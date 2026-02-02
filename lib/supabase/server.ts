import { createClient } from "@supabase/supabase-js";

export function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // ✅ debug claro si faltan envs
  if (!url || !key) {
    console.error("Missing Supabase env vars:", {
      NEXT_PUBLIC_SUPABASE_URL: url ? "OK" : "MISSING",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: key ? "OK" : "MISSING",
    });
    throw new Error("Supabase env vars missing (.env.local)");
  }

  // ✅ valida formato de URL (evita fetch failed por url mala)
  if (!url.startsWith("https://")) {
    throw new Error(
      `NEXT_PUBLIC_SUPABASE_URL must start with https:// (got: ${url})`
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
