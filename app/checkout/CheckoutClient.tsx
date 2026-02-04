"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  getDepartments,
  getProvincesByDepartment,
  getDistrictsByProvince,
  type UbigeoOption,
} from "@/lib/ubigeo";
import { useCart } from "@/lib/store/cart";

type ShippingType =
  | "lima_regular"
  | "lima_express"
  | "provincia_regular"
  | null;

type DocType = "DNI" | "CE" | "PAS";
type ReceiptType = "boleta" | "factura";

function money(n: number) {
  return `S/ ${Number(n || 0).toFixed(2)}`;
}

const pretty = (s: string) => {
  const t = (s || "").trim();
  if (!t) return "";
  return t.charAt(0).toUpperCase() + t.slice(1);
};

// ✅ TU ITEM REAL DEL STORE
type CartItem = {
  key: string;
  product_id: string;
  title: string;
  slug: string;
  image: string | null;
  price_now: number;
  qty: number;

  color_slug?: string | null;
  color_name?: string | null;
  size_label?: string | null;
};

export default function CheckoutClient() {
  // ✅ Hooks SIEMPRE arriba
  const [mounted, setMounted] = useState(false);

  const cart = useCart();
  const items = (cart?.items ?? []) as CartItem[];

  // ✅ Pago MP (loading)
  const [paying, setPaying] = useState(false);

  // UBIGEO
  const [departments, setDepartments] = useState<UbigeoOption[]>([]);
  const [provinces, setProvinces] = useState<UbigeoOption[]>([]);
  const [districts, setDistricts] = useState<UbigeoOption[]>([]);
  const [dep, setDep] = useState("");
  const [prov, setProv] = useState("");
  const [dist, setDist] = useState("");

  // Cliente
  const [fullName, setFullName] = useState("");
  const [docType, setDocType] = useState<DocType>("DNI");
  const [docNumber, setDocNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Dirección
  const [address, setAddress] = useState("");
  const [reference, setReference] = useState("");

  // Comprobante
  const [receiptType, setReceiptType] = useState<ReceiptType>("boleta");
  const [ruc, setRuc] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [direccionFiscal, setDireccionFiscal] = useState("");

  // T&C
  const [agree, setAgree] = useState(false);

  // Shipping
  const [shippingType, setShippingType] = useState<ShippingType>(null);

  // UI
  const [submitted, setSubmitted] = useState(false);

  // ===== CUPÓN
  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [showCoupon, setShowCoupon] = useState(false);
  const [discount, setDiscount] = useState(0); // total descuento en S/

  useEffect(() => setMounted(true), []);

  // ✅ Modal: cerrar con ESC + bloquear scroll
  useEffect(() => {
    if (!showCoupon) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowCoupon(false);
    };

    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [showCoupon]);

  // Load departments once
  useEffect(() => {
    try {
      setDepartments(getDepartments());
    } catch (e) {
      console.error("UBIGEO load error:", e);
      setDepartments([]);
    }
  }, []);

  // When department changes → provinces
  useEffect(() => {
    if (!dep) {
      setProvinces([]);
      setProv("");
      setDistricts([]);
      setDist("");
      setShippingType(null);
      return;
    }
    const next = getProvincesByDepartment(dep);
    setProvinces(next);
    setProv("");
    setDistricts([]);
    setDist("");
    setShippingType(null);
  }, [dep]);

  // When province changes → districts
  useEffect(() => {
    if (!prov) {
      setDistricts([]);
      setDist("");
      return;
    }
    const next = getDistrictsByProvince(prov);
    setDistricts(next);
    setDist("");
  }, [prov]);

  // ===== Persistencia (para que no se borre al recargar)
  useEffect(() => {
    if (!mounted) return;
    try {
      const raw = localStorage.getItem("checkout-form-smiggle");
      if (!raw) return;
      const saved = JSON.parse(raw);

      setFullName(saved.fullName ?? "");
      setDocType(saved.docType ?? "DNI");
      setDocNumber(saved.docNumber ?? "");
      setPhone(saved.phone ?? "");
      setEmail(saved.email ?? "");

      setDep(saved.dep ?? "");
      setProv(saved.prov ?? "");
      setDist(saved.dist ?? "");

      setAddress(saved.address ?? "");
      setReference(saved.reference ?? "");

      setReceiptType(saved.receiptType ?? "boleta");
      setRuc(saved.ruc ?? "");
      setRazonSocial(saved.razonSocial ?? "");
      setDireccionFiscal(saved.direccionFiscal ?? "");

      setAgree(Boolean(saved.agree ?? false));
      setShippingType(saved.shippingType ?? null);

      // cupón
      setCoupon(saved.coupon ?? "");
      setAppliedCoupon(saved.appliedCoupon ?? null);
      setDiscount(Number(saved.discount ?? 0));
    } catch {
      // ignore
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const payload = {
      fullName,
      docType,
      docNumber,
      phone,
      email,
      dep,
      prov,
      dist,
      address,
      reference,
      receiptType,
      ruc,
      razonSocial,
      direccionFiscal,
      agree,
      shippingType,
      // cupón
      coupon,
      appliedCoupon,
      discount,
    };
    try {
      localStorage.setItem("checkout-form-smiggle", JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [
    mounted,
    fullName,
    docType,
    docNumber,
    phone,
    email,
    dep,
    prov,
    dist,
    address,
    reference,
    receiptType,
    ruc,
    razonSocial,
    direccionFiscal,
    agree,
    shippingType,
    coupon,
    appliedCoupon,
    discount,
  ]);

  // ✅ SUBTOTAL usando tu store real: qty + price_now
  const { totalUnits, subtotal } = useMemo(() => {
    let u = 0;
    let s = 0;
    for (const it of items) {
      const qty = Number(it.qty ?? 0);
      const price = Number(it.price_now ?? 0);
      u += qty;
      s += qty * price;
    }
    return { totalUnits: u, subtotal: s };
  }, [items]);

  // ✅ Labels ubigeo
  const depLabel = useMemo(
    () => departments.find((x) => x.id === dep)?.name ?? "",
    [departments, dep]
  );

  const provLabel = useMemo(
    () => provinces.find((x) => x.id === prov)?.name ?? "",
    [provinces, prov]
  );

  const distLabel = useMemo(
    () => districts.find((x) => x.id === dist)?.name ?? "",
    [districts, dist]
  );

  // ✅ Lima/Callao
  const isLimaCallao = useMemo(() => {
    const n = depLabel.trim().toLowerCase();
    return n === "lima" || n === "callao";
  }, [depLabel]);

  // Si estoy en provincia y estaba express, lo bajo
  useEffect(() => {
    if (depLabel && !isLimaCallao && shippingType === "lima_express") {
      setShippingType("provincia_regular");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depLabel, isLimaCallao]);

  const shippingCost = useMemo(() => {
    if (!shippingType) return 0;
    if (shippingType === "lima_regular") return 12;
    if (shippingType === "lima_express") return 20;
    if (shippingType === "provincia_regular") return 16;
    return 0;
  }, [shippingType]);

  const carrier = useMemo(() => {
    if (!depLabel) return "";
    return isLimaCallao ? "Urbano Express" : "Shalom";
  }, [depLabel, isLimaCallao]);

  // ✅ total (descuento SOLO a productos)
  const safeDiscount = useMemo(() => {
    const s = Number(subtotal || 0);
    const d = Number(discount || 0);
    if (s <= 0 || d <= 0) return 0;
    return Math.min(d, s);
  }, [subtotal, discount]);

  const total = useMemo(() => {
    const s = Number(subtotal || 0);
    return Math.max(0, s - safeDiscount) + Number(shippingCost || 0);
  }, [subtotal, safeDiscount, shippingCost]);

  // ✅ Evita hidratación (0 soles)
  const safeSubtotal = mounted ? subtotal : 0;
  const safeUnits = mounted ? totalUnits : 0;

  // ===== Validaciones
  const validarDocumento = () => {
    const n = docNumber.trim();
    if (docType === "DNI") return /^\d{8}$/.test(n);
    if (docType === "CE") return /^[A-Za-z0-9]{8,12}$/.test(n);
    return /^[A-Za-z0-9]{6,12}$/.test(n);
  };

  const validarTelefono = () => /^\d{9}$/.test(phone.trim().replace(/\D/g, ""));
  const validarEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const validarRUC = () => /^\d{11}$/.test(ruc.trim());

  const handleDoc = (v: string) => {
    if (docType === "DNI") setDocNumber(v.replace(/\D/g, "").slice(0, 8));
    else if (docType === "CE")
      setDocNumber(v.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12));
    else setDocNumber(v.replace(/[^a-zA-Z0-9]/g, "").slice(0, 12));
  };

  const handleTel = (v: string) => setPhone(v.replace(/\D/g, "").slice(0, 9));

  const faltantes = useMemo(() => {
    const f: string[] = [];
    if (items.length === 0) f.push("Carrito");
    if (fullName.trim().length < 3) f.push("Nombre completo");
    if (!validarDocumento())
      f.push(
        docType === "DNI"
          ? "DNI (8 dígitos)"
          : docType === "CE"
          ? "CE (8–12)"
          : "Pasaporte (6–12)"
      );
    if (!validarTelefono()) f.push("Celular (9 dígitos)");
    if (!validarEmail()) f.push("Correo");
    if (!dep) f.push("Departamento");
    if (!prov) f.push("Provincia");
    if (!dist) f.push("Distrito");
    if (address.trim().length < 6) f.push("Dirección");

    if (depLabel) {
      if (isLimaCallao) {
        if (shippingType !== "lima_regular" && shippingType !== "lima_express")
          f.push("Tipo de envío (Lima/Callao)");
      } else {
        if (shippingType !== "provincia_regular")
          f.push("Tipo de envío (Provincia)");
      }
    }

    if (receiptType === "factura") {
      if (!validarRUC()) f.push("RUC (11 dígitos)");
      if (razonSocial.trim().length < 3) f.push("Razón social");
    }

    if (!agree) f.push("Aceptar Términos y Condiciones");

    return f;
  }, [
    items.length,
    fullName,
    docType,
    docNumber,
    phone,
    email,
    dep,
    prov,
    dist,
    address,
    depLabel,
    isLimaCallao,
    shippingType,
    receiptType,
    ruc,
    razonSocial,
    agree,
  ]);

  const canContinue = mounted && faltantes.length === 0;

  // ✅ FLUJO EXACTO:
  // 1️⃣ /api/orders/create
  // 2️⃣ /api/mercadopago/create-preference pasando external_reference
  const onContinue = async () => {
    setSubmitted(true);
    if (!canContinue) return;
    if (paying) return;

    setPaying(true);

    try {
      // ========= 1) payload completo para crear orden =========
      const payload = {
        fullName,
        docType,
        docNumber,
        phone,
        email,

        dep_id: dep,
        prov_id: prov,
        dist_id: dist,

        address,
        reference,

        receiptType,
        ruc,
        razonSocial,
        direccionFiscal,

        shippingType,
        carrier,

        shipping_cost: Number(shippingCost || 0), // ✅ OJO nombres como tu endpoint
        discount: Number(safeDiscount || 0),

        coupon: appliedCoupon,

        items: items.map((it) => ({
          product_id: it.product_id,
          title: it.title,
          qty: Number(it.qty || 0),
          unit_price: Number(it.price_now || 0), // ✅ orders/create espera unit_price
          slug: it.slug,
          image: it.image,
          color_slug: it.color_slug ?? null,
          color_name: it.color_name ?? null,
          size_label: it.size_label ?? null,
        })),

        metadata: {
          dep_name: depLabel,
          prov_name: provLabel,
          dist_name: distLabel,
          shipping_type: shippingType,
          carrier,
          receipt_type: receiptType,
          doc_type: docType,
          doc_number: docNumber,
        },
      };

      // ========= 1️⃣ Crear orden =========
      const orderRes = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const order = await orderRes.json();

      if (!order?.ok || !order?.external_reference) {
        alert("Falta external_reference");
        setPaying(false);
        return;
      }

      // ========= 2️⃣ Crear preferencia MP (PASANDO external_reference) =========
      const mpRes = await fetch("/api/mercadopago/create-preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          external_reference: order.external_reference, // 🔥 CLAVE
          order_id: order.order_id, // opcional (si tu endpoint lo acepta)
          items: items.map((it) => ({
            product_id: it.product_id,
            title: it.title,
            qty: Number(it.qty || 0),
            unit_price: Number(it.price_now || 0),
          })),
          shipping_cost: Number(shippingCost || 0),
          discount: Number(safeDiscount || 0),
          payer: {
            name: payload.fullName,
            email: payload.email,
            phone: payload.phone,
          },
        }),
      });

      const mp = await mpRes.json();

      if (!mp?.ok) {
        alert("Error iniciando pago");
        setPaying(false);
        return;
      }

      const url = mp.init_point || mp.sandbox_init_point;
      if (!url) {
        alert("No llegó init_point");
        setPaying(false);
        return;
      }

      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Error iniciando pago. Intenta nuevamente.");
      setPaying(false);
    }
  };

  // ===== CUPÓN helpers
  const applyCoupon = async () => {
    const code = coupon.trim().toUpperCase();
    setCouponMsg(null);

    if (!code) {
      setCouponMsg("Ingresa un código.");
      return;
    }

    // ✅ AHORA MANDA ITEMS (NO SUBTOTAL)
    const payloadItems = items.map((it) => ({
      product_id: it.product_id,
      qty: it.qty,
    }));

    try {
      const res = await fetch("/api/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          items: payloadItems,
        }),
      });

      const data = await res.json();

      if (!data?.ok) {
        setAppliedCoupon(null);
        setDiscount(0);
        setCouponMsg(data?.message || "Cupón inválido o expirado.");
        return;
      }

      setAppliedCoupon(data.coupon || code);
      setDiscount(Number(data.discount || 0));
      setCoupon(code);
      setCouponMsg(
        `Cupón ${data.coupon || code} aplicado (-${money(
          Number(data.discount || 0)
        )})`
      );
      setShowCoupon(false);
    } catch (err) {
      console.error("Error validando cupón:", err);
      setCouponMsg("Error validando cupón. Inténtalo nuevamente.");
    }
  };

  const removeCoupon = () => {
    setCoupon("");
    setCouponMsg(null);
    setAppliedCoupon(null);
    setDiscount(0);
    setShowCoupon(false);
  };

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-[28px] font-semibold tracking-tight text-black">
            Checkout
          </h1>
          <p className="mt-1 text-[13px] text-black/55">
            Completa tus datos para finalizar la compra.
          </p>
        </div>

        <div className="text-[13px] font-medium text-black/70">
          {safeUnits} {safeUnits === 1 ? "unidad" : "unidades"} ·{" "}
          <span className="text-black">{money(safeSubtotal)}</span>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.7fr_1fr]">
        {/* LEFT */}
        <div className="rounded-2xl border border-black/10 bg-white">
          <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
            <div className="text-[14px] font-semibold text-black">
              Datos de envío
            </div>

            <Link
              href="/carrito"
              className="text-[12px] text-black/60 hover:text-black"
            >
              Volver al carrito
            </Link>
          </div>

          {/* Productos */}
          <div className="px-6 pt-5">
            <div className="text-[12px] font-medium text-black/70">
              Productos
            </div>

            <div className="mt-3 divide-y divide-black/5 rounded-2xl border border-black/10">
              {items.length === 0 ? (
                <div className="px-4 py-4 text-[13px] text-black/55">
                  Tu carrito está vacío.
                </div>
              ) : (
                items.map((it) => {
                  const price = Number(it.price_now ?? 0);

                  const color = pretty(
                    (it.color_name ?? it.color_slug ?? "").toString().trim()
                  );

                  const size = (it.size_label ?? "").toString().trim();

                  return (
                    <div
                      key={it.key}
                      className="flex items-center gap-4 px-4 py-4"
                    >
                      <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-black/[0.03]">
                        {it.image ? (
                          <Image
                            src={it.image}
                            alt={it.title}
                            fill
                            className="object-cover"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-medium text-black">
                          {it.title}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-black/55">
                          <span>Cant.: {it.qty}</span>
                          {color ? <span>Color: {color}</span> : null}
                          {size ? <span>Talla: {size}</span> : null}
                        </div>
                      </div>

                      <div className="text-[13px] font-semibold text-black">
                        {money(price * Number(it.qty ?? 0))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Cliente */}
          <div className="px-6 pt-6">
            <div className="text-[12px] font-medium text-black/70">Cliente</div>

            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Nombre completo*">
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ej: Carlos Sanchez"
                  className="h-11 w-full rounded-xl border border-black/10 px-3 text-[13px] outline-none focus:border-black/25"
                />
              </Field>

              <Field label="Celular*">
                <input
                  value={phone}
                  onChange={(e) => handleTel(e.target.value)}
                  placeholder="Ej: 999999999"
                  className={[
                    "h-11 w-full rounded-xl border px-3 text-[13px] outline-none focus:border-black/25",
                    submitted && phone && !validarTelefono()
                      ? "border-red-400"
                      : "border-black/10",
                  ].join(" ")}
                />
                {submitted && phone && !validarTelefono() ? (
                  <div className="mt-1 text-[11px] text-red-600">
                    Teléfono inválido (9 dígitos).
                  </div>
                ) : null}
              </Field>

              <div className="md:col-span-2">
                <Field label="Correo*">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@dominio.com"
                    className={[
                      "h-11 w-full rounded-xl border px-3 text-[13px] outline-none focus:border-black/25",
                      submitted && email && !validarEmail()
                        ? "border-red-400"
                        : "border-black/10",
                    ].join(" ")}
                  />
                  {submitted && email && !validarEmail() ? (
                    <div className="mt-1 text-[11px] text-red-600">
                      Correo inválido.
                    </div>
                  ) : null}
                </Field>
              </div>

              <div className="md:col-span-2">
                <div className="grid grid-cols-3 gap-3">
                  <Field label="Tipo doc.*">
                    <select
                      value={docType}
                      onChange={(e) => {
                        setDocType(e.target.value as DocType);
                        setDocNumber("");
                      }}
                      className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-[13px] outline-none focus:border-black/25"
                    >
                      <option value="DNI">DNI</option>
                      <option value="CE">CE</option>
                      <option value="PAS">PAS</option>
                    </select>
                  </Field>

                  <div className="col-span-2">
                    <Field
                      label={
                        docType === "DNI"
                          ? "N° DNI*"
                          : docType === "CE"
                          ? "N° CE*"
                          : "N° Pasaporte*"
                      }
                    >
                      <input
                        value={docNumber}
                        onChange={(e) => handleDoc(e.target.value)}
                        className={[
                          "h-11 w-full rounded-xl border px-3 text-[13px] outline-none focus:border-black/25",
                          submitted && docNumber && !validarDocumento()
                            ? "border-red-400"
                            : "border-black/10",
                        ].join(" ")}
                        inputMode={docType === "DNI" ? "numeric" : "text"}
                        maxLength={docType === "DNI" ? 8 : 12}
                      />
                      {submitted && docNumber && !validarDocumento() ? (
                        <div className="mt-1 text-[11px] text-red-600">
                          {docType === "DNI"
                            ? "Debe tener 8 dígitos."
                            : "Usa 8–12 caracteres alfanuméricos."}
                        </div>
                      ) : null}
                    </Field>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* UBIGEO + dirección */}
          <div className="px-6 pb-6 pt-6">
            <div className="text-[12px] font-medium text-black/70">
              Ubicación y dirección
            </div>

            <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-3">
              <Field label="Departamento*">
                <select
                  value={dep}
                  onChange={(e) => setDep(e.target.value)}
                  className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-[13px] outline-none focus:border-black/25"
                >
                  <option value="">Selecciona</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Provincia*">
                <select
                  value={prov}
                  onChange={(e) => setProv(e.target.value)}
                  disabled={!dep}
                  className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-[13px] outline-none focus:border-black/25 disabled:bg-black/[0.03]"
                >
                  <option value="">
                    {dep ? "Selecciona" : "Primero departamento"}
                  </option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Distrito*">
                <select
                  value={dist}
                  onChange={(e) => setDist(e.target.value)}
                  disabled={!prov}
                  className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-[13px] outline-none focus:border-black/25 disabled:bg-black/[0.03]"
                >
                  <option value="">
                    {prov ? "Selecciona" : "Primero provincia"}
                  </option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Field label="Dirección*">
                  <input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej: Av. La Marina 123, Dpto 402"
                    className="h-11 w-full rounded-xl border border-black/10 px-3 text-[13px] outline-none focus:border-black/25"
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Referencia (opcional)">
                  <input
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Ej: Frente al parque"
                    className="h-11 w-full rounded-xl border border-black/10 px-3 text-[13px] outline-none focus:border-black/25"
                  />
                </Field>
              </div>
            </div>

            {/* Tipo de envío */}
            <div className="mt-5">
              <div className="text-[12px] font-medium text-black/70">
                Tipo de envío
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
                {isLimaCallao ? (
                  <>
                    <ShipOption
                      checked={shippingType === "lima_regular"}
                      title="Regular Lima/Callao"
                      desc="Entrega 48 a 72 horas"
                      price={12}
                      onClick={() => setShippingType("lima_regular")}
                    />
                    <ShipOption
                      checked={shippingType === "lima_express"}
                      title="Express Lima/Callao"
                      desc="Entrega el mismo día"
                      price={20}
                      onClick={() => setShippingType("lima_express")}
                    />
                  </>
                ) : (
                  <ShipOption
                    checked={shippingType === "provincia_regular"}
                    title="Regular Provincia"
                    desc="Entrega 24 a 72 horas"
                    price={16}
                    onClick={() => setShippingType("provincia_regular")}
                  />
                )}
              </div>

              {!dep ? (
                <div className="mt-2 text-[12px] text-black/45">
                  Selecciona un departamento para ver envíos.
                </div>
              ) : carrier ? (
                <div className="mt-2 text-[12px] text-black/55">
                  Envío vía{" "}
                  <span className="font-semibold text-black">{carrier}</span>.
                </div>
              ) : null}
            </div>

            {/* Comprobante */}
            <div className="mt-6">
              <div className="text-[12px] font-medium text-black/70">
                Comprobante
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {(["boleta", "factura"] as ReceiptType[]).map((rt) => (
                  <button
                    key={rt}
                    type="button"
                    onClick={() => setReceiptType(rt)}
                    className={[
                      "h-11 rounded-xl border px-3 text-[13px] font-medium transition",
                      receiptType === rt
                        ? "border-black/35 bg-black/[0.03]"
                        : "border-black/10 hover:border-black/20",
                    ].join(" ")}
                  >
                    {rt === "boleta" ? "Boleta" : "Factura"}
                  </button>
                ))}
              </div>

              {receiptType === "factura" ? (
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="RUC* (11 dígitos)">
                    <input
                      value={ruc}
                      onChange={(e) =>
                        setRuc(e.target.value.replace(/\D/g, "").slice(0, 11))
                      }
                      className={[
                        "h-11 w-full rounded-xl border px-3 text-[13px] outline-none focus:border-black/25",
                        submitted && ruc && !validarRUC()
                          ? "border-red-400"
                          : "border-black/10",
                      ].join(" ")}
                      inputMode="numeric"
                      maxLength={11}
                      placeholder="Ej: 20123456789"
                    />
                    {submitted && ruc && !validarRUC() ? (
                      <div className="mt-1 text-[11px] text-red-600">
                        RUC inválido (11 dígitos).
                      </div>
                    ) : null}
                  </Field>

                  <Field label="Razón social*">
                    <input
                      value={razonSocial}
                      onChange={(e) => setRazonSocial(e.target.value)}
                      className={[
                        "h-11 w-full rounded-xl border px-3 text-[13px] outline-none focus:border-black/25",
                        submitted &&
                        razonSocial &&
                        razonSocial.trim().length < 3
                          ? "border-red-400"
                          : "border-black/10",
                      ].join(" ")}
                      placeholder="Ej: SMIGGLE PERU SAC"
                    />
                  </Field>

                  <div className="md:col-span-2">
                    <Field label="Dirección fiscal (opcional)">
                      <input
                        value={direccionFiscal}
                        onChange={(e) => setDireccionFiscal(e.target.value)}
                        className="h-11 w-full rounded-xl border border-black/10 px-3 text-[13px] outline-none focus:border-black/25"
                        placeholder="Ej: Av. X 123, Lima"
                      />
                    </Field>
                  </div>

                  <div className="md:col-span-2 text-[12px] text-black/50">
                    Boleta: sin RUC. Factura: requiere RUC y razón social.
                  </div>
                </div>
              ) : (
                <div className="mt-2 text-[12px] text-black/50">
                  Boleta: no requiere RUC.
                </div>
              )}
            </div>

            {/* T&C */}
            <div className="mt-6 rounded-2xl border border-black/10 p-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-black/20"
                />
                <span className="text-[13px] text-black/70">
                  Acepto los{" "}
                  <Link
                    href="/terminos-y-condiciones"
                    className="underline text-black"
                  >
                    Términos y Condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link
                    href="/politicas-de-privacidad"
                    className="underline text-black"
                  >
                    Política de Privacidad
                  </Link>
                  .
                </span>
              </label>
            </div>

            {/* Faltantes */}
            {submitted && faltantes.length > 0 ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                Faltan: {faltantes.join(", ")}
              </div>
            ) : null}
          </div>
        </div>

        {/* RIGHT */}
        <div className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="text-[14px] font-semibold text-black">Resumen</div>

          {/* CUPÓN */}
          <div className="mt-4 rounded-2xl border border-black/10 p-3">
            {!appliedCoupon ? (
              <button
                type="button"
                onClick={() => {
                  setShowCoupon(true);
                  setCouponMsg(null);
                }}
                className="w-full h-10 rounded-xl border border-black/10 text-[13px] bg-white hover:border-black/20"
              >
                Agregar cupón
              </button>
            ) : (
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-2 text-[12px] px-2 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                  Cupón: <strong>{appliedCoupon}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCoupon(true);
                      setCouponMsg(null);
                    }}
                    className="h-9 rounded-xl px-3 text-[12px] bg-black/5 hover:bg-black/10"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="h-9 rounded-xl px-3 text-[12px] bg-black/10 hover:bg-black/15"
                  >
                    Quitar
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 space-y-3 text-[13px] text-black/70">
            <Row label="Subtotal" value={money(mounted ? subtotal : 0)} strong />

            {safeDiscount > 0 ? (
              <Row
                label="Descuento"
                value={
                  <span className="text-green-700">- {money(safeDiscount)}</span>
                }
              />
            ) : null}

            <Row
              label="Envío"
              value={
                shippingType ? (
                  money(shippingCost)
                ) : (
                  <span className="text-black/45">Selecciona el envío</span>
                )
              }
            />

            {depLabel && carrier ? (
              <Row
                label="Carrier"
                value={<span className="text-black">{carrier}</span>}
              />
            ) : null}

            <div className="my-3 h-px w-full bg-black/10" />
            <Row label="Total" value={money(mounted ? total : 0)} strong />
          </div>

          {/* ✅ BOTÓN */}
          <button
            disabled={!canContinue || paying}
            className="mt-5 h-12 w-full rounded-full bg-[#2f2f2f] text-[13px] font-semibold text-white transition hover:bg-[#262626] disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onContinue}
          >
            {paying ? "Abriendo MercadoPago..." : "Ir a pagar"}
          </button>

          <Link
            href="/"
            className="mt-3 flex h-11 w-full items-center justify-center rounded-full border border-black/10 text-[13px] font-medium text-black/70 hover:border-black/20 hover:text-black"
          >
            ← Seguir comprando
          </Link>

          <p className="mt-4 text-[12px] text-black/45">
            El costo de envío se calcula según tu ubicación antes de pagar.
          </p>
        </div>
      </div>

      {/* ===== Modal Cupón (BONITO + GIF) ===== */}
      {showCoupon && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowCoupon(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Cupón de descuento"
            className={[
              "relative w-full sm:max-w-md",
              "mx-0 sm:mx-4",
              "rounded-t-3xl sm:rounded-3xl",
              "bg-white shadow-2xl",
              "border border-black/10",
              "overflow-hidden",
              "animate-[modalIn_.18s_ease-out]",
            ].join(" ")}
          >
            <div className="px-5 pt-5 pb-4 border-b border-black/5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-2xl bg-black/[0.04] border border-black/10">
                    <Image
                      src="/cupon-movil.gif"
                      alt="Cupón"
                      fill
                      className="object-cover"
                      unoptimized
                      priority
                    />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold tracking-tight text-black">
                      Cupón de descuento
                    </h3>
                    <p className="mt-0.5 text-[12px] text-black/55">
                      Escribe tu cupón para validar el descuento.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCoupon(false)}
                  className="h-10 w-10 rounded-2xl border border-black/10 bg-white hover:bg-black/[0.03] grid place-items-center"
                  aria-label="Cerrar"
                  title="Cerrar"
                >
                  <span className="text-[18px] leading-none text-black/70">
                    ×
                  </span>
                </button>
              </div>
            </div>

            <div className="px-5 pt-4 pb-24">
              <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-3">
                <div className="flex items-center gap-2">
                  <input
                    className={[
                      "h-11 w-full rounded-xl",
                      "border border-black/10 bg-white",
                      "px-3 text-[13px] outline-none",
                      "focus:border-black/25 focus:ring-2 focus:ring-black/5",
                    ].join(" ")}
                    placeholder="Ej: SMIGGLE10"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        applyCoupon();
                      }
                    }}
                    autoComplete="off"
                    autoFocus
                  />

                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={!coupon.trim()}
                    className={[
                      "h-11 px-4 rounded-xl text-[13px] font-semibold",
                      "bg-[#2f2f2f] text-white",
                      "hover:bg-[#262626]",
                      "disabled:bg-black/30 disabled:cursor-not-allowed",
                      "shadow-sm",
                    ].join(" ")}
                  >
                    Aplicar
                  </button>
                </div>

                {couponMsg && (
                  <div
                    className={[
                      "mt-3 rounded-xl border px-3 py-2 text-[13px]",
                      couponMsg.includes("aplicado")
                        ? "border-green-200 bg-green-50 text-green-800"
                        : "border-red-200 bg-red-50 text-red-800",
                    ].join(" ")}
                  >
                    {couponMsg}
                  </div>
                )}

                <div className="mt-3 text-[12px] text-black/50">
                  El descuento se aplica solo a productos (no incluye envío).
                </div>
              </div>

              {appliedCoupon ? (
                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white p-3">
                  <div className="min-w-0">
                    <div className="text-[12px] text-black/55">
                      Cupón aplicado
                    </div>
                    <div className="truncate text-[13px] font-semibold text-black">
                      {appliedCoupon}{" "}
                      <span className="text-black/40">·</span>{" "}
                      <span className="text-green-700">
                        -{money(safeDiscount)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="h-10 px-3 rounded-xl text-[12px] font-medium bg-black/5 hover:bg-black/10"
                  >
                    Quitar
                  </button>
                </div>
              ) : null}
            </div>

            <div className="absolute left-0 right-0 bottom-0 p-3 bg-white border-t border-black/5">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCoupon(false)}
                  className="h-11 flex-1 rounded-xl border border-black/10 bg-white text-[13px] font-medium text-black/70 hover:border-black/20 hover:text-black"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={applyCoupon}
                  disabled={!coupon.trim()}
                  className="h-11 flex-1 rounded-xl bg-[#2f2f2f] text-[13px] font-semibold text-white hover:bg-[#262626] disabled:bg-black/30 disabled:cursor-not-allowed"
                >
                  Confirmar
                </button>
              </div>
            </div>

            <style jsx>{`
              @keyframes modalIn {
                from {
                  transform: translateY(18px);
                  opacity: 0;
                }
                to {
                  transform: translateY(0);
                  opacity: 1;
                }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-[12px] text-black/60">{label}</div>
      {children}
    </label>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-black/60">{label}</div>
      <div className={strong ? "font-semibold text-black" : "text-black"}>
        {value}
      </div>
    </div>
  );
}

function ShipOption({
  checked,
  title,
  desc,
  price,
  onClick,
}: {
  checked: boolean;
  title: string;
  desc: string;
  price: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-start justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition",
        checked
          ? "border-black/35 bg-black/[0.03]"
          : "border-black/10 hover:border-black/20",
      ].join(" ")}
    >
      <div>
        <div className="text-[13px] font-medium text-black">{title}</div>
        <div className="mt-0.5 text-[12px] text-black/55">{desc}</div>
      </div>
      <div className="text-[13px] font-semibold text-black">{money(price)}</div>
    </button>
  );
}
