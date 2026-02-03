"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Truck, RefreshCw, Info } from "lucide-react";

type DetailsJson = {
  detail_text?: string;
  shipping_text?: string;
  includes?: string[];
  subtitle?: string;
  badge?: string;
  seo?: any;
  [key: string]: any;
};

function cn(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function splitBlocks(text?: string) {
  if (!text) return [];
  return text
    .replace(/\r\n/g, "\n")
    .split("\n\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseLinesToList(block: string) {
  const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
  const isList = lines.length >= 2 && lines.every((l) => l.startsWith("- ") || l.startsWith("• "));
  if (!isList) return null;
  return lines.map((l) => l.replace(/^(- |• )/, "").trim()).filter(Boolean);
}

function RichText({ text }: { text?: string }) {
  const blocks = useMemo(() => splitBlocks(text), [text]);

  if (!text) return (
    <p className="text-sm text-gray-500">
      Aún no se ha definido información.
    </p>
  );

  return (
    <div className="space-y-4">
      {blocks.map((block, idx) => {
        const list = parseLinesToList(block);
        if (list) {
          return (
            <ul key={idx} className="ml-5 list-disc space-y-2 text-sm leading-7 text-gray-700">
              {list.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          );
        }

        return (
          <p key={idx} className="text-sm leading-7 text-gray-700">
            {block}
          </p>
        );
      })}
    </div>
  );
}

function inferChips(shippingText?: string) {
  const t = (shippingText || "").toLowerCase();

  const lima =
    t.includes("lima") || t.includes("metropolitana")
      ? "Lima: 24–48h"
      : null;

  const prov =
    t.includes("provincia") || t.includes("provincias")
      ? "Provincias: 48–72h"
      : null;

  const cambios =
    t.includes("cambio") || t.includes("cambios")
      ? "Cambios: 7 días"
      : null;

  const out = [lima, prov, cambios].filter(Boolean) as string[];
  return out.length ? out : ["Envío rápido", "Cambios disponibles"];
}

function Chip({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
      {children}
    </span>
  );
}

function AccordionItem({
  title,
  icon,
  children,
  defaultOpen = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-gray-200 bg-white text-gray-800">
            {icon}
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold uppercase tracking-[0.14em] text-gray-900">
              {title}
            </div>
            <div className="text-xs text-gray-500">Toca para ver más</div>
          </div>
        </div>

        <ChevronDown
          className={cn(
            "h-5 w-5 text-gray-500 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 pt-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ProductDetailsPanels({
  details,
}: {
  details?: DetailsJson | null;
}) {
  const detailText = details?.detail_text;
  const shippingText = details?.shipping_text;

  const chips = useMemo(() => inferChips(shippingText), [shippingText]);

  return (
    <section className="space-y-4">
      <AccordionItem
        title="Detalles"
        icon={<Info className="h-4 w-4" />}
        defaultOpen
      >
        <RichText text={detailText} />
      </AccordionItem>

      <AccordionItem
        title="Envíos y cambios"
        icon={<Truck className="h-4 w-4" />}
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {chips.map((c) => (
            <Chip key={c}>{c}</Chip>
          ))}
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700">
            <RefreshCw className="h-3.5 w-3.5" />
            Compra segura
          </span>
        </div>

        <RichText text={shippingText} />
      </AccordionItem>
    </section>
  );
}
