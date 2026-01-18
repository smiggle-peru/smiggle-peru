"use client";

type Props = {
  src: string;
  poster?: string;
};

export function PromoVideoSection({ src, poster }: Props) {
  return (
    <section className="w-full bg-white">
      {/* Desktop: max-w normal */}
      <div className="md:mx-auto md:max-w-[1280px] md:px-4">
        {/* ✅ MOBILE: full-bleed real (siempre llena ambos lados) */}
        <div className="relative left-1/2 w-screen -translate-x-1/2 md:left-auto md:w-auto md:translate-x-0">
          <div className="md:overflow-hidden md:rounded-[28px] md:ring-1 md:ring-black/5">
            <video
              src={src}
              poster={poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-[360px] w-full object-cover md:h-[520px]"
            />
          </div>
        </div>

        {/* ✅ gap mini para pegar el texto sin invadir */}
        <div className="h-2 md:h-3" />
      </div>
    </section>
  );
}
