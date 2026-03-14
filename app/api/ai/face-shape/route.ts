import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Sen profesyonel bir yüz analisti ve güzellik uzmanısın. Sana gönderilen yüz fotoğrafını analiz ederek kişinin yüz şeklini belirlemeye çalışacaksın.

5 temel yüz şekli:
- oval: Alın hafifçe geniş, çene yumuşak, yüz uzunluğu genişliğinin yaklaşık 1.5 katı
- round: Yüz genişliği ve uzunluğu yaklaşık eşit, yumuşak hatlar, belirgin elmacık kemikleri
- square: Güçlü çene hattı, geniş alın, köşeli hatlar
- heart: Geniş alın, sivri/dar çene, elmacık kemikleri belirgin
- long: Alın-çene mesafesi uzun, dar yüz, yüksek alın

Analiz ederken şunlara dikkat et:
1. Alın genişliği
2. Elmacık kemikleri
3. Çene hattı ve şekli
4. Yüz uzunluk-genişlik oranı
5. Genel yüz simetrisi

Yanıtını şu JSON formatında ver:
{
  "success": true,
  "faceShape": "oval" | "round" | "square" | "heart" | "long",
  "confidence": "high" | "medium" | "low",
  "analysis": "Yüz şekli hakkında 2-3 cümlelik Türkçe açıklama"
}

Eğer fotoğrafta yüz göremiyorsan:
{
  "success": false,
  "error": "Fotoğrafta yüz net görünmüyor. Lütfen yüzünüzün tam ve net göründüğü bir fotoğraf yükleyin."
}

Sadece JSON döndür, başka metin ekleme.`;

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "Fotoğraf gerekli" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { success: false, error: "AI analizi yapılamadı. API anahtarı ayarlanmamış." },
        { status: 500 }
      );
    }

    // Handle both raw base64 and data URL formats
    let mediaType: "image/jpeg" | "image/png" | "image/gif" | "image/webp" = "image/jpeg";
    let base64Data = image;

    const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (match) {
      mediaType = match[1] as typeof mediaType;
      base64Data = match[2];
    }

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 512,
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
              text: "Bu fotoğraftaki kişinin yüz şeklini analiz et.",
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
    console.error("Face shape analysis error:", error);
    return NextResponse.json(
      { error: "Yüz şekli analizi sırasında hata oluştu" },
      { status: 500 }
    );
  }
}
