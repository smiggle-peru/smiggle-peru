"use client";

import Image from "next/image";
import Link from "next/link";

type Props = {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  linkHref?: string; // 👈 NUEVO
  ctaHref?: string;
  ctaLabel?: string;
};

export function HomeHero({
  desktopSrc,
  mobileSrc,
  alt,
  linkHref,
  ctaHref,
  ctaLabel,
}: Props) {
  const Wrapper = linkHref ? Link : "div";

  return (
    <section className="relative w-full -mt-[1px]">
      <Wrapper
        {...(linkHref ? { href: linkHref } : {})}
        className="block cursor-pointer"
      >
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
      </Wrapper>

      {/* CTA opcional (no rompe el link principal) */}
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
}
