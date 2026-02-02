import { supabaseServer } from "@/lib/supabase/server";

export type SimilarItem = {
  id: string;
  title: string;
  slug: string;
  preview?: { color?: string | null; color_slug?: string | null };
  card: { image: string | null; price_now: number | null; price_before: number | null };
  match_type: "same_color" | "similar";
};

type Args = {
  productId: string;
  categoryId: string | null;
  subcategoryId: string | null;
  colorSlug: string | null;
  limit?: number;
};

function pickPrimary(vars: any[]) {
  const primary = vars.find((v) => (v.stock ?? 0) > 0) ?? vars[0] ?? null;
  const img = primary?.images?.[0] ?? null;
  return {
    preview: { color: primary?.color ?? primary?.color_name ?? null, color_slug: primary?.color_slug ?? null },
    card: {
      image: img,
      price_now: primary?.price_now ?? null,
      price_before: primary?.price_before ?? null,
    },
  };
}

export async function getSimilarProducts({
  productId,
  categoryId,
  subcategoryId,
  colorSlug,
  limit = 6,
}: Args): Promise<SimilarItem[]> {
  const sb = supabaseServer();
  if (!categoryId) return [];

  // 1) candidatos por subcategoría (si existe) o por categoría
  let candidateIds: string[] = [];

  if (subcategoryId) {
    const { data: links, error } = await sb
      .from("product_subcategories")
      .select("product_id")
      .eq("subcategory_id", subcategoryId);

    if (error) throw error;
    candidateIds = (links ?? []).map((r: any) => r.product_id).filter(Boolean);
  } else {
    const { data: links, error } = await sb
      .from("product_categories")
      .select("product_id")
      .eq("category_id", categoryId);

    if (error) throw error;
    candidateIds = (links ?? []).map((r: any) => r.product_id).filter(Boolean);
  }

  candidateIds = Array.from(new Set(candidateIds)).filter((id) => id !== productId);
  if (!candidateIds.length) return [];

  // 2) Trae productos base (activos)
  const { data: products, error: e2 } = await sb
    .from("products")
    .select("id,title,slug,is_active,created_at")
    .in("id", candidateIds)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(50);

  if (e2) throw e2;
  if (!products?.length) return [];

  const productIds = products.map((p) => p.id);

  // 3) Trae variantes (para elegir la del mismo color si existe)
  const { data: variants, error: e3 } = await sb
    .from("product_variants")
    .select("product_id,price_now,price_before,images,stock,sort_order,is_active,color,color_slug,color_hex,color_name")
    .in("product_id", productIds)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (e3) throw e3;

  const byProduct = new Map<string, any[]>();
  for (const v of variants ?? []) {
    const arr = byProduct.get(v.product_id) ?? [];
    arr.push(v);
    byProduct.set(v.product_id, arr);
  }

  // 4) Armado de items:
  //    - same_color: tienen al menos 1 variante con color_slug = seleccionado
  //    - similar: el resto
  const sameColor: SimilarItem[] = [];
  const similar: SimilarItem[] = [];

  for (const p of products) {
    const list = byProduct.get(p.id) ?? [];
    if (!list.length) continue;

    const colorVars = colorSlug ? list.filter((v) => v.color_slug === colorSlug) : [];
    if (colorSlug && colorVars.length) {
      const picked = pickPrimary(colorVars);
      sameColor.push({
        id: p.id,
        title: p.title,
        slug: p.slug,
        ...picked,
        match_type: "same_color",
      });
    } else {
      const picked = pickPrimary(list);
      similar.push({
        id: p.id,
        title: p.title,
        slug: p.slug,
        ...picked,
        match_type: "similar",
      });
    }
  }

  // 5) Prioriza mismo color, rellena con similares
  const out = [...sameColor, ...similar].slice(0, limit);
  return out;
}
