"use client";

import { useMemo } from "react";
import Fuse from "fuse.js";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/ProductGrid";

type Item = {
  id: string;
  title: string;
  slug: string;
  details?: any;
  card: {
    image: string | null;
    price_now: number | null;
    price_before: number | null;
    color_slug?: string | null;
  };
  // ✅ campos extra para búsqueda (no afectan UI)
  _search?: {
    title: string;
    slug: string;
    keywords: string;
    detail: string;
  };
};

function normalize(text: string) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .trim();
}

function expandQuery(q: string) {
  const s = normalize(q);
  if (s.includes("tupper") || s.includes("tuper")) return q + " taper";
  if (s.includes("taper")) return q + " tupper tuper";
  return q;
}

export default function SearchResults({ items }: { items: Item[] }) {
  const params = useSearchParams();
  const qRaw = (params.get("q") || "").trim();
  const q = normalize(expandQuery(qRaw));

  // ✅ Creamos una “vista” de búsqueda normalizada
  const indexed = useMemo(() => {
    return items.map((it) => {
      const keywordsArr = it?.details?.seo?.keywords;
      const keywords =
        Array.isArray(keywordsArr) ? keywordsArr.join(" ") : String(keywordsArr || "");

      const detail = String(it?.details?.detail_text || "");

      return {
        ...it,
        _search: {
          title: normalize(it.title),
          slug: normalize(it.slug),
          keywords: normalize(keywords),
          detail: normalize(detail),
        },
      };
    });
  }, [items]);

  const fuse = useMemo(() => {
    return new Fuse(indexed, {
      keys: ["_search.title", "_search.slug", "_search.keywords", "_search.detail"],
      threshold: 0.35,
      minMatchCharLength: 2,
      ignoreLocation: true,
    });
  }, [indexed]);

  const results = useMemo(() => {
    if (!q) return indexed;
    return fuse.search(q).map((r) => r.item);
  }, [q, fuse, indexed]);

  return <ProductGrid items={results} />;
}
