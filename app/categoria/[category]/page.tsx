export const runtime = "nodejs";

import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductsByCategory } from "@/lib/data/products";
import { ProductGrid } from "@/components/ProductGrid";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!category) notFound();

  const items = await getProductsByCategory(category);

  // ✅ si no hay productos, 404
  if (!items || items.length === 0) notFound();

  const title = decodeURIComponent(category).replaceAll("-", " ");

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 pb-16 pt-6">
      {/* Top bar */}
      <div className="space-y-4">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12px] text-black/55">
          <Link href="/" className="hover:text-black">
            Inicio
          </Link>
          <span className="text-black/25">/</span>
          <span className="capitalize text-black/80">{title}</span>
        </nav>

        {/* Title + meta */}
        <div className="flex flex-col gap-4 border-b border-black/10 pb-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-[22px] font-extrabold leading-[1.05] tracking-[-0.02em] text-black md:text-[34px]">
              {title}
            </h1>
            <div className="mt-2 flex items-center gap-3 text-[13px] text-black/60">
              <span>
                <span className="font-semibold text-black">
                  {items.length}
                </span>{" "}
                productos
              </span>
              <span className="text-black/20">•</span>
              <span></span>
            </div>
          </div>

          {/* Ordenar (solo UI) */}
          <div className="flex items-center gap-2">
            <div className="text-[12px] font-semibold uppercase tracking-[0.08em] text-black/60">
              Ordenar por
            </div>
            <select
              className="
                h-10 rounded-full border border-black/15 bg-white px-4 pr-9
                text-[13px] text-black/80 outline-none
                hover:border-black/25
              "
              defaultValue="recomendados"
            >
              <option value="recomendados">Recomendados</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="nuevos">Nuevos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-8">
        <ProductGrid items={items as any} />
      </div>
    </div>
  );
}
