"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  images: { src: string; alt?: string }[];
  href?: string;
  intervalMs?: number;
};

export function PromoMochilasCarousel({
  images,
  href = "/categoria/mochilas",
  intervalMs = 4000,
}: Props) {
  const slides = useMemo(() => images?.filter(Boolean) ?? [], [images]);
  const [idx, setIdx] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (slides.length <= 1) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setInterval(() => {
      setIdx((p) => (p + 1) % slides.length);
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [slides.length, intervalMs]);

  if (!slides.length) return null;

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1280px] px-4 pb-14">
        <div className="flex overflow-hidden rounded-[28px] ring-1 ring-black/5 md:grid md:grid-cols-2">
          {/* LEFT — solo mobile con micro-ajuste para phones angostos */}
          <div className="w-[52%] max-[380px]:w-[54%] flex items-center justify-center bg-[#B8A4E6] px-5 py-8 md:w-auto md:px-10 md:py-12">
            <div className="text-center text-white">
              <div className="text-[12px] font-extrabold uppercase tracking-[0.22em] opacity-95 md:text-[16px]">
                SOLO ONLINE
              </div>

              {/* MOBILE: NO wrap + “–” anclado al % */}
              <div className="mt-4 md:hidden">
                <div className="inline-flex items-center justify-center whitespace-nowrap">
                  <span className="relative inline-block text-[64px] font-extrabold leading-[0.85] sm:text-[72px]">
                    30%
                    <span className="absolute left-full top-1/2 -translate-y-1/2 ml-1 max-[380px]:ml-0.5 text-[32px] font-extrabold leading-none opacity-95 sm:text-[34px]">
                      –
                    </span>
                  </span>
                </div>
              </div>

              {/* DESKTOP INTACTO */}
              <div className="mt-4 hidden items-end justify-center gap-2 md:mt-6 md:inline-flex md:gap-6">
                <div className="text-[64px] sm:text-[72px] font-extrabold leading-[0.85] md:text-[170px]">
                  30%
                </div>

                <div className="pb-1 text-left md:pb-6">
                  <div className="whitespace-nowrap text-[18px] sm:text-[20px] font-extrabold leading-[0.95] md:text-[56px]">
                    DSCTO
                  </div>
                </div>
              </div>

              <div className="mt-2 text-[14px] font-extrabold uppercase tracking-[0.14em] md:mt-4 md:text-[44px] md:tracking-[0.06em]">
                MOCHILAS
              </div>

              <Link
                href={href}
                className="mt-4 inline-block text-[11px] font-extrabold uppercase tracking-[0.18em] underline underline-offset-8 decoration-white/80 hover:decoration-white md:mt-8 md:text-[14px]"
              >
                COMPRAR AHORA
              </Link>
            </div>
          </div>

          {/* RIGHT — solo mobile con micro-ajuste para phones angostos */}
          <div className="relative w-[48%] max-[380px]:w-[46%] bg-[#EEF0EF] md:w-auto">
            <div className="relative h-[210px] overflow-hidden md:h-[360px] lg:h-[420px]">
              <div
                className="absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{ transform: `translateX(-${idx * 100}%)` }}
              >
                {slides.map((img, i) => (
                  <div key={`${img.src}-${i}`} className="relative h-full w-full flex-none">
                    <Image
                      src={img.src}
                      alt={img.alt ?? "Promo mochilas Smiggle"}
                      fill
                      sizes="(min-width: 768px) 50vw, 48vw"
                      className="object-contain md:object-cover object-right"
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
