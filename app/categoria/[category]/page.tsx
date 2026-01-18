import { notFound } from "next/navigation";
import { getProductsByCategory } from "@/lib/data/products";
import { ProductGrid } from "@/components/ProductGrid";

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const categorySlug = params?.category;

  if (!categorySlug) notFound();

  const items = await getProductsByCategory(categorySlug);

  const title = decodeURIComponent(categorySlug).replaceAll("-", " ");

  return (
    <div className="space-y-6">
      <h1 className="text-center text-[20px] font-semibold md:text-[28px]">
        {title}
      </h1>

      <ProductGrid items={items as any} />
    </div>
  );
}
