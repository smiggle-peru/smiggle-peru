import { supabaseServer } from "@/lib/supabase/server";

export async function getProductBySlug(slug: string) {
  const sb = supabaseServer();

  const { data: product, error } = await sb
    .from("products")
    .select("id,title,slug,details,is_active")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  if (!product) return null;

  const { data: variants, error: e2 } = await sb
    .from("product_variants")
    .select("id,product_id,price_now,price_before,stock,images,sort_order,is_active,color,color_slug,color_hex,color_name,size_label,sku")
    .eq("product_id", product.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (e2) throw e2;

  // ✅ categoryId (pivot)
  const { data: pc } = await sb
    .from("product_categories")
    .select("category_id")
    .eq("product_id", product.id)
    .maybeSingle();

  // ✅ subcategoryId (pivot)
  const { data: ps } = await sb
    .from("product_subcategories")
    .select("subcategory_id")
    .eq("product_id", product.id)
    .maybeSingle();

  return {
    product,
    variants: variants ?? [],
    categoryId: pc?.category_id ?? null,
    subcategoryId: ps?.subcategory_id ?? null,
  };
}

