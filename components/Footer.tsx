"use client";

import Link from "next/link";
import {
  Phone,
  Clock,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
  BadgeCheck,
} from "lucide-react";

const PAY_METHODS = [
  "Visa",
  "MasterCard",
  "American Express",
  "Yape",
  "PagoEfectivo",
  "Mercado Pago",
];

export function Footer() {
  return (
    <footer className="w-full bg-[#E3E8E8] text-[#111827]">
      <div className="relative">
        {/* TOP */}
        <div className="relative mx-auto w-full max-w-[1280px] px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            {/* CONTACTO */}
            <div>
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-black/80">
                Contáctanos
              </h3>

              <ul className="mt-6 space-y-4 text-[14px] leading-6 text-black/70">
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-black/40" />
                  <span>
                    Whatsapp:{" "}
                    <a
                      className="text-black/80 hover:text-black transition"
                      href="https://wa.me/51903504004"
                      target="_blank"
                      rel="noreferrer"
                    >
                      903 504 004
                    </a>
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 text-black/40" />
                  <span>Lunes a sábado · 9:00 am a 5:00 pm</span>
                </li>

                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-black/40" />
                  <a
                    href="mailto:smiggle@smiggle-peru.com"
                    className="text-black/80 hover:text-black transition"
                  >
                    smiggle@smiggle-peru.com
                  </a>
                </li>

                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-black/40" />
                  <span>Almacén: Vulcano 261, Ate, Lima 15012</span>
                </li>
              </ul>

              {/* Redes */}
              <div className="mt-7 flex items-center gap-3">
                {[
                  { label: "Facebook", Icon: Facebook, href: "#" },
                  { label: "Instagram", Icon: Instagram, href: "#" },
                  { label: "YouTube", Icon: Youtube, href: "#" },
                ].map(({ label, Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="
                      group grid h-10 w-10 place-items-center rounded-full
                      border border-black/10 bg-white
                      shadow-sm
                      transition
                      hover:-translate-y-[1px]
                      hover:border-black/20
                      hover:shadow-md
                      active:translate-y-0
                    "
                  >
                    <Icon className="h-4 w-4 text-black/60 transition group-hover:text-black" />
                  </a>
                ))}
              </div>
            </div>

            {/* SOBRE NOSOTROS */}
            <div>
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-black/80">
                Sobre nosotros
              </h3>

              <ul className="mt-6 space-y-3 text-[14px] text-black/70">
                <li>
                  <FooterLink href="/quienes-somos">¿Quiénes somos?</FooterLink>
                </li>
                <li>
                  <FooterLink href="/canales-de-atencion">
                    Canales de atención
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/compra-facil-y-seguro">
                    Compra fácil y seguro
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/metodos-de-pago">Métodos de pago</FooterLink>
                </li>
              </ul>
            </div>

            {/* TE INFORMAMOS */}
            <div>
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-black/80">
                Te informamos
              </h3>

              <ul className="mt-6 space-y-3 text-[14px] text-black/70">
                <li>
                  <FooterLink href="/cobertura-de-delivery">
                    Cobertura de delivery
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/certificado-de-garantia">
                    Certificado de garantía
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/bases-legales">Bases legales</FooterLink>
                </li>
                <li>
                  <FooterLink href="/terminos-y-condiciones">
                    Términos y condiciones
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/politicas-de-privacidad">
                    Políticas de privacidad
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/politicas-de-cookies">
                    Políticas de cookies
                  </FooterLink>
                </li>
                <li>
                  <FooterLink href="/politicas-de-cambios-y-devoluciones">
                    Cambios y devoluciones
                  </FooterLink>
                </li>
              </ul>
            </div>

            {/* DESTACADOS */}
            <div>
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-black/80">
                Destacados
              </h3>

              {/* ✅ ahora BLANCO */}
              <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-black/[0.04] border border-black/10">
                    <BadgeCheck className="h-4 w-4 text-emerald-600" />
                  </span>

                  <div>
                    <p className="text-[14px] font-semibold text-black">
                      2 AÑOS DE GARANTÍA
                    </p>
                    <p className="mt-1 text-[13px] leading-5 text-black/70">
                      En todos nuestros productos. Compra con confianza y respaldo
                      oficial.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-[12px] text-black/50">
                *Aplican términos y condiciones según categoría.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/15 to-transparent" />

        {/* PAGOS */}
        <div className="mx-auto w-full max-w-[1280px] px-6 py-10">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-black/60">
            Realiza tus compras de forma segura
          </p>

          {/* ✅ chips BLANCOS */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {PAY_METHODS.map((m) => (
              <span
                key={m}
                className="
                  rounded-full border border-black/10 bg-white
                  px-4 py-1.5 text-[12px] text-black/70
                  shadow-sm
                  transition
                  hover:border-black/20 hover:bg-black/[0.02]
                "
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-black/15 to-transparent" />

        {/* BOTTOM */}
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start justify-between gap-4 px-6 py-7 md:flex-row md:items-center">
          <p className="text-[12px] text-black/50">
            © {new Date().getFullYear()} Smiggle Perú. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-6 text-[12px] text-black/60">
            <Link href="/canales-de-atencion" className="hover:text-black transition">
              Canales de atención
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex text-black/70 transition hover:text-black"
    >
      <span className="relative">
        {children}
        <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-black/35 transition-transform duration-200 group-hover:scale-x-100" />
      </span>
    </Link>
  );
}
