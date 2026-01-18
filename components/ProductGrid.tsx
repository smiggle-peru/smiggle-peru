import Link from "next/link";
import Image from "next/image";

type Item = {
  id: string;
  title: string;
  slug: string;
  card: { image: string | null; price_now: number | null; price_before: number | null };
};

export function ProductGrid({ items }: { items: Item[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
      {items.map((p) => (
        <Link key={p.id} href={`/producto/${p.slug}`} className="group">
          <div className="relative aspect-square w-full">
            {p.card.image ? (
              <Image
                src={p.card.image}
                alt={p.title}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#f5f5f5] text-sm text-black/60">
                Sin imagen
              </div>
            )}
          </div>

          <div className="mt-3 space-y-1">
            <div className="text-[13px] leading-snug text-black md:text-[14px]">
              {p.title}
            </div>

            <div className="flex items-baseline gap-2">
              {p.card.price_before ? (
                <span className="text-[12px] text-black/50 line-through">
                  S/ {Number(p.card.price_before).toFixed(2)}
                </span>
              ) : null}

              {p.card.price_now ? (
                <span className="text-[14px] font-semibold text-black">
                  S/ {Number(p.card.price_now).toFixed(2)}
                </span>
              ) : (
                <span className="text-[13px] text-black/60">Consultar</span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
