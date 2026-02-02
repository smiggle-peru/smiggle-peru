import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dep = searchParams.get("dep");
  const prov = searchParams.get("prov");

  if (!dep || !prov) return NextResponse.json([], { status: 200 });

  const sb = supabaseServer();

  const { data, error } = await sb
    .from("ubigeo_districts")
    .select("code,name")
    .eq("department_code", dep)
    .eq("province_code", prov)
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
