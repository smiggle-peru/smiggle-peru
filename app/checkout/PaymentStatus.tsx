"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

type OrderRow = {
  id: string;
  external_reference: string;
  payment_status: string;
  payment_status_detail: string | null;
  mp_payment_id: string | null;
  mp_preference_id: string | null;

  subtotal: number;
  discount: number;
  shipping_cost: number;
  total: number;

  full_name: string;
  email: string;
  phone: string;

  carrier: string | null;
  shipping_type: string | null;

  created_at: string;
  paid_at: string | null;
};

type OrderItemRow = {
  id: string;
  product_id: string;
  variant_id: string | null;
  title: string;
  slug: string | null;
  image: string | null;
  qty: number;
  unit_price: number;
  line_total: number;
  color_name: string | null;
  color_slug: string | null;
  size_label: string | null;
  sku: string | null;
  created_at: string;
};

function money(n: number) {
  return `S/ ${Number(n || 0).toFixed(2)}`;
}

function formatPeru(iso: string | null) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("es-PE", {
      timeZone: "America/Lima",
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function supabasePublic() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !anon) throw new Error("Faltan envs de Supabase (public)");
  return createClient(url, anon, { auth: { persistSession: false } });
}

function badge(status: string) {
  const s = (status || "").toLowerCase();

  if (s === "approved") {
    return {
      title: "✅ Pago aprobado",
      desc: "Tu compra fue confirmada. Te contactaremos para el envío.",
      cls: "border-green-200 bg-green-50 text-green-800",
    };
  }
  if (s === "pending" || s === "in_process" || s === "authorized") {
    return {
      title: "⏳ Pago pendiente",
      desc: "El pago aún se está procesando. Actualiza en unos segundos.",
      cls: "border-yellow-200 bg-yellow-50 text-yellow-900",
    };
  }
  if (s === "rejected" || s === "cancelled") {
    return {
      title: "❌ Pago rechazado",
      desc: "No se pudo completar el pago. Puedes intentarlo nuevamente.",
      cls: "border-red-200 bg-red-50 text-red-800",
    };
  }
  return {
    title: "ℹ️ Estado de pago",
    desc: "Estamos verificando tu pago.",
    cls: "border-black/10 bg-black/[0.03] text-black/80",
  };
}

export default function PaymentStatus({ mode }: { mode: "success" | "pending" | "failure" }) {
  const sb = useMemo(() => supabasePublic(), []);
  const [ref, setRef] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [items, setItems] = useState<OrderItemRow[]>([]);
  const [err, setErr] = useState<string | null>(null);

  // leer ref
  useEffect(() => {
    const u = new URL(window.location.href);
    const r = u.searchParams.get("ref") || "";
    setRef(r);
  }, []);

  // polling suave (solo en pending/failure o si aún no llega approved)
  useEffect(() => {
    if (!ref) return;

    let alive = true;

    const load = async () => {
      setLoading(true);
      setErr(null);

      try {
        // 1) order
        const { data: o, error: e1 } = await sb
          .from("orders")
          .select(
            "id,external_reference,payment_status,payment_status_detail,mp_payment_id,mp_preference_id,subtotal,discount,shipping_cost,total,full_name,email,phone,carrier,shipping_type,created_at,paid_at"
          )
          .eq("external_reference", ref)
          .maybeSingle();

        if (e1) throw e1;
        if (!o) {
          setOrder(null);
          setItems([]);
          setErr("No encontramos la orden. Revisa el enlace o espera unos segundos.");
          setLoading(false);
          return;
        }

        // 2) items
        const { data: its, error: e2 } = await sb
          .from("order_items")
          .select(
            "id,product_id,variant_id,title,slug,image,qty,unit_price,line_total,color_name,color_slug,size_label,sku,created_at"
          )
          .eq("order_id", o.id)
          .order("created_at", { ascending: true });

        if (e2) throw e2;

        if (!alive) return;
        setOrder(o as any);
        setItems((its as any) || []);
        setLoading(false);
      } catch (e: any) {
        if (!alive) return;
        console.error(e);
        setErr("Error cargando estado. Intenta recargar.");
        setLoading(false);
      }
    };

    load();

    // poll: solo si no está approved
    const interval = setInterval(() => {
      if (!order) return;
      const s = (order.payment_status || "").toLowerCase();
      if (s === "approved") return;
      load();
    }, 5000);

    return () => {
      alive = false;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  const status = order?.payment_status || (mode === "success" ? "approved" : mode === "pending" ? "pending" : "rejected");
  const b = badge(status);

  return (
    <div className="mx-auto w-full max-w-[980px] px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-black">
            Estado de tu compra
          </h1>
          <p className="mt-1 text-[13px] text-black/55">
            {ref ? (
              <>
                Referencia: <span className="font-medium text-black">{ref}</span>
              </>
            ) : (
              "Cargando referencia..."
            )}
          </p>
        </div>

        <Link
          href="/"
          className="h-10 px-4 rounded-full border border-black/10 text-[13px] font-medium text-black/70 hover:border-black/20 hover:text-black flex items-center"
        >
          Volver a la tienda
        </Link>
      </div>

      <div className={`mt-6 rounded-2xl border p-4 ${b.cls}`}>
        <div className="text-[15px] font-semibold">{b.title}</div>
        <div className="mt-1 text-[13px] opacity-90">{b.desc}</div>

        {order?.payment_status_detail ? (
          <div className="mt-2 text-[12px] opacity-80">
            Detalle: <span className="font-medium">{order.payment_status_detail}</span>
          </div>
        ) : null}
      </div>

      {loading ? (
        <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5 text-[13px] text-black/60">
          Cargando datos de la orden...
        </div>
      ) : err ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-[13px] text-red-700">
          {err}
        </div>
      ) : order ? (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          {/* Items */}
          <div className="rounded-2xl border border-black/10 bg-white">
            <div className="border-b border-black/5 px-6 py-5">
              <div className="text-[14px] font-semibold text-black">Productos</div>
              <div className="mt-1 text-[12px] text-black/55">
                Orden #{order.id.slice(0, 8)} · Creada: {formatPeru(order.created_at)}
                {order.paid_at ? <> · Pagada: {formatPeru(order.paid_at)}</> : null}
              </div>
            </div>

            <div className="p-6">
              <div className="divide-y divide-black/5 rounded-2xl border border-black/10">
                {items.length === 0 ? (
                  <div className="px-4 py-4 text-[13px] text-black/55">Sin items.</div>
                ) : (
                  items.map((it) => (
                    <div key={it.id} className="flex items-center gap-4 px-4 py-4">
                      <div className="h-14 w-14 rounded-xl bg-black/[0.03] overflow-hidden flex items-center justify-center">
                        {it.image ? (
                          // no usamos next/image para evitar dominios, puedes cambiarlo si ya lo tienes permitido
                          <img src={it.image} alt={it.title} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-[11px] text-black/40">Sin foto</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-medium text-black">{it.title}</div>
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-black/55">
                          <span>Cant.: {it.qty}</span>
                          {it.color_name ? <span>Color: {it.color_name}</span> : null}
                          {it.size_label ? <span>Talla: {it.size_label}</span> : null}
                        </div>
                      </div>

                      <div className="text-[13px] font-semibold text-black">
                        {money(it.line_total)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <div className="text-[14px] font-semibold text-black">Resumen</div>

            <div className="mt-4 space-y-3 text-[13px] text-black/70">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-black">{money(order.subtotal)}</span>
              </div>

              {order.discount > 0 ? (
                <div className="flex justify-between">
                  <span>Descuento</span>
                  <span className="font-semibold text-green-700">- {money(order.discount)}</span>
                </div>
              ) : null}

              <div className="flex justify-between">
                <span>Envío</span>
                <span className="font-semibold text-black">{money(order.shipping_cost)}</span>
              </div>

              {order.carrier ? (
                <div className="flex justify-between">
                  <span>Carrier</span>
                  <span className="text-black">{order.carrier}</span>
                </div>
              ) : null}

              <div className="my-3 h-px w-full bg-black/10" />

              <div className="flex justify-between text-[14px]">
                <span className="font-semibold text-black">Total</span>
                <span className="font-semibold text-black">{money(order.total)}</span>
              </div>

              <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-4 text-[12px] text-black/60">
                <div className="font-semibold text-black/80">Cliente</div>
                <div className="mt-1">{order.full_name}</div>
                <div>{order.email}</div>
                <div>{order.phone}</div>
              </div>

              {(status.toLowerCase() === "pending" || status.toLowerCase() === "rejected" || status.toLowerCase() === "cancelled") &&
              order.mp_preference_id ? (
                <a
                  href={`https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=${encodeURIComponent(
                    order.mp_preference_id
                  )}`}
                  className="mt-4 inline-flex w-full items-center justify-center h-11 rounded-full bg-[#2f2f2f] text-[13px] font-semibold text-white hover:bg-[#262626]"
                >
                  Reintentar pago
                </a>
              ) : null}

              <Link
                href="/"
                className="mt-3 flex h-11 w-full items-center justify-center rounded-full border border-black/10 text-[13px] font-medium text-black/70 hover:border-black/20 hover:text-black"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
