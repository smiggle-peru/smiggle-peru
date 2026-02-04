import { NextResponse } from "next/server";
import { sendOrderEmail } from "@/lib/email/mailer";
import { buildOrderEmailHtml } from "@/lib/email/templates";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { to: string; mode?: "success" | "pending" | "failure" };

    if (!body?.to) {
      return NextResponse.json({ ok: false, message: "Falta 'to' (correo)" }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.smiggle-peru.com";
    const mode = body.mode || "pending";

    const meta =
      mode === "success"
        ? {
            headline: "Pago aprobado",
            badge: { label: "APROBADO", kind: "success" as const },
            intro: "Tu pago fue confirmado. Ya estamos preparando tu pedido.",
            subject: "Pago aprobado — Smiggle Perú",
            cta: `${siteUrl}/checkout/success?external_reference=smiggle_demo_success`,
          }
        : mode === "failure"
        ? {
            headline: "Pago no confirmado",
            badge: { label: "RECHAZADO", kind: "failure" as const },
            intro: "No pudimos confirmar el pago. Puedes intentarlo nuevamente.",
            subject: "Pago no confirmado — Smiggle Perú",
            cta: `${siteUrl}/checkout/failure?external_reference=smiggle_demo_failure`,
          }
        : {
            headline: "Pago en verificación",
            badge: { label: "PENDIENTE", kind: "pending" as const },
            intro: "Tu pago está en proceso. Te avisaremos apenas se confirme.",
            subject: "Pedido recibido — Smiggle Perú",
            cta: `${siteUrl}/checkout/pending?external_reference=smiggle_demo_pending`,
          };

    const html = buildOrderEmailHtml({
      brandName: "Smiggle Perú",
      headline: meta.headline,
      statusBadge: meta.badge,
      intro: meta.intro,
      external_reference: "smiggle_demo_123",
      customerName: "Luis",
      email: body.to,
      items: [
        {
          title: "Mochila Smiggle Trailblazer",
          qty: 1,
          unit_price: 229,
          image: "https://www.smiggle-peru.com/og.jpg",
          color_name: "Azul",
          size_label: null,
        },
        {
          title: "Cartuchera Pop Out",
          qty: 1,
          unit_price: 79,
          image: "https://www.smiggle-peru.com/og.jpg",
        },
      ],
      subtotal: 308,
      shipping: 16,
      discount: 30,
      total: 294,
      shippingInfo: {
        dep: "Lima",
        prov: "Lima",
        dist: "Miraflores",
        address: "Av. La Marina 123, Dpto 402",
        reference: "Frente al parque",
        carrier: "Urbano Express",
        shipping_type: "lima_regular",
      },
      ctaUrl: meta.cta,
      ctaLabel: "Ver mi pedido",
      footerNote: "Si no realizaste esta compra, responde a este correo.",
    });

    await sendOrderEmail({
      to: body.to,
      subject: meta.subject,
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("email/test error:", err);
    return NextResponse.json({ ok: false, message: "Error enviando correo" }, { status: 500 });
  }
}
