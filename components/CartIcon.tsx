"use client";

import Link from "next/link";
import { useCart } from "@/lib/store/cart";

export function CartIcon() {
  const count = useCart((s) => s.count());

  return (
    <Link href="/carrito" className="relative inline-flex items-center">
      {/* tu icono / svg / imagen */}
      <span className="text-[18px]">👜</span>

      {count > 0 && (
        <span className="absolute -right-2 -top-2 min-w-[18px] rounded-full bg-red-500 px-1 text-center text-[11px] font-semibold leading-[18px] text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
