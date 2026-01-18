import { HomeHero } from "@/components/HomeHero";
import { ShopByCategory } from "@/components/ShopByCategory";
import { PromoMochilasCarousel } from "@/components/PromoMochilasCarousel";
import { PromoVideoSection } from "@/components/PromoVideoSection";
import { PromoVideoCTA } from "@/components/PromoVideoCTA";
import { LicenseCarousel } from "@/components/LicenseCarousel";

export default function HomePage() {
  return (
    <div className="w-full">
      {/* HERO */}
      <HomeHero
        desktopSrc="/banners/hero-desktop-es.jpg"
        mobileSrc="/banners/hero-mobile-es.jpg"
        alt="Regreso a clases Smiggle Perú"
        linkHref="/regreso-a-clases"
      />

      {/* COMPRA POR CATEGORÍA */}
      <ShopByCategory className="mt-8 md:mt-20" />

      {/* PROMO 30% OFF MOCHILAS */}
      <PromoMochilasCarousel
        intervalMs={4000}
        href="/categoria/mochilas"
        images={[
          { src: "/promos/mochila-banner-1.jpeg", alt: "Mochilas escolares Smiggle" },
          { src: "/promos/mochila-banner-2.jpeg", alt: "Packs de mochilas Smiggle" },
          { src: "/promos/mochila-banner-3.jpeg", alt: "Mochilas infantiles Smiggle" },
          { src: "/promos/mochila-banner-4.jpeg", alt: "Mochilas originales Smiggle" },
        ]}
      />

      {/* VIDEO PROMO */}
      <PromoVideoSection src="/videos/smiggle-promo.mp4" />

      {/* CTA VIDEO */}
      <PromoVideoCTA href="/categoria/mochilas" />

      {/* LICENCIAS Y COLABORACIONES */}
      <LicenseCarousel
        ctaHref="/categoria/licencias"
        title="LICENCIAS Y COLABORACIONES"
        ctaLabel="COMPRAR AHORA"
        items={[
          { src: "/licenses/hello-kitty.png", alt: "Hello Kitty", href: "/categoria/licencias/hello-kitty" },
          { src: "/licenses/marvel.png", alt: "Marvel", href: "/categoria/licencias/marvel" },
          { src: "/licenses/care-bears.png", alt: "Care Bears", href: "/categoria/licencias/care-bears" },
          { src: "/licenses/disney.png", alt: "Disney", href: "/categoria/licencias/disney" },
          { src: "/licenses/paw-patrol.png", alt: "Paw Patrol", href: "/categoria/licencias/paw-patrol" },
        ]}
      />
    </div>
  );
}
