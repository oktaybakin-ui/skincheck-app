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
// SAP Spartacus/Hybris Angular SPA with e2-* web components
async function scrapeWatsons(page: Page): Promise<ScrapeResult> {
  const start = Date.now();
  const deals: ScrapedDeal[] = [];

  try {
    // Product listing page (not /kampanyalar which is just banners)
    await page.goto("https://www.watsons.com.tr/tum-urunler/c/50110?sort=topRated", {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    // Angular SPA needs extra time to hydrate
    await page.waitForTimeout(6000);
    // Try waiting for product elements to appear
    await page.waitForSelector(".product-list-item, h3.product-list-item__name, [class*='product-grid']", { timeout: 10000 }).catch(() => {});

    // Debug: log page content summary
    const watsonsTitle = await page.title();
    const watsonsBodyLen = await page.evaluate(() => document.body.innerHTML.length);
    const watsonsProductCount = await page.$$eval("*", (els) => els.filter(e => e.className?.toString().includes("product")).length);
    console.log(`  [DEBUG] Watsons page title: "${watsonsTitle}", body length: ${watsonsBodyLen}, product-like elements: ${watsonsProductCount}`);
    // Log all unique tag names containing "product" in class
    const watsonsClasses = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll("*")).filter(e => e.className?.toString?.().toLowerCase().includes("product"));
      return [...new Set(els.map(e => `${e.tagName}.${e.className.toString().split(" ").find(c => c.includes("product"))}`))] .slice(0, 15);
    });
    console.log(`  [DEBUG] Watsons product classes: ${JSON.stringify(watsonsClasses)}`);

    // Product cards use .product-list-item class
    const cards = await page.$$(".product-list-item, [class*='product-grid'] [class*='product'], e2-product-list [class*='product']");

    for (const card of cards.slice(0, 25)) {
      try {
        const name = await card.$eval("h3.product-list-item__name, h3[class*='name'], [class*='product-name']", (el) => el.textContent?.trim() || "").catch(() => "");
        const priceText = await card.$eval("span.price__default-value, [class*='price'] span, e2core-price", (el) => el.textContent?.trim() || "").catch(() => "");
        const memberPrice = await card.$eval("span.price__member-price-value, [class*='member-price']", (el) => el.textContent?.trim() || "").catch(() => "");
        const link = await card.$("a.product-list-item__link, a.product-list-item__details-wrapper, a[class*='product']");
        const href = link ? await link.getAttribute("href") || "" : "";
        const img = await card.$(".product-list-item__image img, e2core-media img, img");
        const imgSrc = img ? await img.getAttribute("src") || await img.getAttribute("data-src") || "" : "";

        if (!name || name.length < 3) continue;

        const regularPrice = parsePrice(priceText);
        const salePrice = memberPrice ? parsePrice(memberPrice) : regularPrice;
        const originalPrice = memberPrice ? regularPrice : undefined;
        const discount = originalPrice && salePrice && salePrice < originalPrice
          ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
          : undefined;

        deals.push({
          store_slug: "watsons",
          store_name: "Watsons",
          campaign_title: name,
          campaign_url: href.startsWith("http") ? href : `https://www.watsons.com.tr${href}`,
          product_name: name,
          category: categorize(name),
          original_price: originalPrice,
          sale_price: salePrice,
          discount_percent: discount,
          image_url: imgSrc ? (imgSrc.startsWith("http") ? imgSrc : `https://www.watsons.com.tr${imgSrc}`) : undefined,
          source_type: "scraped",
        });
      } catch {
        // Skip individual card errors
      }
    }

    return { store_slug: "watsons", status: deals.length > 0 ? "success" : "no_deals", deals, duration_ms: Date.now() - start };
  } catch (err) {
    return { store_slug: "watsons", status: "failed", deals: [], error: err instanceof Error ? err.message : "Unknown", duration_ms: Date.now() - start };
  }
}

// ─── Hepsiburada Scraper ────────────────────────────────────────────
// React SPA with CSS Modules — use stable data-test-id attributes
async function scrapeHepsiburada(page: Page): Promise<ScrapeResult> {
  const start = Date.now();
  const deals: ScrapedDeal[] = [];

  try {
    // Try category page first, fallback to search
    await page.goto("https://www.hepsiburada.com/kozmetik-kisisel-bakim-c-702?siralama=artpirim", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForTimeout(6000);
    // Wait for product cards to render
    await page.waitForSelector('[data-test-id^="title-"], li[type="comfort"], article[class*="productCard"]', { timeout: 10000 }).catch(() => {});

    // Debug: log page content summary
    const hbTitle = await page.title();
    const hbBodyLen = await page.evaluate(() => document.body.innerHTML.length);
    const hbArticles = await page.$$eval("article", (els) => els.length);
    const hbLis = await page.$$eval('li[type="comfort"]', (els) => els.length);
    const hbTestIds = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("[data-test-id]"))
        .map(e => e.getAttribute("data-test-id"))
        .filter(id => id?.includes("title") || id?.includes("price"))
        .slice(0, 10);
    });
    console.log(`  [DEBUG] HB title: "${hbTitle}", body: ${hbBodyLen}, articles: ${hbArticles}, li[comfort]: ${hbLis}, test-ids: ${JSON.stringify(hbTestIds)}`);

    // Product cards: li[type="comfort"] > article or use data-test-id
    let cards = await page.$$('li[type="comfort"] article, article[class*="productCard"]');

    // Fallback: try search URL if category page was blocked
    if (cards.length === 0) {
      console.log("  [DEBUG] HB category page empty, trying search URL...");
      await page.goto("https://www.hepsiburada.com/ara?q=kozmetik+indirim&siralama=artpirim", {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      await page.waitForTimeout(6000);
      await page.waitForSelector('[data-test-id^="title-"], li[type="comfort"]', { timeout: 10000 }).catch(() => {});
      const hbTitle2 = await page.title();
      const hbArticles2 = await page.$$eval("article", (els) => els.length);
      console.log(`  [DEBUG] HB search page title: "${hbTitle2}", articles: ${hbArticles2}`);
      cards = await page.$$('li[type="comfort"] article, article[class*="productCard"]');
    }

    for (const card of cards.slice(0, 25)) {
      try {
        // Title: h2 with data-test-id^="title-"
        const name = await card.$eval('[data-test-id^="title-"], h2, [class*="product-title"]', (el) => el.textContent?.trim() || "").catch(() => "");
        // Final price: div with data-test-id^="final-price-"
        const finalPrice = await card.$eval('[data-test-id^="final-price-"], [class*="finalPrice"]', (el) => el.textContent?.trim() || "").catch(() => "");
        // Original price: span with class containing "originalPrice"
        const oldPrice = await card.$eval('[class*="originalPrice"], [class*="old-price"]', (el) => el.textContent?.trim() || "").catch(() => "");
        // Discount rate
        const discountText = await card.$eval('[class*="discountRate"], [class*="discount"]', (el) => el.textContent?.trim() || "").catch(() => "");
        // Link from title
        const link = await card.$('[data-test-id^="title-"] a, a[class*="productCardLink"], a');
        const href = link ? await link.getAttribute("href") || "" : "";
        // Image
        const img = await card.$("picture img, img[class*='hbImageView'], img");
        const imgSrc = img ? await img.getAttribute("src") || await img.getAttribute("data-src") || "" : "";

        if (!name || name.length < 3) continue;

        const sale = parsePrice(finalPrice);
        const original = parsePrice(oldPrice);
        const discountNum = discountText ? parseInt(discountText.replace(/[^0-9]/g, "")) : undefined;
        const discount = discountNum || (original && sale && sale < original
          ? Math.round(((original - sale) / original) * 100)
          : undefined);

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
// Salesforce Commerce Cloud (Demandware) — clean semantic class names
async function scrapeSephora(page: Page): Promise<ScrapeResult> {
  const start = Date.now();
  const deals: ScrapedDeal[] = [];

  try {
    // /firsatlar/ returns no results — use /avantajli-teklif-7/ for actual discounted products
    await page.goto("https://www.sephora.com.tr/avantajli-teklif-7/", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });
    await page.waitForTimeout(3000);

    // Product grid: li.grid-tile > div.product-tile
    const cards = await page.$$("li.grid-tile, div.product-tile, [class*='product-tile']");

    for (const card of cards.slice(0, 25)) {
      try {
        // Brand: span.product-brand
        const brand = await card.$eval("span.product-brand, [class*='product-brand']", (el) => el.textContent?.trim() || "").catch(() => "");
        // Product name: h3.product-title
        const name = await card.$eval("h3.product-title, [class*='product-title'], .summarize-description", (el) => el.textContent?.trim() || "").catch(() => "");
        // Price: span.price-sales-standard
        const priceText = await card.$eval("span.price-sales-standard, [class*='price-sales'], [class*='price']", (el) => el.textContent?.trim() || "").catch(() => "");
        // Link: a.product-tile-link
        const link = await card.$("a.product-tile-link, a[class*='product-tile-link'], a");
        const href = link ? await link.getAttribute("href") || "" : "";
        // Image: img.product-first-img
        const img = await card.$("img.product-first-img, .product-image img, img");
        const imgSrc = img ? await img.getAttribute("src") || await img.getAttribute("data-src") || "" : "";
        // Product ID
        const pid = await card.getAttribute("data-pid") || "";

        if (!name || name.length < 3) continue;

        const sale = parsePrice(priceText);
        const title = brand ? `${brand} - ${name}` : name;

        deals.push({
          store_slug: "sephora",
          store_name: "Sephora",
          campaign_title: title,
          campaign_url: href.startsWith("http") ? href : `https://www.sephora.com.tr${href}`,
          product_name: name,
          brand: brand || undefined,
          category: categorize(name + " " + brand),
          sale_price: sale,
          image_url: imgSrc ? (imgSrc.startsWith("http") ? imgSrc : `https://www.sephora.com.tr${imgSrc}`) : undefined,
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
