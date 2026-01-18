import Link from "next/link";

export default function CanalesDeAtencionPage() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[900px] px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            Soporte Smiggle Perú
          </p>
          <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.02em] text-black md:text-[40px]">
            Canales de atención
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-black/70">
            En <strong>Smiggle Perú</strong> contamos con canales de atención
            directos para acompañarte antes, durante y después de tu compra.
            Nuestro equipo está disponible para ayudarte con consultas sobre
            productos, pedidos, envíos, cambios y devoluciones.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* WhatsApp */}
          <div className="rounded-[24px] border border-black/10 bg-white p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
              WhatsApp
            </p>
            <p className="mt-2 text-[18px] font-semibold text-black">
              903 504 004
            </p>
            <p className="mt-2 text-[14px] text-black/70">
              Atención rápida y personalizada.
            </p>

            <Link
              href="https://wa.me/51903504004"
              target="_blank"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-black px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-black/90"
            >
              Escribir por WhatsApp
            </Link>
          </div>

          {/* Email */}
          <div className="rounded-[24px] border border-black/10 bg-white p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
              Correo electrónico
            </p>
            <p className="mt-2 text-[18px] font-semibold text-black">
              smiggle@smiggle-peru.com
            </p>
            <p className="mt-2 text-[14px] text-black/70">
              Para consultas detalladas o seguimiento de pedidos.
            </p>

            <a
              href="mailto:smiggle@smiggle-peru.com"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-full border border-black/15 bg-white px-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-black/[0.03]"
            >
              Enviar correo
            </a>
          </div>
        </div>

        {/* Schedule */}
        <div className="mt-8 rounded-[24px] border border-black/10 bg-black/[0.02] p-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            Horario de atención
          </p>
          <p className="mt-2 text-[15px] text-black/80">
            Lunes a sábado · <strong>9:00 a.m. – 5:00 p.m.</strong>
          </p>
          <p className="mt-2 text-[13px] text-black/60">
            Los mensajes recibidos fuera de este horario serán respondidos el
            siguiente día hábil.
          </p>
        </div>
      </div>
    </section>
  );
}
