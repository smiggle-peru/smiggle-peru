import Link from "next/link";

/* ----------------------------- ICONS (no libs) ----------------------------- */

function Icon({
  type,
  className = "",
}: {
  type: "shield" | "fast" | "support" | "check";
  className?: string;
}) {
  const base =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-black/10 bg-black/[0.02] text-black";
  const svg = "h-5 w-5";

  if (type === "shield") {
    return (
      <div className={`${base} ${className}`}>
        <svg
          className={svg}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 2.6 20 6.2v6.1c0 5-3.4 9.2-8 10.8-4.6-1.6-8-5.8-8-10.8V6.2l8-3.6Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M9.2 12.2l1.9 2 3.7-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  if (type === "fast") {
    return (
      <div className={`${base} ${className}`}>
        <svg
          className={svg}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 3v4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M20 12h-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M6.3 6.3 9.1 9.1"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M12 8.5a6.5 6.5 0 1 0 6.5 6.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M12 12l3-2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  if (type === "support") {
    return (
      <div className={`${base} ${className}`}>
        <svg
          className={svg}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4.5 12a7.5 7.5 0 0 1 15 0v4.2a2.2 2.2 0 0 1-2.2 2.2h-1.3"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M6 13.8H5a2 2 0 0 1-2-2V12a2 2 0 0 1 2-2h1v3.8Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M18 13.8h1a2 2 0 0 0 2-2V12a2 2 0 0 0-2-2h-1v3.8Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path
            d="M15.5 18.4a2.2 2.2 0 0 1-2.2 2.2h-1.7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  // check
  return (
    <div className={`${base} ${className}`}>
      <svg className={svg} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6.5 12.5 10.2 16.2 17.6 8.8"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ----------------------------- PAGE ----------------------------- */

export default function CertificadoDeGarantiaPage() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[900px] px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            Smiggle Perú
          </p>
          <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.02em] text-black md:text-[40px]">
            Certificado de garantía
          </h1>
          <p className="mt-4 text-[15px] leading-7 text-black/70">
            En <strong>Smiggle Perú</strong> todos nuestros productos cuentan con{" "}
            <strong>2 años de garantía</strong>. Aquí encontrarás las condiciones,
            el alcance y el procedimiento para solicitarla.
          </p>
        </div>

        {/* Highlight */}
        <div className="rounded-[26px] border border-black/10 bg-black/[0.02] p-6 md:p-7">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            Cobertura
          </p>
          <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.01em] text-black">
            2 años de garantía en todos nuestros productos
          </h2>
          <p className="mt-3 text-[15px] leading-7 text-black/70">
            La garantía aplica por <strong>defectos de fabricación</strong> y/o{" "}
            <strong>fallas de origen</strong>, siempre que el producto haya sido usado
            de manera adecuada y bajo las recomendaciones de cuidado.
          </p>
        </div>

        {/* ✅ 2) HIGHLIGHTS (sin gifs, pro) */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Highlight
            icon={<Icon type="shield" />}
            title="2 años de garantía"
            desc="Cobertura por defectos de fabricación o fallas de origen."
          />
          <Highlight
            icon={<Icon type="fast" />}
            title="Postventa más ágil"
            desc="Operamos con almacén en Perú para gestionar solicitudes con mayor rapidez."
          />
          <Highlight
            icon={<Icon type="support" />}
            title="Soporte y acompañamiento"
            desc="Te guiamos en todo el proceso por WhatsApp o correo."
          />
        </div>

        {/* Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card
            eyebrow="Incluye"
            title="Qué cubre la garantía"
            list={[
              "Defectos de fabricación o fallas de origen.",
              "Problemas de costuras, cierres o componentes que presenten falla sin evidencia de mal uso.",
              "Daños detectados al recibir el producto (reportados dentro de 48 horas).",
            ]}
          />

          <Card
            eyebrow="No incluye"
            title="Qué no cubre la garantía"
            list={[
              "Desgaste por uso normal (decoloración, desgaste de suelas/ruedas, etc.).",
              "Daños por mal uso, golpes, caídas, humedad excesiva o exposición a calor extremo.",
              "Manipulación, reparación o modificación realizada por terceros.",
              "Daños ocasionados por accidentes, cortes, rasgados o uso indebido del producto.",
            ]}
          />
        </div>

        {/* Process */}
        <div className="mt-8 rounded-[26px] border border-black/10 bg-white p-7 md:p-9">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            Cómo solicitar la garantía
          </p>

          <div className="mt-5 grid gap-3">
            <MiniCheck text="Escríbenos por WhatsApp o correo indicando tu número de pedido." />
            <MiniCheck text="Envíanos fotos y/o video donde se evidencie el problema, y una breve descripción del caso." />
            <MiniCheck text="Nuestro equipo validará el caso y te indicará los siguientes pasos (revisión, cambio o solución)." />
            <MiniCheck text="Al contar con almacén en Perú, la gestión de postventa se realiza de forma más ágil." />
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/canales-de-atencion"
              className="inline-flex h-11 items-center justify-center rounded-full bg-black px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-black/90"
            >
              Solicitar garantía
            </Link>
            <Link
              href="/metodos-de-pago"
              className="inline-flex h-11 items-center justify-center rounded-full border border-black/15 bg-white px-6 text-[13px] font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-black/[0.03]"
            >
              Ver métodos de pago
            </Link>
          </div>
        </div>

        {/* Requirements */}
        <div className="mt-8 rounded-[26px] border border-black/10 bg-white p-7">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            Requisitos
          </p>

          <div className="mt-4 grid gap-3">
            <MiniCheck text="Contar con el número de pedido o comprobante de compra." />
            <MiniCheck text="Enviar evidencia visual (fotos/video) del problema." />
            <MiniCheck text="El producto debe conservar sus componentes y no estar alterado por terceros." />
          </div>
        </div>

        {/* Note */}
        <p className="mt-8 text-[12px] leading-6 text-black/55">
          Nota: Las condiciones pueden variar según la categoría del producto.
          Para asistencia inmediata visita{" "}
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

/* ----------------------------- UI Blocks ----------------------------- */

function Highlight({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4 rounded-[24px] border border-black/10 bg-white p-6 transition hover:bg-black/[0.02]">
      {icon}
      <div>
        <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
          {title}
        </p>
        <p className="mt-2 text-[14px] leading-6 text-black/70">{desc}</p>
      </div>
    </div>
  );
}

function MiniCheck({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-black/10 bg-white p-4">
      <Icon type="check" />
      <p className="text-[14px] leading-6 text-black/70">{text}</p>
    </div>
  );
}

function Card({
  eyebrow,
  title,
  list,
}: {
  eyebrow: string;
  title: string;
  list: string[];
}) {
  return (
    <div className="rounded-[26px] border border-black/10 bg-white p-7">
      <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-[20px] font-semibold tracking-[-0.01em] text-black">
        {title}
      </h2>

      <ul className="mt-4 space-y-3 text-[14px] leading-6 text-black/70">
        {list.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black/60" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
