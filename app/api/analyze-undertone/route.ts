import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Sen profesyonel bir renk analisti ve cilt uzmanısın. Sana gönderilen yüz/bilek/el fotoğrafını analiz ederek kişinin cilt alt tonunu (undertone) belirlemeye çalışacaksın.

Analiz ederken şunlara dikkat et:
1. Damar renkleri (yeşilimsi = sıcak, mavimsi = soğuk, karışık = nötr)
2. Cilt yüzeyinin genel renk tonu
3. Kızarıklık veya sarımsılık eğilimi
4. Dudak doğal rengi
5. Göz altı bölgesi renk tonu

Yanıtını şu JSON formatında ver:
{
  "success": true,
  "undertone": "warm" | "cool" | "neutral",
  "confidence": "high" | "medium" | "low",
  "analysis": {
    "skin_tone": "Açık / Orta / Koyu / Çok Koyu",
    "vein_observation": "Damar rengi gözlemi",
    "surface_tone": "Yüzey tonu gözlemi",
    "overall_warmth": "Genel sıcaklık-soğukluk değerlendirmesi"
  },
  "season": "İlkbahar | Yaz | Sonbahar | Kış",
  "season_detail": "Mevsim tipi hakkında kısa açıklama",
  "recommendations": {
    "foundation_tone": "Fondöten alt ton önerisi",
    "best_colors": ["En yakışan 5 renk"],
    "avoid_colors": ["Kaçınılması gereken 3 renk"],
    "metal": "Altın / Gümüş / Rose Gold / Hepsi",
    "lip_tip": "Ruj tonu önerisi",
    "blush_tip": "Allık tonu önerisi"
  },
  "description": "Kullanıcıya yönelik 2-3 cümlelik kişiselleştirilmiş açıklama"
}

Eğer fotoğrafta cilt göremiyorsan veya analiz yapamıyorsan:
{
  "success": false,
  "error": "Fotoğrafta yeterli cilt bölgesi görünmüyor. Lütfen yüzünüzün veya bileğinizin iç kısmının net göründüğü bir fotoğraf çekin."
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
              text: "Bu fotoğraftaki kişinin cilt alt tonunu analiz et. Damar renkleri, cilt yüzey tonu ve genel sıcaklık-soğukluk durumunu değerlendir.",
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
    console.error("Undertone analysis error:", error);
    return NextResponse.json(
      { error: "Alt ton analizi sırasında hata oluştu" },
      { status: 500 }
    );
  }
}
