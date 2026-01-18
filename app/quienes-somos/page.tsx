import Image from "next/image";
import Link from "next/link";

const IMAGE_SRC = "/about/quienes-somos.png"; // ✅ Cambia por tu PNG dentro de /public

export default function QuienesSomosPage() {
  return (
    <section className="w-full">
      {/* HERO PREMIUM */}
      <div className="mx-auto max-w-[1280px] px-4 pt-10 md:pt-14">
        <div className="relative overflow-hidden rounded-[30px] border border-black/10 bg-white">
          {/* Serigrafía / textura sutil */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-44 left-1/2 h-[520px] w-[880px] -translate-x-1/2 rounded-full bg-black/[0.035] blur-3xl" />
            <div className="absolute -bottom-52 right-10 h-[520px] w-[720px] rounded-full bg-black/[0.025] blur-3xl" />
            <div className="absolute inset-0 opacity-[0.18] [background-image:radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.18)_1px,transparent_0)] [background-size:18px_18px]" />
          </div>

          <div className="relative grid gap-10 p-7 md:grid-cols-2 md:p-12">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.20em] text-black/60">
                Smiggle Perú
              </p>

              <h1 className="mt-3 text-[34px] font-semibold leading-[1.04] tracking-[-0.02em] text-black md:text-[46px]">
                Una marca global.
                <br />
                Una experiencia local, ahora en Perú.
              </h1>

              <p className="mt-6 text-[15px] leading-7 text-black/70 md:text-[16px]">
                <strong className="text-black/85">Smiggle</strong> es una marca
                internacional reconocida por crear la papelería más divertida:
                productos que combinan{" "}
                <strong className="text-black/85">diseño</strong>,
                <strong className="text-black/85"> funcionalidad</strong> y
                <strong className="text-black/85"> calidad</strong> para acompañar
                la creatividad en cada etapa.
              </p>

              <p className="mt-4 text-[15px] leading-7 text-black/70 md:text-[16px]">
                <strong className="text-black/85">Smiggle Perú</strong> nace para
                acercar esa experiencia al mercado peruano con procesos claros,
                compra segura y un servicio que prioriza la confianza.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/categoria/regreso-a-clases"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-black/90"
                >
                  Ver colección
                </Link>

                <Link
                  href="/canales-de-atencion"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-black/15 bg-white px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-black/[0.03]"
                >
                  Atención al cliente
                </Link>
              </div>

              {/* Nota “sin tienda física” muy pro */}
              <div className="mt-7 rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                {/* ✅ 1) HERO – bloque informativo (reemplazado) */}
                <p className="text-[13px] leading-6 text-black/70">
                  <strong className="text-black/85">Modelo de operación:</strong>{" "}
                  Operamos con{" "}
                  <strong className="text-black/85">almacén en Perú</strong>, lo
                  que nos permite realizar entregas más rápidas y gestionar
                  cambios y devoluciones de forma eficiente a nivel nacional.
                </p>
              </div>
            </div>

            {/* BLOQUES DE CONFIANZA (estilo ecommerce grande) */}
            <div className="grid gap-4 md:content-start">
              <TrustStat
                title="Almacén en Perú"
                desc="Despachos más ágiles y soporte local."
              />
              <TrustStat
                title="Entregas más rápidas"
                desc="Procesamiento eficiente para envíos a nivel nacional."
              />
              <TrustStat
                title="Cambios y devoluciones"
                desc="Gestión más simple y rápida desde Perú."
              />
              <TrustStat
                title="2 años de garantía"
                desc="En todos nuestros productos, para comprar con tranquilidad."
                strong
              />

              <div className="mt-2 rounded-2xl border border-black/10 bg-white p-5">
                <p className="text-[12px] font-semibold uppercase tracking-[0.20em] text-black/60">
                  Nuestro enfoque
                </p>
                <p className="mt-2 text-[14px] leading-6 text-black/70">
                  Una experiencia de compra premium: claridad, tiempos de respuesta
                  rápidos y respaldo post-venta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN “NUESTRA PROPUESTA” */}
      <div className="mx-auto max-w-[1280px] px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <InfoBlock
            eyebrow="Nuestra propuesta"
            title="Diseño con propósito"
            text="Cada pieza está pensada para el uso real: materiales durables, acabados premium y colecciones con personalidad."
          />
          <InfoBlock
            eyebrow="Compra segura"
            title="Transparencia y confianza"
            text="Te acompañamos antes, durante y después de tu compra con canales de atención claros y políticas definidas."
          />
          <InfoBlock
            eyebrow="Perú"
            title="Operación local"
            text="Contamos con almacén en Perú para acelerar entregas y gestionar cambios/devoluciones con mayor rapidez."
          />
        </div>

        {/* Divider fino */}
        <div className="my-12 h-px w-full bg-black/10" />

        {/* MISIÓN / SERVICIO (layout premium) */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <p className="text-[12px] font-semibold uppercase tracking-[0.20em] text-black/60">
              Misión
            </p>
            <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.01em] text-black">
              Hacer que cada día sea más creativo.
            </h2>
            <p className="mt-3 text-[15px] leading-7 text-black/70">
              Acercamos a Perú una experiencia Smiggle de nivel internacional,
              priorizando diseño, calidad y un servicio post-venta confiable.
            </p>
          </Card>

          <Card>
            <p className="text-[12px] font-semibold uppercase tracking-[0.20em] text-black/60">
              Servicio & Post-venta
            </p>
            <ul className="mt-4 space-y-3 text-[15px] text-black/75">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/60" />
                {/* ✅ 2) BLOQUES DE CONFIANZA (texto cambiado) */}
                Operación online con almacén en Perú
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/60" />
                Almacén en Perú para agilizar entregas
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/60" />
                Cambios y devoluciones gestionados localmente
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/60" />
                2 años de garantía en todos los productos
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* CTA PREMIUM */}
      <div className="mx-auto max-w-[1280px] px-4 pb-8">
        <div className="rounded-[26px] border border-black/10 bg-white p-7 md:p-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.20em] text-black/60">
                ¿Listo para empezar?
              </p>
              <h3 className="mt-2 text-[22px] font-semibold tracking-[-0.01em] text-black">
                Explora la colección Smiggle Perú
              </h3>
              <p className="mt-2 text-[15px] leading-7 text-black/70">
                Mochilas, cartucheras, loncheras, papelería y accesorios para
                transformar el regreso a clases.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/categoria/mochilas"
                className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-black/90"
              >
                Ver mochilas
              </Link>
              <Link
                href="/politicas-de-cambios-y-devoluciones"
                className="inline-flex h-11 items-center justify-center rounded-full border border-black/15 bg-white px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-black/[0.03]"
              >
                Cambios y devoluciones
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ IMAGEN FINAL (tu PNG) */}
      <div className="mx-auto max-w-[1280px] px-4 pb-14 md:pb-20">
        <div className="overflow-hidden rounded-[30px] border border-black/10 bg-white">
          <div className="px-6 pt-7 md:px-10 md:pt-10">
            <p className="text-[12px] font-semibold uppercase tracking-[0.20em] text-black/60">
              Smiggle Perú
            </p>
            <h3 className="mt-2 text-[22px] font-semibold tracking-[-0.01em] text-black">
              Bienvenidos a una nueva etapa en Perú.
            </h3>

            {/* ✅ 3) SECCIÓN FINAL: se queda tal cual */}
            <p className="mt-2 text-[15px] leading-7 text-black/70">
              Operación online con almacén local para entregas más rápidas y una
              mejor experiencia post-venta.
            </p>
          </div>

          <div className="relative mt-6 w-full">
            <div className="relative h-[260px] w-full md:h-[430px]">
              <Image
                src={IMAGE_SRC}
                alt="Smiggle Perú - Quiénes somos"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustStat({
  title,
  desc,
  strong,
}: {
  title: string;
  desc: string;
  strong?: boolean;
}) {
  return (
    <div className="rounded-[18px] border border-black/10 bg-white p-5 transition hover:bg-black/[0.02]">
      <p
        className={[
          "text-[13px] font-semibold uppercase tracking-[0.16em]",
          strong ? "text-black" : "text-black/85",
        ].join(" ")}
      >
        {title}
      </p>
      <p className="mt-2 text-[14px] leading-6 text-black/65">{desc}</p>
    </div>
  );
}

function InfoBlock({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[26px] border border-black/10 bg-white p-7 md:p-9">
      <p className="text-[12px] font-semibold uppercase tracking-[0.20em] text-black/60">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.01em] text-black">
        {title}
      </h2>
      <p className="mt-3 text-[15px] leading-7 text-black/70">{text}</p>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[26px] border border-black/10 bg-white p-7 md:p-9">
      {children}
    </div>
  );
}
