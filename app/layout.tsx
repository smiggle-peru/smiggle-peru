import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Smiggle Perú | Los creadores de la papelería más divertida",
  description:
    "Smiggle, los creadores de la papelería más divertida. Encuentra mochilas, loncheras, cartucheras y accesorios para el colegio. Compra online.",
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={roboto.variable}>
      <head>
        <meta name="color-scheme" content="light" />
      </head>

      <body className="min-h-screen flex flex-col bg-[#060606]">
        <Header />

        {/* MAIN full width BLANCO */}
        <main className="flex-1 w-full bg-white">
          <div className="mx-auto max-w-[1280px] px-4 py-6">{children}</div>
        </main>

        <Footer />
      </body>
    </html>
  );
}
