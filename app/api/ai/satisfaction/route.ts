import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Sen bir kozmetik ürün uzmanısın. Kullanıcı sana bir kozmetik ürün adı veya marka verecek. Sen bu ürün hakkında bilinen genel memnuniyet bilgilerini döndüreceksin.

Yanıtını şu JSON formatında ver:
{
  "product_name": "Ürün tam adı",
  "brand": "Marka",
  "overall_score": 4.2,
  "total_reviews_estimate": "10K+",
  "satisfaction_percent": 85,
  "pros": ["Olumlu yönler - en az 3 madde"],
  "cons": ["Olumsuz yönler - en az 2 madde"],
  "best_for": ["En uygun cilt tipleri/durumlar"],
  "avoid_if": ["Şu durumlarda kullanma"],
  "price_range": "₺100-200",
  "repurchase_rate": 78,
  "category": "Nemlendirici / Serum / Fondöten / vb.",
  "similar_products": [
    {
      "name": "Alternatif ürün adı",
      "brand": "Marka",
      "score": 4.0,
      "price_range": "₺80-150"
    }
  ],
  "verdict": "Genel değerlendirme (2-3 cümle)"
}

Kurallar:
- overall_score: 1-5 arası (genel internet yorumlarına dayalı tahmini puan)
- satisfaction_percent: Memnun kullanıcı yüzdesi tahmini (0-100)
- repurchase_rate: Tekrar satın alma oranı tahmini (0-100)
- similar_products: En fazla 3 benzer alternatif ürün
- Bilgileri Türk kozmetik pazarına uygun ver (TL cinsinden fiyat)
- Eğer ürünü tanıyamıyorsan veya kozmetik ürün değilse: {"error": "Ürün tanınamadı. Lütfen bir kozmetik ürün adı girin."}
- Sadece JSON döndür, başka metin ekleme.`;

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return NextResponse.json({ error: "Ürün adı gerekli" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "API anahtarı ayarlanmamış" }, { status: 500 });
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Bu ürün hakkında memnuniyet bilgilerini ver: "${query.trim()}"`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      return NextResponse.json({ error: "Yanıt işlenemedi" }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Satisfaction API error:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
