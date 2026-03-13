import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const store = searchParams.get("store");
  const category = searchParams.get("category");

  let query = supabase
    .from("deals")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(100);

  if (store) {
    query = query.eq("store_slug", store);
  }
  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Also fetch retailer configs for campaign links
  const { data: retailers } = await supabase
    .from("retailer_configs")
    .select("*")
    .order("store_name");

  // Last scrape info
  const { data: lastRun } = await supabase
    .from("scrape_runs")
    .select("created_at, status")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return NextResponse.json(
    {
      deals: data || [],
      retailers: retailers || [],
      lastScrape: lastRun?.created_at || null,
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=1800",
      },
    }
  );
}
