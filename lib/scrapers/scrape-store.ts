import * as cheerio from "cheerio";
import { STORE_CONFIGS, LINK_ONLY_STORES, type StoreScraperConfig } from "./stores";
import type { ScrapedDeal, ScraperResult } from "./types";

const MAX_RETRIES = 2;
const FETCH_TIMEOUT = 15000; // 15s

async function fetchWithRetry(
  url: string,
  headers: Record<string, string>,
  retries = MAX_RETRIES
): Promise<string | null> {
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

      const res = await fetch(url, {
        headers,
        signal: controller.signal,
        redirect: "follow",
      });
      clearTimeout(timeout);

      if (!res.ok) {
        if (res.status === 403 || res.status === 429) return null; // blocked
        if (i < retries) continue;
        return null;
      }

      return await res.text();
    } catch {
      if (i < retries) continue;
      return null;
    }
  }
  return null;
}

function cleanText(text: string | undefined): string {
  if (!text) return "";
  return text.replace(/\s+/g, " ").trim();
}

function parsePrice(text: string | undefined): number | undefined {
  if (!text) return undefined;
  // Handle Turkish price format: 1.234,56 TL or 1234.56
  const cleaned = text
    .replace(/[^\d.,]/g, "")
    .replace(/\.(?=\d{3})/g, "") // remove thousands separator
    .replace(",", "."); // Turkish decimal to standard
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : num;
}

function parseDiscount(text: string | undefined): number | undefined {
  if (!text) return undefined;
  const match = text.match(/(\d+)\s*%/);
  return match ? parseInt(match[1], 10) : undefined;
}

function resolveUrl(href: string | undefined, baseUrl: string): string | undefined {
  if (!href) return undefined;
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return undefined;
  }
}

function scrapeWithCheerio(
  html: string,
  config: StoreScraperConfig
): ScrapedDeal[] {
  const $ = cheerio.load(html);
  const deals: ScrapedDeal[] = [];
  const baseUrl = new URL(config.campaignUrl).origin;
  const seen = new Set<string>();

  $(config.selectors.dealContainer).each((_, el) => {
    const $el = $(el);

    const title = cleanText($el.find(config.selectors.title).first().text());
    if (!title || title.length < 3) return;

    // Deduplicate
    const key = title.toLowerCase().slice(0, 50);
    if (seen.has(key)) return;
    seen.add(key);

    const deal: ScrapedDeal = {
      store_slug: config.slug,
      store_name: config.name,
      campaign_title: title,
      campaign_url: config.campaignUrl,
      source_type: "scraped",
    };

    if (config.selectors.price) {
      deal.sale_price = parsePrice($el.find(config.selectors.price).first().text());
    }
    if (config.selectors.originalPrice) {
      deal.original_price = parsePrice($el.find(config.selectors.originalPrice).first().text());
    }
    if (config.selectors.discountPercent) {
      deal.discount_percent = parseDiscount(
        $el.find(config.selectors.discountPercent).first().text()
      );
    }

    // Calculate discount if we have both prices
    if (deal.original_price && deal.sale_price && !deal.discount_percent) {
      deal.discount_percent = Math.round(
        ((deal.original_price - deal.sale_price) / deal.original_price) * 100
      );
    }

    if (config.selectors.image) {
      const img = $el.find(config.selectors.image).first();
      const src = img.attr("src") || img.attr("data-src") || img.attr("data-lazy-src");
      deal.image_url = resolveUrl(src, baseUrl);
    }

    if (config.selectors.link) {
      const href = $el.find(config.selectors.link).first().attr("href");
      if (href) {
        deal.campaign_url = resolveUrl(href, baseUrl) || config.campaignUrl;
      }
    }

    // Try to extract brand from title
    const brandMatch = title.match(
      /^(L'Oréal|Maybelline|MAC|NYX|Flormar|Golden Rose|Pastel|Farmasi|Avon|Garnier|Neutrogena|La Roche[- ]Posay|Vichy|Bioderma|Nivea|Dove|Pantene|Head\s*&\s*Shoulders|Kérastase|Moroccanoil)/i
    );
    if (brandMatch) {
      deal.brand = brandMatch[1];
      deal.product_name = title.replace(brandMatch[0], "").trim();
    } else {
      deal.product_name = title;
    }

    deals.push(deal);
  });

  return deals;
}

export async function scrapeStore(config: StoreScraperConfig): Promise<ScraperResult> {
  const start = Date.now();

  const html = await fetchWithRetry(config.campaignUrl, config.headers || {});

  if (!html) {
    return {
      store_slug: config.slug,
      status: "blocked",
      deals: [],
      error: "Failed to fetch page (blocked or timeout)",
      duration_ms: Date.now() - start,
    };
  }

  try {
    const deals = scrapeWithCheerio(html, config);

    if (deals.length === 0) {
      return {
        store_slug: config.slug,
        status: "failed",
        deals: [],
        error: "No deals found with current selectors",
        duration_ms: Date.now() - start,
      };
    }

    return {
      store_slug: config.slug,
      status: "success",
      deals,
      duration_ms: Date.now() - start,
    };
  } catch (err) {
    return {
      store_slug: config.slug,
      status: "failed",
      deals: [],
      error: err instanceof Error ? err.message : "Unknown parse error",
      duration_ms: Date.now() - start,
    };
  }
}

export async function scrapeAllStores(): Promise<ScraperResult[]> {
  const results = await Promise.allSettled(
    STORE_CONFIGS.map((config) => scrapeStore(config))
  );

  return results.map((r, i) =>
    r.status === "fulfilled"
      ? r.value
      : {
          store_slug: STORE_CONFIGS[i].slug,
          status: "failed" as const,
          deals: [],
          error: r.reason?.message || "Promise rejected",
          duration_ms: 0,
        }
  );
}

// Generate campaign link deals for link-only stores
export function getCampaignLinkDeals(): ScrapedDeal[] {
  const linkStores: Record<string, { name: string; url: string; title: string }> = {
    sephora: {
      name: "Sephora",
      url: "https://www.sephora.com.tr/kampanyalar",
      title: "Sephora Kampanyaları",
    },
    mac: {
      name: "MAC Cosmetics",
      url: "https://www.maccosmetics.com.tr/offers",
      title: "MAC Özel Teklifler",
    },
  };

  return Object.entries(linkStores).map(([slug, info]) => ({
    store_slug: slug,
    store_name: info.name,
    campaign_title: info.title,
    campaign_url: info.url,
    source_type: "campaign_link" as const,
  }));
}
