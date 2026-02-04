import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// MP manda distintos formatos. Cubrimos ambos.
type MPWebhookBody = {
  action?: string;
  api_version?: string;
  data?: { id?: string };
  date_created?: string;
  id?: string;
  live_mode?: boolean;
  type?: string; // "payment" | "merchant_order" | etc
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
  const r = await fetch(
    `https://api.mercadopago.com/merchant_orders/${moId}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    }
  );
  const j = await r.json();
  return { ok: r.ok, status: r.status, data: j };
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

    // MP a veces manda query params: ?type=payment&data.id=123
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

    // Responder rápido si no es algo que manejamos
    if (!type || !dataId) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const sb = supabaseAdmin();

    // =========================================================
    // 1) Si llega PAYMENT → consultamos /v1/payments/:id
    // =========================================================
    if (type === "payment") {
      const paymentId = String(dataId);

      const pay = await fetchPayment(accessToken, paymentId);
      if (!pay.ok) {
        // Igual respondemos 200 para que MP no reintente infinito
        console.error("MP fetch payment failed:", pay.status, pay.data);
        return NextResponse.json({ ok: true, mp_fetch_failed: true });
      }

      const p = pay.data || {};
      const external_reference = p.external_reference as string | undefined;

      if (!external_reference) {
        console.error("Payment without external_reference:", p?.id);
        return NextResponse.json({ ok: true, no_external_reference: true });
      }

      // Estados típicos: approved | pending | rejected | cancelled | in_process | refunded | charged_back
      const payment_status = (p.status || "unknown") as string;
      const payment_status_detail = (p.status_detail || null) as string | null;

      const payment_type_id = (p.payment_type_id || null) as string | null;
      const payment_method_id = (p.payment_method_id || null) as string | null;
      const installments =
        typeof p.installments === "number" ? (p.installments as number) : null;

      const transaction_amount =
        typeof p.transaction_amount === "number"
          ? (p.transaction_amount as number)
          : null;

      const currency_id = (p.currency_id || null) as string | null;

      // paid_at: usamos date_approved si existe, si no date_created
      const paid_at =
        toIsoOrNull(p.date_approved) || toIsoOrNull(p.date_created);

      const mp_merchant_order_id =
        p.order?.id ? String(p.order.id) : null;

      // Update order by external_reference
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

          // guardamos el payment completo en metadata (auditoría)
          metadata: {
            mp_payment: p,
          },
        })
        .eq("external_reference", external_reference);

      if (updErr) {
        console.error("Supabase update order error:", updErr);
        return NextResponse.json({ ok: true, supabase_update_failed: true });
      }

      return NextResponse.json({ ok: true });
    }

    // =========================================================
    // 2) Si llega MERCHANT_ORDER → consultamos /merchant_orders/:id
    // (sirve cuando MP no manda payment directo en algunos flows)
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

      // merchant_order trae payments[]
      const payments = Array.isArray(m.payments) ? m.payments : [];

      // Tomamos el pago más relevante (approved primero)
      const best =
        payments.find((x: any) => x.status === "approved") ||
        payments[0] ||
        null;

      // Si hay payment_id, jalamos el payment completo (más confiable)
      if (best?.id) {
        const pay = await fetchPayment(accessToken, String(best.id));
        if (pay.ok) {
          const p = pay.data || {};
          const payment_status = (p.status || "unknown") as string;

          const paid_at =
            toIsoOrNull(p.date_approved) || toIsoOrNull(p.date_created);

          const { error: updErr } = await sb
            .from("orders")
            .update({
              mp_payment_id: String(p.id),
              mp_merchant_order_id: String(m.id),

              payment_status: String(p.status || "unknown"),
              payment_status_detail: String(p.status_detail || ""),

              payment_type_id: p.payment_type_id || null,
              payment_method_id: p.payment_method_id || null,
              installments:
                typeof p.installments === "number" ? p.installments : null,
              transaction_amount:
                typeof p.transaction_amount === "number"
                  ? p.transaction_amount
                  : null,
              currency_id: p.currency_id || "PEN",

              paid_at: payment_status === "approved" ? paid_at : null,

              metadata: {
                mp_merchant_order: m,
                mp_payment: p,
              },
            })
            .eq("external_reference", external_reference);

          if (updErr) {
            console.error("Supabase update order error:", updErr);
            return NextResponse.json({ ok: true, supabase_update_failed: true });
          }

          return NextResponse.json({ ok: true });
        }
      }

      // Si no pudimos obtener payment completo, igual guardamos merchant_order
      await sb
        .from("orders")
        .update({
          mp_merchant_order_id: String(m.id),
          metadata: { mp_merchant_order: m },
        })
        .eq("external_reference", external_reference);

      return NextResponse.json({ ok: true });
    }

    // otros tipos: ignorar
    return NextResponse.json({ ok: true, ignored: true });
  } catch (err: any) {
    console.error("MP webhook error:", err);
    // Importante: responder 200 para que no te spamee
    return NextResponse.json({ ok: true, error: "handled" });
  }
}
