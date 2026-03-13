export interface ScrapedDeal {
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
  coupon_code?: string;
  valid_until?: string;
  image_url?: string;
  source_type: "scraped" | "campaign_link" | "api";
}

export interface ScraperResult {
  store_slug: string;
  status: "success" | "failed" | "blocked";
  deals: ScrapedDeal[];
  error?: string;
  duration_ms: number;
}

export interface RetailerConfig {
  store_slug: string;
  store_name: string;
  store_url: string;
  campaign_page_url: string | null;
  scrape_enabled: boolean;
  logo_emoji: string | null;
  description: string | null;
}
