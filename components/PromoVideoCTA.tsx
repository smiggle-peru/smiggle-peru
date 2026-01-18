"use client";

import Link from "next/link";

type Props = {
  href?: string;
};

export function PromoVideoCTA({ href = "/categoria/mochilas" }: Props) {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1280px] px-4 pb-14 text-center">
        <h2 className="text-[17px] font-normal tracking-wide md:text-[22px]">
          ¡Llevemos este año al siguiente nivel!
        </h2>

        <Link
          href={href}
          className="mt-2 inline-block text-[13px] font-semibold uppercase tracking-[0.18em] underline underline-offset-8 decoration-black/60 hover:decoration-black"
        >
          Comprar ahora
        </Link>
      </div>
    </section>
  );
}
