import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  getDepartments,
  getProvincesByDepartment,
  getDistrictsByProvince,
} from "@/lib/ubigeo";

// ✅ EMAIL (nuevo)
import { sendOrderEmail } from "@/lib/email/mailer";
import { buildOrderEmailHtml } from "@/lib/email/templates";

type CartItem = {
  product_id: string;
  title: string;
  qty: number;
  unit_price: number; // price_now
  image?: string | null;
  slug?: string;
  color_slug?: string | null;
  color_name?: string | null;
  size_label?: string | null;
};

type ShippingType = "lima_regular" | "lima_express" | "provincia_regular" | null;
type DocType = "DNI" | "CE" | "PAS";
type ReceiptType = "boleta" | "factura";

function moneyRound(n: number) {
  return Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100;
}

// Perú (Lima) no observa DST, usar ISO con offset -05:00 (o guarda UTC y conviertes en view)
function nowPeruISO() {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const peru = new Date(utc - 5 * 3600000);
  return peru.toISOString();
}

function findDepName(depId: string) {
  const deps = getDepartments();
  return deps.find((d) => d.id === depId)?.name ?? null;
}

function findProvName(depId: string, provId: string) {
  if (!depId) return null;
  const provs = getProvincesByDepartment(depId);
  return provs.find((p) => p.id === provId)?.name ?? null;
}

function findDistName(provId: string, distId: string) {
  if (!provId) return null;
  const dists = getDistrictsByProvince(provId);
  return dists.find((d) => d.id === distId)?.name ?? null;
}

export async function POST(req: Request) {
  try {
    const sb = supabaseAdmin();

    const body = (await req.json()) as {
      items: CartItem[];

      // checkout data
      fullName: string;
      docType: DocType;
      docNumber: string;
      phone: string;
      email: string;

      dep_id: string;
      prov_id: string;
      dist_id: string;

      address: string;
      reference?: string;

      receiptType: ReceiptType;
      ruc?: string;
      razonSocial?: string;
      direccionFiscal?: string;

      shippingType: ShippingType;
      carrier?: string;

      // amounts
      shipping_cost: number;
      discount: number; // descuento total S/ (solo productos)
      currency_id?: string; // PEN default

      // coupon
      coupon?: string | null;

      // optional
      metadata?: any;
    };

    const items = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Carrito vacío" },
        { status: 400 }
      );
    }

    // ✅ Genera SIEMPRE external_reference
    const external_reference = `smiggle_${Date.now()}_${Math.random()
      .toString(16)
      .slice(2)}`;

    // ✅ FIX: log ANTES del insert
    console.log("external_reference:", external_reference);

    // totals
    const subtotal = items.reduce(
      (acc, it) => acc + Number(it.unit_price || 0) * Number(it.qty || 0),
      0
    );

    const safeDiscount =
      subtotal > 0
        ? Math.min(Math.max(0, Number(body.discount || 0)), subtotal)
        : 0;

    const shippingCost = Math.max(0, Number(body.shipping_cost || 0));
    const total = moneyRound(subtotal - safeDiscount + shippingCost);

    // ✅ nombres por librería (NO Supabase tables)
    const dep_name = findDepName(body.dep_id);
    const prov_name = findProvName(body.dep_id, body.prov_id);
    const dist_name = findDistName(body.prov_id, body.dist_id);

    // Insert order
    const payload = {
      // ✅ ASEGURAR que vaya EXACTO y top-level
      external_reference,

      // customer
      full_name: body.fullName,
      doc_type: body.docType,
      doc_number: body.docNumber,
      phone: body.phone,
      email: body.email,

      // location
      dep_id: body.dep_id,
      prov_id: body.prov_id,
      dist_id: body.dist_id,
      dep_name,
      prov_name,
      dist_name,

      address: body.address,
      reference: body.reference ?? null,

      // receipt
      receipt_type: body.receiptType,
      ruc: body.ruc ?? null,
      razon_social: body.razonSocial ?? null,
      direccion_fiscal: body.direccionFiscal ?? null,

      // shipping
      shipping_type: body.shippingType,
      carrier: body.carrier ?? null,
      shipping_cost: shippingCost,

      // payment initial state
      payment_provider: "mercadopago",
      payment_status: "pending",
      currency_id: body.currency_id || "PEN",

      // amounts
      subtotal: moneyRound(subtotal),
      discount: moneyRound(safeDiscount),
      total,

      // timestamps
      created_at_pe: nowPeruISO(), // si tienes esta columna. Si no, bórrala.
      paid_at: null,

      // store items snapshot
      items: items.map((it) => ({
        product_id: it.product_id,
        title: it.title,
        qty: Number(it.qty || 0),
        unit_price: moneyRound(Number(it.unit_price || 0)),
        slug: it.slug ?? null,
        image: it.image ?? null,
        color_name: it.color_name ?? null,
        color_slug: it.color_slug ?? null,
        size_label: it.size_label ?? null,
      })),

      coupon: body.coupon ?? null,
      metadata: body.metadata ?? {},
    };

    const { data, error } = await sb
      .from("orders")
      .insert(payload)
      // 👇 importante: también traer email_pending_sent_at para evitar reenvíos
      .select("id, external_reference, email_pending_sent_at")
      .single();

    if (error) {
      console.error("orders/create insert error:", error);
      return NextResponse.json(
        { ok: false, message: "No se pudo crear order", error },
        { status: 500 }
      );
    }

    // ✅ EMAIL PENDIENTE (después del insert OK) - NUEVO TEMPLATE PRO
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;

    try {
      if (payload.email && siteUrl && !data.email_pending_sent_at) {
        const html = buildOrderEmailHtml({
          order: {
            ...data,
            email: payload.email,
            full_name: payload.full_name,
            phone: payload.phone,
            address: payload.address,
            reference: payload.reference,
            dep_name: payload.dep_name,
            prov_name: payload.prov_name,
            dist_name: payload.dist_name,
            carrier: payload.carrier,
            shipping_type: payload.shipping_type,
            shipping_cost: payload.shipping_cost,
            subtotal: payload.subtotal,
            discount: payload.discount,
            total: payload.total,
            items: payload.items,
            doc_type: payload.doc_type,
            doc_number: payload.doc_number,
          },
          mode: "pending", // pedido recién creado => pendiente
          siteUrl,
        });

        await sendOrderEmail({
          to: payload.email,
          subject: "⏳ Recibimos tu pedido — Smiggle Perú",
          html,
        });

        await sb
          .from("orders")
          .update({ email_pending_sent_at: new Date().toISOString() })
          .eq("id", data.id);
      }
    } catch (e) {
      // ⚠️ No rompas la creación de la orden por error de email
      console.error("orders/create email pending error:", e);
    }

    return NextResponse.json({
      ok: true,
      order_id: data.id,
      external_reference: data.external_reference,
    });
  } catch (err: any) {
    console.error("orders/create error:", err);
    return NextResponse.json(
      { ok: false, message: "Error interno" },
      { status: 500 }
    );
  }
}
