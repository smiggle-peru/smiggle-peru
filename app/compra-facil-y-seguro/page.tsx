import Link from "next/link";
import Image from "next/image";

const TRUST_ITEMS = [
  {
    icon: "/icons/payment-secure.gif",
    title: "Pagos seguros",
    desc: "Procesos protegidos y verificados.",
  },
  {
    icon: "/icons/support-local.gif",
    title: "Soporte local",
    desc: "Te acompañamos en cada etapa.",
  },
  {
    icon: "/icons/warranty-2-years.gif",
    title: "2 años de garantía",
    desc: "En todos nuestros productos.",
  },
];

export default function CompraFacilYSeguraPage() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[900px] px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            Smiggle Perú
          </p>
          <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.02em] text-black md:text-[40px]">
            Compra fácil y segura
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-black/70">
            En <strong>Smiggle Perú</strong> queremos que tu experiencia sea
            simple, transparente y confiable. Aquí encontrarás cómo comprar en
            pocos pasos, cómo protegemos tu información y qué hacer si necesitas
            ayuda con tu pedido.
          </p>
        </div>

        {/* Trust highlights */}
        <div className="grid gap-4 md:grid-cols-3">
          {TRUST_ITEMS.map((item) => (
            <TrustPill
              key={item.title}
              icon={item.icon}
              title={item.title}
              desc={item.desc}
            />
          ))}
        </div>

        {/* Steps */}
        <div className="mt-10 rounded-[24px] border border-black/10 bg-white p-7 md:p-9">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            Cómo comprar
          </p>

          <ol className="mt-5 space-y-4 text-[15px] leading-7 text-black/75">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/60" />
              Explora nuestras categorías y elige el producto que deseas.
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/60" />
              Añádelo al carrito y verifica el resumen de tu compra.
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/60" />
              Completa tus datos de envío y selecciona tu método de pago.
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/60" />
              Confirma tu pedido. Te contactaremos si se requiere validar algún
              dato para garantizar una entrega correcta.
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/60" />
              Recibe tu compra en la dirección indicada. Si necesitas soporte,
              estamos listos para ayudarte.
            </li>
          </ol>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/categoria/regreso-a-clases"
              className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-black/90"
            >
              Ver productos
            </Link>
            <Link
              href="/canales-de-atencion"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/15 bg-white px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-black/[0.03]"
            >
              Necesito ayuda
            </Link>
          </div>
        </div>

        {/* Security */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card
            eyebrow="Seguridad"
            title="Protección de tu información"
            text="Tu información personal se utiliza únicamente para procesar tu compra, coordinar la entrega y brindarte soporte. Priorizamos una experiencia segura y transparente."
          />
          <Card
            eyebrow="Transparencia"
            title="Seguimiento y soporte"
            text="Si tienes dudas sobre tu pedido, cambios o devoluciones, puedes contactarnos por WhatsApp o correo. Nuestro equipo te orientará durante el proceso."
          />
        </div>

        {/* Delivery + returns */}
        <div className="mt-8 rounded-[24px] border border-black/10 bg-black/[0.02] p-6 md:p-7">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            Entregas, cambios y devoluciones
          </p>

          <p className="mt-3 text-[15px] leading-7 text-black/70">
            Operamos con <strong>almacén en Perú</strong>, lo que nos permite
            despachar de manera eficiente y gestionar{" "}
            <strong>cambios y devoluciones</strong> con mayor rapidez.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/cobertura-de-delivery"
              className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 bg-white px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-black/[0.03]"
            >
              Ver cobertura de delivery
            </Link>
            <Link
              href="/politicas-de-cambios-y-devoluciones"
              className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 bg-white px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-black/[0.03]"
            >
              Cambios y devoluciones
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-[12px] leading-6 text-black/55">
          Nota: La disponibilidad de productos, tiempos de entrega y condiciones
          de post-venta pueden variar según ubicación y tipo de producto. Para
          atención directa, visita{" "}
          <Link
            className="text-black underline underline-offset-4"
            href="/canales-de-atencion"
          >
            Canales de atención
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

function TrustPill({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-[20px] border border-black/10 bg-white p-5 transition hover:bg-black/[0.02]">
      {/* Icono animado */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center">
        <Image
          src={icon}
          alt={title}
          width={48}
          height={48}
          className="object-contain"
          priority
        />
      </div>

      {/* Texto */}
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/70">
          {title}
        </p>
        <p className="mt-2 text-[14px] leading-6 text-black/65">{desc}</p>
      </div>
    </div>
  );
}

function Card({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] border border-black/10 bg-white p-7">
      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.01em] text-black">
        {title}
      </h2>
      <p className="mt-3 text-[15px] leading-7 text-black/70">{text}</p>
    </div>
  );
}
