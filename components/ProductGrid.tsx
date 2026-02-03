import { ProductCard } from "@/components/ProductCard";

type Item = {
  id: string;
  title: string;
  slug: string;
  card: {
    image: string | null;
    price_now: number | null;
    price_before: number | null;
    color_slug?: string | null;
  };
};

export function ProductGrid({ items }: { items: Item[] }) {
  if (!items.length) {
    return (
      <div className="py-16 text-center text-sm text-black/60">
        No hay productos disponibles.
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
      <div
        className="
          grid
          grid-cols-2
          gap-x-4 gap-y-8

          sm:grid-cols-2
          sm:gap-x-6 sm:gap-y-10

          md:grid-cols-3
          md:gap-x-8 md:gap-y-12

          lg:grid-cols-4
          lg:gap-x-10 lg:gap-y-14
        "
        style={{
          // ✅ hace que todas las cards se alineen mejor verticalmente
          gridAutoRows: "1fr",
        }}
      >
        {items.map((p) => (
          <div key={`${p.id}-${p.card.color_slug ?? "default"}`} className="h-full">
            <ProductCard
              id={p.id}
              title={p.title}
              slug={p.slug}
              image={p.card.image}
              price_now={p.card.price_now}
              price_before={p.card.price_before}
              color_slug={p.card.color_slug ?? null}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
