"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentStatus() {
  const sp = useSearchParams();

  const status = sp.get("status"); // success | pending | failure
  const order = sp.get("order");   // id opcional

  const cfg =
    status === "success"
      ? {
          title: "Pago aprobado",
          desc: "Tu compra se confirmó correctamente.",
          box: "border-green-200 bg-green-50 text-green-800",
        }
      : status === "pending"
        ? {
            title: "Pago pendiente",
            desc: "Estamos verificando tu pago. Si ya pagaste, se actualizará en breve.",
            box: "border-amber-200 bg-amber-50 text-amber-800",
          }
        : {
            title: "Pago no completado",
            desc: "No se pudo confirmar el pago. Puedes intentarlo nuevamente.",
            box: "border-red-200 bg-red-50 text-red-800",
          };

  return (
    <section className="mx-auto w-full max-w-[720px] px-4 py-14">
      <h1 className="text-3xl font-semibold tracking-tight">{cfg.title}</h1>
      <p className="mt-2 text-sm text-black/55">{cfg.desc}</p>

      <div className={`mt-6 rounded-2xl border px-4 py-4 text-sm ${cfg.box}`}>
        {order ? (
          <div>
            <div className="text-black/60">Código de pedido</div>
            <div className="mt-1 font-medium text-black/90">{order}</div>
          </div>
        ) : (
          <div className="text-black/70">No se recibió un código de pedido.</div>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="w-full rounded-full bg-[#2b2b2b] px-5 py-3 text-center text-sm font-medium text-white hover:bg-[#242424]"
        >
          Volver al inicio
        </Link>

        <Link
          href="/carrito"
          className="w-full rounded-full border border-black/15 px-5 py-3 text-center text-sm text-black/70 hover:bg-black/[0.03]"
        >
          Ir al carrito
        </Link>
      </div>
    </section>
  );
}
