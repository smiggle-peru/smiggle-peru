"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;

  // CTA opcional (solo desktop)
  ctaHref?: string;
  ctaLabel?: string;

  // ✅ NUEVO: si quieres que el hero completo sea clickeable
  linkHref?: string;
  linkAriaLabel?: string;
};

export function HomeHero({
  desktopSrc,
  mobileSrc,
  alt,
  ctaHref,
  ctaLabel,
  linkHref,
  linkAriaLabel,
}: Props) {
  const content = (
    <section className="relative w-full -mt-[1px]">
      {/* DESKTOP */}
      <div className="relative hidden md:block bg-white left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-[100vw] overflow-x-clip -mt-[2px]">
        <div className="flex justify-center">
          <Image
            src={desktopSrc}
            alt={alt}
            width={1920}
            height={760}
            priority
            sizes="100vw"
            className="block h-auto w-[100vw] max-w-[1920px] object-contain"
          />
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden -mx-4 -mt-6">
        <div className="relative w-screen bg-[#7fdad6]">
          <div className="relative mx-auto w-full max-w-[420px]">
            <Image
              src={mobileSrc}
              alt={alt}
              width={420}
              height={560}
              priority
              sizes="100vw"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* CTA opcional */}
      {ctaHref && ctaLabel && (
        <div className="pointer-events-none absolute inset-0 hidden md:flex items-end">
          <div className="mx-auto w-full px-12 pb-10">
            <Link
              href={ctaHref}
              className="pointer-events-auto inline-flex rounded-full border border-black/20 bg-white px-8 py-3 text-[12px] font-medium"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      )}
    </section>
  );

  // ✅ Si hay linkHref, hacemos TODO el hero clickeable
  if (linkHref) {
    return (
      <Link
        href={linkHref}
        aria-label={linkAriaLabel ?? alt}
        className="block cursor-pointer"
      >
        {content}
      </Link>
    );
  }

  return content;
}
