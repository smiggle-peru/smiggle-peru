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

  // ✅ si quieres que el hero completo sea clickeable
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
    <section className="relative w-full">
      {/* DESKTOP (igual que lo tenías) */}
      <div className="relative hidden md:block bg-white left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-[100vw] overflow-x-clip">
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

      {/* MOBILE (FIXED) */}
      <div className="md:hidden">
        {/* full-bleed sin márgenes negativos */}
        <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-[100vw] bg-[#7fdad6]">
          {/* contenedor con ratio fijo para que no se “rompa” */}
          <div className="mx-auto w-full max-w-[520px] px-0">
            <div className="relative w-full overflow-hidden aspect-[4/5]">
              <Image
                src={mobileSrc}
                alt={alt}
                fill
                priority
                sizes="100vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CTA opcional (desktop) */}
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
