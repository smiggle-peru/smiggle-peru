"use client";

import Link from "next/link";

type Category = {
  label: string;
  href: string;
};

const CATEGORIES: Category[] = [
  { label: "MOCHILAS", href: "/categoria/mochilas" },
  { label: "PACKS", href: "/categoria/packs" },
  { label: "LONCHERAS", href: "/categoria/loncheras" },
  { label: "PRE ESCOLAR", href: "/categoria/pre-escolar" },
];

type Props = {
  className?: string;
};

export function ShopByCategory({ className = "" }: Props) {
  return (
    <section className={`w-full bg-white ${className}`}>
      <div className="mx-auto max-w-[1280px] px-4 py-10 md:py-12">
        {/* Title */}
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-center text-[18px] font-extrabold uppercase tracking-[0.20em] text-[#E64545] md:text-[22px]">
            COMPRA POR CATEGORÍA
          </h2>

          {/* Línea sutil */}
          <div className="h-[3px] w-[72px] rounded-full bg-[#E64545]/20" />
        </div>

        {/* Buttons */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:mt-10 md:grid-cols-4 md:gap-6">
          {CATEGORIES.map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="
                group relative isolate
                flex h-[56px] items-center justify-center
                rounded-full px-6 text-center
                text-[12px] font-extrabold uppercase tracking-[0.12em] text-white
                md:h-[64px] md:text-[15px] md:tracking-[0.14em]
                bg-[#E64545]
                shadow-[0_10px_24px_rgba(230,69,69,0.18)]
                ring-1 ring-black/5
                transition
                hover:-translate-y-[1px]
                hover:shadow-[0_14px_30px_rgba(230,69,69,0.22)]
                active:translate-y-0
                active:shadow-[0_10px_22px_rgba(230,69,69,0.18)]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#E64545]/50
                focus-visible:ring-offset-2
              "
            >
              {/* brillo suave hover */}
              <span
                className="
                  pointer-events-none absolute inset-0 -z-10 rounded-full opacity-0
                  bg-[radial-gradient(120px_40px_at_50%_0%,rgba(255,255,255,0.45),transparent)]
                  transition-opacity duration-300 group-hover:opacity-100
                "
              />
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
