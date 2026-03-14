import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Sen bir kozmetik ürün uzmanısın. Sana gönderilen fotoğrafı analiz ederek kozmetik ürünü tanımaya çalışacaksın.

Fotoğraftan şunları tespit etmeye çalış:
1. Ürün adı
2. Marka
3. Ürün kategorisi (nemlendirici, temizleyici, serum, ruj, fondöten vb.)
4. Varsa INCI listesi (içerik maddeleri)
5. Önemli içerik maddeleri ve bunlar hakkında dikkat edilmesi gerekenler

Yanıtını şu JSON formatında ver:
{
  "found": true/false,
  "product_name": "Ürün adı veya null",
  "brand": "Marka veya null",
  "category": "Kategori veya null",
  "ingredients_text": "INCI listesi metni veya null",
  "confidence": "high|medium|low",
  "description": "Ürün hakkında kısa açıklama",
  "key_ingredients": [
    {
      "name": "İçerik adı (Türkçe)",
      "inci_name": "INCI adı",
      "benefit": "Faydası (kısa)",
      "warning": "Dikkat edilmesi gereken (varsa, yoksa null)",
      "rating": "good" | "neutral" | "caution"
    }
  ],
  "warnings": ["Genel uyarılar - hamilelikte dikkat, alerjen riski vb."],
  "suitable_for": ["Uygun cilt tipleri"],
  "not_suitable_for": ["Uygun olmayan cilt tipleri (varsa)"]
}

key_ingredients: Fotoğraftan okunabilen veya ürünün bilinen formülasyonundaki en önemli 5-10 içeriği listele.
- rating "good": Faydalı, güvenli içerik
- rating "neutral": Nötr, dolgu/yapısal içerik
- rating "caution": Dikkat gerektiren içerik (tahriş, alerjen, hamilelikte dikkat vb.)

warnings: Ürün genelinde dikkat edilmesi gereken konular (hamilelikte kullanım, alerjen madde, güneş hassasiyeti vb.)

Eğer fotoğrafta kozmetik ürün göremiyorsan found: false döndür.
Sadece JSON döndür, başka metin ekleme.`;

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "Fotoğraf gerekli" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        found: false,
        product_name: null,
        brand: null,
        category: null,
        ingredients_text: null,
        confidence: "low",
        description: "AI analizi yapılamadı. API anahtarı ayarlanmamış.",
      });
    }

    // Extract base64 data and media type
    const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ error: "Geçersiz fotoğraf formatı" }, { status: 400 });
    }

    const mediaType = match[1] as "image/jpeg" | "image/png" | "image/gif" | "image/webp";
    const base64Data = match[2];

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: "text",
              text: "Bu fotoğraftaki kozmetik ürünü tanı ve bilgilerini ver.",
            },
          ],
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI yanıtı parse edilemedi" }, { status: 500 });
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Recognize product error:", error);
    return NextResponse.json({ error: "Ürün tanıma sırasında hata oluştu" }, { status: 500 });
  }
}
