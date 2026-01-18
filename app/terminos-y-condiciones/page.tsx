import Link from "next/link";

export default function TerminosYCondicionesPage() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-[900px] px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60">
            Smiggle Perú
          </p>

          <h1 className="mt-3 text-[32px] font-semibold tracking-[-0.02em] text-black md:text-[40px]">
            Términos y condiciones
          </h1>

          <p className="mt-4 text-[15px] leading-7 text-black/70">
            Estos Términos y Condiciones regulan el acceso, uso y las compras
            realizadas a través del sitio web de <strong>Smiggle Perú</strong>.
            Al navegar o realizar una compra, aceptas estas condiciones.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          <TCSection
            title="1. Aceptación de los términos"
            text={
              <>
                El acceso y uso del sitio web de Smiggle Perú implica la
                aceptación plena y sin reservas de los presentes Términos y
                Condiciones. Si no estás de acuerdo con alguno de ellos, te
                recomendamos no utilizar la plataforma.
              </>
            }
          />

          <TCSection
            title="2. Uso del sitio web"
            text={
              <>
                El usuario se compromete a utilizar el sitio web de manera
                responsable y lícita. Queda prohibido realizar acciones que
                afecten la seguridad, disponibilidad o correcto funcionamiento
                de la plataforma.
              </>
            }
          />

          <TCSection
            title="3. Registro y datos del usuario"
            text={
              <>
                Para realizar compras, el usuario deberá proporcionar
                información veraz, completa y actualizada. Smiggle Perú no se
                responsabiliza por errores en la entrega derivados de datos
                incorrectos proporcionados por el cliente.
              </>
            }
          />

          <TCSection
            title="4. Proceso de compra"
            text={
              <>
                La compra se considera confirmada una vez que el pago haya sido
                procesado correctamente y el pedido haya sido validado. Smiggle
                Perú se reserva el derecho de contactar al cliente para validar
                información cuando sea necesario para garantizar una entrega
                segura.
              </>
            }
          />

          <TCSection
            title="5. Precios y disponibilidad"
            text={
              <>
                Todos los precios están expresados en{" "}
                <strong>soles peruanos (PEN)</strong> e incluyen impuestos
                aplicables, salvo indicación contraria. Los productos están
                sujetos a disponibilidad de stock.
                <br />
                <br />
                Smiggle Perú se reserva el derecho de modificar precios,
                promociones o condiciones comerciales sin previo aviso,
                respetando siempre las compras ya confirmadas.
              </>
            }
          />

          <TCSection
            title="6. Medios de pago"
            text={
              <>
                Las transacciones se realizan mediante plataformas de pago
                seguras y certificadas. Smiggle Perú no almacena datos sensibles
                de tarjetas ni información bancaria de los clientes.
              </>
            }
          />

          <TCSection
            title="7. Envíos y entregas"
            text={
              <>
                Smiggle Perú realiza envíos a todo el territorio peruano. Los
                plazos de entrega son estimados y pueden variar por factores
                logísticos o externos. El cliente es responsable de asegurar que
                la información de entrega sea correcta.
              </>
            }
          />

          <TCSection
            title="8. Cambios, devoluciones y garantía"
            text={
              <>
                Los cambios, devoluciones y solicitudes de garantía se rigen por
                nuestras políticas publicadas. Todos los productos cuentan con{" "}
                <strong>2 años de garantía</strong>, aplicable únicamente a
                defectos de fabricación o fallas de origen.
              </>
            }
          />

          <TCSection
            title="9. Responsabilidad"
            text={
              <>
                Smiggle Perú no será responsable por daños indirectos,
                incidentales o derivados del uso del sitio web o de la
                imposibilidad de utilizarlo, salvo en los casos expresamente
                establecidos por la ley.
              </>
            }
          />

          <TCSection
            title="10. Propiedad intelectual"
            text={
              <>
                Todo el contenido del sitio web —textos, imágenes, logotipos,
                diseños y material gráfico— es propiedad de Smiggle Perú o de
                sus respectivos titulares. Queda prohibida su reproducción sin
                autorización previa.
              </>
            }
          />

          <TCSection
            title="11. Modificaciones"
            text={
              <>
                Smiggle Perú se reserva el derecho de modificar estos Términos y
                Condiciones en cualquier momento. Las modificaciones entrarán
                en vigor desde su publicación en el sitio web.
              </>
            }
          />

          <TCSection
            title="12. Legislación aplicable"
            text={
              <>
                Estos Términos y Condiciones se rigen por las leyes de la
                República del Perú. Cualquier controversia será resuelta por las
                autoridades competentes del territorio peruano.
              </>
            }
          />
        </div>

        {/* Footer */}
        <div className="mt-10 rounded-[24px] border border-black/10 bg-black/[0.02] p-6">
          <p className="text-[14px] leading-7 text-black/70">
            Para cualquier consulta relacionada con estos Términos y
            Condiciones, puedes contactarnos a través de nuestros{" "}
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

function TCSection({
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
