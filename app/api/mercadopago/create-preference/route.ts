import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type BodyItem = {
  product_id: string; // uuid string (public.products.id)
  variant_id?: string | null; // uuid string (public.product_variants.id) opcional

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
      items: BodyItem[];

      shipping_cost: number;
      discount: number; // total descuento S/ (solo productos)

      // si quieres: cupón
      coupon_code?: string | null;

      // estos datos pueden venir desde tu CheckoutClient
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

      // MP payer (opcional)
      payer?: { name?: string; email?: string; phone?: string };

      // metadata extra (se guarda en orders.metadata también)
      metadata?: any;
    };

    const items = Array.isArray(body.items) ? body.items : [];
    const shippingCost = round2(Number(body.shipping_cost || 0));
    const discount = Math.max(0, round2(Number(body.discount || 0)));

    if (items.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Carrito vacío" },
        { status: 400 }
      );
    }

    // ===== Montos base
    const subtotal = round2(
      items.reduce(
        (acc, it) => acc + Number(it.unit_price || 0) * Number(it.qty || 0),
        0
      )
    );

    const safeDiscount = subtotal > 0 ? Math.min(discount, subtotal) : 0;
    const total = round2(Math.max(0, subtotal - safeDiscount) + shippingCost);

    // ===== Aplicar descuento sin items negativos (prorrateo)
    const factor = subtotal > 0 ? (subtotal - safeDiscount) / subtotal : 1;

    const pricedItems = items.map((it) => ({
      ...it,
      qty: Math.max(1, Number(it.qty || 1)),
      unit_price: round2(Number(it.unit_price || 0)),
    }));

    const computed = pricedItems.map((it) => ({
      id: it.product_id, // MP item id puede ser string
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

    // ===== 1) Crear ORDEN en Supabase (ANTES de MP)
    const sb = supabaseAdmin();

    const external_reference = `smiggle_${crypto.randomUUID()}`;

    const customer = body.customer || {};
    const addr = body.address || {};
    const receipt = body.receipt || {};
    const ship = body.shipping || {};

    const { data: order, error: orderErr } = await sb
      .from("orders")
      .insert({
        external_reference,

        payment_status: "initiated",

        subtotal,
        discount: safeDiscount,
        shipping_cost: shippingCost,
        total,
        currency_id: "PEN",

        full_name: customer.full_name || body?.payer?.name || "Cliente",
        email: customer.email || body?.payer?.email || "no-email@local",
        phone: customer.phone || body?.payer?.phone || "000000000",
        doc_type: customer.doc_type || null,
        doc_number: customer.doc_number || null,

        dep_id: addr.dep_id || null,
        prov_id: addr.prov_id || null,
        dist_id: addr.dist_id || null,
        address: addr.address || null,
        reference: addr.reference || null,

        receipt_type: receipt.receipt_type || "boleta",
        ruc: receipt.ruc || null,
        razon_social: receipt.razon_social || null,
        direccion_fiscal: receipt.direccion_fiscal || null,

        shipping_type: ship.shipping_type || null,
        carrier: ship.carrier || null,

        coupon_code: body.coupon_code || null,

        // guardamos TODO lo extra para auditoría
        metadata: {
          ...(body.metadata ?? {}),
          safeDiscount,
          shippingCost,
        },
      })
      .select("id, external_reference")
      .single();

    if (orderErr || !order) {
      console.error("Supabase order insert error:", orderErr);
      return NextResponse.json(
        { ok: false, message: "Error creando orden en Supabase" },
        { status: 500 }
      );
    }

    // ===== 2) Insertar ITEMS en Supabase (FK + snapshot)
    const itemsRows = pricedItems.map((it) => {
      const qty = Math.max(1, Number(it.qty || 1));
      const unit = round2(Number(it.unit_price || 0));

      return {
        order_id: order.id,

        // FK a tu schema real
        product_id: it.product_id,
        variant_id: it.variant_id ?? null,

        qty,
        unit_price: unit,
        line_total: round2(unit * qty),

        // snapshot
        title: it.title,
        slug: it.slug ?? null,
        image: it.image ?? null,
        color_name: it.color_name ?? null,
        color_slug: it.color_slug ?? null,
        size_label: it.size_label ?? null,
        sku: it.sku ?? null,
      };
    });

    const { error: itemsErr } = await sb.from("order_items").insert(itemsRows);
    if (itemsErr) {
      console.error("Supabase order_items insert error:", itemsErr);
      return NextResponse.json(
        { ok: false, message: "Error guardando items de la orden en Supabase" },
        { status: 500 }
      );
    }

    // ===== 3) Crear preference Mercado Pago
    const preferencePayload: any = {
      external_reference,

      // ✅ Recomendación clave: webhook directo en la preferencia
      notification_url: `${siteUrl}/api/mercadopago/webhook`,

      items: computed,

      // (opcional) no siempre funciona como esperas en todos los flows, pero lo dejamos:
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
        name: body?.payer?.name || customer.full_name || undefined,
        email: body?.payer?.email || customer.email || undefined,
        phone: (body?.payer?.phone || customer.phone)
          ? { number: body?.payer?.phone || customer.phone }
          : undefined,
      },

      metadata: {
        ...body.metadata,
        order_id: order.id,
        external_reference,
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

      // marcamos la orden como error (opcional)
      await sb
        .from("orders")
        .update({
          payment_status: "failed",
          payment_status_detail: "preference_create_failed",
          metadata: { ...(body.metadata ?? {}), mp_error: mpData },
        })
        .eq("id", order.id);

      return NextResponse.json(
        {
          ok: false,
          message: "Error creando preferencia en Mercado Pago",
          mp: mpData,
        },
        { status: 500 }
      );
    }

    // ===== 4) Guardar preference_id en Supabase
    await sb
      .from("orders")
      .update({
        mp_preference_id: mpData.id,
      })
      .eq("id", order.id);

    return NextResponse.json({
      ok: true,
      order_id: order.id,
      external_reference,
      preference_id: mpData.id,
      init_point: mpData.init_point, // PROD
      sandbox_init_point: mpData.sandbox_init_point, // sandbox
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
