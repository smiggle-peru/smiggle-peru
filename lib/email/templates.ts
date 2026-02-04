type EmailItem = {
  title: string;
  qty: number;
  unit_price: number;
  image?: string | null;
  color_name?: string | null;
  size_label?: string | null;
};

function money(n: number) {
  return `S/ ${Number(n || 0).toFixed(2)}`;
}

function esc(s: any) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 👇 “chip” visual pro
function badgeHtml(label: string, kind: "success" | "pending" | "failure") {
  const bg =
    kind === "success" ? "#ECFDF5" : kind === "pending" ? "#FFFBEB" : "#FEF2F2";
  const border =
    kind === "success" ? "#A7F3D0" : kind === "pending" ? "#FDE68A" : "#FECACA";
  const text =
    kind === "success" ? "#065F46" : kind === "pending" ? "#92400E" : "#991B1B";

  return `<span style="display:inline-flex;align-items:center;gap:8px;padding:8px 12px;border-radius:999px;background:${bg};border:1px solid ${border};color:${text};font-weight:900;font-size:12px;letter-spacing:.02em">${esc(
    label
  )}</span>`;
}

// 👇 “bloque” elegante tipo retail líder
function card(title: string, body: string) {
  return `
  <div style="border:1px solid #E5E7EB;border-radius:16px;padding:16px;background:#FFFFFF">
    <div style="font-weight:900;color:#111827;font-size:14px;margin-bottom:10px">${esc(
      title
    )}</div>
    ${body}
  </div>`;
}

export function buildOrderEmailHtml(args: {
  brandName?: string; // Smiggle Perú
  headline: string; // Pago aprobado
  statusBadge: { label: string; kind: "success" | "pending" | "failure" };
  intro: string; // texto corto pro
  external_reference: string;

  customerName: string;
  email: string;

  items: EmailItem[];

  subtotal: number;
  shipping: number;
  discount: number;
  total: number;

  shippingInfo?: {
    dep?: string | null;
    prov?: string | null;
    dist?: string | null;
    address?: string | null;
    reference?: string | null;
    carrier?: string | null;
    shipping_type?: string | null;
  };

  ctaUrl: string;
  ctaLabel?: string;

  footerNote?: string;
}) {
  const brand = args.brandName || "Smiggle Perú";

  const itemsHtml =
    (args.items || []).length === 0
      ? `<div style="color:#6B7280;font-size:13px">No se encontraron productos en el pedido.</div>`
      : (args.items || [])
          .map((it) => {
            const meta = [
              it.color_name ? `Color: ${esc(it.color_name)}` : null,
              it.size_label ? `Talla: ${esc(it.size_label)}` : null,
              `Cant: ${esc(it.qty)}`,
            ]
              .filter(Boolean)
              .join(" · ");

            const img = it.image
              ? `<img src="${esc(
                  it.image
                )}" width="64" height="64" style="border-radius:14px;object-fit:cover;border:1px solid #E5E7EB;display:block" />`
              : `<div style="width:64px;height:64px;border-radius:14px;background:#F3F4F6;border:1px solid #E5E7EB"></div>`;

            return `
            <div style="display:flex;gap:12px;align-items:flex-start;padding:12px 0;border-top:1px solid #F3F4F6">
              <div style="width:64px;flex:0 0 64px">${img}</div>
              <div style="flex:1;min-width:0">
                <div style="font-weight:900;color:#111827;font-size:13px;line-height:1.25">${esc(
                  it.title
                )}</div>
                <div style="color:#6B7280;font-size:12px;margin-top:6px">${meta}</div>
              </div>
              <div style="font-weight:900;color:#111827;font-size:13px;white-space:nowrap">${money(
                (it.unit_price || 0) * (it.qty || 0)
              )}</div>
            </div>`;
          })
          .join("");

  const totalsHtml = `
    <div style="display:flex;justify-content:space-between;gap:12px;color:#6B7280;font-size:13px">
      <div>Subtotal</div><div style="font-weight:900;color:#111827">${money(
        args.subtotal
      )}</div>
    </div>
    <div style="display:flex;justify-content:space-between;gap:12px;color:#6B7280;font-size:13px;margin-top:10px">
      <div>Envío</div><div style="font-weight:900;color:#111827">${money(
        args.shipping
      )}</div>
    </div>
    <div style="display:flex;justify-content:space-between;gap:12px;color:#6B7280;font-size:13px;margin-top:10px">
      <div>Descuento</div><div style="font-weight:900;color:#111827">- ${money(
        args.discount
      )}</div>
    </div>
    <div style="height:1px;background:#E5E7EB;margin:14px 0"></div>
    <div style="display:flex;justify-content:space-between;gap:12px;color:#111827;font-size:14px">
      <div style="font-weight:900">Total</div><div style="font-weight:900">${money(
        args.total
      )}</div>
    </div>
  `;

  const ship = args.shippingInfo;
  const shippingHtml = ship
    ? `
      <div style="color:#111827;font-size:13px;line-height:1.55">
        <div><b>Ubicación:</b> ${esc(ship.dep || "")}${
        ship.prov ? `, ${esc(ship.prov)}` : ""
      }${ship.dist ? `, ${esc(ship.dist)}` : ""}</div>
        <div style="margin-top:6px"><b>Dirección:</b> ${esc(
          ship.address || ""
        )}</div>
        ${
          ship.reference
            ? `<div style="margin-top:6px"><b>Referencia:</b> ${esc(
                ship.reference
              )}</div>`
            : ""
        }
        ${
          ship.carrier
            ? `<div style="margin-top:6px"><b>Carrier:</b> ${esc(
                ship.carrier
              )}</div>`
            : ""
        }
        ${
          ship.shipping_type
            ? `<div style="margin-top:6px"><b>Tipo de envío:</b> ${esc(
                ship.shipping_type
              )}</div>`
            : ""
        }
      </div>
    `
    : `<div style="color:#6B7280;font-size:13px">Detalle de envío no disponible.</div>`;

  const ctaLabel = args.ctaLabel || "Ver estado de mi compra";

  return `
  <div style="background:#F6F7F9;padding:28px">
    <div style="max-width:720px;margin:0 auto">
      <div style="background:#FFFFFF;border:1px solid #E5E7EB;border-radius:20px;overflow:hidden">
        
        <!-- Header -->
        <div style="padding:22px 22px 12px 22px">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
            <div>
              <div style="font-weight:1000;color:#111827;font-size:12px;letter-spacing:.18em;text-transform:uppercase">${esc(
                brand
              )}</div>
              <div style="font-weight:1000;color:#111827;font-size:22px;line-height:1.15;margin-top:8px">${esc(
                args.headline
              )}</div>
              <div style="color:#6B7280;font-size:13px;margin-top:8px">${esc(
                args.intro
              )}</div>
            </div>
            <div>${badgeHtml(args.statusBadge.label, args.statusBadge.kind)}</div>
          </div>

          <div style="margin-top:14px;color:#6B7280;font-size:12px">
            Referencia: <b style="color:#111827">${esc(
              args.external_reference
            )}</b>
          </div>
        </div>

        <!-- Body -->
        <div style="padding:18px 22px 22px 22px">
          ${card(
            "Resumen del pedido",
            `<div style="color:#111827;font-size:13px;line-height:1.6;margin-bottom:10px">
              Cliente: <b>${esc(args.customerName)}</b><br/>
              Correo: <b>${esc(args.email)}</b>
            </div>
            <div style="border-top:1px solid #F3F4F6;margin-top:10px">
              ${itemsHtml}
            </div>`
          )}

          <div style="margin-top:14px">
            ${card("Totales", totalsHtml)}
          </div>

          <div style="margin-top:14px">
            ${card("Envío", shippingHtml)}
          </div>

          <!-- CTA -->
          <div style="margin-top:18px">
            <a href="${esc(
              args.ctaUrl
            )}" style="display:block;text-align:center;background:#111827;color:#FFFFFF;text-decoration:none;padding:14px 16px;border-radius:14px;font-weight:1000;font-size:13px">
              ${esc(ctaLabel)}
            </a>
            <div style="text-align:center;color:#9CA3AF;font-size:12px;margin-top:10px">
              Si el botón no funciona, copia y pega este link:<br/>
              <span style="color:#6B7280">${esc(args.ctaUrl)}</span>
            </div>
          </div>

          <div style="margin-top:18px;color:#9CA3AF;font-size:12px;line-height:1.45">
            ${esc(
              args.footerNote ||
                "Este correo fue generado automáticamente por tu compra en Smiggle Perú."
            )}
          </div>
        </div>
      </div>

      <div style="text-align:center;color:#9CA3AF;font-size:12px;margin-top:14px">
        © ${new Date().getFullYear()} ${esc(brand)} · Lima, Perú
      </div>
    </div>
  </div>
  `;
}
