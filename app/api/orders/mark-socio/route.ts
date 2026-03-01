import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendOrderEmail } from "@/lib/email/mailer";
import { buildOrderEmailHtml } from "@/lib/email/templates";

export async function POST(req: Request) {
  try {
    const sb = supabaseAdmin();
    const body = await req.json();

    const external_reference = String(body.external_reference || "").trim();
    if (!external_reference) {
      return NextResponse.json({ ok: false, error: "Falta external_reference" }, { status: 400 });
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://www.smiggle-peru.com";

    // 1) Traer orden completa (incluye items JSON)
    const { data: order, error: eFind } = await sb
      .from("orders")
      .select(
        "id, external_reference, email, full_name, phone, address, reference, dep_name, prov_name, dist_name, carrier, shipping_type, shipping_cost, subtotal, discount, total, items, doc_type, doc_number, email_pending_sent_at"
      )
      .eq("external_reference", external_reference)
      .single();

    if (eFind || !order) {
      console.error("mark-socio find error:", eFind);
      return NextResponse.json({ ok: false, error: "Orden no encontrada" }, { status: 404 });
    }

    // 2) Actualizar estado de pago “socio”
    const { error: eUp } = await sb
      .from("orders")
      .update({
        payment_provider: "socio",
        payment_status: "pending", // o "in_process" si prefieres
        payment_status_detail: "socio_submitted",
      })
      .eq("id", order.id);

    if (eUp) {
      console.error("mark-socio update error:", eUp);
      return NextResponse.json({ ok: false, error: eUp.message }, { status: 500 });
    }

    // 3) Enviar correo pending SOLO si aún no se envió
    try {
      if (order.email && !order.email_pending_sent_at) {
        const html = buildOrderEmailHtml({
          order: {
            id: order.id,
            external_reference: order.external_reference,
            email: order.email,
            full_name: order.full_name,
            phone: order.phone,
            address: order.address,
            reference: order.reference,
            dep_name: order.dep_name,
            prov_name: order.prov_name,
            dist_name: order.dist_name,
            carrier: order.carrier,
            shipping_type: order.shipping_type,
            shipping_cost: order.shipping_cost,
            subtotal: order.subtotal,
            discount: order.discount,
            total: order.total,
            items: Array.isArray(order.items) ? order.items : [],
            doc_type: order.doc_type,
            doc_number: order.doc_number,
          },
          mode: "pending",
          siteUrl,
        });

        await sendOrderEmail({
          to: order.email,
          subject: "⏳ Recibimos tu pago — Smiggle Perú",
          html,
        });

        await sb
          .from("orders")
          .update({ email_pending_sent_at: new Date().toISOString() })
          .eq("id", order.id);
      }
    } catch (mailErr) {
      console.error("mark-socio email pending error:", mailErr);
      // OJO: no devolvemos 500 por correo, para no romper el flujo
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("mark-socio fatal:", err);
    return NextResponse.json({ ok: false, error: err?.message || "Error interno" }, { status: 500 });
  }
}