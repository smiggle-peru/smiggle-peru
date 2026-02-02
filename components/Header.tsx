"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, type NavItem } from "@/components/nav";
import { IconMenu } from "@/components/icons";
import { MobileDrawer } from "@/components/MobileDrawer";
import { HeaderSearchDesktop } from "@/components/HeaderSearchDesktop";
import { MegaMenu } from "@/components/MegaMenu";
import { PromoBar } from "@/components/PromoBar";
import { useCart } from "@/lib/store/cart";

export function Header() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // MegaMenu (desktop hover)
  const [hoverItem, setHoverItem] = useState<NavItem | null>(null);
  const [megaOpen, setMegaOpen] = useState(false);

  // ✅ mounted (fix hydration por Zustand persist)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // ✅ PromoBar smart (oculta bajando, aparece subiendo) - FIX DEFINITIVO
  const [showPromo, setShowPromo] = useState(true);

  // ✅ FIX PRO (anti-jitter + solo reaparece si subes de verdad)
  useEffect(() => {
    let lastY = window.scrollY;
    let lastDirection: "up" | "down" | null = null;
    let accUp = 0;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;

      // ignora micro movimientos (trackpad jitter)
      if (Math.abs(delta) < 4) return;

      if (delta > 0) {
        // bajando
        lastDirection = "down";
        accUp = 0;

        if (y > 40) setShowPromo(false);
      } else {
        // subiendo
        if (lastDirection !== "up") {
          lastDirection = "up";
          accUp = 0;
        }

        accUp += Math.abs(delta);

        // solo muestra si subió "de verdad"
        if (y <= 10 || accUp > 30) {
          setShowPromo(true);
        }
      }

      lastY = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ carrito real
  const cartCount = useCart((s) => s.count());
  const hasCart = mounted && cartCount > 0;

  const activeHref = useMemo(() => {
    const found = NAV_ITEMS.find((x) =>
      pathname?.startsWith(x.href.replace(/\/$/, ""))
    );
    return found?.href ?? "";
  }, [pathname]);

  return (
    <header className="sticky top-0 z-[999] border-b border-black/10 bg-white/95 backdrop-blur-md">
      {/* TOP ROW */}
      <div className="mx-auto flex max-w-[1280px] items-center px-4 pt-1 pb-0">
        {/* Left */}
        <div className="flex flex-1 items-center justify-start">
          <div className="flex items-center gap-0.5 md:hidden">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-1.5"
              aria-label="Abrir menú"
            >
              <IconMenu />
            </button>
          </div>

          <div className="hidden md:block">
            <HeaderSearchDesktop placeholder="Buscar productos" />
          </div>
        </div>

        {/* Center Logo */}
        <div className="flex flex-1 items-center justify-center">
          <Link href="/" aria-label="Ir al inicio" className="block">
            <Image
              src="/brand/smiggle-logo.jpg"
              alt="Smiggle"
              width={180}
              height={48}
              priority
              className="h-auto w-[160px]"
            />
          </Link>
        </div>

        {/* Right Cart */}
        <div className="flex flex-1 items-center justify-end">
          <Link href="/carrito" className="relative p-1.5" aria-label="Carrito">
            <Image
              src="/icons/bag.png"
              alt="Carrito"
              width={26}
              height={26}
              className={`h-[26px] w-[26px] transition-transform hover:scale-110 ${
                hasCart ? "cart-bag-red" : ""
              }`}
              priority
            />

            {hasCart && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E64545] px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* NAV + MegaMenu (desktop) */}
      <div
        className="hidden md:block"
        onMouseLeave={() => {
          setMegaOpen(false);
          setHoverItem(null);
        }}
      >
        <div className="relative isolate z-50">
          <div className="mx-auto max-w-[1280px] px-4">
            <nav className="flex items-center justify-center gap-8 pt-0.5 pb-1.5">
              {NAV_ITEMS.map((item) => {
                const isActive = activeHref === item.href;

                const isBackToSchool =
                  item.label.trim().toUpperCase() === "REGRESO A CLASES";

                const base =
                  "text-[14px] lg:text-[15px] font-medium uppercase tracking-[0.10em] transition-colors";

                const className = isBackToSchool
                  ? `${base} animate-gradient bg-[linear-gradient(90deg,#00B7B7,#7C3AED,#E64545,#00B7B7)] bg-[length:200%_200%] bg-clip-text text-transparent`
                  : `${base} ${
                      isActive
                        ? "text-[#00B7B7]"
                        : "text-black hover:text-[#00B7B7]"
                    }`;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={className}
                    onMouseEnter={() => {
                      setHoverItem(item);
                      setMegaOpen(!!item.columns?.length);
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="h-[2px] w-full bg-[#E64545]" />

          <MegaMenu
            item={hoverItem}
            open={megaOpen}
            onClose={() => {
              setMegaOpen(false);
              setHoverItem(null);
            }}
          />
        </div>

        {/* ✅ Desktop PromoBar (se oculta al bajar) */}
        <div
          className={`hidden md:block overflow-hidden transition-all duration-300 ease-in-out ${
            showPromo ? "max-h-[120px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <PromoBar />
        </div>
      </div>

      {/* ✅ Mobile PromoBar (se oculta al bajar) */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          showPromo ? "max-h-16 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <PromoBar />
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
