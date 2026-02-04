import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type BodyItem = {
  product_id: string; // uuid string (public.products.id)
  variant_id?: string | null;

  title: string;
  slug?: string | null;
  image?: string | null;

  qty: number;
  unit_price: number; // price_now (numeric)

  color_name?: string | null;
  color_slug?: string | null;
  size_label?: string | null;
  sku?: string | null;
};

function round2(n: number) {
  return Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100;
}

export async function POST(req: Request) {
  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;

    if (!accessToken) {
      return NextResponse.json(
        { ok: false, message: "Falta MP_ACCESS_TOKEN en .env.local" },
        { status: 500 }
      );
    }
    if (!siteUrl) {
      return NextResponse.json(
        { ok: false, message: "Falta NEXT_PUBLIC_SITE_URL en .env.local" },
        { status: 500 }
      );
    }

    const body = (await req.json()) as {
      external_reference?: string; // ✅ viene del /api/orders/create
      order_id?: string;

      items: BodyItem[];

      shipping_cost: number;
      discount: number;

      coupon_code?: string | null;

      customer?: {
        full_name?: string;
        email?: string;
        phone?: string;
        doc_type?: string;
        doc_number?: string;
      };
      address?: {
        dep_id?: string;
        prov_id?: string;
        dist_id?: string;
        address?: string;
        reference?: string;
      };
      receipt?: {
        receipt_type?: "boleta" | "factura";
        ruc?: string;
        razon_social?: string;
        direccion_fiscal?: string;
      };
      shipping?: {
        shipping_type?: string | null;
        carrier?: string | null;
      };

      payer?: { name?: string; email?: string; phone?: string };

      metadata?: any;
    };

    // ✅ 3️⃣ LO QUE PEDISTE: DESTRUCTURING + VALIDACIÓN AL INICIO
    const { external_reference, items, shipping_cost, discount, payer } = body;

    if (!external_reference) {
      return NextResponse.json(
        { ok: false, message: "Falta external_reference" },
        { status: 400 }
      );
    }

    const safeItems = Array.isArray(items) ? items : [];
    const shippingCost = round2(Number(shipping_cost || 0));
    const disc = Math.max(0, round2(Number(discount || 0)));

    if (safeItems.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Carrito vacío" },
        { status: 400 }
      );
    }

    // ===== Montos base
    const subtotal = round2(
      safeItems.reduce(
        (acc, it) => acc + Number(it.unit_price || 0) * Number(it.qty || 0),
        0
      )
    );

    const safeDiscount = subtotal > 0 ? Math.min(disc, subtotal) : 0;
    const total = round2(Math.max(0, subtotal - safeDiscount) + shippingCost);

    // ===== Aplicar descuento sin items negativos (prorrateo)
    const factor = subtotal > 0 ? (subtotal - safeDiscount) / subtotal : 1;

    const pricedItems = safeItems.map((it) => ({
      ...it,
      qty: Math.max(1, Number(it.qty || 1)),
      unit_price: round2(Number(it.unit_price || 0)),
    }));

    const computed = pricedItems.map((it) => ({
      id: it.product_id,
      title: it.title,
      quantity: it.qty,
      currency_id: "PEN",
      unit_price: Math.max(0, round2(it.unit_price * factor)),
    }));

    // Ajuste de centavos para que cuadre exacto
    const targetProductsTotal = round2(subtotal - safeDiscount);
    const currentProductsTotal = round2(
      computed.reduce((acc, it) => acc + it.unit_price * it.quantity, 0)
    );

    const diff = round2(targetProductsTotal - currentProductsTotal);
    if (computed.length > 0 && Math.abs(diff) >= 0.01) {
      const last = computed[computed.length - 1];
      const perUnitFix = diff / (last.quantity || 1);
      last.unit_price = Math.max(0, round2(last.unit_price + perUnitFix));
    }

    // ===== (Opcional) tocar orden si mandas order_id
    const sb = supabaseAdmin();
    if (body.order_id) {
      await sb
        .from("orders")
        .update({
          payment_status: "initiated",
          metadata: {
            ...(body.metadata ?? {}),
            discount: safeDiscount,
            shipping_cost: shippingCost,
          },
        })
        .eq("id", body.order_id);
    }

    // ✅ 3️⃣ LO QUE PEDISTE: preferencePayload usa EL MISMO external_reference
    const preferencePayload: any = {
      external_reference, // 🔥 MISMO DE LA ORDEN

      notification_url: `${siteUrl}/api/mercadopago/webhook`,

      items: computed,

      shipments: {
        cost: Math.max(0, shippingCost),
        mode: "not_specified",
      },

      back_urls: {
        success: `${siteUrl}/checkout/success?ref=${encodeURIComponent(
          external_reference
        )}`,
        pending: `${siteUrl}/checkout/pending?ref=${encodeURIComponent(
          external_reference
        )}`,
        failure: `${siteUrl}/checkout/failure?ref=${encodeURIComponent(
          external_reference
        )}`,
      },
      auto_return: "approved",

      payer: {
        name: payer?.name || body?.customer?.full_name || undefined,
        email: payer?.email || body?.customer?.email || undefined,
        phone: (payer?.phone || body?.customer?.phone)
          ? { number: payer?.phone || body?.customer?.phone }
          : undefined,
      },

      metadata: {
        ...body.metadata,
        order_id: body.order_id,
        discount: safeDiscount,
        shipping_cost: shippingCost,
      },
    };

    const mpRes = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferencePayload),
      }
    );

    const mpData = await mpRes.json();

    if (!mpRes.ok) {
      console.error("MP error:", mpData);

      if (body.order_id) {
        await sb
          .from("orders")
          .update({
            payment_status: "failed",
            payment_status_detail: "preference_create_failed",
            metadata: { ...(body.metadata ?? {}), mp_error: mpData },
          })
          .eq("id", body.order_id);
      }

      return NextResponse.json(
        {
          ok: false,
          message: "Error creando preferencia en Mercado Pago",
          mp: mpData,
        },
        { status: 500 }
      );
    }

    if (body.order_id) {
      await sb
        .from("orders")
        .update({ mp_preference_id: mpData.id })
        .eq("id", body.order_id);
    }

    return NextResponse.json({
      ok: true,
      order_id: body.order_id ?? null,
      external_reference,
      preference_id: mpData.id,
      init_point: mpData.init_point,
      sandbox_init_point: mpData.sandbox_init_point,
      total,
    });
  } catch (err: any) {
    console.error("MP create-preference error:", err);
    return NextResponse.json(
      { ok: false, message: "Error interno creando preferencia" },
      { status: 500 }
    );
  }
}
