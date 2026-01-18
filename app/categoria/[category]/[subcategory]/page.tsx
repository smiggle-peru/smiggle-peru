import { getProductsByCategory } from "@/lib/data/products";
import { ProductGrid } from "@/components/ProductGrid";

export default async function SubCategoryPage({
  params,
}: {
  params: { category: string; subcategory: string };
}) {
  const items = await getProductsByCategory(params.category, params.subcategory);

  return (
    <div className="space-y-6">
      <h1 className="text-center text-[20px] font-semibold md:text-[28px]">
        {params.subcategory.replaceAll("-", " ")}
      </h1>

      <ProductGrid items={items as any} />
    </div>
  );
}
