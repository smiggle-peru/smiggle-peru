import type { ReactNode } from "react";
import { PromoBar } from "@/components/PromoBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <body className="min-h-screen bg-white text-neutral-900">
      {/* ✅ PROMOBAR – SOLO DESKTOP */}
      <div className="hidden md:block">
        <PromoBar />
      </div>

      {/* ✅ HEADER */}
      <Header />

      {/* ✅ CONTENIDO */}
      <main className="flex-1">{children}</main>

      {/* ✅ FOOTER */}
      <Footer />
    </body>
  );
}
