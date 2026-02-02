"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/store/cart";

type ProductCardProps = {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  price_now: number | null;
  price_before: number | null;
  color_slug?: string | null;
};

function discountPct(before: number, now: number) {
  return Math.round(((before - now) / before) * 100);
}

export function ProductCard({
  id,
  title,
  slug,
  image,
  price_now,
  price_before,
  color_slug,
}: ProductCardProps) {
  const add = useCart((s) => s.add);

  const colorQ = color_slug ? `?color=${encodeURIComponent(color_slug)}` : "";
  const href = `/producto/${slug}${colorQ}`;

  const hasDiscount =
    typeof price_now === "number" &&
    typeof price_before === "number" &&
    price_before > price_now;

  const pct =
    hasDiscount && price_now && price_before
      ? discountPct(price_before, price_now)
      : null;

  const canAdd = typeof price_now === "number" && price_now > 0;

  return (
    <article className="group">
      {/* ✅ IMAGEN LIBRE (sin caja, sin fondo, sin alto fijo) */}
      <Link href={href} className="block">
        {image ? (
          <Image
            src={image}
            alt={title}
            width={900}
            height={900}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="h-auto w-full object-contain"
            priority={false}
          />
        ) : (
          <div className="flex aspect-square items-center justify-center text-sm text-black/40">
            Sin imagen
          </div>
        )}
      </Link>

      {/* TEXTO */}
      <div className="mt-3">
        <Link href={href} className="block">
          <h3 className="text-[13px] leading-snug text-black line-clamp-2">
            {title}
          </h3>
        </Link>

        {/* PRECIOS + AGREGAR (hover desktop, visible mobile) */}
        <div className="mt-1 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            {hasDiscount && price_before ? (
              <span className="text-[12px] text-black/40 line-through">
                S/ {price_before.toFixed(2)}
              </span>
            ) : null}

            {typeof price_now === "number" ? (
              <span className="text-[14px] font-semibold text-black">
                S/ {price_now.toFixed(2)}
              </span>
            ) : (
              <span className="text-[13px] text-black/60">Consultar</span>
            )}
          </div>

          {/* ✅ Mobile: visible | Desktop: aparece solo con hover */}
          <button
            type="button"
            disabled={!canAdd}
            onClick={() => {
              if (!canAdd) return;

              add({
                product_id: id,
                title,
                slug,
                image,
                price_now: price_now!, // safe por canAdd
                color_slug: color_slug ?? null,
                qty: 1,
              });
            }}
            className="
              grid h-8 w-8 shrink-0 place-items-center rounded-full
              border border-black/15 bg-white
              transition hover:bg-black/5
              opacity-100
              lg:opacity-0 lg:pointer-events-none
              lg:group-hover:opacity-100 lg:group-hover:pointer-events-auto
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            aria-label="Agregar a bolsa"
            title={canAdd ? "Agregar a bolsa" : "No disponible"}
          >
            <Image
              src="/icons/add-to-bag.png"
              alt="Agregar"
              width={16}
              height={16}
              className="opacity-80"
            />
          </button>
        </div>

        {pct ? (
          <div className="mt-1 text-[12px] text-[#0A66FF]">
            Ahorra {pct}% • ¡Compra hoy!
          </div>
        ) : null}
      </div>
    </article>
  );
}
