import Link from "next/link";

export default function PoliticaDeCookiesPage() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[900px] px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            Smiggle Perú
          </p>

          <h1 className="mt-3 text-[32px] font-semibold tracking-[-0.02em] text-black md:text-[40px]">
            Política de cookies
          </h1>

          <p className="mt-4 text-[15px] leading-7 text-black/70">
            En <strong>Smiggle Perú</strong> utilizamos cookies y tecnologías
            similares para mejorar tu experiencia de navegación, analizar el uso
            del sitio web y ofrecer un servicio más eficiente.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <CookieSection
            title="1. ¿Qué son las cookies?"
            text={
              <>
                Las cookies son pequeños archivos de texto que se almacenan en
                tu dispositivo cuando visitas un sitio web. Estas permiten
                recordar información sobre tu navegación y facilitar el uso de
                determinadas funcionalidades.
              </>
            }
          />

          <CookieSection
            title="2. Tipos de cookies que utilizamos"
            text={
              <>
                En nuestro sitio web podemos utilizar los siguientes tipos de
                cookies:
                <ul className="mt-3 list-disc pl-6">
                  <li>
                    <strong>Cookies esenciales:</strong> necesarias para el
                    funcionamiento básico del sitio web.
                  </li>
                  <li>
                    <strong>Cookies de rendimiento:</strong> nos permiten
                    analizar cómo los usuarios interactúan con el sitio para
                    mejorar su funcionamiento.
                  </li>
                  <li>
                    <strong>Cookies de funcionalidad:</strong> recuerdan
                    preferencias del usuario para ofrecer una experiencia más
                    personalizada.
                  </li>
                </ul>
              </>
            }
          />

          <CookieSection
            title="3. Uso de cookies de terceros"
            text={
              <>
                Smiggle Perú puede utilizar cookies de terceros, como
                herramientas de análisis o plataformas de pago, con la única
                finalidad de mejorar la experiencia del usuario y procesar
                transacciones de forma segura.
              </>
            }
          />

          <CookieSection
            title="4. Gestión de cookies"
            text={
              <>
                El usuario puede configurar su navegador para aceptar, bloquear
                o eliminar cookies en cualquier momento. Ten en cuenta que
                deshabilitar algunas cookies puede afectar el correcto
                funcionamiento del sitio web.
              </>
            }
          />

          <CookieSection
            title="5. Consentimiento"
            text={
              <>
                Al navegar y continuar utilizando nuestro sitio web, el usuario
                acepta el uso de cookies conforme a lo establecido en esta
                política, salvo que haya modificado la configuración de su
                navegador.
              </>
            }
          />

          <CookieSection
            title="6. Modificaciones a esta política"
            text={
              <>
                Smiggle Perú se reserva el derecho de modificar esta Política de
                Cookies en cualquier momento. Cualquier cambio será publicado
                oportunamente en el sitio web.
              </>
            }
          />

          <CookieSection
            title="7. Legislación aplicable"
            text={
              <>
                Esta Política de Cookies se rige por las leyes de la República
                del Perú y es complementaria a nuestra{" "}
                <Link
                  href="/politicas-de-privacidad"
                  className="text-black underline underline-offset-4"
                >
                  Política de Privacidad
                </Link>
                .
              </>
            }
          />
        </div>

        {/* Footer */}
        <div className="mt-10 rounded-[24px] border border-black/10 bg-black/[0.02] p-6">
          <p className="text-[14px] leading-7 text-black/70">
            Si tienes dudas sobre el uso de cookies en nuestro sitio web, puedes
            comunicarte a través de nuestros{" "}
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

function CookieSection({
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
