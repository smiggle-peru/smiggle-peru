import { NextResponse } from "next/server";

type BodyItem = {
  product_id: string;
  title: string;
  qty: number;
  unit_price: number; // price_now
};

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
      discount: number; // total descuento S/
      payer?: { name?: string; email?: string; phone?: string };
      metadata?: any;
    };

    const items = Array.isArray(body.items) ? body.items : [];
    const shippingCost = Number(body.shipping_cost || 0);
    const discount = Math.max(0, Number(body.discount || 0));

    if (items.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Carrito vacío" },
        { status: 400 }
      );
    }

    // ===== Aplicar descuento sin items negativos (prorrateo)
    const subtotal = items.reduce(
      (acc, it) => acc + Number(it.unit_price || 0) * Number(it.qty || 0),
      0
    );

    const safeDiscount = subtotal > 0 ? Math.min(discount, subtotal) : 0;
    const factor = subtotal > 0 ? (subtotal - safeDiscount) / subtotal : 1;

    // Redondeo a 2 decimales manteniendo el total (ajuste en el último ítem)
    const pricedItems = items.map((it) => ({
      ...it,
      qty: Number(it.qty || 0),
      unit_price: Number(it.unit_price || 0),
    }));

    const computed = pricedItems.map((it) => ({
      id: it.product_id,
      title: it.title,
      quantity: it.qty,
      currency_id: "PEN",
      unit_price: Math.max(0, Math.round(it.unit_price * factor * 100) / 100),
    }));

    // Ajuste de centavos para que cuadre exacto
    const targetProductsTotal = Math.round((subtotal - safeDiscount) * 100) / 100;
    const currentProductsTotal =
      Math.round(
        computed.reduce((acc, it) => acc + it.unit_price * it.quantity, 0) * 100
      ) / 100;

    const diff = Math.round((targetProductsTotal - currentProductsTotal) * 100) / 100;
    if (computed.length > 0 && Math.abs(diff) >= 0.01) {
      const last = computed[computed.length - 1];
      const perUnitFix = diff / (last.quantity || 1);
      last.unit_price = Math.max(
        0,
        Math.round((last.unit_price + perUnitFix) * 100) / 100
      );
    }

    // ===== Preference Mercado Pago
    const external_reference = `smiggle_${Date.now()}`;

    const preferencePayload: any = {
      external_reference,
      items: computed,
      shipments: {
        cost: Math.max(0, shippingCost),
        mode: "not_specified",
      },
      back_urls: {
        success: `${siteUrl}/checkout/success`,
        pending: `${siteUrl}/checkout/pending`,
        failure: `${siteUrl}/checkout/failure`,
      },
      auto_return: "approved",
      payer: {
        name: body?.payer?.name || undefined,
        email: body?.payer?.email || undefined,
        phone: body?.payer?.phone
          ? { number: body.payer.phone }
          : undefined,
      },
      metadata: {
        ...body.metadata,
        discount: safeDiscount,
        shipping_cost: shippingCost,
      },
    };

    // Crea preference
    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferencePayload),
    });

    const mpData = await mpRes.json();

    if (!mpRes.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: "Error creando preferencia en Mercado Pago",
          mp: mpData,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      id: mpData.id,
      init_point: mpData.init_point, // PROD
      sandbox_init_point: mpData.sandbox_init_point, // sandbox
    });
  } catch (err: any) {
    console.error("MP create-preference error:", err);
    return NextResponse.json(
      { ok: false, message: "Error interno creando preferencia" },
      { status: 500 }
    );
  }
}
