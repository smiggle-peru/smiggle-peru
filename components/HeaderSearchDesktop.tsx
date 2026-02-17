"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";

type Props = {
  placeholder?: string;
  products?: any[]; // 👈 NUEVO
};

export function HeaderSearchDesktop({
  placeholder = "Buscar productos",
  products = [],
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const fuse = useMemo(() => {
    if (!products?.length) return null;
    return new Fuse(products, {
      keys: ["name", "subtitle", "category", "detail_text", "seo.keywords"],
      threshold: 0.35,
      minMatchCharLength: 2,
      ignoreLocation: true,
    });
  }, [products]);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  function submit() {
    const query = q.trim();
    if (!query) return router.push(`/categoria/buscar`);

    // ✅ Si hay fuse y hay match, manda al producto top
    if (fuse) {
      const res = fuse.search(query);
      const best = res?.[0]?.item;
      if (best?.slug) {
        router.push(`/producto/${best.slug}`);
        setOpen(false);
        setQ("");
        return;
      }
    }

    // fallback normal
    router.push(`/categoria/buscar?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="relative">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-[15px] font-medium text-black transition-opacity hover:opacity-70"
          aria-label="Abrir búsqueda"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="currentColor" strokeWidth="2" />
            <path d="M16.5 16.5 21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span>Buscar</span>
        </button>
      ) : (
        <div className="flex items-center gap-3 transition-all duration-300 ease-out animate-[searchOpen_0.3s_ease-out]">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") {
                setOpen(false);
                setQ("");
              }
            }}
            onBlur={() => {
              if (!q.trim()) setOpen(false);
            }}
            placeholder={placeholder}
            className="w-[320px] bg-transparent text-[16px] font-medium text-black placeholder:text-black/60 outline-none"
          />

          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={submit}
            aria-label="Buscar"
            className="shrink-0 transition-transform hover:scale-110"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" stroke="#E64545" strokeWidth="2" />
              <path d="M16.5 16.5 21 21" stroke="#E64545" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      <div className={`mt-1 h-[2px] bg-black/40 transition-all duration-300 ease-out ${open ? "w-[360px] opacity-100" : "w-0 opacity-0"}`} />
    </div>
  );
}
