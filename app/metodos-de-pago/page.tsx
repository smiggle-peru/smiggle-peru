import Image from "next/image";
import Link from "next/link";

const PAYMENT_ICONS = {
  visa: "/payments/visa.png",
  mastercard: "/payments/mastercard.png",
  amex: "/payments/amex.png",
  yape: "/payments/yape.png",
  pagoefectivo: "/payments/pagoefectivo.png",
  mercadopago: "/payments/mercadopago.png",
};

const SECURITY_GIF = "/icons/security.gif"; // ✅ tu gif animado
const IMPORTANT_GIF = "/icons/important.gif"; // ✅ tu gif animado

export default function MetodosDePagoPage() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[900px] px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            Smiggle Perú
          </p>
          <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.02em] text-black md:text-[40px]">
            Métodos de pago
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-black/70">
            En <strong>Smiggle Perú</strong> contamos con métodos de pago seguros
            y confiables para que completes tu compra con total tranquilidad.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Tarjetas */}
          <PayCard
            eyebrow="Tarjetas"
            title="Crédito y débito"
            desc="Aceptamos tarjetas emitidas en Perú y el extranjero. Las transacciones se procesan mediante plataformas seguras."
            logos={[
              { src: PAYMENT_ICONS.visa, alt: "Visa" },
              { src: PAYMENT_ICONS.mastercard, alt: "MasterCard" },
              { src: PAYMENT_ICONS.amex, alt: "American Express" },
            ]}
          />

          {/* Pagos locales */}
          <PayCard
            eyebrow="Pagos locales"
            title="Opciones rápidas"
            desc="Métodos populares para pagar de forma simple desde el Perú."
            logos={[
              { src: PAYMENT_ICONS.yape, alt: "Yape" },
              { src: PAYMENT_ICONS.pagoefectivo, alt: "PagoEfectivo" },
            ]}
          />

          {/* Mercado Pago */}
          <PayCard
            eyebrow="Plataforma"
            title="Mercado Pago"
            desc="Paga de forma segura con los métodos disponibles en Mercado Pago."
            logos={[{ src: PAYMENT_ICONS.mercadopago, alt: "Mercado Pago" }]}
          />

          {/* Seguridad (gif animado) */}
          <IconInfoCard
            icon={SECURITY_GIF}
            eyebrow="Seguridad"
            title="Pagos protegidos"
            text="Toda la información de pago es procesada mediante pasarelas certificadas. Smiggle Perú no almacena datos sensibles de tarjetas."
          />
        </div>

        {/* Importante (gif animado) */}
        <div className="mt-8">
          <IconInfoStrip
            icon={IMPORTANT_GIF}
            title="Importante"
            text="La disponibilidad de métodos de pago puede variar según el producto, el monto de la compra o la plataforma utilizada."
          />
        </div>

        {/* CTA soporte */}
        <div className="mt-8 rounded-[24px] border border-black/10 bg-white p-6">
          <p className="text-[14px] leading-7 text-black/70">
            ¿Tienes dudas antes de pagar? Visita{" "}
            <Link
              href="/canales-de-atencion"
              className="text-black underline underline-offset-4"
            >
              Canales de atención
            </Link>{" "}
            y te ayudamos.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- UI Blocks ----------------------------- */

function PayCard({
  eyebrow,
  title,
  desc,
  logos,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  logos: { src: string; alt: string }[];
}) {
  return (
    <div className="rounded-[26px] border border-black/10 bg-white p-7 transition hover:bg-black/[0.02]">
      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.01em] text-black">
        {title}
      </h2>
      <p className="mt-3 text-[15px] leading-7 text-black/70">{desc}</p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {logos.map((l) => (
          <div
            key={l.alt}
            title={l.alt}
            className="group flex h-16 items-center justify-center rounded-2xl border border-black/10 bg-white px-7 transition
                       hover:border-black/20 hover:shadow-md hover:scale-[1.04]"
          >
            <Image
              src={l.src}
              alt={l.alt}
              width={150}
              height={48}
              className="h-[42px] w-auto object-contain transition group-hover:scale-[1.05]"
              priority
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function IconInfoCard({
  icon,
  eyebrow,
  title,
  text,
}: {
  icon: string;
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[26px] border border-black/10 bg-black/[0.02] p-7">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-white">
          <Image
            src={icon}
            alt={eyebrow}
            width={40}
            height={40}
            className="h-9 w-9 object-contain"
            priority
          />
        </div>

        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            {eyebrow}
          </p>
          <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.01em] text-black">
            {title}
          </h3>
          <p className="mt-3 text-[15px] leading-7 text-black/70">{text}</p>
        </div>
      </div>
    </div>
  );
}

function IconInfoStrip({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-[26px] border border-black/10 bg-white p-6">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.02]">
        <Image
          src={icon}
          alt={title}
          width={40}
          height={40}
          className="h-9 w-9 object-contain"
          priority
        />
      </div>

      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
          {title}
        </p>
        <p className="mt-2 text-[14px] leading-6 text-black/70">{text}</p>
      </div>
    </div>
  );
}
