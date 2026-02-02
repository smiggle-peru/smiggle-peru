"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  key: string; // productId + colorSlug + size (si aplica)
  product_id: string;
  title: string;
  slug: string;
  image: string | null;
  price_now: number;
  qty: number;

  // variantes (para que no mezcles)
  color_slug?: string | null;
  color_name?: string | null;
  size_label?: string | null;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty" | "key"> & { qty?: number }) => void;
  inc: (key: string) => void;
  dec: (key: string) => void;
  remove: (key: string) => void;
  clear: () => void;
  count: () => number; // suma qty
};

function makeKey(p: {
  product_id: string;
  color_slug?: string | null;
  size_label?: string | null;
}) {
  return [
    p.product_id,
    p.color_slug ?? "default",
    p.size_label ?? "one",
  ].join("::");
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const qty = item.qty ?? 1;
        const key = makeKey(item);

        set((state) => {
          const existing = state.items.find((x) => x.key === key);
          if (existing) {
            return {
              items: state.items.map((x) =>
                x.key === key ? { ...x, qty: x.qty + qty } : x
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                key,
                qty,
                ...item,
              } as CartItem,
            ],
          };
        });
      },
      inc: (key) =>
        set((state) => ({
          items: state.items.map((x) =>
            x.key === key ? { ...x, qty: x.qty + 1 } : x
          ),
        })),
      dec: (key) =>
        set((state) => ({
          items: state.items
            .map((x) => (x.key === key ? { ...x, qty: x.qty - 1 } : x))
            .filter((x) => x.qty > 0),
        })),
      remove: (key) =>
        set((state) => ({ items: state.items.filter((x) => x.key !== key) })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((acc, x) => acc + (x.qty ?? 0), 0),
    }),
    { name: "smiggle-cart-v1" }
  )
);
