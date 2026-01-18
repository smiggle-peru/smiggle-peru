"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  gifSrc?: string;
};

export default function EmptyCart({
  gifSrc = "/icons/empty-bag.gif", // ajusta si tu ruta es distinta
}: Props) {
  return (
    <section className="w-full">
      <div className="mx-auto flex max-w-[720px] flex-col items-center px-4 py-20 md:py-28">
        {/* Title */}
        <h1 className="text-center text-[22px] font-semibold tracking-[-0.01em] text-black md:text-[28px]">
          Bolsa de compras
        </h1>

        {/* Subtitle */}
        <p className="mt-3 max-w-[420px] text-center text-[14px] leading-6 text-black/70 md:text-[15px]">
          Parece que tu bolsa está vacía.
          <br />
          ¿Quieres llenarla con cosas increíbles?
        </p>

        {/* GIF (PROTAGONISTA, SIN CÍRCULO) */}
        <div className="mt-14 flex items-center justify-center">
          <Image
            src={gifSrc}
            alt="Bolsa de compras vacía"
            width={260}
            height={260}
            unoptimized
            priority
            className="h-auto w-[220px] md:w-[260px]"
          />
        </div>

        {/* CTAs */}
        <div className="mt-16 flex items-center gap-14">
          <Link
            href="/categoria/novedades"
            className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black underline underline-offset-8 transition-opacity hover:opacity-70"
          >
            VER NOVEDADES
          </Link>

          <Link
            href="/categoria/regreso-a-clases"
            className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black underline underline-offset-8 transition-opacity hover:opacity-70"
          >
            VER OFERTAS
          </Link>
        </div>
      </div>
    </section>
  );
}
