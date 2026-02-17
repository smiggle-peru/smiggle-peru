import { createClient } from "@supabase/supabase-js";
import SearchResults from "./SearchResults";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function BuscarPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    }
  );

  // productos
  const { data: products, error: pErr } = await supabase
    .from("products")
    .select("id,title,slug,details,is_active")
    .eq("is_active", true);

  if (pErr) console.error("Products error:", pErr.message);

  const productIds = (products || []).map((p) => p.id);

  // variants (de acá sale precio/imagen/color)
  const { data: variants, error: vErr } = await supabase
    .from("product_variants")
    .select("product_id,price_now,price_before,images,color_name,is_active")
    .in(
      "product_id",
      productIds.length ? productIds : ["00000000-0000-0000-0000-000000000000"]
    )
    .eq("is_active", true);

  if (vErr) console.error("Variants error:", vErr.message);

  // 👉 mejor variant por producto (elige la más barata)
  const bestByProduct = new Map<string, any>();
  for (const v of variants || []) {
    const cur = bestByProduct.get(v.product_id);
    const vPrice = v?.price_now ?? 999999;
    const curPrice = cur?.price_now ?? 999999;
    if (!cur || vPrice < curPrice) bestByProduct.set(v.product_id, v);
  }

  // ✅ items con el MISMO shape que ProductGrid
  const items =
    (products || []).map((p) => {
      const v = bestByProduct.get(p.id);

      const image = Array.isArray(v?.images) ? v.images[0] : null;

      // color_slug: si no tienes columna, lo generamos desde color_name
      const color_slug =
        typeof v?.color_name === "string" && v.color_name.trim()
          ? v.color_name
              .toLowerCase()
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")
          : null;

      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        details: p.details,
        card: {
          image,
          price_now: v?.price_now ?? null,
          price_before: v?.price_before ?? null,
          color_slug,
        },
      };
    }) || [];

  return (
    <main className="w-full py-8">
      <h1 className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 text-xl font-semibold mb-6">
        Resultados de búsqueda
      </h1>

      <Suspense
        fallback={
          <div className="py-16 text-center text-sm text-black/60">
            Cargando resultados…
          </div>
        }
      >
        <SearchResults items={items} />
      </Suspense>
    </main>
  );
}
