import type { ScrapedDeal, ScraperResult } from "./types";

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const FETCH_TIMEOUT = 15000;

async function safeFetch(url: string, headers: Record<string, string> = {}): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    const res = await fetch(url, {
      headers: { "User-Agent": BROWSER_UA, ...headers },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

// ─── Rossmann (WAWLabs JSON API) ───────────────────────────────────
export async function scrapeRossmannAPI(): Promise<ScraperResult> {
  const start = Date.now();
  try {
    const text = await safeFetch("https://rossmann-top-searches.wawlabs.com/");
    if (!text) {
      return { store_slug: "rossmann", status: "blocked", deals: [], error: "API unreachable", duration_ms: Date.now() - start };
    }

    const data = JSON.parse(text);
    const products = Array.isArray(data) ? data : data.products || data.items || [];
    const deals: ScrapedDeal[] = [];

    for (const p of products.slice(0, 30)) {
      const originalPrice = parseFloat(p.price) || undefined;
      const salePrice = parseFloat(p.sale_price) || undefined;

      // Only include items that are actually discounted
      if (!salePrice || !originalPrice || salePrice >= originalPrice) continue;

      const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);

      deals.push({
        store_slug: "rossmann",
        store_name: "Rossmann",
        campaign_title: p.title || p.name || "Rossmann Ürünü",
        campaign_url: p.link || "https://www.rossmann.com.tr",
        product_name: p.title || p.name,
        brand: p.brand || undefined,
        category: categorizeProduct(p.title || p.category || ""),
        original_price: originalPrice,
        sale_price: salePrice,
        discount_percent: discount,
        image_url: p.image_link || p.image || undefined,
        source_type: "api",
      });
    }

    return { store_slug: "rossmann", status: deals.length > 0 ? "success" : "failed", deals, duration_ms: Date.now() - start };
  } catch (err) {
    return { store_slug: "rossmann", status: "failed", deals: [], error: err instanceof Error ? err.message : "Parse error", duration_ms: Date.now() - start };
  }
}

// ─── Trendyol (JSON-LD from category pages) ────────────────────────
export async function scrapeTrendyolAPI(): Promise<ScraperResult> {
  const start = Date.now();
  const urls = [
    "https://www.trendyol.com/kozmetik-x-c89?pi=1&siralama=1", // kozmetik, indirim sırası
    "https://www.trendyol.com/cilt-bakimi-x-c92?pi=1&siralama=1",
  ];

  const deals: ScrapedDeal[] = [];
  const seen = new Set<string>();

  for (const url of urls) {
    const html = await safeFetch(url);
    if (!html) continue;

    // Extract JSON-LD structured data
    const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
    if (!jsonLdMatches) continue;

    for (const match of jsonLdMatches) {
      try {
        const jsonStr = match.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "").trim();
        const parsed = JSON.parse(jsonStr);

        // Could be a single object or an array, or ItemList
        const items = parsed["@type"] === "ItemList"
          ? (parsed.itemListElement || []).map((e: { item?: unknown }) => e.item || e)
          : Array.isArray(parsed) ? parsed : [parsed];

        for (const item of items) {
          if (!item || item["@type"] !== "Product") continue;

          const name = item.name;
          if (!name || seen.has(name.toLowerCase())) continue;
          seen.add(name.toLowerCase());

          const offers = item.offers || {};
          const price = parseFloat(offers.price) || undefined;
          if (!price) continue;

          deals.push({
            store_slug: "trendyol",
            store_name: "Trendyol",
            campaign_title: name,
            campaign_url: item.url ? `https://www.trendyol.com${item.url.startsWith("/") ? "" : "/"}${item.url}` : url,
            product_name: name,
            brand: item.brand?.name || undefined,
            category: categorizeProduct(name),
            sale_price: price,
            image_url: item.image || undefined,
            source_type: "api",
          });

          if (deals.length >= 20) break;
        }
      } catch {
        // Skip malformed JSON-LD
      }
    }
  }

  return { store_slug: "trendyol", status: deals.length > 0 ? "success" : "failed", deals, duration_ms: Date.now() - start };
}

// ─── Gratis (Next.js SSR data from search pages) ──────────────────
export async function scrapeGratisAPI(): Promise<ScraperResult> {
  const start = Date.now();
  const queries = ["indirim", "kampanya"];
  const deals: ScrapedDeal[] = [];
  const seen = new Set<string>();

  for (const q of queries) {
    const html = await safeFetch(`https://www.gratis.com/search?q=${q}`);
    if (!html) continue;

    // Extract Next.js streaming data chunks
    const chunks = html.match(/self\.__next_f\.push\(\[[\d,]*"([^]*?)"\]\)/g);
    if (!chunks) continue;

    for (const chunk of chunks) {
      try {
        // Find product-like JSON objects within the chunk
        const priceMatches = chunk.match(/"discountedPrice":\s*(\d+(?:\.\d+)?)/g);
        const normalMatches = chunk.match(/"normalPrice":\s*(\d+(?:\.\d+)?)/g);
        const nameMatches = chunk.match(/"displayName":\s*"([^"]+)"/g);
        const brandMatches = chunk.match(/"brand":\s*"([^"]+)"/g);

        if (!nameMatches || !priceMatches) continue;

        const count = Math.min(nameMatches.length, priceMatches.length, 15);
        for (let i = 0; i < count; i++) {
          const nameMatch = nameMatches[i]?.match(/"displayName":\s*"([^"]+)"/);
          const priceMatch = priceMatches[i]?.match(/"discountedPrice":\s*(\d+(?:\.\d+)?)/);
          const normalMatch = normalMatches?.[i]?.match(/"normalPrice":\s*(\d+(?:\.\d+)?)/);
          const brandMatch = brandMatches?.[i]?.match(/"brand":\s*"([^"]+)"/);

          if (!nameMatch || !priceMatch) continue;

          const name = nameMatch[1];
          if (seen.has(name.toLowerCase())) continue;
          seen.add(name.toLowerCase());

          const salePrice = parseFloat(priceMatch[1]);
          const originalPrice = normalMatch ? parseFloat(normalMatch[1]) : undefined;

          if (!salePrice || (originalPrice && salePrice >= originalPrice)) continue;

          const discount = originalPrice
            ? Math.round(((originalPrice - salePrice) / originalPrice) * 100)
            : undefined;

          deals.push({
            store_slug: "gratis",
            store_name: "Gratis",
            campaign_title: name,
            campaign_url: `https://www.gratis.com/search?q=${encodeURIComponent(name)}`,
            product_name: name,
            brand: brandMatch?.[1] || undefined,
            category: categorizeProduct(name),
            original_price: originalPrice,
            sale_price: salePrice,
            discount_percent: discount,
            source_type: "api",
          });
        }
      } catch {
        // Skip malformed chunks
      }
    }
  }

  return { store_slug: "gratis", status: deals.length > 0 ? "success" : "failed", deals, duration_ms: Date.now() - start };
}

// ─── Helper: categorize product by name ────────────────────────────
function categorizeProduct(text: string): string | undefined {
  const lower = text.toLowerCase();
  if (/ruj|lip|dudak/.test(lower)) return "makyaj";
  if (/fondöten|foundation|allık|blush|far|eyeshadow|rimel|mascara|eyeliner|kapatıcı|concealer|pudra|powder|makyaj/.test(lower)) return "makyaj";
  if (/serum|krem|cream|nemlendirici|moistur|tonik|toner|temizleyici|cleanser|peeling|maske|mask|cilt|skin/.test(lower)) return "cilt bakımı";
  if (/şampuan|shampoo|saç|hair|bakım kremi|conditioner|saç maskesi/.test(lower)) return "saç bakımı";
  if (/parfüm|perfume|deodorant|koku|fragrance|edp|edt/.test(lower)) return "parfüm";
  if (/güneş|sun|spf/.test(lower)) return "güneş";
  return undefined;
}

// ─── Akakçe (api6.akakce.com — open JSON API) ──────────────────────
export async function scrapeAkakceAPI(): Promise<ScraperResult> {
  const start = Date.now();
  const deals: ScrapedDeal[] = [];
  const seen = new Set<string>();

  try {
    // 1) Last discounts endpoint — trending discounted products
    const discountsText = await safeFetch("https://api6.akakce.com/home/v3/lastDiscounts");
    if (discountsText) {
      try {
        const discounts = JSON.parse(discountsText);
        const items = Array.isArray(discounts) ? discounts : discounts.products || discounts.items || discounts.result || [];

        for (const p of items.slice(0, 40)) {
          const name = p.name || p.title || p.productName;
          if (!name) continue;

          const lowerName = name.toLowerCase();
          // Filter to beauty/cosmetics products only
          if (!isBeautyProduct(lowerName)) continue;
          if (seen.has(lowerName)) continue;
          seen.add(lowerName);

          const price = parseFloat(p.price || p.currentPrice || p.salePrice) || undefined;
          const originalPrice = parseFloat(p.oldPrice || p.originalPrice || p.listPrice) || undefined;
          const discount = p.discountRatio || p.discount
            ? Math.round(parseFloat(p.discountRatio || p.discount))
            : (originalPrice && price && price < originalPrice)
              ? Math.round(((originalPrice - price) / originalPrice) * 100)
              : undefined;

          if (!price) continue;

          const brand = p.mkName || p.brand || p.brandName || extractBrand(name);
          const productUrl = p.url || p.link || p.productUrl;
          const fullUrl = productUrl
            ? (productUrl.startsWith("http") ? productUrl : `https://www.akakce.com${productUrl.startsWith("/") ? "" : "/"}${productUrl}`)
            : "https://www.akakce.com";

          deals.push({
            store_slug: "akakce",
            store_name: "Akakçe",
            campaign_title: name,
            campaign_url: fullUrl,
            product_name: name,
            brand: brand || undefined,
            category: categorizeProduct(name),
            original_price: originalPrice,
            sale_price: price,
            discount_percent: discount,
            image_url: p.image || p.imageUrl || p.img || undefined,
            source_type: "api",
          });
        }
      } catch {
        // Skip parse errors for discounts
      }
    }

    // 2) Autocomplete search for beauty-specific queries
    const queries = ["serum", "krem", "şampuan", "parfüm", "ruj", "fondöten", "maske", "güneş kremi"];
    for (const q of queries) {
      if (deals.length >= 50) break;

      const searchText = await safeFetch(`https://api6.akakce.com/autocomplete?q=${encodeURIComponent(q)}`);
      if (!searchText) continue;

      try {
        const searchData = JSON.parse(searchText);
        // Autocomplete returns product suggestions
        const products = searchData.products || searchData.items || searchData.result || [];

        for (const p of products.slice(0, 8)) {
          const name = p.name || p.title || p.label;
          if (!name) continue;

          const lowerName = name.toLowerCase();
          if (seen.has(lowerName)) continue;
          seen.add(lowerName);

          const price = parseFloat(p.price || p.currentPrice) || undefined;
          const productUrl = p.url || p.link || p.code;
          const fullUrl = productUrl
            ? (productUrl.startsWith("http") ? productUrl : `https://www.akakce.com${productUrl.startsWith("/") ? "" : "/"}${productUrl}`)
            : `https://www.akakce.com/arama/?q=${encodeURIComponent(q)}`;

          deals.push({
            store_slug: "akakce",
            store_name: "Akakçe",
            campaign_title: name,
            campaign_url: fullUrl,
            product_name: name,
            brand: p.mkName || p.brand || extractBrand(name) || undefined,
            category: categorizeProduct(name) || categorizeProduct(q),
            sale_price: price,
            image_url: p.image || p.imageUrl || undefined,
            source_type: "api",
          });
        }
      } catch {
        // Skip parse errors
      }
    }

    return {
      store_slug: "akakce",
      status: deals.length > 0 ? "success" : "failed",
      deals,
      duration_ms: Date.now() - start,
    };
  } catch (err) {
    return {
      store_slug: "akakce",
      status: "failed",
      deals: [],
      error: err instanceof Error ? err.message : "Parse error",
      duration_ms: Date.now() - start,
    };
  }
}

// ─── Helper: check if product is beauty/cosmetics related ─────────
function isBeautyProduct(text: string): boolean {
  return /ruj|lip|dudak|fondöten|foundation|allık|blush|far|eyeshadow|rimel|mascara|eyeliner|kapatıcı|concealer|pudra|powder|makyaj|serum|krem|cream|nemlendirici|moistur|tonik|toner|temizleyici|cleanser|peeling|maske|mask|cilt|skin|şampuan|shampoo|saç|hair|parfüm|perfume|deodorant|koku|fragrance|edp|edt|güneş|sun|spf|kozmetik|bakım|beauty|losyon|lotion|jel|gel|yağ|oil|retinol|hyaluron|niacinamide|vitamin|kolajen|collagen/.test(text);
}

// ─── Helper: extract brand from product name ──────────────────────
function extractBrand(name: string): string | undefined {
  // Akakce often starts product names with brand
  const parts = name.split(/\s+/);
  if (parts.length >= 2) {
    return parts[0];
  }
  return undefined;
}

// ─── Run all API scrapers ──────────────────────────────────────────
export async function scrapeAllAPIs(): Promise<ScraperResult[]> {
  const results = await Promise.allSettled([
    scrapeRossmannAPI(),
    scrapeTrendyolAPI(),
    scrapeGratisAPI(),
    scrapeAkakceAPI(),
  ]);

  return results.map((r, i) => {
    const slugs = ["rossmann", "trendyol", "gratis", "akakce"];
    return r.status === "fulfilled"
      ? r.value
      : { store_slug: slugs[i], status: "failed" as const, deals: [], error: r.reason?.message, duration_ms: 0 };
  });
}
