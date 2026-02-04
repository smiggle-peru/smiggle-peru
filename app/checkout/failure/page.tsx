import Link from "next/link";
import Image from "next/image";
import { supabaseServer } from "@/lib/supabase/server";

function money(n: any) {
  const v = Number(n || 0);
  return `S/ ${v.toFixed(2)}`;
}

function Card({ title, children }: { title: string; children: any }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
      <div className="border-b border-black/5 px-6 py-4">
        <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

export default async function FailurePage({
  searchParams,
}: {
  searchParams: Promise<{ external_reference?: string }>;
}) {
  const { external_reference } = await searchParams;

  const sb = supabaseServer();
  const { data: order } = external_reference
    ? await sb.from("orders").select("*").eq("external_reference", external_reference).single()
    : { data: null as any };

  const items = order && Array.isArray(order.items) ? order.items : [];

  return (
    <div className="min-h-[70vh] bg-[#F6F7F9]">
      <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        <div className="rounded-3xl bg-gradient-to-r from-[#111827] to-black p-7 text-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/70">
                Smiggle Perú
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                No se pudo completar el pago
              </h1>
              <p className="mt-2 text-sm text-white/75">
                Tu pago fue rechazado o cancelado. Puedes intentarlo otra vez.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-[12px] font-semibold text-rose-700 ring-1 ring-rose-200">
              <span className="h-2 w-2 rounded-full bg-rose-600 opacity-70" />
              Pago fallido
            </span>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <Card title="Productos">
              <div className="space-y-4">
                {items.map((it: any, idx: number) => {
                  const img = it.image || it.images?.[0] || null;
                  const qty = Number(it.qty || 0);
                  const unit = Number(it.unit_price || 0);

                  return (
                    <div key={`${it.product_id || idx}`} className="flex gap-4 rounded-2xl border border-black/10 bg-white p-4">
                      <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-black/5">
                        {img ? <Image src={img} alt={it.title || "Producto"} fill className="object-cover" /> : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[14px] font-semibold">{it.title}</div>
                        <div className="mt-1 text-xs text-black/60">
                          Cant: {qty}
                          {it.color_name ? ` · Color: ${it.color_name}` : ""}
                          {it.size_label ? ` · Talla: ${it.size_label}` : ""}
                        </div>
                        <div className="mt-2 text-xs text-black/60">Unit: {money(unit)}</div>
                      </div>
                    </div>
                  );
                })}

                {items.length === 0 ? (
                  <div className="rounded-2xl border border-black/10 p-4 text-sm text-black/60">
                    No hay productos guardados en esta orden.
                  </div>
                ) : null}
              </div>
            </Card>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
                <div className="text-[13px] font-semibold tracking-tight">Qué hacer ahora</div>

                <div className="mt-3 rounded-2xl bg-rose-50 p-4 text-xs text-rose-800 ring-1 ring-rose-200">
                  <div className="font-semibold">Consejo</div>
                  <div className="mt-1">Prueba otro método de pago o verifica tus datos en MercadoPago.</div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3">
                  <Link className="rounded-xl bg-black px-4 py-3 text-center text-sm font-semibold text-white" href="/checkout">
                    Intentar de nuevo
                  </Link>
                  <Link className="rounded-xl border border-black/10 bg-white px-4 py-3 text-center text-sm font-semibold" href="/">
                    Volver al inicio
                  </Link>
                </div>

                {order ? (
                  <div className="mt-5 text-xs text-black/55">
                    <div>Orden: <span className="font-semibold">{order.external_reference}</span></div>
                    <div className="mt-1">Total: <span className="font-semibold">{money(order.total)}</span></div>
                    <div className="mt-1">Detalle: <span className="font-semibold">{order.payment_status_detail || "—"}</span></div>
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
                <div className="text-[13px] font-semibold">Soporte</div>
                <p className="mt-2 text-sm text-black/60">
                  Si el problema persiste, contáctanos y te ayudamos con tu compra.
                </p>
                <div className="mt-4">
                  <Link className="text-sm font-semibold underline underline-offset-4" href="/canales-de-atencion">
                    Ver canales de atención
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-black/45">
          Smiggle Perú · Compra segura
        </div>
      </div>
    </div>
  );
}
