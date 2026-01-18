"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type License = {
  src: string;
  alt: string;
  href?: string; // ✅ ahora es opcional (para que no rompa)
};

type Props = {
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
  items: License[];
  speedPxPerSec?: number;
};

export function LicenseCarousel({
  title = "LICENCIAS Y COLABORACIONES",
  ctaLabel = "COMPRAR AHORA",
  ctaHref = "/categoria/licencias",
  items,
  speedPxPerSec = 70,
}: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [duration, setDuration] = useState(30);

  // ✅ filtramos items inválidos (sin src/alt)
  const safeItems = useMemo(
    () => (items ?? []).filter((x) => x?.src && x?.alt),
    [items]
  );

  // duplicamos para loop perfecto
  const loopItems = useMemo(() => [...safeItems, ...safeItems], [safeItems]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const totalWidth = el.scrollWidth / 2;
    const seconds = Math.max(12, totalWidth / speedPxPerSec);
    setDuration(seconds);
  }, [safeItems, speedPxPerSec]);

  if (!safeItems.length) return null;

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1280px] px-4 pb-6 pt-6">
        <h2 className="text-center text-[20px] font-extrabold uppercase tracking-[0.18em] md:text-[28px]">
          {title}
        </h2>
      </div>

      <div className="relative left-1/2 w-screen -translate-x-1/2 bg-[#F1F1F1] py-10 md:py-12">
        <div className="relative w-full overflow-hidden">
          <div
            ref={trackRef}
            className="flex w-max items-center gap-16 px-8 md:gap-24 md:px-16"
            style={{
              animationName: "license-marquee",
              animationDuration: `${duration}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
            }}
          >
            {loopItems.map((l, i) => {
              const href = l.href?.trim(); // ✅ evita undefined/""/espacios

              const Card = (
                <div
                  className="
                    relative flex items-center justify-center
                    h-[92px] w-[200px]
                    md:h-[120px] md:w-[260px]
                    rounded-2xl
                    transition-all duration-200 ease-out
                    group-hover:scale-[1.04] group-hover:bg-white/60 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]
                    group-active:scale-[0.98]
                  "
                >
                  <div
                    className="
                      pointer-events-none absolute inset-0 rounded-2xl
                      opacity-0 blur-xl transition-opacity duration-200
                      group-hover:opacity-40
                      bg-white
                    "
                  />
                  <div className="relative h-[70px] w-[170px] md:h-[90px] md:w-[220px]">
                    <Image
                      src={l.src}
                      alt={l.alt}
                      fill
                      sizes="(min-width: 768px) 260px, 200px"
                      className="object-contain"
                      priority={i < safeItems.length}
                    />
                  </div>
                </div>
              );

              // ✅ Si hay href: Link normal
              if (href) {
                return (
                  <Link
                    key={`${l.src}-${i}`}
                    href={href}
                    aria-label={l.alt}
                    className="
                      group relative shrink-0 rounded-xl
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30
                    "
                  >
                    {Card}
                  </Link>
                );
              }

              // ✅ Si NO hay href: no rompe (solo muestra el logo)
              return (
                <div
                  key={`${l.src}-${i}`}
                  className="group relative shrink-0 rounded-xl opacity-80"
                  aria-label={l.alt}
                  title="Sin link configurado"
                >
                  {Card}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 text-center md:mt-12">
          <Link
            href={ctaHref}
            className="inline-block text-[13px] font-semibold uppercase tracking-[0.18em] underline underline-offset-8 decoration-black/70 hover:decoration-black"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>

      <div className="h-12" />
    </section>
  );
}
