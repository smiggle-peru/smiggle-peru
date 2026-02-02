"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import EmptyCart from "@/components/EmptyCart";
import { useCart } from "@/lib/store/cart";

type CartItem = {
  key: string; // ✅ viene del store
  product_id: string;
  title: string;
  slug: string;
  image: string | null;
  price_now: number;
  qty: number;

  color_slug?: string | null;
  color_name?: string | null;
  size_label?: string | null;
  color_hex?: string | null; // si no lo usas, quítalo
};

function formatPEN(n: number) {
  return `S/ ${Number(n || 0).toFixed(2)}`;
}

function getColorLabel(it: CartItem) {
  const v = it.color_name ?? it.color_slug ?? null;
  if (!v) return null;
  return v.replaceAll("-", " ");
}

export function CartClient() {
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const safeItems = mounted ? items : [];

  const { totalUnits, subtotal } = useMemo(() => {
    let units = 0;
    let sub = 0;

    for (const it of safeItems) {
      const q = Number(it.qty ?? 1);
      const p = Number(it.price_now ?? 0);
      units += q;
      sub += q * p;
    }

    return { totalUnits: units, subtotal: sub };
  }, [safeItems]);

  if (!mounted) return null;
  if (!safeItems.length) return <EmptyCart />;

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 pb-16 pt-10">
      {/* Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
            Carrito de compras
          </h1>
          <p className="mt-1 text-[13px] text-black/55">
            Revisa tus productos antes de continuar al pago.
          </p>
        </div>

        <div className="text-[13px] text-black/60">
          <span>
            {totalUnits} {totalUnits === 1 ? "producto" : "productos"}
          </span>
          <span className="mx-2 text-black/25">•</span>
          <span className="text-black font-medium">{formatPEN(subtotal)}</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[1fr_420px]">
        {/* Left */}
        <section className="rounded-2xl border border-black/10 bg-white">
          <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
            <div className="text-[13px] font-medium text-black">
              Productos en tu carrito
            </div>

            <button
              type="button"
              onClick={() => clear()}
              className="text-[12px] font-medium text-red-600 hover:underline underline-offset-4"
            >
              Vaciar carrito
            </button>
          </div>

          <div className="divide-y divide-black/10">
            {safeItems.map((it) => {
              const qty = Number(it.qty ?? 1);
              const unit = Number(it.price_now ?? 0);
              const colorLabel = getColorLabel(it);

              return (
                <div key={it.key} className="px-6 py-5">
                  <div className="flex items-start gap-4">
                    {/* image */}
                    <div className="h-[84px] w-[84px] shrink-0 overflow-hidden rounded-2xl border border-black/10 bg-black/[0.02]">
                      {it.image ? (
                        <Image
                          src={it.image}
                          alt={it.title}
                          width={168}
                          height={168}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[11px] text-black/40">
                          Sin imagen
                        </div>
                      )}
                    </div>

                    {/* info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="line-clamp-2 text-[13px] font-medium leading-snug text-black">
                            <Link
                              href={`/producto/${it.slug}${
                                it.color_slug ? `?color=${it.color_slug}` : ""
                              }`}
                              className="hover:underline underline-offset-4"
                            >
                              {it.title}
                            </Link>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] text-black/55">
                            <span>Cantidad: {qty}</span>

                            {colorLabel && (
                              <>
                                <span className="text-black/20">•</span>
                                <span className="inline-flex items-center gap-2">
                                  <span>Color:</span>
                                  <span className="text-black/80">
                                    {colorLabel}
                                  </span>
                                </span>
                              </>
                            )}

                            {it.size_label && (
                              <>
                                <span className="text-black/20">•</span>
                                <span className="inline-flex items-center gap-2">
                                  <span>Talla:</span>
                                  <span className="text-black/80">
                                    {it.size_label}
                                  </span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* ✅ ELIMINAR INDIVIDUAL (por key) */}
                        <button
                          type="button"
                          onClick={() => remove(it.key)}
                          className="shrink-0 text-[12px] text-black/45 hover:text-black hover:underline underline-offset-4"
                        >
                          Eliminar
                        </button>
                      </div>

                      <div className="mt-3 text-[14px] font-semibold text-red-600">
                        {formatPEN(unit)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Right */}
        <aside className="rounded-2xl border border-black/10 bg-white p-6 md:sticky md:top-6">
          <div className="text-[13px] font-medium text-black">
            Resumen de compra
          </div>

          <div className="mt-4 space-y-3 text-[13px]">
            <div className="flex items-center justify-between">
              <span className="text-black/55">Subtotal</span>
              <span className="font-medium text-black">
                {formatPEN(subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-black/55">Costo de envío</span>
              <span className="text-right text-[12px] text-black/50">
                Se calculará en el último paso
              </span>
            </div>

            <Link
              href="/checkout"
              className="
                mt-4 inline-flex w-full items-center justify-center
                rounded-full bg-[#46BEDC]
                px-7 py-3.5
                text-[13px] font-bold tracking-wide text-white
                shadow-[0_10px_25px_rgba(70,190,220,0.45)]
                transition-all duration-200
                hover:-translate-y-[1px]
                hover:bg-[#3DB3CF]
                hover:shadow-[0_14px_30px_rgba(70,190,220,0.55)]
                active:translate-y-0
                active:shadow-[0_8px_18px_rgba(70,190,220,0.35)]
              "
            >
              Continuar con la compra
            </Link>

            <Link
              href="/"
              className="mt-3 inline-flex w-full items-center justify-center rounded-full border border-black/15 bg-white px-6 py-3 text-[12px] font-semibold text-black hover:bg-black/[0.03]"
            >
              ← Seguir comprando
            </Link>

            <div className="mt-2 text-center text-[11px] text-black/40">
              Dirección y métodos de envío se eligen en checkout.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
