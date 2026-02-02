import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/data/product";
import { ProductView } from "./ProductView";

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ color?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const data = await getProductBySlug(slug);
  if (!data) notFound();

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8">
      <ProductView
        product={data.product}
        variants={data.variants}
        initialColorSlug={sp.color ?? null}
      />
    </div>
  );
}

