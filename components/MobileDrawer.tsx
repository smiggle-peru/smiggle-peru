"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { NAV_ITEMS, type NavItem } from "@/components/nav";
import {
  IconClose,
  IconSearch,
  IconChevronRight,
  IconArrowLeft,
} from "@/components/icons";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MobileDrawer({ open, onClose }: Props) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState<NavItem | null>(null);

  useEffect(() => {
    if (!open) {
      setActive(null);
      setQ("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (active) setActive(null);
        else onClose();
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, active]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;

    router.push(`/categoria/buscar?q=${encodeURIComponent(query)}`);
    onClose();
  }

  const activeColumns = useMemo(() => active?.columns ?? [], [active]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => {
          if (active) setActive(null);
          else onClose();
        }}
      />

      {/* Drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[84%] max-w-sm bg-white shadow-xl transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-4">
          <div className="flex items-center gap-2">
            {active && (
              <button
                type="button"
                onClick={() => setActive(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-black/[0.04]"
                aria-label="Atrás"
              >
                <IconArrowLeft className="text-black/70" />
              </button>
            )}

            <div className="text-sm font-extrabold uppercase tracking-wider">
              {active ? active.label : "Menú"}
            </div>
          </div>

          <button
            onClick={() => {
              if (active) setActive(null);
              else onClose();
            }}
            className="rounded-xl p-2 hover:bg-black/[0.04]"
            aria-label={active ? "Cerrar submenú" : "Cerrar menú"}
          >
            <IconClose />
          </button>
        </div>

        {/* Search */}
        <form onSubmit={onSubmit} className="border-b px-4 py-4">
          <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3">
            <IconSearch className="h-5 w-5 text-black/60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar productos…"
              className="w-full bg-transparent text-[14px] text-black outline-none placeholder:text-black/45"
            />
          </div>
        </form>

        {/* Body */}
        <div className="h-[calc(100%-124px)] overflow-y-auto">
          {/* LEVEL 1 */}
          {!active && (
            <nav className="p-4">
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/55">
                Explorar
              </div>

              <ul className="space-y-1">
                {NAV_ITEMS.map((item) => {
                  const hasChildren = !!item.columns?.length;

                  return (
                    <li key={item.href}>
                      <button
                        type="button"
                        onClick={() => {
                          if (hasChildren) setActive(item);
                          else {
                            router.push(item.href);
                            onClose();
                          }
                        }}
                        className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-[13px] font-extrabold uppercase tracking-wider hover:bg-gray-50"
                      >
                        <span>{item.label}</span>

                        {hasChildren && (
                          <IconChevronRight className="text-black/35" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-xs text-gray-700">
                <div className="font-bold">Smiggle Perú</div>
                <div className="mt-1">WhatsApp: 903 504 004</div>
              </div>
            </nav>
          )}

          {/* LEVEL 2 */}
          {active && (
            <nav className="p-4">
              <div className="flex items-center justify-between">
                <Link
                  href={active.href}
                  onClick={onClose}
                  className="rounded-xl px-3 py-2 text-[12px] font-semibold text-black underline underline-offset-4"
                >
                  Ver todo
                </Link>
              </div>

              <div className="mt-4 space-y-5">
                {activeColumns.map((col, idx) => (
                  <div key={idx}>
                    {col.title && (
                      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/55">
                        {col.title}
                      </div>
                    )}

                    <ul className="space-y-1">
                      {col.items.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={onClose}
                            className="block rounded-2xl px-3 py-3 text-[13px] font-semibold text-black/80 hover:bg-gray-50"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-gray-50 p-4 text-xs text-gray-700">
                <div className="font-bold">¿Necesitas ayuda?</div>
                <div className="mt-1">WhatsApp: 903 504 004</div>
              </div>
            </nav>
          )}
        </div>
      </aside>
    </>
  );
}
