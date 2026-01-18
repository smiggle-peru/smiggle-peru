"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  placeholder?: string;
};

export function HeaderSearchDesktop({ placeholder = "Buscar productos" }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto focus cuando se abre
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  function submit() {
    const query = q.trim();
    router.push(
      query
        ? `/categoria/buscar?q=${encodeURIComponent(query)}`
        : `/categoria/buscar`
    );
  }

  return (
    <div className="relative">
      {/* BOTÓN CERRADO */}
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-[15px] font-medium text-black transition-opacity hover:opacity-70"
          aria-label="Abrir búsqueda"
        >
          {/* Lupa */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M16.5 16.5 21 21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>

          <span>Buscar</span>
        </button>
      ) : (
        /* BUSCADOR ABIERTO (con animación) */
        <div
          className="
            flex items-center gap-3
            transition-all duration-300 ease-out
            animate-[searchOpen_0.3s_ease-out]
          "
        >
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
            className="
              w-[320px]
              bg-transparent
              text-[16px]
              font-medium
              text-black
              placeholder:text-black/60
              outline-none
            "
          />

          {/* Lupa roja */}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={submit}
            aria-label="Buscar"
            className="shrink-0 transition-transform hover:scale-110"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                stroke="#E64545"
                strokeWidth="2"
              />
              <path
                d="M16.5 16.5 21 21"
                stroke="#E64545"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Línea inferior animada */}
      <div
        className={`
          mt-1 h-[2px] bg-black/40
          transition-all duration-300 ease-out
          ${open ? "w-[360px] opacity-100" : "w-0 opacity-0"}
        `}
      />
    </div>
  );
}
