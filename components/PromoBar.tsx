"use client";

export function PromoBar() {
  return (
    <div className="relative z-20 w-full bg-[linear-gradient(90deg,#E64545_0%,#D83F3F_50%,#E64545_100%)]">
      <div className="mx-auto flex items-center justify-center px-4 py-3 md:min-h-[96px] md:max-w-[1280px] md:px-4 md:py-0">
        <div
          className="
            text-center font-extrabold uppercase text-[#FFD400]
            [text-shadow:0_2px_0_rgba(0,0,0,0.18)]
            text-[14px] leading-[1.15] tracking-[0.10em]
            md:text-[36px] md:leading-none md:tracking-[0.14em]
          "
        >
          APROVECHA HASTA 50% DESCUENTO EN TODA LA TIENDA
        </div>
      </div>
    </div>
  );
}
