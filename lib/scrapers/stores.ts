// Store-specific scraping configurations
// Each store has CSS selectors for extracting deal data from their campaign pages

export interface StoreScraperConfig {
  slug: string;
  name: string;
  campaignUrl: string;
  // CSS selectors for extracting deals
  selectors: {
    dealContainer: string;
    title: string;
    price?: string;
    originalPrice?: string;
    discountPercent?: string;
    image?: string;
    link?: string;
  };
  // Custom headers for the request
  headers?: Record<string, string>;
}

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

export const STORE_CONFIGS: StoreScraperConfig[] = [
  {
    slug: "gratis",
    name: "Gratis",
    campaignUrl: "https://www.gratis.com/kampanyalar",
    selectors: {
      dealContainer: ".campaign-item, .promotion-card, .campaign-card, [class*='campaign'], [class*='promo']",
      title: "h2, h3, .title, .campaign-title, [class*='title']",
      image: "img",
      link: "a",
    },
    headers: { "User-Agent": BROWSER_UA },
  },
  {
    slug: "watsons",
    name: "Watsons",
    campaignUrl: "https://www.watsons.com.tr/kampanyalar",
    selectors: {
      dealContainer: ".campaign-item, .promotion-item, [class*='campaign'], [class*='promo'], .col-md-4, .col-lg-3",
      title: "h2, h3, .title, [class*='title'], p",
      image: "img",
      link: "a",
    },
    headers: { "User-Agent": BROWSER_UA },
  },
  {
    slug: "rossmann",
    name: "Rossmann",
    campaignUrl: "https://www.rossmann.com.tr/kampanyalar",
    selectors: {
      dealContainer: ".campaign-item, .campaign-card, [class*='campaign'], [class*='promo'], article",
      title: "h2, h3, .title, [class*='title']",
      image: "img",
      link: "a",
    },
    headers: { "User-Agent": BROWSER_UA },
  },
  {
    slug: "trendyol",
    name: "Trendyol",
    campaignUrl: "https://www.trendyol.com/butik/liste/kozmetik-indirimleri",
    selectors: {
      dealContainer: ".p-card-wrppr, [class*='product-card'], [class*='prdct']",
      title: ".prdct-desc-cntnr-name, [class*='product-name'], span[class*='name']",
      price: ".prc-box-dscntd, [class*='discounted']",
      originalPrice: ".prc-box-orgnl, [class*='original']",
      discountPercent: ".prc-box-dscntd-prc, [class*='discount-rate']",
      image: "img",
      link: "a",
    },
    headers: { "User-Agent": BROWSER_UA },
  },
  {
    slug: "hepsiburada",
    name: "Hepsiburada",
    campaignUrl: "https://www.hepsiburada.com/kozmetik-kisisel-bakim-c-702",
    selectors: {
      dealContainer: "[data-test-id='product-card'], .product-card, [class*='productCard']",
      title: "[data-test-id='product-card-name'], .product-title, [class*='productName']",
      price: "[data-test-id='price-current-price'], .product-price, [class*='price']",
      originalPrice: "[data-test-id='price-old-price'], .old-price",
      image: "img",
      link: "a",
    },
    headers: { "User-Agent": BROWSER_UA },
  },
  {
    slug: "flormar",
    name: "Flormar",
    campaignUrl: "https://www.flormar.com.tr/kampanyalar",
    selectors: {
      dealContainer: ".campaign-item, .product-item, [class*='campaign'], [class*='product']",
      title: "h2, h3, .title, [class*='title'], .product-name",
      price: ".price, [class*='price']",
      originalPrice: ".old-price, [class*='old-price'], del",
      image: "img",
      link: "a",
    },
    headers: { "User-Agent": BROWSER_UA },
  },
];

// Stores that only show campaign links (no scraping attempted)
export const LINK_ONLY_STORES = ["sephora", "mac"];
