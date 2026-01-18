import Link from "next/link";

export default function CoberturaDeDeliveryPage() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[900px] px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            Smiggle Perú
          </p>
          <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.02em] text-black md:text-[40px]">
            Cobertura de delivery
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-black/70">
            Realizamos envíos a <strong>todo el Perú</strong>. A continuación
            encontrarás los tiempos y costos según tu ubicación.
          </p>
        </div>

        {/* Coverage cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Lima */}
          <div className="rounded-[26px] border border-black/10 bg-white p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
              Lima
            </p>
            <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.01em] text-black">
              Envío regular y express
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-black/70">
              Elige la opción que mejor se adapte a tu necesidad.
            </p>

            <div className="mt-5 space-y-3">
              <ShipOption
                title="Envío regular"
                time="48 – 72 horas"
                price="S/ 12"
                badge="Más elegido"
              />
              <ShipOption
                title="Envío express"
                time="Mismo día"
                price="S/ 20"
                note="Válido si compras antes de las 11:00 a.m. Si compras después, se programa para el día siguiente."
              />
            </div>
          </div>

          {/* Provincia */}
          <div className="rounded-[26px] border border-black/10 bg-white p-7">
            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
              Provincias
            </p>
            <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.01em] text-black">
              Envío regular
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-black/70">
              Realizamos envíos a nivel nacional con tiempos estimados de entrega.
            </p>

            <div className="mt-5 space-y-3">
              <ShipOption title="Envío regular" time="48 – 72 horas" price="S/ 16" />
            </div>

            <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-4">
              <p className="text-[13px] leading-6 text-black/70">
                El plazo es estimado y puede variar por cobertura de agencia,
                temporadas de alta demanda o condiciones externas.
              </p>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="mt-8 rounded-[26px] border border-black/10 bg-black/[0.02] p-6 md:p-7">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            Consideraciones importantes
          </p>

          <ul className="mt-4 space-y-3 text-[14px] leading-6 text-black/70">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/60" />
              Los tiempos de entrega se cuentan desde la confirmación del pedido.
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/60" />
              Envío express (Lima): aplica para compras realizadas antes de las 11:00 a.m.
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/60" />
              Si necesitas ayuda con tu pedido o tu entrega, contáctanos por nuestros canales de atención.
            </li>
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/canales-de-atencion"
              className="inline-flex h-10 items-center justify-center rounded-full bg-black px-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-black/90"
            >
              Canales de atención
            </Link>
            <Link
              href="/compra-facil-y-seguro"
              className="inline-flex h-10 items-center justify-center rounded-full border border-black/15 bg-white px-6 text-[12px] font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-black/[0.03]"
            >
              Compra fácil y segura
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-[12px] leading-6 text-black/55">
          Los costos y tiempos pueden ajustarse sin previo aviso según campañas
          o condiciones logísticas. Para confirmación, escríbenos por{" "}
          <Link className="text-black underline underline-offset-4" href="/canales-de-atencion">
            Canales de atención
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

function ShipOption({
  title,
  time,
  price,
  badge,
  note,
}: {
  title: string;
  time: string;
  price: string;
  badge?: string;
  note?: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            {title}
          </p>
          <p className="mt-2 text-[14px] text-black/75">
            <span className="font-semibold text-black">Tiempo:</span> {time}
          </p>
        </div>

        <div className="text-right">
          {badge ? (
            <span className="inline-flex rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-[11px] font-semibold text-black/70">
              {badge}
            </span>
          ) : null}
          <p className="mt-2 text-[16px] font-semibold text-black">{price}</p>
        </div>
      </div>

      {note ? (
        <p className="mt-3 text-[13px] leading-6 text-black/65">{note}</p>
      ) : null}
    </div>
  );
}
