import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { scrapeAllStores, getCampaignLinkDeals } from "@/lib/scrapers/scrape-store";
import { aiParseDeals } from "@/lib/scrapers/ai-parser";
import { STORE_CONFIGS } from "@/lib/scrapers/stores";
import type { ScrapedDeal } from "@/lib/scrapers/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const maxDuration = 60; // Allow up to 60s for scraping

export async function POST(request: Request) {
  // Verify cron secret or allow in development
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const runStart = new Date().toISOString();

  // Log scrape run start
  const { data: runData } = await supabase
    .from("scrape_runs")
    .insert({
      started_at: runStart,
      status: "running",
      stores_attempted: STORE_CONFIGS.map((s) => s.slug),
    })
    .select()
    .single();

  const runId = runData?.id;

  try {
    // Step 1: Scrape all stores with cheerio
    const results = await scrapeAllStores();

    // Step 2: For failed scrapes, try AI parser
    const allDeals: ScrapedDeal[] = [];
    const storeStatuses: Record<string, string> = {};

    for (const result of results) {
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
            // AI parser also failed, keep original status
          }
        }
      }
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
        last_scraped_at: runStart,
        is_active: true,
      }));

      await supabase.from("deals").insert(dealsToInsert);
    }

    // Step 5: Update scrape run log
    const successCount = Object.values(storeStatuses).filter(
      (s) => s === "success" || s === "ai_parsed"
    ).length;

    if (runId) {
      await supabase
        .from("scrape_runs")
        .update({
          completed_at: new Date().toISOString(),
          status: successCount > 0 ? "completed" : "failed",
          stores_succeeded: Object.entries(storeStatuses)
            .filter(([, s]) => s === "success" || s === "ai_parsed")
            .map(([slug]) => slug),
          total_deals_found: allDeals.length,
          error_details: Object.entries(storeStatuses)
            .filter(([, s]) => s === "failed" || s === "blocked")
            .reduce(
              (acc, [slug, status]) => ({ ...acc, [slug]: status }),
              {} as Record<string, string>
            ),
        })
        .eq("id", runId);
    }

    return NextResponse.json({
      success: true,
      totalDeals: allDeals.length,
      storeStatuses,
      duration_ms: Date.now() - new Date(runStart).getTime(),
    });
  } catch (err) {
    // Update run as failed
    if (runId) {
      await supabase
        .from("scrape_runs")
        .update({
          completed_at: new Date().toISOString(),
          status: "failed",
          error_details: {
            message: err instanceof Error ? err.message : "Unknown error",
          },
        })
        .eq("id", runId);
    }

    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Scrape failed" },
      { status: 500 }
    );
  }
}
