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

function payLabel(s: any) {
  const v = String(s || "").toLowerCase();
  if (v === "approved") return { t: "Pago aprobado", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" };
  if (v === "pending" || v === "in_process") return { t: "Pago en proceso", cls: "bg-amber-50 text-amber-700 ring-amber-200" };
  if (v === "rejected" || v === "cancelled") return { t: "Pago rechazado", cls: "bg-rose-50 text-rose-700 ring-rose-200" };
  return { t: "Estado desconocido", cls: "bg-slate-50 text-slate-700 ring-slate-200" };
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

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ external_reference?: string }>;
}) {
  const { external_reference } = await searchParams;

  if (!external_reference) {
    return (
      <div className="min-h-[70vh] bg-[#F6F7F9]">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
            <h1 className="text-xl font-semibold">No se encontró la orden</h1>
            <p className="mt-2 text-sm text-black/60">
              Falta <b>external_reference</b> en la URL.
            </p>
            <div className="mt-6 flex gap-3">
              <Link className="rounded-xl bg-black px-4 py-2 text-sm text-white" href="/">
                Ir al inicio
              </Link>
              <Link className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm" href="/checkout">
                Volver al checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sb = supabaseServer();
  const { data: order } = await sb.from("orders").select("*").eq("external_reference", external_reference).single();

  if (!order) {
    return (
      <div className="min-h-[70vh] bg-[#F6F7F9]">
        <div className="mx-auto max-w-6xl px-5 py-12">
          <div className="rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
            <h1 className="text-xl font-semibold">Orden no encontrada</h1>
            <p className="mt-2 text-sm text-black/60">
              No existe una orden con ese <b>external_reference</b>.
            </p>
            <div className="mt-6 flex gap-3">
              <Link className="rounded-xl bg-black px-4 py-2 text-sm text-white" href="/">
                Ir al inicio
              </Link>
              <Link className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm" href="/checkout">
                Volver al checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const badge = payLabel(order.payment_status);

  return (
    <div className="min-h-[70vh] bg-[#F6F7F9]">
      <div className="mx-auto max-w-6xl px-5 py-10 md:py-14">
        {/* HERO */}
        <div className="rounded-3xl bg-gradient-to-r from-black to-[#111827] p-7 text-white shadow-[0_20px_60px_rgba(0,0,0,0.25)] md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/70">
                Smiggle Perú
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                ¡Compra confirmada!
              </h1>
              <p className="mt-2 text-sm text-white/75">
                Te dejamos el detalle completo de tu orden para que tengas todo claro.
              </p>
            </div>

            <div className="flex flex-col items-start gap-2 md:items-end">
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-semibold ring-1 ${badge.cls}`}>
                <span className="h-2 w-2 rounded-full bg-current opacity-70" />
                {badge.t}
              </span>
              <div className="text-xs text-white/70">
                Orden: <span className="font-semibold text-white">{order.external_reference}</span>
              </div>
            </div>
          </div>
        </div>

        {/* GRID */}
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
                          <Image
                            src={img}
                            alt={it.title || "Producto"}
                            fill
                            className="object-cover"
                          />
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

                        {it.slug ? (
                          <div className="mt-3">
                            <Link
                              className="text-xs font-semibold text-[#111827] underline underline-offset-4"
                              href={`/producto/${it.slug}${it.color_slug ? `?color=${it.color_slug}` : ""}`}
                            >
                              Ver producto
                            </Link>
                          </div>
                        ) : null}
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

            <Card title="Entrega">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-black/10 p-4">
                  <div className="text-xs font-semibold text-black/60">Tipo de envío</div>
                  <div className="mt-1 text-sm font-semibold">{shipLabel(order.shipping_type)}</div>
                  <div className="mt-3 text-xs font-semibold text-black/60">Carrier</div>
                  <div className="mt-1 text-sm">{order.carrier || "—"}</div>
                </div>

                <div className="rounded-2xl border border-black/10 p-4">
                  <div className="text-xs font-semibold text-black/60">Dirección</div>
                  <div className="mt-1 text-sm font-semibold">{order.address || "—"}</div>
                  {order.reference ? (
                    <div className="mt-2 text-xs text-black/60">Referencia: {order.reference}</div>
                  ) : null}
                  <div className="mt-3 text-xs font-semibold text-black/60">Ubicación</div>
                  <div className="mt-1 text-sm">
                    {order.dep_name || "—"}, {order.prov_name || "—"}, {order.dist_name || "—"}
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Cliente">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-black/10 p-4">
                  <div className="text-xs font-semibold text-black/60">Nombre</div>
                  <div className="mt-1 text-sm font-semibold">{order.full_name || "—"}</div>
                  <div className="mt-3 text-xs font-semibold text-black/60">Correo</div>
                  <div className="mt-1 text-sm">{order.email || "—"}</div>
                </div>

                <div className="rounded-2xl border border-black/10 p-4">
                  <div className="text-xs font-semibold text-black/60">Documento</div>
                  <div className="mt-1 text-sm font-semibold">
                    {order.doc_type || "—"} {order.doc_number || ""}
                  </div>
                  <div className="mt-3 text-xs font-semibold text-black/60">Celular</div>
                  <div className="mt-1 text-sm">{order.phone || "—"}</div>
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT (Sticky) */}
          <div className="col-span-12 lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
                <div className="text-[13px] font-semibold tracking-tight">Resumen de pago</div>

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

                <div className="mt-4 rounded-2xl bg-black/5 p-4 text-xs text-black/70">
                  <div className="font-semibold text-black/80">Estado</div>
                  <div className="mt-1">
                    {badge.t} · {order.payment_method_id || "Método no especificado"}
                  </div>
                  <div className="mt-2">
                    Creada: <span className="font-semibold">{fmtDatePe(order.created_at || order.created_at_pe)}</span>
                  </div>
                  <div className="mt-1">
                    Pagada: <span className="font-semibold">{order.paid_at ? fmtDatePe(order.paid_at) : "—"}</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                  <Link className="rounded-xl bg-black px-4 py-3 text-center text-sm font-semibold text-white" href="/">
                    Seguir comprando
                  </Link>
                  <Link className="rounded-xl border border-black/10 bg-white px-4 py-3 text-center text-sm font-semibold" href="/checkout">
                    Volver al checkout
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
                <div className="text-[13px] font-semibold">¿Necesitas ayuda?</div>
                <p className="mt-2 text-sm text-black/60">
                  Si tienes dudas, escríbenos por WhatsApp y te ayudamos con tu compra.
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

        {/* FOOT NOTE */}
        <div className="mt-10 text-center text-xs text-black/45">
          Gracias por comprar en Smiggle Perú.
        </div>
      </div>
    </div>
  );
}
