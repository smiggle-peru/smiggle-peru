"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { useCart } from "@/lib/store/cart";

type ProductCardProps = {
  id: string;
  title: string;
  slug: string;
  image: string | null;
  price_now: number | null;
  price_before: number | null;
  color_slug?: string | null;

  // opcionales
  badge?: string | null; // "Almost Gone" | "Most Popular"
  variants_count?: number | null; // 1, 3, etc
};

function discountPct(before: number, now: number) {
  return Math.round(((before - now) / before) * 100);
}

function money(n: number) {
  return `S/ ${n.toFixed(2)}`;
}

export function ProductCard({
  id,
  title,
  slug,
  image,
  price_now,
  price_before,
  color_slug,
  badge = null,
  variants_count = null,
}: ProductCardProps) {
  const add = useCart((s) => s.add);

  const href = useMemo(() => {
    const colorQ = color_slug ? `?color=${encodeURIComponent(color_slug)}` : "";
    return `/producto/${slug}${colorQ}`;
  }, [slug, color_slug]);

  const hasDiscount =
    typeof price_now === "number" &&
    typeof price_before === "number" &&
    price_before > price_now;

  const pct =
    hasDiscount &&
    typeof price_now === "number" &&
    typeof price_before === "number"
      ? discountPct(price_before, price_now)
      : null;

  const canAdd = typeof price_now === "number" && price_now > 0;

  return (
    <article className="h-full">
      {/* IMAGEN (bloque gris grande, sin rounded, sin sombra) */}
      <div className="relative bg-[#ededed]">
        <Link href={href} className="block">
          <div className="relative aspect-square w-full">
            {image ? (
              <img
                src={image}
                alt={title}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-black/40">
                Sin imagen
              </div>
            )}
          </div>
        </Link>

        {/* BADGE tipo "Almost Gone" */}
        {badge ? (
          <div className="absolute left-0 bottom-0 bg-white px-3 py-1 text-[12px] font-semibold text-black">
            {badge}
          </div>
        ) : null}
      </div>

      {/* INFO + ACCIONES */}
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={href} className="block">
            <h3 className="text-[13px] leading-snug text-black hover:underline line-clamp-2">
              {title}
            </h3>
          </Link>

          <div className="mt-1 flex items-baseline gap-2">
            {hasDiscount && typeof price_before === "number" ? (
              <span className="text-[12px] text-black/40 line-through">
                {money(price_before)}
              </span>
            ) : null}

            {typeof price_now === "number" ? (
              <span className="text-[14px] font-semibold text-black">
                {money(price_now)}
              </span>
            ) : (
              <span className="text-[13px] text-black/60">Consultar</span>
            )}
          </div>

          {/* línea azul */}
          {pct ? (
            <div className="mt-1 text-[12px] font-semibold text-[#0A66FF]">
              {pct}% OFF packs. SOLO ONLINE!
            </div>
          ) : null}

          {/* + colores */}
          {typeof variants_count === "number" && variants_count > 0 ? (
            <div className="mt-1 text-[12px] text-black/60">
              + {variants_count} color{variants_count === 1 ? "" : "es"}
            </div>
          ) : null}
        </div>

        {/* ✅ SOLO BOLSA (sin corazón) */}
        <div className="flex items-center gap-3 pt-0.5">
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
                price_now: price_now!,
                color_slug: color_slug ?? null,
                qty: 1,
              });
            }}
            className="grid h-8 w-8 place-items-center rounded-md border border-black/15 bg-white hover:bg-black/5 disabled:opacity-50"
            aria-label="Agregar a bolsa"
            title={canAdd ? "Agregar a bolsa" : "No disponible"}
          >
            <Image
              src="/icons/add-to-bag.png"
              alt="Agregar a bolsa"
              width={18}
              height={18}
              className="opacity-90"
            />
          </button>
        </div>
      </div>
    </article>
  );
}