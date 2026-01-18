import Image from "next/image";
import Link from "next/link";

// ✅ Reemplaza estas rutas por tus gifs reales
const HIGHLIGHT_GIFS = {
  confianza: "/icons/confianza.gif",
  peru: "/icons/peru.gif",
  soporte: "/icons/soporte.gif",
};

export default function CambiosYDevolucionesPage() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[900px] px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            Smiggle Perú
          </p>

          <h1 className="mt-3 text-[32px] font-semibold tracking-[-0.02em] text-black md:text-[40px]">
            Cambios y devoluciones
          </h1>

          <p className="mt-4 text-[15px] leading-7 text-black/70">
            En <strong>Smiggle Perú</strong> queremos que compres con total
            tranquilidad. Aquí encontrarás nuestras condiciones, plazos y el
            procedimiento para solicitar un cambio o devolución de forma clara y
            ordenada.
          </p>
        </div>

        {/* Highlights (PRO + GIF animados) */}
        <div className="grid gap-4 md:grid-cols-3">
          <HighlightPro
            gif={HIGHLIGHT_GIFS.confianza}
            title="Compra con confianza"
            desc="Políticas claras y transparentes para proteger tu compra."
          />
          <HighlightPro
            gif={HIGHLIGHT_GIFS.peru}
            title="Gestión en Perú"
            desc="Contamos con almacén en Perú para procesos más ágiles."
          />
          <HighlightPro
            gif={HIGHLIGHT_GIFS.soporte}
            title="Soporte directo"
            desc="Te acompañamos durante todo el proceso por canales oficiales."
          />
        </div>

        {/* Main cards */}
        <div className="mt-8 space-y-6">
          <PolicyCard title="Plazo para solicitar cambios o devoluciones">
            <p>
              Podrás solicitar un cambio o devolución dentro de los{" "}
              <strong>7 días calendario</strong> posteriores a la recepción del
              producto, siempre que se cumplan las condiciones descritas en esta
              política.
            </p>
          </PolicyCard>

          <PolicyCard title="Condiciones generales">
            <p>Para que un cambio o devolución sea aceptado, el producto debe:</p>
            <ul className="mt-3 list-disc pl-6">
              <li>Encontrarse en perfecto estado.</li>
              <li>No presentar signos de uso.</li>
              <li>Conservar etiquetas, empaques y accesorios originales.</li>
              <li>Contar con número de pedido o comprobante de compra.</li>
            </ul>
          </PolicyCard>

          <PolicyCard title="Casos que no aplican">
            <p>No se aceptarán cambios ni devoluciones cuando:</p>
            <ul className="mt-3 list-disc pl-6">
              <li>El producto esté usado, dañado o incompleto.</li>
              <li>Exista desgaste por uso normal.</li>
              <li>
                Se evidencie mal uso, golpes, caídas o manipulación indebida.
              </li>
              <li>El producto haya sido intervenido o reparado por terceros.</li>
            </ul>
          </PolicyCard>

          <PolicyCard title="Costos de envío">
            <p>
              Los costos de envío asociados a cambios o devoluciones serán
              asumidos por el cliente, salvo en casos de{" "}
              <strong>falla de origen</strong>,{" "}
              <strong>defecto de fabricación</strong> o error atribuible a
              Smiggle Perú.
            </p>
          </PolicyCard>

          <PolicyCard title="Devolución de dinero">
            <p>
              Si la devolución es aprobada, el reembolso se realizará mediante
              el mismo medio de pago utilizado en la compra o mediante un método
              acordado con el cliente, dentro de los plazos establecidos por la
              plataforma de pago correspondiente.
            </p>
          </PolicyCard>

          <PolicyCard title="Productos con garantía">
            <p>
              Los productos con fallas de origen o defectos de fabricación se
              rigen por nuestro{" "}
              <Link
                href="/certificado-de-garantia"
                className="text-black underline underline-offset-4"
              >
                Certificado de Garantía
              </Link>
              , con vigencia de <strong>2 años</strong>.
            </p>
          </PolicyCard>
        </div>

        {/* Steps */}
        <div className="mt-8 rounded-[28px] border border-black/10 bg-white p-7 md:p-9">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            Proceso
          </p>

          <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.01em] text-black">
            Cómo solicitar un cambio o devolución
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Step
              n="1"
              title="Contáctanos"
              text="Escríbenos por WhatsApp o correo indicando tu número de pedido."
            />
            <Step
              n="2"
              title="Envía evidencia"
              text="Adjunta fotos del producto para validar el estado."
            />
            <Step
              n="3"
              title="Evaluación"
              text="Revisaremos tu solicitud y te confirmaremos los siguientes pasos."
            />
            <Step
              n="4"
              title="Resolución"
              text="Se coordinará el cambio, devolución o alternativa disponible."
            />
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/canales-de-atencion"
              className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-black/90"
            >
              Solicitar cambio o devolución
            </Link>
            <Link
              href="/terminos-y-condiciones"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/15 bg-white px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-black/[0.03]"
            >
              Ver términos y condiciones
            </Link>
          </div>
        </div>

        {/* Note */}
        <div className="mt-8 rounded-[24px] border border-black/10 bg-black/[0.02] p-6">
          <p className="text-[14px] leading-7 text-black/70">
            Smiggle Perú se reserva el derecho de evaluar cada caso conforme a
            esta política. Para atención directa, visita{" "}
            <Link
              href="/canales-de-atencion"
              className="text-black underline underline-offset-4"
            >
              Canales de atención
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- UI ----------------------------- */

function HighlightPro({
  gif,
  title,
  desc,
}: {
  gif: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="group rounded-[26px] border border-black/10 bg-white p-6 transition hover:bg-black/[0.02]">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.02] transition group-hover:bg-black/[0.03]">
          {/* ✅ GIF animado sin optimizar */}
          <Image
            src={gif}
            alt={title}
            width={44}
            height={44}
            className="h-10 w-10 object-contain"
            unoptimized
            priority
          />
        </div>

        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            {title}
          </p>
          <p className="mt-2 text-[14px] leading-6 text-black/70">{desc}</p>
        </div>
      </div>

      {/* micro detail line */}
      <div className="mt-5 h-px w-full bg-black/5" />
      <p className="mt-4 text-[12px] leading-5 text-black/55">
        Gestión transparente y soporte durante todo el proceso.
      </p>
    </div>
  );
}

// ✅ FIX PRO: PolicyCard con children y contenedor (no <p> fijo)
function PolicyCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-black/10 bg-white p-7 transition hover:bg-black/[0.02]">
      <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
        {title}
      </h2>

      {/* ✅ Permite <ul>, <p>, etc. sin HTML inválido */}
      <div className="mt-3 text-[15px] leading-7 text-black/70">{children}</div>
    </div>
  );
}

function Step({
  n,
  title,
  text,
}: {
  n: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] border border-black/10 bg-white p-6 transition hover:bg-black/[0.02]">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.02] text-[13px] font-semibold text-black/70">
          {n}
        </div>
        <div>
          <h3 className="text-[16px] font-semibold text-black">{title}</h3>
          <p className="mt-2 text-[14px] leading-6 text-black/70">{text}</p>
        </div>
      </div>
    </div>
  );
}
