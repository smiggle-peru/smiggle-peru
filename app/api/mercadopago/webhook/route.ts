import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// ✅ EMAIL
import { sendOrderEmail } from "@/lib/email/mailer";
import { buildOrderEmailHtml } from "@/lib/email/templates";

type MPWebhookBody = {
  action?: string;
  api_version?: string;
  data?: { id?: string };
  date_created?: string;
  id?: string;
  live_mode?: boolean;
  type?: string; // "payment" | "merchant_order"
};

function toIsoOrNull(d: any) {
  const t = new Date(d).getTime();
  return Number.isFinite(t) ? new Date(t).toISOString() : null;
}

async function fetchPayment(accessToken: string, paymentId: string) {
  const r = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const j = await r.json();
  return { ok: r.ok, status: r.status, data: j };
}

async function fetchMerchantOrder(accessToken: string, moId: string) {
  const r = await fetch(`https://api.mercadopago.com/merchant_orders/${moId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const j = await r.json();
  return { ok: r.ok, status: r.status, data: j };
}

function resolveMode(payment_status: string) {
  const s = String(payment_status || "").toLowerCase();

  if (s === "approved") return "success" as const;

  // MP suele usar "in_process" cuando aún se está procesando
  if (s === "pending" || s === "in_process") return "pending" as const;

  return "failure" as const;
}

function emailSubjectByMode(mode: "success" | "pending" | "failure") {
  if (mode === "success") return "✅ Pago confirmado — Smiggle Perú";
  if (mode === "pending") return "⏳ Pedido recibido — Estamos verificando tu pago";
  return "⚠️ No se pudo confirmar el pago — Smiggle Perú";
}

function shouldMarkFailure(payment_status: string) {
  const s = String(payment_status || "").toLowerCase();
  // lista razonable de estados finales negativos
  return ["rejected", "cancelled", "charged_back", "refunded"].includes(s);
}

// ✅ helper: env + email success/pending/failure (SIN orderEmailTemplate)
async function maybeSendOrderEmail(
  sb: any,
  args: { external_reference: string; payment_status: string }
) {
  const { external_reference, payment_status } = args;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://www.smiggle-peru.com";

  // ✅ trae la orden completa (SI NO HAY ORDER, NO ENVÍA)
  const { data: order, error } = await sb
    .from("orders")
    .select("*")
    .eq("external_reference", external_reference)
    .single();

  if (error) {
    console.error("webhook email: select order error:", error);
    return;
  }

  if (!order?.email) return;

  try {
    const mode = resolveMode(payment_status);

    // ✅ SUCCESS (1 sola vez)
    if (mode === "success" && !order.email_success_sent_at) {
      const subject = emailSubjectByMode("success");

      const html = buildOrderEmailHtml({
        order,
        mode: "success",
        siteUrl,
      });

      await sendOrderEmail({ to: order.email, subject, html });

      await sb
        .from("orders")
        .update({
          email_success_sent_at: new Date().toISOString(),
          // opcional: si quieres “limpiar” flags previos
          // email_pending_sent_at: null,
          // email_failure_sent_at: null,
        })
        .eq("id", order.id);

      return;
    }

    // ✅ PENDING (1 sola vez)
    // OJO: puede llegar antes del aprobado, así que lo mandamos si aún no se mandó
    if (mode === "pending" && !order.email_pending_sent_at) {
      const subject = emailSubjectByMode("pending");

      const html = buildOrderEmailHtml({
        order,
        mode: "pending",
        siteUrl,
      });

      await sendOrderEmail({ to: order.email, subject, html });

      await sb
        .from("orders")
        .update({
          email_pending_sent_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      return;
    }

    // ✅ FAILURE (solo si el estado es realmente final negativo)
    const isRealFailure = shouldMarkFailure(payment_status);
    if (isRealFailure && !order.email_failure_sent_at) {
      const subject = emailSubjectByMode("failure");

      const html = buildOrderEmailHtml({
        order,
        mode: "failure",
        siteUrl,
      });

      await sendOrderEmail({ to: order.email, subject, html });

      await sb
        .from("orders")
        .update({
          email_failure_sent_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      return;
    }
  } catch (e) {
    // ⚠️ no rompas webhook por fallo de email
    console.error("webhook email send error:", e);
  }
}

export async function POST(req: Request) {
  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json(
        { ok: false, message: "Missing MP_ACCESS_TOKEN" },
        { status: 500 }
      );
    }

    const url = new URL(req.url);
    const qpType = url.searchParams.get("type") || undefined;
    const qpDataId = url.searchParams.get("data.id") || undefined;

    let body: MPWebhookBody | null = null;
    try {
      body = (await req.json()) as MPWebhookBody;
    } catch {
      body = null;
    }

    const type = body?.type || qpType || "";
    const dataId = body?.data?.id || qpDataId || "";

    if (!type || !dataId) return NextResponse.json({ ok: true, ignored: true });

    const sb = supabaseAdmin();

    // =========================================================
    // PAYMENT
    // =========================================================
    if (type === "payment") {
      const paymentId = String(dataId);

      const pay = await fetchPayment(accessToken, paymentId);
      if (!pay.ok) {
        console.error("MP fetch payment failed:", pay.status, pay.data);
        return NextResponse.json({ ok: true, mp_fetch_failed: true });
      }

      const p = pay.data || {};
      const external_reference = p.external_reference as string | undefined;
      if (!external_reference) {
        console.error("Payment without external_reference:", p?.id);
        return NextResponse.json({ ok: true, no_external_reference: true });
      }

      const mpMeta = (p.metadata || {}) as any;

      const payment_status = String(p.status || "unknown");
      const payment_status_detail = (p.status_detail ?? null) as string | null;

      const payment_type_id = (p.payment_type_id || null) as string | null;
      const payment_method_id = (p.payment_method_id || null) as string | null;
      const installments =
        typeof p.installments === "number" ? (p.installments as number) : null;

      const transaction_amount =
        typeof p.transaction_amount === "number"
          ? (p.transaction_amount as number)
          : null;

      const currency_id = (p.currency_id || null) as string | null;

      const paid_at = toIsoOrNull(p.date_approved) || toIsoOrNull(p.date_created);

      const mp_merchant_order_id = p.order?.id ? String(p.order.id) : null;

      // ✅ 1) Trae metadata actual de la orden para NO pisarla
      const { data: currentOrder, error: selErr } = await sb
        .from("orders")
        .select("metadata, dep_id, prov_id, dist_id, dep_name, prov_name, dist_name")
        .eq("external_reference", external_reference)
        .maybeSingle();

      if (selErr) {
        console.error("Supabase select order error:", selErr);
        return NextResponse.json({ ok: true, supabase_select_failed: true });
      }

      const currentMeta = (currentOrder?.metadata || {}) as any;

      // ✅ 2) Merge metadata (NO PISAR)
      const mergedMeta = {
        ...currentMeta,
        checkout: currentMeta.checkout || mpMeta,
        mp_payment: p,
      };

      // ✅ 3) Ubigeo
      const dep_id = mpMeta.dep_id ?? currentOrder?.dep_id ?? null;
      const prov_id = mpMeta.prov_id ?? currentOrder?.prov_id ?? null;
      const dist_id = mpMeta.dist_id ?? currentOrder?.dist_id ?? null;

      const dep_name = mpMeta.dep_name ?? currentOrder?.dep_name ?? null;
      const prov_name = mpMeta.prov_name ?? currentOrder?.prov_name ?? null;
      const dist_name = mpMeta.dist_name ?? currentOrder?.dist_name ?? null;

      // ✅ 4) Update orden
      const { error: updErr } = await sb
        .from("orders")
        .update({
          mp_payment_id: String(p.id),
          mp_merchant_order_id,

          payment_status,
          payment_status_detail,
          payment_type_id,
          payment_method_id,
          installments,
          transaction_amount,
          currency_id: currency_id || "PEN",
          paid_at: payment_status === "approved" ? paid_at : null,

          dep_id,
          prov_id,
          dist_id,
          dep_name,
          prov_name,
          dist_name,

          metadata: mergedMeta,
        })
        .eq("external_reference", external_reference);

      if (updErr) {
        console.error("Supabase update order error:", updErr);
        return NextResponse.json({ ok: true, supabase_update_failed: true });
      }

      // ✅ 5) EMAIL success / pending / failure
      await maybeSendOrderEmail(sb, {
        external_reference,
        payment_status,
      });

      return NextResponse.json({ ok: true });
    }

    // =========================================================
    // MERCHANT_ORDER
    // =========================================================
    if (type === "merchant_order") {
      const moId = String(dataId);

      const mo = await fetchMerchantOrder(accessToken, moId);
      if (!mo.ok) {
        console.error("MP fetch merchant_order failed:", mo.status, mo.data);
        return NextResponse.json({ ok: true, mp_fetch_failed: true });
      }

      const m = mo.data || {};
      const external_reference = m.external_reference as string | undefined;

      if (!external_reference) {
        console.error("Merchant order without external_reference:", m?.id);
        return NextResponse.json({ ok: true, no_external_reference: true });
      }

      const payments = Array.isArray(m.payments) ? m.payments : [];
      const best =
        payments.find((x: any) => x.status === "approved") || payments[0] || null;

      // si tenemos payment_id, jala payment y cae al flujo normal
      if (best?.id) {
        const pay = await fetchPayment(accessToken, String(best.id));
        if (pay.ok) {
          const p = pay.data || {};
          const payment_status = String(p.status || "unknown");
          const paid_at =
            toIsoOrNull(p.date_approved) || toIsoOrNull(p.date_created);

          const mpMeta = (p.metadata || {}) as any;

          const { data: currentOrder } = await sb
            .from("orders")
            .select("metadata, dep_id, prov_id, dist_id, dep_name, prov_name, dist_name")
            .eq("external_reference", external_reference)
            .maybeSingle();

          const currentMeta = (currentOrder?.metadata || {}) as any;

          const mergedMeta = {
            ...currentMeta,
            mp_merchant_order: m,
            mp_payment: p,
          };

          const dep_id = mpMeta.dep_id ?? currentOrder?.dep_id ?? null;
          const prov_id = mpMeta.prov_id ?? currentOrder?.prov_id ?? null;
          const dist_id = mpMeta.dist_id ?? currentOrder?.dist_id ?? null;

          const dep_name = mpMeta.dep_name ?? currentOrder?.dep_name ?? null;
          const prov_name = mpMeta.prov_name ?? currentOrder?.prov_name ?? null;
          const dist_name = mpMeta.dist_name ?? currentOrder?.dist_name ?? null;

          const { error: updErr } = await sb
            .from("orders")
            .update({
              mp_payment_id: String(p.id),
              mp_merchant_order_id: String(m.id),

              payment_status: String(p.status || "unknown"),
              payment_status_detail: String(p.status_detail || ""),

              payment_type_id: p.payment_type_id || null,
              payment_method_id: p.payment_method_id || null,
              installments: typeof p.installments === "number" ? p.installments : null,
              transaction_amount:
                typeof p.transaction_amount === "number" ? p.transaction_amount : null,
              currency_id: p.currency_id || "PEN",

              paid_at: payment_status === "approved" ? paid_at : null,

              dep_id,
              prov_id,
              dist_id,
              dep_name,
              prov_name,
              dist_name,

              metadata: mergedMeta,
            })
            .eq("external_reference", external_reference);

          if (updErr) {
            console.error("Supabase update order error:", updErr);
            return NextResponse.json({ ok: true, supabase_update_failed: true });
          }

          // ✅ EMAIL success / pending / failure
          await maybeSendOrderEmail(sb, {
            external_reference,
            payment_status,
          });

          return NextResponse.json({ ok: true });
        }
      }

      // fallback: solo guarda merchant_order sin pisar metadata
      const { data: currentOrder } = await sb
        .from("orders")
        .select("metadata")
        .eq("external_reference", external_reference)
        .maybeSingle();

      const mergedMeta = {
        ...((currentOrder?.metadata || {}) as any),
        mp_merchant_order: m,
      };

      await sb
        .from("orders")
        .update({
          mp_merchant_order_id: String(m.id),
          metadata: mergedMeta,
        })
        .eq("external_reference", external_reference);

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true, ignored: true });
  } catch (err: any) {
    console.error("MP webhook error:", err);
    return NextResponse.json({ ok: true, error: "handled" });
  }
}
