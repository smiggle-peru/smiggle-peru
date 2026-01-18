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
    <footer className="w-full bg-[#060606] text-white">
      {/* Fondo elegante (glow súper sutil) */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-24 left-1/2 h-72 w-[720px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -bottom-24 right-16 h-64 w-[520px] rounded-full bg-white/4 blur-3xl" />
        </div>

        {/* TOP */}
        <div className="relative mx-auto w-full max-w-[1280px] px-6 py-16 md:py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            {/* CONTACTO */}
            <div>
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-white/90">
                Contáctanos
              </h3>

              <ul className="mt-6 space-y-4 text-[14px] leading-6 text-white/75">
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 text-white/55" />
                  <span>
                    Whatsapp:{" "}
                    <a
                      className="text-white/85 hover:text-white transition"
                      href="https://wa.me/51903504004"
                      target="_blank"
                      rel="noreferrer"
                    >
                      903 504 004
                    </a>
                  </span>
                </li>

                <li className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 text-white/55" />
                  <span>Lunes a sábado · 9:00 am a 5:00 pm</span>
                </li>

                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 text-white/55" />
                  <a
                    href="mailto:smiggle@smiggle-peru.com"
                    className="text-white/85 hover:text-white transition"
                  >
                    smiggle@smiggle-peru.com
                  </a>
                </li>

                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-white/55" />
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
                    className="group grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.04] backdrop-blur transition hover:border-white/20 hover:bg-white/[0.07]"
                  >
                    <Icon className="h-4 w-4 text-white/70 transition group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* SOBRE NOSOTROS */}
            <div>
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-white/90">
                Sobre nosotros
              </h3>

              <ul className="mt-6 space-y-3 text-[14px] text-white/75">
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
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-white/90">
                Te informamos
              </h3>

              <ul className="mt-6 space-y-3 text-[14px] text-white/75">
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
              <h3 className="text-[13px] font-semibold uppercase tracking-[0.18em] text-white/90">
                Destacados
              </h3>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/[0.06] border border-white/10">
                    <BadgeCheck className="h-4 w-4 text-emerald-300/90" />
                  </span>

                  <div>
                    <p className="text-[14px] font-semibold text-white">
                      2 AÑOS DE GARANTÍA
                    </p>
                    <p className="mt-1 text-[13px] leading-5 text-white/70">
                      En todos nuestros productos. Compra con confianza y respaldo
                      oficial.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-5 text-[12px] text-white/55">
                *Aplican términos y condiciones según categoría.
              </p>
            </div>
          </div>
        </div>

        {/* Divider suave */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* PAGOS */}
        <div className="mx-auto w-full max-w-[1280px] px-6 py-10">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-white/60">
            Realiza tus compras de forma segura
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {PAY_METHODS.map((m) => (
              <span
                key={m}
                className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-[12px] text-white/75 backdrop-blur transition hover:border-white/20 hover:bg-white/[0.07]"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Divider suave */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* BOTTOM */}
        <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start justify-between gap-4 px-6 py-7 md:flex-row md:items-center">
          <p className="text-[12px] text-white/55">
            © {new Date().getFullYear()} Smiggle Perú. Todos los derechos reservados.
          </p>

          <div className="flex items-center gap-6 text-[12px] text-white/65">
            <Link
              href="/canales-de-atencion"
              className="hover:text-white transition"
            >
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
      className="inline-flex text-white/75 transition hover:text-white"
    >
      <span className="relative">
        {children}
        <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white/35 transition-transform duration-200 group-hover:scale-x-100" />
      </span>
    </Link>
  );
}
