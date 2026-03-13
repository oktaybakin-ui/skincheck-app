import Anthropic from "@anthropic-ai/sdk";
import type { ScrapedDeal } from "./types";

const anthropic = new Anthropic();

/**
 * AI-powered fallback parser: When cheerio selectors fail to extract deals,
 * send a trimmed version of the HTML to Claude for structured extraction.
 */
export async function aiParseDeals(
  html: string,
  storeSlug: string,
  storeName: string,
  campaignUrl: string
): Promise<ScrapedDeal[]> {
  // Trim HTML to reduce token usage — keep only body content
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = bodyMatch ? bodyMatch[1] : html;

  // Remove scripts, styles, SVGs, comments
  content = content
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(header|footer|nav)[\s\S]*?<\/\1>/gi, "");

  // Truncate to ~30k chars to stay within token limits
  if (content.length > 30000) {
    content = content.slice(0, 30000);
  }

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `Bu bir Türk kozmetik mağazasının (${storeName}) kampanya sayfasının HTML içeriğidir.
Sayfadaki kampanya/indirim bilgilerini JSON formatında çıkar.

Her kampanya için şu alanları bul:
- campaign_title: Kampanya başlığı
- product_name: Ürün adı (varsa)
- brand: Marka (varsa)
- original_price: Orijinal fiyat (sayı, varsa)
- sale_price: İndirimli fiyat (sayı, varsa)
- discount_percent: İndirim yüzdesi (sayı, varsa)
- image_url: Ürün görseli URL'si (varsa)
- campaign_url: Kampanya linki (varsa)

Sadece JSON array döndür, başka bir şey yazma. Kampanya bulamazsan boş array [] döndür.

HTML:
${content}`,
        },
      ],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];

    const parsed = JSON.parse(jsonMatch[0]);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item: Record<string, unknown>) => item.campaign_title)
      .map((item: Record<string, unknown>) => ({
        store_slug: storeSlug,
        store_name: storeName,
        campaign_title: String(item.campaign_title || ""),
        campaign_url: String(item.campaign_url || campaignUrl),
        product_name: item.product_name ? String(item.product_name) : undefined,
        brand: item.brand ? String(item.brand) : undefined,
        original_price:
          typeof item.original_price === "number" ? item.original_price : undefined,
        sale_price:
          typeof item.sale_price === "number" ? item.sale_price : undefined,
        discount_percent:
          typeof item.discount_percent === "number"
            ? item.discount_percent
            : undefined,
        image_url: item.image_url ? String(item.image_url) : undefined,
        source_type: "scraped" as const,
      }));
  } catch (err) {
    console.error(`AI parser failed for ${storeSlug}:`, err);
    return [];
  }
}
