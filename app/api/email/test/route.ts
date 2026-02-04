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
 * TEST EMAIL
 * /api/email/test?to=correo@...&mode=pending&external_reference=smiggle_...
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const to = url.searchParams.get("to") || "";
    const mode = pickMode(url.searchParams.get("mode"));
    const external_reference = url.searchParams.get("external_reference");

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;

    if (!siteUrl) {
      return NextResponse.json(
        { ok: false, message: "Falta NEXT_PUBLIC_SITE_URL o NEXT_PUBLIC_APP_URL" },
        { status: 500 }
      );
    }

    if (!to) {
      return NextResponse.json(
        { ok: false, message: "Falta ?to=correo@dominio.com" },
        { status: 400 }
      );
    }

    // 1) Trae una orden real si mandas external_reference
    let order: any = null;

    if (external_reference) {
      const sb = supabaseAdmin();
      const { data, error } = await sb
        .from("orders")
        .select("*")
        .eq("external_reference", external_reference)
        .single();

      if (error) {
        return NextResponse.json(
          { ok: false, message: "No se encontró la orden por external_reference", error },
          { status: 404 }
        );
      }

      order = data;
    } else {
      // 2) Si no mandas external_reference, arma un ejemplo (mock)
      order = {
        external_reference: `smiggle_test_${Date.now()}`,
        full_name: "Luis Pruebas",
        email: to,
        phone: "900000000",
        dep_name: "Cajamarca",
        prov_name: "Cajamarca",
        dist_name: "Cajamarca",
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
            title: "Pack Escolar Smiggle (Demo)",
            qty: 1,
            unit_price: 223,
            image: `${siteUrl}/brand/smiggle-logo.jpg`,
            color_name: "Negro",
            size_label: null,
          },
        ],
      };
    }

    const html = buildOrderEmailHtml({
      order,
      mode,
      siteUrl,
    });

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
  } catch (err: any) {
    console.error("email/test error:", err);
    return NextResponse.json(
      { ok: false, message: "Error enviando email de prueba" },
      { status: 500 }
    );
  }
}
