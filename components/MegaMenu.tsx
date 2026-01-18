"use client";

import Link from "next/link";
import type { NavItem } from "@/components/nav";

type Props = {
  item: NavItem | null;
  open: boolean;
  onClose: () => void;
};

export function MegaMenu({ item, open, onClose }: Props) {
  if (!open || !item?.columns?.length) return null;

  return (
    <div className="absolute left-0 top-full z-[9999] w-full border-t border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.10)]">
      <div className="mx-auto max-w-[1280px] px-4 py-12">
        <div className="grid gap-12 md:grid-cols-3">
          {item.columns.map((col, idx) => (
            <div key={idx}>
              {/* TÍTULO DE COLUMNA */}
              {col.title && (
                <div className="mb-5 text-[15px] font-semibold uppercase tracking-[0.08em] text-black">
                  {col.title}
                </div>
              )}

              {/* SUBCATEGORÍAS */}
              <ul className="space-y-4">
                {col.items.map((child) => (
                  <li key={child.href}>
                    <Link
                      href={child.href}
                      onClick={onClose}
                      className="
                        inline-block
                        text-[15px]
                        font-medium
                        text-black
                        transition-colors
                        hover:text-[#00B7B7]
                        hover:underline
                        underline-offset-4
                      "
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
