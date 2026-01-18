import { supabaseServer } from "@/lib/supabase/server";

export async function getProductsByCategory(category: string, subcategory?: string) {
  const sb = supabaseServer();

  // 1) Trae productos activos
  let q = sb
    .from("products")
    .select("id,title,slug,category_slug,subcategory_slug")
    .eq("is_active", true)
    .eq("category_slug", category);

  if (subcategory) q = q.eq("subcategory_slug", subcategory);

  const { data: products, error } = await q.order("created_at", { ascending: false });

  if (error) throw error;
  if (!products?.length) return [];

  // 2) Trae variantes para esos productos (para sacar “principal”)
  const ids = products.map((p) => p.id);

  const { data: variants, error: e2 } = await sb
    .from("product_variants")
    .select("product_id,price_now,price_before,images,stock,sort_order,is_active")
    .in("product_id", ids)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (e2) throw e2;

  // 3) arma el “card model”
  const byProduct = new Map<string, any[]>();
  for (const v of variants ?? []) {
    const arr = byProduct.get(v.product_id) ?? [];
    arr.push(v);
    byProduct.set(v.product_id, arr);
  }

  return products.map((p) => {
    const list = byProduct.get(p.id) ?? [];
    const primary =
      list.find((v) => (v.stock ?? 0) > 0) ?? list[0] ?? null;

    const img = primary?.images?.[0] ?? null;

    return {
      ...p,
      card: primary
        ? { price_now: primary.price_now, price_before: primary.price_before, image: img }
        : { price_now: null, price_before: null, image: null },
    };
  });
}
