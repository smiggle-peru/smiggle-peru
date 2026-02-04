import Link from "next/link";
import Image from "next/image";
import { supabaseServer } from "@/lib/supabase/server";

function money(n: any) {
  const v = Number(n || 0);
  return `S/ ${v.toFixed(2)}`;
}

function fmtDatePe(value: any) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("es-PE", {
    timeZone: "America/Lima",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shipLabel(s: any) {
  if (s === "lima_express") return "Lima Express (mismo día)";
  if (s === "lima_regular") return "Lima Regular (48–72h)";
  if (s === "provincia_regular") return "Provincia (24–72h)";
  return "—";
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

export default async function PendingPage({
  searchParams,
}: {
  searchParams: Promise<{ external_reference?: string }>;
}) {
  const { external_reference } = await searchParams;
  if (!external_reference) return null;

  const sb = supabaseServer();
  const { data: order } = await sb.from("orders").select("*").eq("external_reference", external_reference).single();
  if (!order) return null;

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="min-h-[70vh] bg-[#F6F7F9]">
      <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        {/* HERO */}
        <div className="rounded-3xl bg-gradient-to-r from-[#111827] to-[#0B1220] p-7 text-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/70">
                Smiggle Perú
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Pago pendiente
              </h1>
              <p className="mt-2 text-sm text-white/75">
                Estamos validando tu pago. Si ya pagaste, puede demorar unos minutos en reflejarse.
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 md:items-end">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[12px] font-semibold text-amber-700 ring-1 ring-amber-200">
                <span className="h-2 w-2 rounded-full bg-amber-600 opacity-70" />
                En verificación
              </span>
              <div className="text-xs text-white/70">
                Orden: <span className="font-semibold text-white">{order.external_reference}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-white/10 p-4 text-sm text-white/80">
            Tip: si cerraste MercadoPago o cambiaste de método, vuelve a intentar el pago desde el checkout.
          </div>
        </div>

        <div className="mt-8 grid grid-cols-12 gap-6">
          {/* LEFT */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <Card title="Productos">
              <div className="space-y-4">
                {items.map((it: any, idx: number) => {
                  const img = it.image || it.images?.[0] || null;
                  const qty = Number(it.qty || 0);
                  const unit = Number(it.unit_price || 0);
                  const line = qty * unit;

                  return (
                    <div
                      key={`${it.product_id || idx}`}
                      className="flex gap-4 rounded-2xl border border-black/10 bg-white p-4 hover:shadow-sm transition"
                    >
                      <div className="relative h-20 w-20 overflow-hidden rounded-2xl bg-black/5">
                        {img ? (
                          <Image src={img} alt={it.title || "Producto"} fill className="object-cover" />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <div className="truncate text-[14px] font-semibold">{it.title}</div>
                            <div className="mt-1 text-xs text-black/60">
                              Cant: {qty}
                              {it.color_name ? ` · Color: ${it.color_name}` : ""}
                              {it.size_label ? ` · Talla: ${it.size_label}` : ""}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-black/60">Unit: {money(unit)}</div>
                            <div className="mt-1 text-sm font-semibold">{money(line)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card title="Entrega y cliente">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-black/10 p-4">
                  <div className="text-xs font-semibold text-black/60">Envío</div>
                  <div className="mt-1 text-sm font-semibold">{shipLabel(order.shipping_type)}</div>
                  <div className="mt-3 text-xs font-semibold text-black/60">Carrier</div>
                  <div className="mt-1 text-sm">{order.carrier || "—"}</div>

                  <div className="mt-4 text-xs font-semibold text-black/60">Dirección</div>
                  <div className="mt-1 text-sm">{order.address || "—"}</div>
                  {order.reference ? <div className="mt-1 text-xs text-black/60">Ref: {order.reference}</div> : null}
                </div>

                <div className="rounded-2xl border border-black/10 p-4">
                  <div className="text-xs font-semibold text-black/60">Cliente</div>
                  <div className="mt-1 text-sm font-semibold">{order.full_name || "—"}</div>

                  <div className="mt-3 text-xs font-semibold text-black/60">Documento</div>
                  <div className="mt-1 text-sm">
                    {order.doc_type || "—"} {order.doc_number || ""}
                  </div>

                  <div className="mt-3 text-xs font-semibold text-black/60">Correo</div>
                  <div className="mt-1 text-sm">{order.email || "—"}</div>

                  <div className="mt-3 text-xs font-semibold text-black/60">Ubicación</div>
                  <div className="mt-1 text-sm">
                    {order.dep_name || "—"}, {order.prov_name || "—"}, {order.dist_name || "—"}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
                <div className="text-[13px] font-semibold tracking-tight">Resumen</div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-black/70">
                    <span>Subtotal</span>
                    <span>{money(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-black/70">
                    <span>Descuento</span>
                    <span>- {money(order.discount)}</span>
                  </div>
                  <div className="flex justify-between text-black/70">
                    <span>Envío</span>
                    <span>{money(order.shipping_cost)}</span>
                  </div>
                  <div className="my-3 h-px bg-black/10" />
                  <div className="flex justify-between text-base font-semibold">
                    <span>Total</span>
                    <span>{money(order.total)}</span>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-xs text-amber-800 ring-1 ring-amber-200">
                  <div className="font-semibold">Recomendación</div>
                  <div className="mt-1">
                    Espera 1–3 minutos y recarga la página. MercadoPago a veces confirma en segundo plano.
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                  {/* “Actualizar” sin JS: recarga la misma URL */}
                  <a
                    className="rounded-xl bg-black px-4 py-3 text-center text-sm font-semibold text-white"
                    href={`/checkout/pending?external_reference=${encodeURIComponent(order.external_reference)}`}
                  >
                    Actualizar estado
                  </a>
                  <Link className="rounded-xl border border-black/10 bg-white px-4 py-3 text-center text-sm font-semibold" href="/checkout">
                    Volver al checkout
                  </Link>
                </div>

                <div className="mt-4 text-xs text-black/50">
                  Creada: <span className="font-semibold">{fmtDatePe(order.created_at || order.created_at_pe)}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
                <div className="text-[13px] font-semibold">¿Hubo un error?</div>
                <p className="mt-2 text-sm text-black/60">
                  Si tu pago fue rechazado, vuelve al checkout y prueba otro método.
                </p>
                <div className="mt-4">
                  <Link className="text-sm font-semibold underline underline-offset-4" href="/">
                    Seguir comprando
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-xs text-black/45">
          Smiggle Perú · Gracias por tu compra
        </div>
      </div>
    </div>
  );
}
