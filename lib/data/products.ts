import { supabaseServer } from "@/lib/supabase/server";

type GridItem = {
  id: string;
  title: string;
  slug: string;
  preview?: { color?: string | null; color_slug?: string | null };
  card: {
    image: string | null;
    price_now: number | null;
    price_before: number | null;
    color_slug?: string | null;
  };
};

function throwSb(where: string, e: any): never {
  const msg =
    e?.message ??
    e?.cause?.message ??
    (typeof e === "string" ? e : "Unknown Supabase error");
  console.error(`[Supabase] ${where}`, e);
  throw new Error(`${where}: ${msg}`);
}

export async function getProductsByCategory(
  categorySlug: string,
  subSlug?: string
): Promise<GridItem[]> {
  const sb = supabaseServer();

  // 1) category
  const { data: cat, error: e1 } = await sb
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .eq("is_active", true)
    .maybeSingle();

  if (e1) throwSb("categories.maybeSingle", e1);
  if (!cat?.id) return [];

  // 2) si viene subSlug -> filtra por esa subcategoría
  let subId: string | null = null;

  if (subSlug) {
    const { data: sub, error: e2 } = await sb
      .from("subcategories")
      .select("id")
      .eq("category_id", cat.id)
      .eq("slug", subSlug)
      .eq("is_active", true)
      .maybeSingle();

    if (e2) throwSb("subcategories.maybeSingle", e2);
    if (!sub?.id) return [];

    subId = sub.id;
  }

  // 3) juntar IDs de productos
  const idSet = new Set<string>();

  // 3a) productos directos en category (siempre)
  const { data: linksCat, error: e3a } = await sb
    .from("product_categories")
    .select("product_id")
    .eq("category_id", cat.id);

  if (e3a) throwSb("product_categories.select", e3a);
  for (const r of linksCat ?? []) {
    if (r?.product_id) idSet.add(r.product_id);
  }

  // 3b) productos por subcategorías
  if (subId) {
    // solo esa subcategoría
    const { data: linksSub, error: e3b } = await sb
      .from("product_subcategories")
      .select("product_id")
      .eq("subcategory_id", subId);

    if (e3b) throwSb("product_subcategories.select(sub)", e3b);
    for (const r of linksSub ?? []) {
      if (r?.product_id) idSet.add(r.product_id);
    }
  } else {
    // TODAS las subcategorías de la categoría
    const { data: subs, error: e2b } = await sb
      .from("subcategories")
      .select("id")
      .eq("category_id", cat.id)
      .eq("is_active", true);

    if (e2b) throwSb("subcategories.select(all)", e2b);

    const subIds = (subs ?? []).map((s: any) => s.id).filter(Boolean);

    if (subIds.length) {
      const { data: linksSubs, error: e3c } = await sb
        .from("product_subcategories")
        .select("product_id")
        .in("subcategory_id", subIds);

      if (e3c) throwSb("product_subcategories.select(all)", e3c);
      for (const r of linksSubs ?? []) {
        if (r?.product_id) idSet.add(r.product_id);
      }
    }
  }

  const ids = Array.from(idSet);
  if (!ids.length) return [];

  // 4) products
  const { data: products, error: e4 } = await sb
    .from("products")
    .select("id,title,slug,is_active,created_at")
    .in("id", ids)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (e4) throwSb("products.select", e4);
  if (!products?.length) return [];

  // 5) variants (traer color y color_slug)
  const { data: variants, error: e5 } = await sb
    .from("product_variants")
    .select(
      "product_id,price_now,price_before,images,stock,sort_order,is_active,color,color_slug,color_hex,color_name"
    )
    .in(
      "product_id",
      products.map((p) => p.id)
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (e5) throwSb("product_variants.select", e5);

  // 6) agrupar variantes por producto
  const byProduct = new Map<string, any[]>();
  for (const v of variants ?? []) {
    const arr = byProduct.get(v.product_id) ?? [];
    arr.push(v);
    byProduct.set(v.product_id, arr);
  }

  // 7) 1 card por color
  return products.flatMap((p): GridItem[] => {
    const list = byProduct.get(p.id) ?? [];

    // ✅ FIX: devuelve preview SIEMPRE (evita el error en build)
    if (!list.length) {
      return [
        {
          id: p.id,
          title: p.title,
          slug: p.slug,
          preview: {
            color: null,
            color_slug: null,
          },
          card: {
            price_now: null,
            price_before: null,
            image: null,
            color_slug: null,
          },
        },
      ];
    }

    const byColor = new Map<string, any[]>();
    for (const v of list) {
      const key = (v.color_slug ?? v.color ?? "default").toString();
      const arr = byColor.get(key) ?? [];
      arr.push(v);
      byColor.set(key, arr);
    }

    return Array.from(byColor.entries()).map(([key, vars]): GridItem => {
      const primary = vars.find((v) => (v.stock ?? 0) > 0) ?? vars[0] ?? null;
      const img = primary?.images?.[0] ?? null;

      const colorSlug = primary?.color_slug ?? key ?? null;
      const colorName = primary?.color ?? primary?.color_name ?? null;

      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        preview: {
          color: colorName,
          color_slug: colorSlug,
        },
        card: primary
          ? {
              price_now: primary.price_now ?? null,
              price_before: primary.price_before ?? null,
              image: img,
              color_slug: colorSlug,
            }
          : {
              price_now: null,
              price_before: null,
              image: null,
              color_slug: colorSlug,
            },
      };
    });
  });
}
