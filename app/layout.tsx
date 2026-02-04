import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto",
  display: "swap",
});

/* 🔒 FUERZA LIGHT MODE A NIVEL NAVEGADOR */
export const viewport: Viewport = {
  themeColor: "#F6F7F9", // color base de tu UI
  colorScheme: "light",  // ✅ CLAVE
};

export const metadata: Metadata = {
  title: "Smiggle Perú | Los creadores de la papelería más divertida",
  description:
    "Smiggle, los creadores de la papelería más divertida. Encuentra mochilas, loncheras, cartucheras y accesorios para el colegio. Compra online.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={roboto.variable}>
      <head>
        {/* 🔒 Refuerzo explícito (por si algún navegador se pone creativo) */}
        <meta name="color-scheme" content="light" />
      </head>

      {/* ✅ Fondo global SIEMPRE blanco */}
      <body className="min-h-screen flex flex-col bg-white text-black">
        <Header />

        {/* Cada página decide si usa container o full width */}
        <main className="flex-1 w-full">{children}</main>

        <Footer />
      </body>
    </html>
  );
}
