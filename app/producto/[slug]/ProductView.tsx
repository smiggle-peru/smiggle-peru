"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/store/cart";
import { ProductDetailsPanels } from "@/components/ProductDetailsPanels";
import ProductLightbox from "@/components/ProductLightbox";

type Variant = {
  id: string;
  price_now: number | null;
  price_before: number | null;
  stock: number | null;
  images: string[] | null;

  color?: string | null;
  color_slug?: string | null;
  color_hex?: string | null;
  color_name?: string | null;
};

function fmtPEN(v: number | null) {
  if (v === null || v === undefined) return null;
  return `S/ ${Number(v).toFixed(2)}`;
}

function cn(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(" ");
}

export function ProductView({
  product,
  variants,
  initialColorSlug,
  onAddToCart,
  similarSlot,
}: {
  product: { id?: string; title: string; slug?: string; details: any };
  variants: Variant[];
  initialColorSlug: string | null;
  onAddToCart?: (v: Variant, qty: number) => void;
  similarSlot?: React.ReactNode;
}) {
  const add = useCart((s) => s.add);

  const colors = useMemo(() => {
    const m = new Map<string, Variant>();
    for (const v of variants) {
      const key = (v.color_slug ?? v.color ?? v.id) as string;
      if (!m.has(key)) m.set(key, v);
    }
    return Array.from(m.values());
  }, [variants]);

  const initial = useMemo(() => {
    if (!initialColorSlug) return colors[0] ?? variants[0] ?? null;
    return (
      colors.find((v) => v.color_slug === initialColorSlug) ??
      variants.find((v) => v.color_slug === initialColorSlug) ??
      colors[0] ??
      variants[0] ??
      null
    );
  }, [initialColorSlug, colors, variants]);

  const [selected, setSelected] = useState<Variant | null>(initial);
  const [qty, setQty] = useState(1);

  const gallery = selected?.images?.filter(Boolean) ?? [];
  const [activeIdx, setActiveIdx] = useState(0);

  // ✅ Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setActiveIdx(0);
    // cuando cambias de variante, aseguras que el zoom abra desde la primera
  }, [selected?.id]);

  const activeImg = gallery[activeIdx] ?? gallery[0] ?? null;

  const priceNow = selected?.price_now ?? null;
  const priceBefore = selected?.price_before ?? null;

  const colorLabel =
    selected?.color_name ??
    selected?.color ??
    (selected?.color_slug ? selected.color_slug.replaceAll("-", " ") : null) ??
    "—";

  const inStock = (selected?.stock ?? 0) > 0;

  const canAdd =
    !!selected && inStock && typeof priceNow === "number" && priceNow > 0;

  const includes: string[] = Array.isArray(product?.details?.includes)
    ? product.details.includes
    : [];

  // ✅ Slides para el lightbox
  const lightboxSlides = useMemo(
    () => gallery.map((src) => ({ src, alt: product.title })),
    [gallery, product.title]
  );

  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8">
      <div className="grid gap-10 lg:grid-cols-[560px_1fr_320px]">
        {/* ======= GALERÍA ======= */}
        <div className="lg:pr-2">
          <div className="grid gap-3 lg:grid-cols-[64px_1fr]">
            <div className="hidden lg:flex lg:flex-col lg:gap-3">
              {gallery.slice(0, 6).map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setActiveIdx(i)}
                  className={cn(
                    "relative h-14 w-14 overflow-hidden rounded-md border bg-[#f3f3f3] transition",
                    i === activeIdx
                      ? "border-black"
                      : "border-black/15 hover:border-black/35"
                  )}
                  aria-label={`Ver imagen ${i + 1}`}
                >
                  <Image
                    src={src}
                    alt={product.title}
                    fill
                    className="object-contain p-1"
                  />
                </button>
              ))}
            </div>

            <div className="relative overflow-hidden rounded-lg border border-black/10 bg-[#f3f3f3]">
              <div className="relative aspect-square w-full">
                {activeImg ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setLightboxOpen(true);
                    }}
                    className="absolute inset-0 cursor-zoom-in"
                    aria-label="Abrir zoom"
                  >
                    <Image
                      src={activeImg}
                      alt={product.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 560px"
                      className="object-contain p-4"
                      priority
                    />
                  </button>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-black/50">
                    Sin imagen
                  </div>
                )}
              </div>

              {gallery.length > 1 ? (
                <div className="flex gap-2 overflow-x-auto border-t border-black/10 bg-white p-3 lg:hidden">
                  {gallery.slice(0, 10).map((src, i) => (
                    <button
                      key={src + i}
                      onClick={() => setActiveIdx(i)}
                      className={cn(
                        "relative h-14 w-14 shrink-0 overflow-hidden rounded-md border bg-[#f3f3f3]",
                        i === activeIdx ? "border-black" : "border-black/15"
                      )}
                      aria-label={`Ver imagen ${i + 1}`}
                    >
                      <Image
                        src={src}
                        alt={product.title}
                        fill
                        className="object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              ) : null}

              {/* ✅ LIGHTBOX (fullscreen Smiggle style) */}
              <ProductLightbox
                open={lightboxOpen}
                onClose={() => setLightboxOpen(false)}
                images={lightboxSlides}
                index={activeIdx}
                onIndexChange={setActiveIdx}
              />
            </div>
          </div>
        </div>

        {/* ======= INFO ======= */}
        <div className="lg:pt-1">
          <h1
            className={cn(
              "font-semibold leading-[1.15] tracking-[-0.01em] text-black",
              "text-[18px] md:text-[20px] lg:text-[22px]",
              "line-clamp-2"
            )}
            title={product.title}
          >
            {product.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {priceBefore ? (
              <span className="text-[22px] font-semibold tracking-[-0.01em] text-black/45 line-through md:text-[24px]">
                {fmtPEN(priceBefore)}
              </span>
            ) : null}

            {priceNow ? (
              <span className="text-[22px] font-semibold tracking-[-0.01em] text-black md:text-[24px]">
                {fmtPEN(priceNow)}
              </span>
            ) : (
              <span className="text-[14px] text-black/60">Consultar</span>
            )}
          </div>

          {priceBefore && priceNow ? (
            <div className="mt-2 text-[12px] font-medium text-[#0A66FF]">
              Ahorra hoy. ¡Compra ahora!
            </div>
          ) : null}

          <div className="mt-6 border-t border-black/10" />

          {/* Color */}
          <div className="mt-5">
            <div className="flex items-center gap-2 text-[13px]">
              <span className="font-semibold">Color:</span>
              <span className="text-black/75">{colorLabel}</span>
              <span className="text-black/30">—</span>
              <span
                className={cn(
                  "text-[12px] font-medium",
                  inStock ? "text-[#0B7A2A]" : "text-[#B42318]"
                )}
              >
                {inStock ? "En stock" : "Agotado"}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4">
              {colors.map((v) => {
                const hex = v.color_hex ?? null;

                return (
                  <button
                    key={v.color_slug ?? v.id}
                    type="button"
                    onClick={() => setSelected(v)}
                    title={v.color_name ?? v.color ?? ""}
                    aria-label={`Elegir color ${v.color_name ?? v.color ?? ""}`}
                    className={cn(
                      "group relative h-12 w-12 rounded-full p-[4px] transition",
                      "border-2 border-transparent hover:border-black/25",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-black/25 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    )}
                  >
                    <span className="block h-full w-full rounded-full border border-black/25 bg-white p-[3px]">
                      <span
                        className="block h-full w-full rounded-full"
                        style={hex ? { backgroundColor: hex } : undefined}
                      />
                    </span>

                    {!hex ? (
                      <span className="absolute inset-0 grid place-items-center text-[12px] text-black/55">
                        —
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Qty + CTA */}
          <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center justify-between gap-3 sm:justify-start">
                <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-black/70">
                  Cantidad
                </div>

                <div className="flex h-12 items-center overflow-hidden rounded-xl border border-black/15 bg-white">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="h-12 w-12 text-[18px] text-black/70 transition hover:bg-black/5 active:bg-black/10"
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>

                  <input
                    value={qty}
                    onChange={(e) => {
                      const n = Math.max(1, Number(e.target.value || 1));
                      setQty(Number.isFinite(n) ? n : 1);
                    }}
                    className="h-12 w-14 border-x border-black/10 text-center text-[14px] font-semibold outline-none"
                    inputMode="numeric"
                  />

                  <button
                    type="button"
                    onClick={() => setQty((q) => q + 1)}
                    className="h-12 w-12 text-[18px] text-black/70 transition hover:bg-black/5 active:bg-black/10"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                type="button"
                disabled={!canAdd}
                onClick={() => {
                  if (!canAdd || !selected || priceNow == null) return;

                  add({
                    product_id: product.id ?? selected.id,
                    title: product.title,
                    slug: product.slug ?? "",
                    image: selected.images?.[0] ?? null,
                    price_now: priceNow,
                    color_slug: selected.color_slug ?? null,
                    color_name: selected.color_name ?? selected.color ?? null,
                    qty,
                  });

                  onAddToCart?.(selected, qty);
                }}
                className={cn(
                  "h-12 w-full sm:w-[220px] rounded-xl px-5",
                  "text-[13px] font-extrabold uppercase tracking-[0.12em] text-white",
                  "bg-[#3BB7D4] hover:brightness-[0.98] active:brightness-[0.96]",
                  "shadow-[0_10px_18px_rgba(59,183,212,0.35)]",
                  "disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
                  "flex items-center justify-center text-center leading-none"
                )}
              >
                Agregar al carrito
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-black/60">
              <span className="inline-flex items-center gap-2">
                <Image
                  src="/icons/peru.gif"
                  alt="Perú"
                  width={22}
                  height={22}
                  unoptimized
                />
                Envíos a todo el Perú
              </span>

              <span className="inline-flex items-center gap-2">
                <Image
                  src="/icons/security.gif"
                  alt="Pago seguro"
                  width={22}
                  height={22}
                  unoptimized
                />
                Pago seguro
              </span>

              <span className="inline-flex items-center gap-2">
                <Image
                  src="/icons/soporte.gif"
                  alt="Soporte"
                  width={22}
                  height={22}
                  unoptimized
                />
                Soporte a todo el Perú
              </span>
            </div>
          </div>

          <div className="mt-6 border-t border-black/10" />

          {/* INCLUDES */}
          {includes.length ? (
            <div className="mt-6">
              <div className="text-[13px] font-semibold uppercase tracking-[0.08em] text-black">
                ¿Qué incluye este pack?
              </div>

              <ul className="mt-3 space-y-2">
                {includes.map((it, idx) => (
                  <li key={idx} className="flex gap-2 text-[13px] text-black/80">
                    <span className="mt-[2px] inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/5">
                      <Image
                        src="/icons/check.png"
                        alt="check"
                        width={14}
                        height={14}
                        className="opacity-90"
                      />
                    </span>
                    <span className="leading-snug">{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* ✅ ACCORDIONS PRO */}
          <div className="mt-8">
            <ProductDetailsPanels details={product.details} />
          </div>
        </div>

        {/* ======= SIMILARES ======= */}
        <aside className="hidden lg:block">
          {similarSlot ? (
            similarSlot
          ) : (
            <div className="rounded-lg border border-black/10 p-4">
              <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0A66FF]">
                Productos similares
              </div>
              <div className="mt-3 text-[13px] text-black/60">
                Aún no hay productos similares para mostrar.
              </div>
            </div>
          )}
        </aside>
      </div>

      <div className="mt-10 lg:hidden">
        {similarSlot ? (
          similarSlot
        ) : (
          <div className="rounded-lg border border-black/10 p-4">
            <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0A66FF]">
              Productos similares
            </div>
            <div className="mt-3 text-[13px] text-black/60">
              Aún no hay productos similares para mostrar.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
