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
    // Try multiple Watsons URLs — Cloudflare blocks aggressively
    const watsonsUrls = [
      "https://www.watsons.com.tr/cilt-bakimi/c/11030?sort=topRated",
      "https://www.watsons.com.tr/makyaj/c/11020?sort=topRated",
      "https://www.watsons.com.tr/tum-urunler/c/50110?sort=topRated",
    ];

    let cards: Awaited<ReturnType<Page["$$"]>> = [];

    for (const wUrl of watsonsUrls) {
      try {
        await page.goto(wUrl, { waitUntil: "domcontentloaded", timeout: 25000 });
        await page.waitForTimeout(5000);

        const title = await page.title();
        console.log(`  [DEBUG] Watsons trying: ${wUrl} → "${title}"`);

        if (title.includes("Access Denied") || title.includes("Just a moment")) continue;

        await page.waitForSelector(".product-list-item, h3[class*='product'], [class*='product-grid']", { timeout: 8000 }).catch(() => {});
        cards = await page.$$(".product-list-item, [class*='product-grid'] [class*='product'], e2-product-list [class*='product']");
        console.log(`  [DEBUG] Watsons found ${cards.length} cards`);
        if (cards.length > 0) break;
      } catch {
        continue;
      }
    }

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
    // Try multiple kozmetik category URLs
    const hbUrls = [
      "https://www.hepsiburada.com/ara?q=kozmetik+makyaj&siralama=artpirim",
      "https://www.hepsiburada.com/ara?q=fondoten+ruj+rimel&siralama=artpirim",
      "https://www.hepsiburada.com/ara?q=cilt+bakim+serum+krem&siralama=artpirim",
    ];

    let cards: Awaited<ReturnType<Page["$$"]>> = [];

    for (const hbUrl of hbUrls) {
      try {
        await page.goto(hbUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
        await page.waitForTimeout(6000);
        await page.waitForSelector('li[type="comfort"], article[class*="productCard"]', { timeout: 10000 }).catch(() => {});

        const hbTitle = await page.title();
        const hbArticles = await page.$$eval("article", (els) => els.length);
        console.log(`  [DEBUG] HB "${hbUrl.split("q=")[1]?.split("&")[0]}" → title: "${hbTitle}", articles: ${hbArticles}`);

        // Extract products directly from DOM using evaluate for reliability
        const products = await page.evaluate(() => {
          const items: Array<{name: string; price: string; oldPrice: string; href: string; img: string}> = [];
          // Try all possible article/card containers
          const articles = document.querySelectorAll("article, li[type='comfort'], [class*='productCard']");
          articles.forEach((article) => {
            const nameEl = article.querySelector("h3, h2, [data-test-id*='title'], a[title]");
            const name = nameEl?.textContent?.trim() || (nameEl as HTMLAnchorElement)?.title || "";
            const priceEls = article.querySelectorAll("[class*='price'], [data-test-id*='price']");
            let price = "";
            let oldPrice = "";
            priceEls.forEach((p) => {
              const text = p.textContent?.trim() || "";
              if (text.includes("TL") || /\d/.test(text)) {
                if (!price) price = text;
                else if (!oldPrice) oldPrice = text;
              }
            });
            const linkEl = article.querySelector("a[href*='/']") as HTMLAnchorElement;
            const href = linkEl?.href || "";
            const imgEl = article.querySelector("img") as HTMLImageElement;
            const img = imgEl?.src || imgEl?.getAttribute("data-src") || "";
            if (name && name.length > 3) {
              items.push({ name, price, oldPrice, href, img });
            }
          });
          return items;
        });

        console.log(`  [DEBUG] HB evaluate found ${products.length} products`);
        if (products.length > 0) {
          console.log(`  [DEBUG] HB sample: ${products[0].name} → ${products[0].price}`);
        }

        for (const product of products.slice(0, 15)) {
          // Kozmetik filtresi
          const nameLower = product.name.toLowerCase();
          const isCosmetic = /ruj|lip|dudak|fondöten|foundation|allık|blush|far|eyeshadow|rimel|mascara|eyeliner|kapatıcı|concealer|pudra|powder|makyaj|serum|krem|cream|nemlendirici|moistur|tonik|toner|temizleyici|cleanser|peeling|maske|mask|cilt|skin|şampuan|shampoo|saç|hair|parfüm|perfume|deodorant|koku|fragrance|edp|edt|güneş|sun|spf|oje|nail|kirpik|kaş|brow|kontür|contour|highlighter|bronzer|primer|bb|cc|losyon|lotion|jel|gel/.test(nameLower);
          if (!isCosmetic) {
            continue;
          }

          const sale = parsePrice(product.price);
          const original = parsePrice(product.oldPrice);
          const discount = original && sale && sale < original
            ? Math.round(((original - sale) / original) * 100)
            : undefined;

          deals.push({
            store_slug: "hepsiburada",
            store_name: "Hepsiburada",
            campaign_title: product.name,
            campaign_url: product.href.startsWith("http") ? product.href : `https://www.hepsiburada.com${product.href}`,
            product_name: product.name,
            category: categorize(product.name),
            original_price: original,
            sale_price: sale,
            discount_percent: discount,
            image_url: product.img || undefined,
            source_type: "scraped",
          });
        }
      } catch {
        continue;
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

// ─── Gratis Scraper ────────────────────────────────────────────────
// Next.js app — extract products via __NEXT_DATA__ or DOM evaluate
async function scrapeGratis(page: Page): Promise<ScrapeResult> {
  const start = Date.now();
  const deals: ScrapedDeal[] = [];

  try {
    const gratisUrls = [
      "https://www.gratis.com/firsatlar",
      "https://www.gratis.com/makyaj",
      "https://www.gratis.com/cilt-bakimi",
    ];

    for (const gUrl of gratisUrls) {
      try {
        await page.goto(gUrl, { waitUntil: "networkidle", timeout: 30000 });
        await page.waitForTimeout(8000); // Wait for SPA to render

        const title = await page.title();
        console.log(`  [DEBUG] Gratis ${gUrl.split(".com")[1]} → "${title}"`);

        // Strategy 1: Try __NEXT_DATA__ for Next.js apps
        const nextData = await page.evaluate(() => {
          const el = document.getElementById("__NEXT_DATA__");
          return el?.textContent || "";
        });

        if (nextData) {
          try {
            const parsed = JSON.parse(nextData);
            // Navigate through Next.js props to find product data
            const pageProps = parsed?.props?.pageProps;
            const products = pageProps?.products || pageProps?.items || pageProps?.data?.products || [];
            console.log(`  [DEBUG] Gratis __NEXT_DATA__ keys: ${Object.keys(pageProps || {}).slice(0, 10).join(", ")}`);
            if (Array.isArray(products)) {
              for (const p of products.slice(0, 25)) {
                const name = p.name || p.title || p.productName || "";
                if (!name) continue;
                deals.push({
                  store_slug: "gratis",
                  store_name: "Gratis",
                  campaign_title: name,
                  campaign_url: p.url || p.slug ? `https://www.gratis.com/${p.slug}` : gUrl,
                  product_name: name,
                  brand: p.brand || p.brandName,
                  category: categorize(name),
                  original_price: p.originalPrice || p.listPrice,
                  sale_price: p.price || p.salePrice || p.discountedPrice,
                  image_url: p.image || p.imageUrl || p.thumbnailUrl,
                  source_type: "scraped",
                });
              }
            }
          } catch { /* skip */ }
        }

        if (deals.length > 0) break;

        // Strategy 2: Extract all visible product-like elements via DOM
        const products = await page.evaluate(() => {
          const items: Array<{name: string; price: string; href: string; img: string}> = [];
          // Find all links that might be products
          const allLinks = document.querySelectorAll("a[href]");
          allLinks.forEach((link) => {
            const href = (link as HTMLAnchorElement).href;
            // Look for product-like links (containing /p/ or product paths)
            if (!href || href === window.location.href) return;
            const img = link.querySelector("img");
            const imgSrc = img?.src || img?.getAttribute("data-src") || "";
            // Get text content — product name is usually near image
            const texts = Array.from(link.querySelectorAll("span, p, h3, h4, div"))
              .map((el) => el.textContent?.trim())
              .filter((t) => t && t.length > 3 && t.length < 200);
            const priceMatch = texts.find((t) => t && (/TL|₺|\d+[.,]\d{2}/.test(t)));
            const nameMatch = texts.find((t) => t && t !== priceMatch && !(/^\d/.test(t || "")));
            if (nameMatch && imgSrc) {
              items.push({ name: nameMatch, price: priceMatch || "", href, img: imgSrc });
            }
          });
          return items;
        });

        console.log(`  [DEBUG] Gratis DOM products: ${products.length}`);
        if (products.length > 0) {
          console.log(`  [DEBUG] Gratis sample: ${products[0].name} → ${products[0].price}`);
        }

        for (const p of products.slice(0, 25)) {
          const sale = parsePrice(p.price);
          deals.push({
            store_slug: "gratis",
            store_name: "Gratis",
            campaign_title: p.name,
            campaign_url: p.href,
            product_name: p.name,
            category: categorize(p.name),
            sale_price: sale,
            image_url: p.img || undefined,
            source_type: "scraped",
          });
        }

        if (deals.length > 0) break;
      } catch { continue; }
    }

    return { store_slug: "gratis", status: deals.length > 0 ? "success" : "no_deals", deals, duration_ms: Date.now() - start };
  } catch (err) {
    return { store_slug: "gratis", status: "failed", deals: [], error: err instanceof Error ? err.message : "Unknown", duration_ms: Date.now() - start };
  }
}

// ─── Rossmann Scraper ──────────────────────────────────────────────
// Cloudflare protected — use domcontentloaded + long wait + DOM evaluate
async function scrapeRossmann(page: Page): Promise<ScrapeResult> {
  const start = Date.now();
  const deals: ScrapedDeal[] = [];

  try {
    // Navigate and wait for CF challenge to auto-resolve
    await page.goto("https://www.rossmann.com.tr", {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });

    // Wait for CF challenge — it auto-resolves in headed mode
    let title = await page.title();
    console.log(`  [DEBUG] Rossmann initial title: "${title}"`);

    // Poll for CF resolution (up to 20 seconds)
    for (let i = 0; i < 10; i++) {
      if (!title.includes("dakika") && !title.includes("moment") && !title.includes("Checking") && !title.includes("Just")) break;
      await page.waitForTimeout(2000);
      title = await page.title();
    }
    console.log(`  [DEBUG] Rossmann resolved title: "${title}"`);

    // If CF resolved, navigate to product pages
    if (!title.includes("dakika") && !title.includes("moment")) {
      const rossmannUrls = [
        "https://www.rossmann.com.tr/c/makyaj",
        "https://www.rossmann.com.tr/c/cilt-bakimi",
        "https://www.rossmann.com.tr/c/sac-bakimi",
      ];

      for (const rUrl of rossmannUrls) {
        if (deals.length >= 20) break;
        try {
          await page.goto(rUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
          await page.waitForTimeout(5000);

          const rTitle = await page.title();
          console.log(`  [DEBUG] Rossmann ${rUrl.split(".tr")[1]} → "${rTitle}"`);

          // Extract products via evaluate
          const products = await page.evaluate(() => {
            const items: Array<{name: string; price: string; href: string; img: string; brand: string}> = [];
            // Try various product containers
            const containers = document.querySelectorAll("[class*='product'], article, [class*='card'], [class*='item']");
            containers.forEach((el) => {
              const nameEl = el.querySelector("h3, h4, [class*='name'], [class*='title']");
              const name = nameEl?.textContent?.trim() || "";
              const priceEl = el.querySelector("[class*='price'], [class*='Price']");
              const price = priceEl?.textContent?.trim() || "";
              const linkEl = el.querySelector("a[href]") as HTMLAnchorElement;
              const href = linkEl?.href || "";
              const imgEl = el.querySelector("img") as HTMLImageElement;
              const img = imgEl?.src || "";
              const brandEl = el.querySelector("[class*='brand']");
              const brand = brandEl?.textContent?.trim() || "";
              if (name && name.length > 3 && (price || href)) {
                items.push({ name, price, href, img, brand });
              }
            });
            return items;
          });

          console.log(`  [DEBUG] Rossmann evaluate found ${products.length} products`);

          for (const p of products.slice(0, 15)) {
            const sale = parsePrice(p.price);
            deals.push({
              store_slug: "rossmann",
              store_name: "Rossmann",
              campaign_title: p.name,
              campaign_url: p.href || rUrl,
              product_name: p.name,
              brand: p.brand || undefined,
              category: categorize(p.name),
              sale_price: sale,
              image_url: p.img || undefined,
              source_type: "scraped",
            });
          }
        } catch { continue; }
      }
    }

    // Fallback: JSON-LD
    if (deals.length === 0) {
      const jsonLd = await page.$$eval('script[type="application/ld+json"]', (scripts) =>
        scripts.map((s) => s.textContent || "")
      );
      for (const json of jsonLd) {
        try {
          const data = JSON.parse(json);
          const products = data["@type"] === "ItemList" ? data.itemListElement : Array.isArray(data) ? data : [data];
          for (const item of products.slice(0, 25)) {
            const product = item.item || item;
            if (product["@type"] === "Product" && product.name) {
              deals.push({
                store_slug: "rossmann",
                store_name: "Rossmann",
                campaign_title: product.name,
                campaign_url: product.url || "https://www.rossmann.com.tr",
                product_name: product.name,
                brand: product.brand?.name,
                category: categorize(product.name),
                sale_price: product.offers?.price ? parseFloat(product.offers.price) : undefined,
                image_url: product.image,
                source_type: "scraped",
              });
            }
          }
        } catch { /* skip */ }
      }
    }

    return { store_slug: "rossmann", status: deals.length > 0 ? "success" : "no_deals", deals, duration_ms: Date.now() - start };
  } catch (err) {
    return { store_slug: "rossmann", status: "failed", deals: [], error: err instanceof Error ? err.message : "Unknown", duration_ms: Date.now() - start };
  }
}

// ─── MAC Cosmetics Scraper ─────────────────────────────────────────
// Estée Lauder e-commerce — SPA with networkidle + DOM evaluate
async function scrapeMAC(page: Page): Promise<ScrapeResult> {
  const start = Date.now();
  const deals: ScrapedDeal[] = [];

  try {
    const macUrls = [
      "https://www.maccosmetics.com.tr/en-cok-satanlar",
      "https://www.maccosmetics.com.tr/best-sellers",
      "https://www.maccosmetics.com.tr/makyaj",
    ];

    for (const mUrl of macUrls) {
      if (deals.length > 0) break;
      try {
        await page.goto(mUrl, { waitUntil: "networkidle", timeout: 30000 });
        await page.waitForTimeout(8000); // Wait for SPA to fully render

        const title = await page.title();
        console.log(`  [DEBUG] MAC ${mUrl.split(".tr")[1]} → "${title}"`);

        // Strategy 1: JSON-LD (MAC often has structured data)
        const jsonLd = await page.$$eval('script[type="application/ld+json"]', (scripts) =>
          scripts.map((s) => s.textContent || "")
        );
        for (const json of jsonLd) {
          try {
            const data = JSON.parse(json);
            const items = data["@type"] === "ItemList" ? data.itemListElement :
                         data["@type"] === "Product" ? [data] :
                         Array.isArray(data) ? data : [];
            for (const item of items.slice(0, 25)) {
              const product = item.item || item;
              if (product.name) {
                deals.push({
                  store_slug: "mac",
                  store_name: "MAC Cosmetics",
                  campaign_title: product.name,
                  campaign_url: product.url || mUrl,
                  product_name: product.name,
                  brand: "MAC",
                  category: categorize(product.name),
                  sale_price: product.offers?.price ? parseFloat(product.offers.price) : undefined,
                  image_url: typeof product.image === "string" ? product.image : product.image?.[0],
                  source_type: "scraped",
                });
              }
            }
          } catch { /* skip */ }
        }

        if (deals.length > 0) break;

        // Strategy 2: DOM evaluate — look for product cards with images + text
        const products = await page.evaluate(() => {
          const items: Array<{name: string; price: string; href: string; img: string}> = [];
          // MAC uses various product grid formats
          const allLinks = document.querySelectorAll("a[href]");
          allLinks.forEach((link) => {
            const el = link as HTMLAnchorElement;
            const href = el.href;
            if (!href || href === window.location.href) return;
            // Skip non-product links
            if (href.includes("login") || href.includes("cart") || href.includes("#")) return;

            const img = link.querySelector("img");
            if (!img) return;
            const imgSrc = img.src || img.getAttribute("data-src") || "";
            if (!imgSrc || imgSrc.includes("logo") || imgSrc.includes("icon")) return;

            // Get all text spans
            const texts = Array.from(link.querySelectorAll("span, p, h3, h4, div"))
              .map((t) => t.textContent?.trim())
              .filter((t) => t && t.length > 2 && t.length < 200);

            const priceMatch = texts.find((t) => t && /TL|₺|\d+[.,]\d{2}/.test(t));
            const nameMatch = texts.find((t) => t && t !== priceMatch && t.length > 3);

            if (nameMatch) {
              items.push({ name: nameMatch, price: priceMatch || "", href, img: imgSrc });
            }
          });
          return items;
        });

        console.log(`  [DEBUG] MAC DOM products: ${products.length}`);
        if (products.length > 0) {
          console.log(`  [DEBUG] MAC sample: ${products[0].name} → ${products[0].price}`);
        }

        for (const p of products.slice(0, 25)) {
          const sale = parsePrice(p.price);
          deals.push({
            store_slug: "mac",
            store_name: "MAC Cosmetics",
            campaign_title: p.name,
            campaign_url: p.href,
            product_name: p.name,
            brand: "MAC",
            category: categorize(p.name),
            sale_price: sale,
            image_url: p.img || undefined,
            source_type: "scraped",
          });
        }
      } catch { continue; }
    }

    return { store_slug: "mac", status: deals.length > 0 ? "success" : "no_deals", deals, duration_ms: Date.now() - start };
  } catch (err) {
    return { store_slug: "mac", status: "failed", deals: [], error: err instanceof Error ? err.message : "Unknown", duration_ms: Date.now() - start };
  }
}

// ─── Main ───────────────────────────────────────────────────────────
async function main() {
  console.log("🚀 Starting Playwright deal scraper...");
  const totalStart = Date.now();

  const browser = await chromium.launch({
    headless: false, // Use headed mode to avoid headless detection
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--disable-features=IsolateOrigins,site-per-process",
      "--disable-dev-shm-usage",
      "--window-size=1280,720",
    ],
  });

  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    locale: "tr-TR",
    viewport: { width: 1280, height: 720 },
    // Stealth: override navigator properties
    javaScriptEnabled: true,
  });

  // Remove webdriver flag to avoid bot detection
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    // Override chrome automation properties
    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters: PermissionDescriptor) =>
      parameters.name === "notifications"
        ? Promise.resolve({ state: "denied", onchange: null } as PermissionStatus)
        : originalQuery(parameters);
    // Add chrome object
    Object.defineProperty(window, "chrome", {
      get: () => ({
        runtime: {},
        loadTimes: () => ({}),
        csi: () => ({}),
      }),
    });
    // Override plugins length
    Object.defineProperty(navigator, "plugins", {
      get: () => [1, 2, 3, 4, 5],
    });
    Object.defineProperty(navigator, "languages", {
      get: () => ["tr-TR", "tr", "en-US", "en"],
    });
  });

  const results: ScrapeResult[] = [];

  // Run scrapers sequentially (to avoid detection)
  const scrapers = [
    { name: "MAC", fn: scrapeMAC },
    { name: "Watsons", fn: scrapeWatsons },
    { name: "Hepsiburada", fn: scrapeHepsiburada },
    { name: "Sephora", fn: scrapeSephora },
    // Gratis ve Rossmann devre dışı — CF/SPA engelliyor, kampanya linki olarak kalıyor
    // { name: "Gratis", fn: scrapeGratis },
    // { name: "Rossmann", fn: scrapeRossmann },
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
