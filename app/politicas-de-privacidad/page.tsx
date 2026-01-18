import Link from "next/link";

export default function PoliticaDePrivacidadPage() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[900px] px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            Smiggle Perú
          </p>

          <h1 className="mt-3 text-[32px] font-semibold tracking-[-0.02em] text-black md:text-[40px]">
            Política de privacidad
          </h1>

          <p className="mt-4 text-[15px] leading-7 text-black/70">
            En <strong>Smiggle Perú</strong> valoramos tu privacidad. Esta Política
            de Privacidad explica cómo recopilamos, usamos y protegemos tu
            información personal cuando navegas o realizas compras en nuestro
            sitio web.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <PrivacySection
            title="1. Información que recopilamos"
            text={
              <>
                Podemos recopilar información personal proporcionada
                voluntariamente por el usuario, como nombre, correo electrónico,
                número de contacto, dirección de entrega y datos necesarios para
                procesar pedidos.
                <br />
                <br />
                Asimismo, podemos recopilar información técnica de navegación
                como dirección IP, tipo de dispositivo, navegador y comportamiento
                de uso del sitio web.
              </>
            }
          />

          <PrivacySection
            title="2. Uso de la información"
            text={
              <>
                La información recopilada se utiliza exclusivamente para:
                <ul className="mt-3 list-disc pl-6">
                  <li>Procesar y gestionar pedidos.</li>
                  <li>Coordinar envíos, cambios, devoluciones y garantías.</li>
                  <li>Brindar atención al cliente y soporte postventa.</li>
                  <li>Enviar comunicaciones relacionadas con la compra.</li>
                  <li>Mejorar la experiencia de navegación en el sitio web.</li>
                </ul>
              </>
            }
          />

          <PrivacySection
            title="3. Protección de los datos"
            text={
              <>
                Smiggle Perú adopta medidas técnicas y organizativas razonables
                para proteger los datos personales contra accesos no autorizados,
                pérdida, alteración o divulgación indebida.
                <br />
                <br />
                No almacenamos información sensible de tarjetas de crédito o
                débito, ya que los pagos se procesan mediante plataformas
                certificadas.
              </>
            }
          />

          <PrivacySection
            title="4. Compartición de información"
            text={
              <>
                Smiggle Perú no vende ni comercializa los datos personales de sus
                clientes. La información solo podrá ser compartida con:
                <ul className="mt-3 list-disc pl-6">
                  <li>Proveedores logísticos para la entrega de pedidos.</li>
                  <li>Plataformas de pago para procesar transacciones.</li>
                  <li>Autoridades competentes cuando la ley lo requiera.</li>
                </ul>
              </>
            }
          />

          <PrivacySection
            title="5. Derechos del usuario"
            text={
              <>
                El usuario tiene derecho a acceder, rectificar, actualizar o
                solicitar la eliminación de sus datos personales, conforme a la
                normativa peruana vigente.
                <br />
                <br />
                Para ejercer estos derechos, puede comunicarse a través de
                nuestros{" "}
                <Link
                  href="/canales-de-atencion"
                  className="text-black underline underline-offset-4"
                >
                  Canales de atención
                </Link>
                .
              </>
            }
          />

          <PrivacySection
            title="6. Uso de cookies"
            text={
              <>
                Nuestro sitio web puede utilizar cookies y tecnologías similares
                para mejorar la experiencia de navegación y analizar el uso del
                sitio. El usuario puede configurar su navegador para rechazar
                cookies, aunque esto podría afectar algunas funcionalidades.
              </>
            }
          />

          <PrivacySection
            title="7. Conservación de la información"
            text={
              <>
                Los datos personales serán conservados únicamente durante el
                tiempo necesario para cumplir con las finalidades descritas en
                esta política o según lo exija la normativa aplicable.
              </>
            }
          />

          <PrivacySection
            title="8. Modificaciones a esta política"
            text={
              <>
                Smiggle Perú se reserva el derecho de actualizar esta Política de
                Privacidad en cualquier momento. Las modificaciones entrarán en
                vigor desde su publicación en el sitio web.
              </>
            }
          />

          <PrivacySection
            title="9. Legislación aplicable"
            text={
              <>
                Esta Política de Privacidad se rige por las leyes de la
                República del Perú, en especial la normativa sobre protección de
                datos personales vigente.
              </>
            }
          />
        </div>

        {/* Footer */}
        <div className="mt-10 rounded-[24px] border border-black/10 bg-black/[0.02] p-6">
          <p className="text-[14px] leading-7 text-black/70">
            Si tienes consultas sobre nuestra Política de Privacidad, puedes
            comunicarte con nosotros a través de nuestros{" "}
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

function PrivacySection({
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
      <div className="mt-3 text-[15px] leading-7 text-black/70">{text}</div>
    </div>
  );
}
