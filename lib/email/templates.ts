type EmailMode = "success" | "pending" | "failure";

type OrderItem = {
  title: string;
  qty: number;
  unit_price: number;
  image?: string | null;
  slug?: string | null;
  color_name?: string | null;
  size_label?: string | null;
};

type Order = {
  external_reference: string;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;

  dep_name?: string | null;
  prov_name?: string | null;
  dist_name?: string | null;
  address?: string | null;
  reference?: string | null;

  shipping_type?: string | null;
  carrier?: string | null;

  subtotal?: number | null;
  discount?: number | null;
  shipping_cost?: number | null;
  total?: number | null;

  items?: OrderItem[] | null;
};

function money(n: any) {
  const v = Number(n || 0);
  return `S/ ${v.toFixed(2)}`;
}

function statusCopy(mode: EmailMode) {
  if (mode === "success") {
    return {
      badge: "PAGO APROBADO",
      title: "¡Pago confirmado! 🎉",
      desc: "Tu compra fue aprobada y ya estamos preparando tu pedido.",
    };
  }
  if (mode === "pending") {
    return {
      badge: "PAGO PENDIENTE",
      title: "Pedido recibido ✅",
      desc: "Estamos verificando tu pago. Apenas se confirme, te avisamos por correo.",
    };
  }
  return {
    badge: "PAGO NO CONFIRMADO",
    title: "No se pudo confirmar el pago",
    desc: "Tu pago fue rechazado o no se completó. Puedes intentarlo nuevamente.",
  };
}

export function buildOrderEmailHtml({
  order,
  mode,
  siteUrl,
}: {
  order: Order;
  mode: EmailMode;
  siteUrl: string;
}) {
  const s = statusCopy(mode);

  const items = Array.isArray(order.items) ? order.items : [];
  const itemsHtml =
    items.length === 0
      ? `<div style="padding:14px;border:1px solid #eee;border-radius:12px;color:#666;">No hay items.</div>`
      : items
          .map((it) => {
            const img = it.image
              ? `<img src="${it.image}" width="64" height="64" style="border-radius:12px;object-fit:cover;border:1px solid #eee;" />`
              : `<div style="width:64px;height:64px;border-radius:12px;border:1px solid #eee;background:#f6f6f6;"></div>`;

            const variants = [
              it.color_name ? `Color: ${it.color_name}` : null,
              it.size_label ? `Talla: ${it.size_label}` : null,
            ]
              .filter(Boolean)
              .join(" · ");

            return `
              <div style="display:flex;gap:14px;align-items:center;padding:14px;border:1px solid #eee;border-radius:14px;margin-bottom:12px;">
                ${img}
                <div style="flex:1;">
                  <div style="font-weight:700;color:#111;line-height:1.2;">${it.title}</div>
                  <div style="color:#666;font-size:13px;margin-top:4px;">${variants || ""}</div>
                  <div style="color:#111;font-size:13px;margin-top:6px;">
                    Cant: <b>${it.qty}</b> · Precio: <b>${money(it.unit_price)}</b>
                  </div>
                </div>
              </div>
            `;
          })
          .join("");

  const location = [order.dep_name, order.prov_name, order.dist_name]
    .filter(Boolean)
    .join(" / ");

  const trackUrl = `${siteUrl}/checkout/${mode}?external_reference=${encodeURIComponent(
    order.external_reference
  )}`;

  const primaryBtn =
    mode === "failure"
      ? `${siteUrl}/checkout`
      : `${siteUrl}/checkout/pending?external_reference=${encodeURIComponent(
          order.external_reference
        )}`;

  const primaryText = mode === "failure" ? "Intentar de nuevo" : "Ver mi pedido";

  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Smiggle Perú</title>
    </head>
    <body style="margin:0;background:#f5f6f7;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;">
      <div style="max-width:720px;margin:0 auto;padding:28px 16px;">
        <div style="background:#fff;border-radius:18px;overflow:hidden;border:1px solid #eee;">
          <div style="padding:22px 22px 12px 22px;border-bottom:1px solid #eee;">
            <div style="display:flex;justify-content:space-between;gap:12px;align-items:center;">
              <div style="font-weight:900;font-size:18px;color:#111;">Smiggle Perú</div>
              <div style="font-size:12px;font-weight:800;letter-spacing:.08em;padding:8px 12px;border-radius:999px;background:#111;color:#fff;">
                ${s.badge}
              </div>
            </div>
            <div style="margin-top:14px;font-size:22px;font-weight:900;color:#111;">${s.title}</div>
            <div style="margin-top:8px;color:#555;line-height:1.5;">${s.desc}</div>
            <div style="margin-top:10px;color:#777;font-size:12px;">
              Referencia: <b style="color:#111;">${order.external_reference}</b>
            </div>
          </div>

          <div style="padding:22px;">
            <div style="display:grid;grid-template-columns:1.2fr .8fr;gap:18px;">
              <div>
                <div style="font-weight:900;color:#111;margin-bottom:10px;">Productos</div>
                ${itemsHtml}
              </div>

              <div>
                <div style="font-weight:900;color:#111;margin-bottom:10px;">Resumen</div>
                <div style="border:1px solid #eee;border-radius:14px;padding:14px;">
                  <div style="display:flex;justify-content:space-between;color:#444;font-size:13px;margin-bottom:8px;">
                    <span>Subtotal</span><b style="color:#111;">${money(order.subtotal)}</b>
                  </div>
                  <div style="display:flex;justify-content:space-between;color:#444;font-size:13px;margin-bottom:8px;">
                    <span>Descuento</span><b style="color:#111;">-${money(order.discount)}</b>
                  </div>
                  <div style="display:flex;justify-content:space-between;color:#444;font-size:13px;margin-bottom:10px;">
                    <span>Envío</span><b style="color:#111;">${money(order.shipping_cost)}</b>
                  </div>
                  <div style="height:1px;background:#eee;margin:10px 0;"></div>
                  <div style="display:flex;justify-content:space-between;color:#111;font-size:14px;">
                    <span style="font-weight:900;">Total</span>
                    <span style="font-weight:900;">${money(order.total)}</span>
                  </div>
                </div>

                <div style="margin-top:14px;border:1px solid #eee;border-radius:14px;padding:14px;">
                  <div style="font-weight:900;color:#111;margin-bottom:8px;">Envío</div>
                  <div style="color:#444;font-size:13px;line-height:1.45;">
                    ${location ? `<div><b>Ubicación:</b> ${location}</div>` : ""}
                    ${order.address ? `<div><b>Dirección:</b> ${order.address}</div>` : ""}
                    ${order.reference ? `<div><b>Referencia:</b> ${order.reference}</div>` : ""}
                    ${order.carrier ? `<div><b>Carrier:</b> ${order.carrier}</div>` : ""}
                    ${order.shipping_type ? `<div><b>Tipo:</b> ${order.shipping_type}</div>` : ""}
                  </div>
                </div>

                <div style="margin-top:14px;text-align:center;">
                  <a href="${primaryBtn}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 18px;border-radius:12px;font-weight:900;">
                    ${primaryText}
                  </a>
                  <div style="margin-top:10px;font-size:12px;color:#777;">
                    También puedes revisar tu pedido aquí:
                    <a href="${trackUrl}" style="color:#111;font-weight:800;text-decoration:underline;">ver estado</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style="padding:16px 22px;border-top:1px solid #eee;color:#777;font-size:12px;line-height:1.5;">
            Si no hiciste esta compra, ignora este correo o contáctanos por WhatsApp.
          </div>
        </div>
      </div>
    </body>
  </html>`;
}
