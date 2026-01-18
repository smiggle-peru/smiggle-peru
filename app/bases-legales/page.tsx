import Link from "next/link";

export default function BasesLegalesPage() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[900px] px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            Smiggle Perú
          </p>

          <h1 className="mt-3 text-[32px] font-semibold tracking-[-0.02em] text-black md:text-[40px]">
            Bases legales
          </h1>

          <p className="mt-4 text-[15px] leading-7 text-black/70">
            Este documento establece las condiciones legales que regulan el uso
            del sitio web y las compras realizadas en <strong>Smiggle Perú</strong>.
            Al navegar o comprar en nuestra plataforma, aceptas estas condiciones.
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-6">
          <LegalCard
            title="Identificación del proveedor"
            text={
              <>
                <strong>Smiggle Perú</strong> opera como tienda online dedicada a
                la comercialización de productos de papelería, mochilas y
                accesorios. Operamos bajo modalidad digital y contamos con{" "}
                <strong>almacén en Perú</strong> para la gestión de pedidos,
                entregas, cambios y devoluciones.
                <br />
                <br />
                No contamos con tienda física abierta al público.
              </>
            }
          />

          <LegalCard
            title="Alcance de las bases legales"
            text={
              <>
                Estas bases legales aplican al acceso, navegación y uso del sitio
                web, así como a todas las transacciones realizadas a través de
                nuestra plataforma, antes, durante y después del proceso de
                compra.
              </>
            }
          />

          <LegalCard
            title="Condiciones de compra"
            text={
              <>
                Todos los productos están sujetos a disponibilidad de stock. Los
                precios se muestran en <strong>soles peruanos (PEN)</strong> e
                incluyen los impuestos aplicables, salvo indicación expresa.
                <br />
                <br />
                Smiggle Perú se reserva el derecho de modificar precios,
                promociones y condiciones comerciales, respetando siempre las
                compras ya confirmadas.
              </>
            }
          />

          <LegalCard
            title="Medios de pago"
            text={
              <>
                Las transacciones se procesan mediante plataformas de pago
                seguras y certificadas. Smiggle Perú{" "}
                <strong>no almacena información sensible</strong> de tarjetas ni
                credenciales bancarias de sus clientes.
              </>
            }
          />

          <LegalCard
            title="Envíos y entregas"
            text={
              <>
                Realizamos envíos a todo el territorio peruano. Los plazos de
                entrega son estimados y pueden variar por factores logísticos o
                externos. El cliente es responsable de proporcionar datos
                correctos y completos para la entrega.
              </>
            }
          />

          <LegalCard
            title="Cambios, devoluciones y garantía"
            text={
              <>
                Todos los productos cuentan con <strong>2 años de garantía</strong>,
                conforme a nuestras políticas publicadas. La garantía cubre
                defectos de fabricación o fallas de origen, no daños ocasionados
                por uso indebido o desgaste normal.
              </>
            }
          />

          <LegalCard
            title="Responsabilidad del usuario"
            text={
              <>
                El usuario se compromete a utilizar el sitio web de manera
                lícita, proporcionando información veraz y absteniéndose de
                realizar acciones que puedan afectar la seguridad o el
                funcionamiento de la plataforma.
              </>
            }
          />

          <LegalCard
            title="Propiedad intelectual"
            text={
              <>
                Todos los contenidos del sitio web —incluyendo textos,
                imágenes, logotipos y diseños— son propiedad de Smiggle Perú o
                de sus respectivos titulares, y se encuentran protegidos por
                las leyes de propiedad intelectual.
              </>
            }
          />

          <LegalCard
            title="Protección de datos personales"
            text={
              <>
                Los datos personales proporcionados por los clientes son
                tratados conforme a la normativa peruana vigente y utilizados
                únicamente para fines comerciales, logísticos y de atención al
                cliente.
              </>
            }
          />

          <LegalCard
            title="Legislación aplicable"
            text={
              <>
                Estas bases legales se rigen por las leyes de la República del
                Perú. Cualquier controversia será resuelta por las autoridades
                competentes del territorio peruano.
              </>
            }
          />
        </div>

        {/* Footer note */}
        <div className="mt-10 rounded-[24px] border border-black/10 bg-black/[0.02] p-6">
          <p className="text-[14px] leading-7 text-black/70">
            Si tienes dudas sobre estas bases legales, puedes contactarnos a
            través de nuestros{" "}
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

function LegalCard({
  title,
  text,
}: {
  title: string;
  text: React.ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-black/10 bg-white p-7 transition hover:bg-black/[0.02]">
      <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
        {title}
      </h2>
      <p className="mt-3 text-[15px] leading-7 text-black/70">{text}</p>
    </div>
  );
}
