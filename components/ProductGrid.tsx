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
      <div className="py-20 text-center text-sm text-black/60">
        No hay productos disponibles.
      </div>
    );
  }

  return (
    <div
      className="
        grid grid-cols-2
        gap-x-4 gap-y-10

        sm:gap-x-6 sm:gap-y-12

        md:grid-cols-3
        md:gap-x-8 md:gap-y-14

        lg:grid-cols-4
        lg:gap-x-10 lg:gap-y-16
      "
    >
      {items.map((p) => (
        <ProductCard
          key={`${p.id}-${p.card.color_slug ?? "default"}`}
          id={p.id}
          title={p.title}
          slug={p.slug}
          image={p.card.image}
          price_now={p.card.price_now}
          price_before={p.card.price_before}
          color_slug={p.card.color_slug ?? null}
        />
      ))}
    </div>
  );
}
