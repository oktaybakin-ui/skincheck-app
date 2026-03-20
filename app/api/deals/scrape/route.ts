import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { scrapeAllStores, getCampaignLinkDeals } from "@/lib/scrapers/scrape-store";
import { scrapeAllAPIs } from "@/lib/scrapers/api-scrapers";
import { aiParseDeals } from "@/lib/scrapers/ai-parser";
import { STORE_CONFIGS } from "@/lib/scrapers/stores";
import type { ScrapedDeal } from "@/lib/scrapers/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const maxDuration = 60;

export async function POST(request: Request) {
  // Verify cron secret for external calls; allow same-origin requests (frontend refresh button)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  const referer = request.headers.get("referer") || "";
  const isSameOrigin = referer.includes("localhost") || referer.includes("vercel.app") || referer.includes("beautycheck") || referer.includes("skincheck");

  if (cronSecret && !isSameOrigin && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const runStart = Date.now();

  try {
    // Step 1a: Scrape stores with API-based scrapers (Rossmann, Trendyol, Gratis)
    const apiResults = await scrapeAllAPIs();
    const apiStores = new Set(apiResults.filter(r => r.status === "success").map(r => r.store_slug));

    // Step 1b: Scrape remaining stores with cheerio (skip stores that API already handled)
    const results = await scrapeAllStores();

    // Step 2: Merge results — API results take priority
    const allDeals: ScrapedDeal[] = [];
    const storeStatuses: Record<string, string> = {};

    // Add API results first
    for (const apiResult of apiResults) {
      storeStatuses[apiResult.store_slug] = apiResult.status === "success" ? "api_success" : apiResult.status;
      if (apiResult.status === "success" && apiResult.deals.length > 0) {
        allDeals.push(...apiResult.deals);
      }
      // Log API scrape run
      await supabase.from("scrape_runs").insert({
        store_slug: apiResult.store_slug,
        status: storeStatuses[apiResult.store_slug],
        deals_found: apiResult.deals.length,
        error_message: apiResult.error || null,
        duration_ms: apiResult.duration_ms,
      });
    }

    // Process cheerio results for stores NOT already handled by API
    for (const result of results) {
      // Skip if API already got data for this store
      if (apiStores.has(result.store_slug)) continue;

      storeStatuses[result.store_slug] = result.status;

      if (result.status === "success" && result.deals.length > 0) {
        allDeals.push(...result.deals);
      } else if (result.status === "failed") {
        // Try AI parser as fallback
        const config = STORE_CONFIGS.find((c) => c.slug === result.store_slug);
        if (config) {
          try {
            const html = await fetch(config.campaignUrl, {
              headers: config.headers || {},
            }).then((r) => (r.ok ? r.text() : null));

            if (html) {
              const aiDeals = await aiParseDeals(
                html,
                config.slug,
                config.name,
                config.campaignUrl
              );
              if (aiDeals.length > 0) {
                allDeals.push(...aiDeals);
                storeStatuses[result.store_slug] = "ai_parsed";
              }
            }
          } catch {
            // AI parser also failed
          }
        }
      }

      // Log scrape run per store (matches scrape_runs schema)
      await supabase.from("scrape_runs").insert({
        store_slug: result.store_slug,
        status: storeStatuses[result.store_slug] || result.status,
        deals_found: result.deals.length,
        error_message: result.error || null,
        duration_ms: result.duration_ms,
      });
    }

    // Step 3: Add campaign link deals (always available)
    const linkDeals = getCampaignLinkDeals();
    allDeals.push(...linkDeals);

    // Step 4: Upsert deals to Supabase
    if (allDeals.length > 0) {
      // Mark old deals as inactive
      await supabase
        .from("deals")
        .update({ is_active: false })
        .eq("is_active", true);

      // Insert new deals
      const dealsToInsert = allDeals.map((deal) => ({
        store_slug: deal.store_slug,
        store_name: deal.store_name,
        campaign_title: deal.campaign_title,
        campaign_url: deal.campaign_url,
        product_name: deal.product_name || null,
        brand: deal.brand || null,
        category: deal.category || null,
        original_price: deal.original_price || null,
        sale_price: deal.sale_price || null,
        discount_percent: deal.discount_percent || null,
        coupon_code: deal.coupon_code || null,
        valid_until: deal.valid_until || null,
        image_url: deal.image_url || null,
        source_type: deal.source_type,
        last_scraped_at: new Date().toISOString(),
        is_active: true,
      }));

      await supabase.from("deals").insert(dealsToInsert);
    }

    return NextResponse.json({
      success: true,
      totalDeals: allDeals.length,
      storeStatuses,
      duration_ms: Date.now() - runStart,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Scrape failed" },
      { status: 500 }
    );
  }
}
