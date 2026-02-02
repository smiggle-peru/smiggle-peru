"use client";

import { useCart } from "@/lib/store/cart";

export function AddToCartButton({
  product_id,
  title,
  slug,
  image,
  price_now,
  color_slug,
  color_name,
}: {
  product_id: string;
  title: string;
  slug: string;
  image: string | null;
  price_now: number | null;
  color_slug?: string | null;
  color_name?: string | null;
}) {
  const add = useCart((s) => s.add);

  const disabled = price_now == null;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        if (price_now == null) return;
        add({
          product_id,
          title,
          slug,
          image,
          price_now,
          color_slug: color_slug ?? null,
          color_name: color_name ?? null,
          qty: 1,
        });
      }}
      className="w-full rounded-full border px-3 py-2 text-sm font-medium transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      Agregar al carrito
    </button>
  );
}
