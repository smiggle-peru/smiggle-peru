export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { getProductsByCategory } from "@/lib/data/products";
import { ProductGrid } from "@/components/ProductGrid";

type AliasRow = {
  to_category_slug: string;
  to_sub_slug: string;
  title: string | null;
};

function throwSb(where: string, e: any): never {
  console.error(`[Supabase] ${where}`, e);
  throw new Error(e?.message ?? `Supabase error in ${where}`);
}

export default async function SubCategoryPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const { category, subcategory } = await params;
  if (!category || !subcategory) notFound();

  const fromCat = decodeURIComponent(category);
  const fromSub = decodeURIComponent(subcategory);

  const sb = supabaseServer();

  // buscar alias
  const { data: alias, error: e1 } = await sb
    .from("category_aliases")
    .select("to_category_slug,to_sub_slug,title")
    .eq("from_category_slug", fromCat)
    .eq("from_sub_slug", fromSub)
    .eq("is_active", true)
    .maybeSingle<AliasRow>();

  if (e1) throwSb("category_aliases.maybeSingle", e1);

  const useCategory = alias?.to_category_slug ?? fromCat;
  const useSub = alias?.to_sub_slug ?? fromSub;

  const items = await getProductsByCategory(useCategory, useSub);

  if (!items || items.length === 0) notFound();

  const title = alias?.title ?? fromSub.replaceAll("-", " ");

  return (
    <div className="space-y-6">
      <h1 className="text-center text-[20px] font-semibold md:text-[28px]">
        {title}
      </h1>

      <ProductGrid items={items as any} />
    </div>
  );
}
