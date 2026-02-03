// app/api/validate-coupon/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type CouponRow = {
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_subtotal: number;
  max_discount: number | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  usage_limit: number | null;
  used_count: number;
};

type ReqItem = {
  product_id: string;
  qty: number;
};

type VariantRow = {
  id: string;
  product_id: string;
  price_now: number | null;
  is_active: boolean | null;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function nowMs() {
  return Date.now();
}

function parseDateMs(s: string | null) {
  if (!s) return null;
  const t = new Date(s).getTime();
  return Number.isFinite(t) ? t : null;
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

// ✅ Usa SERVICE ROLE en el servidor (NO exponer al cliente)
function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !service) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  return createClient(url, service, {
    auth: { persistSession: false },
  });
}

function normalizeItems(raw: any): ReqItem[] {
  const arr = Array.isArray(raw) ? raw : [];
  const cleaned: ReqItem[] = [];

  for (const it of arr) {
    const product_id = String(it?.product_id || "").trim();
    const qty = Number(it?.qty || 0);

    if (!product_id) continue;
    if (!Number.isFinite(qty) || qty <= 0) continue;

    cleaned.push({ product_id, qty: Math.floor(qty) });
  }

  return cleaned;
}

// ✅ subtotal server-side desde public.product_variants (precio real)
async function computeSubtotalFromDB(items: ReqItem[]) {
  const supabase = supabaseAdmin();

  const productIds = Array.from(new Set(items.map((i) => i.product_id)));

  const { data, error } = await supabase
    .from("product_variants")
    .select("id, product_id, price_now, is_active")
    .in("product_id", productIds)
    .returns<VariantRow[]>();

  if (error) {
    return {
      ok: false as const,
      message: "Error consultando precios.",
    };
  }

  if (!data || data.length === 0) {
    return {
      ok: false as const,
      message: "No se encontraron precios para los productos.",
    };
  }

  // Agrupar variantes por product_id
  const variantsByProduct = new Map<string, VariantRow[]>();
  for (const v of data) {
    if (!variantsByProduct.has(v.product_id)) variantsByProduct.set(v.product_id, []);
    variantsByProduct.get(v.product_id)!.push(v);
  }

  let subtotal = 0;

  for (const it of items) {
    const variants = variantsByProduct.get(it.product_id);

    if (!variants || variants.length === 0) {
      return {
        ok: false as const,
        message: "Uno de los productos no tiene precio disponible.",
      };
    }

    // Caso típico: 1 sola variante. Si hay varias, preferimos una activa.
    const chosen =
      variants.find((x) => x.is_active !== false) ?? variants[0];

    const price = Number(chosen.price_now ?? 0);

    if (!Number.isFinite(price) || price <= 0) {
      return {
        ok: false as const,
        message: "Precio inválido en uno de los productos.",
      };
    }

    subtotal += price * it.qty;
  }

  return { ok: true as const, subtotal: round2(subtotal) };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const rawCode = String(body?.code || "").trim().toUpperCase();
    const items = normalizeItems(body?.items);

    if (!rawCode) {
      return NextResponse.json(
        { ok: false, message: "Ingresa un cupón." },
        { status: 400 }
      );
    }

    if (!items.length) {
      return NextResponse.json(
        { ok: false, message: "Carrito vacío." },
        { status: 400 }
      );
    }

    // ✅ subtotal recalculado desde BD (NO confiar en el cliente)
    const subRes = await computeSubtotalFromDB(items);
    if (!subRes.ok) {
      return NextResponse.json(
        { ok: false, message: subRes.message },
        { status: 200 }
      );
    }
    const subtotal = subRes.subtotal;

    if (!Number.isFinite(subtotal) || subtotal <= 0) {
      return NextResponse.json(
        { ok: false, message: "Subtotal inválido." },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    const { data, error } = await supabase
      .from("coupons")
      .select(
        "code,discount_type,discount_value,min_subtotal,max_discount,starts_at,ends_at,is_active,usage_limit,used_count"
      )
      .eq("code", rawCode)
      .limit(1)
      .maybeSingle<CouponRow>();

    if (error) {
      return NextResponse.json(
        { ok: false, message: "Error consultando cupón." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { ok: false, message: "Cupón inválido." },
        { status: 200 }
      );
    }

    if (!data.is_active) {
      return NextResponse.json(
        { ok: false, message: "Cupón inactivo." },
        { status: 200 }
      );
    }

    const n = nowMs();
    const start = parseDateMs(data.starts_at);
    const end = parseDateMs(data.ends_at);

    if (start !== null && n < start) {
      return NextResponse.json(
        { ok: false, message: "Cupón aún no disponible." },
        { status: 200 }
      );
    }

    if (end !== null && n > end) {
      return NextResponse.json(
        { ok: false, message: "Cupón expirado." },
        { status: 200 }
      );
    }

    if (subtotal < Number(data.min_subtotal || 0)) {
      return NextResponse.json(
        {
          ok: false,
          message: `Compra mínima: S/ ${Number(data.min_subtotal || 0).toFixed(
            2
          )}`,
          subtotal,
        },
        { status: 200 }
      );
    }

    if (data.usage_limit !== null && data.used_count >= data.usage_limit) {
      return NextResponse.json(
        { ok: false, message: "Cupón agotado.", subtotal },
        { status: 200 }
      );
    }

    // ===== calcular descuento
    let discount = 0;

    if (data.discount_type === "percent") {
      const pct = clamp(Number(data.discount_value || 0), 0, 100);
      discount = (subtotal * pct) / 100;

      if (data.max_discount !== null && Number.isFinite(data.max_discount)) {
        discount = Math.min(discount, Number(data.max_discount));
      }
    } else {
      discount = Math.max(0, Number(data.discount_value || 0));
    }

    // nunca más que subtotal
    discount = Math.min(discount, subtotal);

    discount = round2(discount);

    return NextResponse.json({
      ok: true,
      coupon: data.code,
      subtotal, // 👈 devolvemos subtotal server-side para que lo muestres si quieres
      discount,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { ok: false, message: "Error inesperado." },
      { status: 500 }
    );
  }
}
