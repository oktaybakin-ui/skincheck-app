import { chromium, type Page } from "playwright";
import { createClient } from "@supabase/supabase-js";

// ─── Supabase Setup ─────────────────────────────────────────────────
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Types ──────────────────────────────────────────────────────────
interface ScrapedDeal {
  store_slug: string;
  store_name: string;
  campaign_title: string;
  campaign_url: string;
  product_name?: string;
  brand?: string;
  category?: string;
  original_price?: number;
  sale_price?: number;
  discount_percent?: number;
  image_url?: string;
  source_type: "scraped" | "campaign_link" | "api";
}

interface ScrapeResult {
  store_slug: string;
  status: string;
  deals: ScrapedDeal[];
  error?: string;
  duration_ms: number;
}

// ─── Helper: categorize product ─────────────────────────────────────
function categorize(text: string): string | undefined {
  const l = text.toLowerCase();
  if (/ruj|lip|dudak/.test(l)) return "makyaj";
  if (/fondöten|foundation|allık|blush|far|eyeshadow|rimel|mascara|eyeliner|kapatıcı|concealer|pudra|powder|makyaj/.test(l)) return "makyaj";
  if (/serum|krem|cream|nemlendirici|moistur|tonik|toner|temizleyici|cleanser|peeling|maske|mask|cilt|skin/.test(l)) return "cilt bakımı";
  if (/şampuan|shampoo|saç|hair|bakım kremi|conditioner/.test(l)) return "saç bakımı";
  if (/parfüm|perfume|deodorant|koku|fragrance|edp|edt/.test(l)) return "parfüm";
  if (/güneş|sun|spf/.test(l)) return "güneş";
  return undefined;
}

// ─── Helper: parse Turkish price ────────────────────────────────────
function parsePrice(text: string): number | undefined {
  if (!text) return undefined;
  // "1.299,99 TL" → 1299.99
  const cleaned = text
    .replace(/[^\d.,]/g, "")
    .replace(/\.(?=\d{3})/g, "") // remove thousand separators
    .replace(",", "."); // decimal comma to dot
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : num;
}

// ─── Watsons Scraper ────────────────────────────────────────────────
async function scrapeWatsons(page: Page): Promise<ScrapeResult> {
  const start = Date.now();
  const deals: ScrapedDeal[] = [];

  try {
    await page.goto("https://www.watsons.com.tr/kampanyalar", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForTimeout(3000);

    // Try multiple selector patterns for campaign cards
    const cards = await page.$$("a[href*='kampanya'], .campaign-item, .promotion-card, [class*='campaign'] a, .slick-slide a, article a");

    for (const card of cards.slice(0, 20)) {
      try {
        const title = await card.getAttribute("title") || await card.innerText().catch(() => "");
        const href = await card.getAttribute("href") || "";
        const img = await card.$("img");
        const imgSrc = img ? await img.getAttribute("src") || await img.getAttribute("data-src") || "" : "";

        if (!title?.trim() || title.trim().length < 5) continue;

        const fullUrl = href.startsWith("http") ? href : `https://www.watsons.com.tr${href}`;

        deals.push({
          store_slug: "watsons",
          store_name: "Watsons",
          campaign_title: title.trim(),
          campaign_url: fullUrl,
          product_name: title.trim(),
          category: categorize(title),
          image_url: imgSrc || undefined,
          source_type: "scraped",
        });
      } catch {
        // Skip individual card errors
      }
    }

    // Also try product listings if campaign page has products
    const productCards = await page.$$("[class*='product'] a, .product-card, .product-item");
    for (const card of productCards.slice(0, 15)) {
      try {
        const name = await card.$eval("[class*='name'], [class*='title'], h3, h4", (el) => el.textContent?.trim() || "").catch(() => "");
        const priceEl = await card.$("[class*='price'], .price");
        const priceText = priceEl ? await priceEl.innerText() : "";
        const href = await card.getAttribute("href") || "";
        const img = await card.$("img");
        const imgSrc = img ? await img.getAttribute("src") || "" : "";

        if (!name || name.length < 3) continue;

        deals.push({
          store_slug: "watsons",
          store_name: "Watsons",
          campaign_title: name,
          campaign_url: href.startsWith("http") ? href : `https://www.watsons.com.tr${href}`,
          product_name: name,
          category: categorize(name),
          sale_price: parsePrice(priceText),
          image_url: imgSrc || undefined,
          source_type: "scraped",
        });
      } catch {
        // Skip
      }
    }

    return { store_slug: "watsons", status: deals.length > 0 ? "success" : "no_deals", deals, duration_ms: Date.now() - start };
  } catch (err) {
    return { store_slug: "watsons", status: "failed", deals: [], error: err instanceof Error ? err.message : "Unknown", duration_ms: Date.now() - start };
  }
}

// ─── Hepsiburada Scraper ────────────────────────────────────────────
async function scrapeHepsiburada(page: Page): Promise<ScrapeResult> {
  const start = Date.now();
  const deals: ScrapedDeal[] = [];

  try {
    await page.goto("https://www.hepsiburada.com/kozmetik-kisisel-bakim-c-702?siralama=indirim", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForTimeout(4000);

    // Hepsiburada product listing
    const cards = await page.$$("[data-test-id='product-card'], .productCardContent, [class*='productCard'], li[class*='product']");

    for (const card of cards.slice(0, 25)) {
      try {
        const name = await card.$eval("[data-test-id='product-card-name'], [class*='productName'], [class*='product-title'], h3", (el) => el.textContent?.trim() || "").catch(() => "");
        const currentPrice = await card.$eval("[data-test-id='price-current-price'], [class*='price-value'], [class*='currentPrice']", (el) => el.textContent?.trim() || "").catch(() => "");
        const oldPrice = await card.$eval("[data-test-id='price-old-price'], [class*='oldPrice'], del", (el) => el.textContent?.trim() || "").catch(() => "");
        const link = await card.$("a");
        const href = link ? await link.getAttribute("href") || "" : "";
        const img = await card.$("img");
        const imgSrc = img ? await img.getAttribute("src") || await img.getAttribute("data-src") || "" : "";

        if (!name || name.length < 3) continue;

        const sale = parsePrice(currentPrice);
        const original = parsePrice(oldPrice);
        const discount = original && sale && sale < original
          ? Math.round(((original - sale) / original) * 100)
          : undefined;

        deals.push({
          store_slug: "hepsiburada",
          store_name: "Hepsiburada",
          campaign_title: name,
          campaign_url: href.startsWith("http") ? href : `https://www.hepsiburada.com${href}`,
          product_name: name,
          category: categorize(name),
          original_price: original,
          sale_price: sale,
          discount_percent: discount,
          image_url: imgSrc || undefined,
          source_type: "scraped",
        });
      } catch {
        // Skip
      }
    }

    return { store_slug: "hepsiburada", status: deals.length > 0 ? "success" : "no_deals", deals, duration_ms: Date.now() - start };
  } catch (err) {
    return { store_slug: "hepsiburada", status: "failed", deals: [], error: err instanceof Error ? err.message : "Unknown", duration_ms: Date.now() - start };
  }
}

// ─── Sephora Scraper ────────────────────────────────────────────────
async function scrapeSephora(page: Page): Promise<ScrapeResult> {
  const start = Date.now();
  const deals: ScrapedDeal[] = [];

  try {
    await page.goto("https://www.sephora.com.tr/firsatlar/", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForTimeout(3000);

    // Sephora product grid
    const cards = await page.$$("[class*='product-tile'], [class*='ProductTile'], .product-item, [class*='product-grid'] > div, article");

    for (const card of cards.slice(0, 20)) {
      try {
        const name = await card.$eval("[class*='product-name'], [class*='ProductName'], h2, h3, [class*='name']", (el) => el.textContent?.trim() || "").catch(() => "");
        const brand = await card.$eval("[class*='brand'], [class*='Brand']", (el) => el.textContent?.trim() || "").catch(() => "");
        const priceText = await card.$eval("[class*='price'], [class*='Price']", (el) => el.textContent?.trim() || "").catch(() => "");
        const link = await card.$("a");
        const href = link ? await link.getAttribute("href") || "" : "";
        const img = await card.$("img");
        const imgSrc = img ? await img.getAttribute("src") || await img.getAttribute("data-src") || "" : "";

        if (!name || name.length < 3) continue;

        // Sephora often shows "oldPrice newPrice" in same element
        const prices = priceText.match(/[\d.,]+/g);
        let sale: number | undefined;
        let original: number | undefined;

        if (prices && prices.length >= 2) {
          original = parsePrice(prices[0]);
          sale = parsePrice(prices[1]);
        } else if (prices && prices.length === 1) {
          sale = parsePrice(prices[0]);
        }

        const discount = original && sale && sale < original
          ? Math.round(((original - sale) / original) * 100)
          : undefined;

        deals.push({
          store_slug: "sephora",
          store_name: "Sephora",
          campaign_title: brand ? `${brand} - ${name}` : name,
          campaign_url: href.startsWith("http") ? href : `https://www.sephora.com.tr${href}`,
          product_name: name,
          brand: brand || undefined,
          category: categorize(name),
          original_price: original,
          sale_price: sale,
          discount_percent: discount,
          image_url: imgSrc || undefined,
          source_type: "scraped",
        });
      } catch {
        // Skip
      }
    }

    return { store_slug: "sephora", status: deals.length > 0 ? "success" : "no_deals", deals, duration_ms: Date.now() - start };
  } catch (err) {
    return { store_slug: "sephora", status: "failed", deals: [], error: err instanceof Error ? err.message : "Unknown", duration_ms: Date.now() - start };
  }
}

// ─── Main ───────────────────────────────────────────────────────────
async function main() {
  console.log("🚀 Starting Playwright deal scraper...");
  const totalStart = Date.now();

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    locale: "tr-TR",
    viewport: { width: 1280, height: 720 },
  });

  const results: ScrapeResult[] = [];

  // Run scrapers sequentially (to avoid detection)
  const scrapers = [
    { name: "Watsons", fn: scrapeWatsons },
    { name: "Hepsiburada", fn: scrapeHepsiburada },
    { name: "Sephora", fn: scrapeSephora },
  ];

  for (const scraper of scrapers) {
    console.log(`\n📦 Scraping ${scraper.name}...`);
    const page = await context.newPage();

    try {
      const result = await scraper.fn(page);
      results.push(result);
      console.log(`  ✅ ${scraper.name}: ${result.status} — ${result.deals.length} deals (${result.duration_ms}ms)`);
      if (result.error) console.log(`  ⚠️ Error: ${result.error}`);
    } catch (err) {
      console.log(`  ❌ ${scraper.name} crashed: ${err}`);
      results.push({
        store_slug: scraper.name.toLowerCase(),
        status: "crashed",
        deals: [],
        error: err instanceof Error ? err.message : "Unknown",
        duration_ms: 0,
      });
    }

    await page.close();
    // Wait between sites to look more human
    await new Promise((r) => setTimeout(r, 2000));
  }

  await browser.close();

  // ─── Save to Supabase ───────────────────────────────────────────
  const allDeals = results.flatMap((r) => r.deals);
  console.log(`\n💾 Saving ${allDeals.length} deals to Supabase...`);

  if (allDeals.length > 0) {
    // Only deactivate deals from stores we just scraped
    const scrapedSlugs = results.filter((r) => r.deals.length > 0).map((r) => r.store_slug);

    if (scrapedSlugs.length > 0) {
      await supabase
        .from("deals")
        .update({ is_active: false })
        .eq("is_active", true)
        .in("store_slug", scrapedSlugs);
    }

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
      image_url: deal.image_url || null,
      source_type: deal.source_type,
      last_scraped_at: new Date().toISOString(),
      is_active: true,
    }));

    const { error } = await supabase.from("deals").insert(dealsToInsert);
    if (error) {
      console.error("❌ Supabase insert error:", error.message);
    } else {
      console.log(`✅ ${dealsToInsert.length} deals inserted`);
    }
  }

  // Log scrape runs
  for (const result of results) {
    await supabase.from("scrape_runs").insert({
      store_slug: result.store_slug,
      status: result.status,
      deals_found: result.deals.length,
      error_message: result.error || null,
      duration_ms: result.duration_ms,
    });
  }

  console.log(`\n🏁 Done in ${Date.now() - totalStart}ms`);
  console.log("Results:", results.map((r) => `${r.store_slug}: ${r.status} (${r.deals.length})`).join(", "));
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
