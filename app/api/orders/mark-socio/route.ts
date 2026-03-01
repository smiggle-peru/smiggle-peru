// app/api/orders/mark-socio/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendOrderEmail } from "@/lib/email/mailer";
import { buildOrderEmailHtml } from "@/lib/email/templates";

export async function POST(req: Request) {
  try {
    const sb = supabaseAdmin();
    const body = await req.json();

    const external_reference = String(body.external_reference || "").trim();
    const socio_payload = body.socio_payload || null;

    if (!external_reference) {
      return NextResponse.json(
        { ok: false, error: "Falta external_reference" },
        { status: 400 }
      );
    }

    // 1) Traer la orden
    const { data: order, error: e1 } = await sb
      .from("orders")
      .select("*")
      .eq("external_reference", external_reference)
      .single();

    if (e1 || !order) {
      return NextResponse.json(
        { ok: false, error: "Orden no encontrada" },
        { status: 404 }
      );
    }

    // 2) Marcar como “socio / in_process”
    const { error: e2 } = await sb
      .from("orders")
      .update({
        payment_provider: "socio",
        payment_status: "in_process",
        payment_status_detail: "Formulario Socio enviado",
        socio_payload, // si tienes esta columna. Si no, bórrala.
      })
      .eq("id", order.id);

    if (e2) {
      return NextResponse.json(
        { ok: false, error: "No se pudo actualizar orden" },
        { status: 500 }
      );
    }

    // 3) (Opcional) Enviar correo “en proceso”
    try {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXT_PUBLIC_APP_URL ||
        "https://www.smiggle-peru.com";

      if (order.email) {
        const html = buildOrderEmailHtml({
          order,
          mode: "pending", // reutiliza tu template pending
          siteUrl,
        });

        await sendOrderEmail({
          to: order.email,
          subject: "⏳ Estamos validando tu pago — Smiggle Perú",
          html,
        });
      }
    } catch (e) {
      console.error("mark-socio email error:", e);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("mark-socio error:", err);
    return NextResponse.json(
      { ok: false, error: "Error interno" },
      { status: 500 }
    );
  }
}