import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendOrderEmail } from "@/lib/email/mailer";
import { buildOrderEmailHtml } from "@/lib/email/templates";

type EmailMode = "success" | "pending" | "failure";

function pickMode(v: string | null): EmailMode {
  if (v === "success" || v === "pending" || v === "failure") return v;
  return "pending";
}

function subjectFor(mode: EmailMode) {
  if (mode === "success") return "✅ Pago confirmado — Smiggle Perú";
  if (mode === "pending") return "⏳ Pedido recibido — Estamos verificando tu pago";
  return "⚠️ No se pudo confirmar el pago — Smiggle Perú";
}

/**
 * TEST EMAIL (nivel empresa)
 * /api/email/test?to=correo@dominio.com
 * /api/email/test?to=correo@dominio.com&mode=success
 * /api/email/test?to=correo@dominio.com&external_reference=smiggle_xxx
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    // 🔹 OPCIÓN B — to por query param
    const to = url.searchParams.get("to");
    const mode = pickMode(url.searchParams.get("mode"));
    const external_reference = url.searchParams.get("external_reference");

    if (!to) {
      return NextResponse.json(
        { ok: false, message: "Falta ?to=correo@dominio.com" },
        { status: 400 }
      );
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL;

    if (!siteUrl) {
      return NextResponse.json(
        { ok: false, message: "Falta NEXT_PUBLIC_SITE_URL o NEXT_PUBLIC_APP_URL" },
        { status: 500 }
      );
    }

    // 1️⃣ Orden real desde Supabase
    let order: any;

    if (external_reference) {
      const sb = supabaseAdmin();

      const { data, error } = await sb
        .from("orders")
        .select("*")
        .eq("external_reference", external_reference)
        .single();

      if (error || !data) {
        return NextResponse.json(
          {
            ok: false,
            message: "No se encontró la orden por external_reference",
            error,
          },
          { status: 404 }
        );
      }

      order = data;
    } else {
      // 2️⃣ Mock de empresa (email de prueba)
      order = {
        external_reference: `smiggle_test_${Date.now()}`,
        full_name: "Luis Johnatan",
        email: to,
        phone: "900000000",
        dep_name: "Lima",
        prov_name: "Lima",
        dist_name: "Miraflores",
        address: "Av. Prueba 123",
        reference: "Frente a la plaza",
        shipping_type: "provincia_regular",
        carrier: "Shalom",
        subtotal: 223,
        discount: 0,
        shipping_cost: 16,
        total: 239,
        items: [
          {
            title: "Pack Escolar Smiggle 3 Piezas",
            qty: 1,
            unit_price: 223,
            image: `${siteUrl}/images/test-product.jpg`,
          },
        ],
      };
    }

    // 3️⃣ Construye HTML
    const html = buildOrderEmailHtml({
      order,
      mode,
      siteUrl,
    });

    // 4️⃣ Envía email
    await sendOrderEmail({
      to,
      subject: subjectFor(mode),
      html,
    });

    return NextResponse.json({
      ok: true,
      sent_to: to,
      mode,
      external_reference: order.external_reference,
      preview_url: `${siteUrl}/checkout/${mode}?external_reference=${encodeURIComponent(
        order.external_reference
      )}`,
    });
  } catch (err) {
    console.error("email/test error:", err);
    return NextResponse.json(
      { ok: false, message: "Error enviando email de prueba" },
      { status: 500 }
    );
  }
}
