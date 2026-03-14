import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Sen profesyonel bir cilt bakım uzmanısın. Sana gönderilen fotoğraflardaki kozmetik ürünleri tanıyıp, kişiye özel sabah ve akşam cilt bakım rutini oluşturacaksın.

Her ürünü tanımla ve şunları belirle:
1. Ürün adı ve markası
2. Ürün kategorisi (temizleyici, tonik, serum, nemlendirici, SPF, göz kremi vb.)
3. Hangi vakitte kullanılmalı (sabah/akşam/her ikisi)
4. Uygulama sırası

Yanıtını şu JSON formatında ver:
{
  "products": [
    {
      "name": "Ürün adı",
      "brand": "Marka",
      "category": "Kategori",
      "time": "morning" | "evening" | "both"
    }
  ],
  "morning_routine": [
    {
      "order": 1,
      "product": "Ürün adı",
      "step": "Adım açıklaması",
      "tip": "Uygulama ipucu"
    }
  ],
  "evening_routine": [
    {
      "order": 1,
      "product": "Ürün adı",
      "step": "Adım açıklaması",
      "tip": "Uygulama ipucu"
    }
  ],
  "warnings": ["Uyumsuz ürün uyarıları"],
  "missing": ["Eksik ürün önerileri (ör. SPF eksikse belirt)"]
}

Eğer fotoğrafta ürün göremiyorsan:
{
  "products": [],
  "error": "Fotoğrafta kozmetik ürün tespit edilemedi."
}

Sadece JSON döndür.`;

export async function POST(req: NextRequest) {
  try {
    const { images } = await req.json();

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: "En az bir fotoğraf gerekli" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "AI analizi yapılamadı. API anahtarı ayarlanmamış." },
        { status: 500 }
      );
    }

    const imageContents = images.map((image: string) => {
      let mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp" = "image/jpeg";
      let base64Data = image;
      const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
      if (match) {
        mediaType = match[1] as typeof mediaType;
        base64Data = match[2];
      }
      return {
        type: "image" as const,
        source: {
          type: "base64" as const,
          media_type: mediaType,
          data: base64Data,
        },
      };
    });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            ...imageContents,
            {
              type: "text" as const,
              text: "Bu fotoğraflardaki kozmetik ürünleri tanı ve bana sabah-akşam cilt bakım rutini oluştur.",
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
    console.error("Routine creation error:", error);
    return NextResponse.json({ error: "Rutin oluşturma sırasında hata oluştu" }, { status: 500 });
  }
}
