import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Sen bir kozmetik kimyageri ve dermatologsun. Sana verilen kozmetik içerik maddesini Türkçe olarak açıklayacaksın.

Yanıtını şu JSON formatında ver:
{
  "common_name_tr": "Türkçe yaygın adı",
  "simple_explanation": "Anlaşılır 1-2 cümle açıklama. Halk dilinde.",
  "function": "Nemlendirici / Koruyucu / Emülgatör / Yüzey aktif madde / Antioksidan vb.",
  "risk_assessment": {
    "general": "safe|low|moderate|high",
    "for_skin_type": "safe|low|moderate|high",
    "pregnancy": "safe|caution|avoid|unknown",
    "reasoning": "Kısa açıklama"
  },
  "comedogenic_score": 0-5,
  "irritancy_score": 0-5,
  "good_for": ["oily", "dry"],
  "bad_for": ["sensitive"],
  "alternatives": ["Alternatif içerik 1", "Alternatif içerik 2"]
}

Bilimsel ve doğru bilgi ver. Abartma veya gereksiz korkutma yapma. Risk seviyesini belirlerken CIR (Cosmetic Ingredient Review) ve EWG verilerini referans al. Sadece JSON döndür, başka metin ekleme.`;

export async function POST(req: NextRequest) {
  try {
    const { inci_name, user_skin_type, user_condition } = await req.json();

    if (!inci_name) {
      return NextResponse.json({ error: "inci_name gerekli" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      // Fallback: return basic info without AI
      return NextResponse.json({
        common_name_tr: inci_name,
        simple_explanation: "AI analizi yapılamadı. API anahtarı ayarlanmamış.",
        function: "Bilinmiyor",
        risk_assessment: { general: "unknown", for_skin_type: "unknown", pregnancy: "unknown", reasoning: "" },
        comedogenic_score: 0,
        irritancy_score: 0,
        good_for: [],
        bad_for: [],
        alternatives: [],
      });
    }

    const userContext = user_skin_type
      ? `Kullanıcının cilt tipi: ${user_skin_type}. ${user_condition && user_condition !== "none" ? `Özel durum: ${user_condition}.` : ""}`
      : "";

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `İçerik: ${inci_name}\n${userContext}\n\nBu içeriği analiz et.`,
        },
      ],
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI yanıtı parse edilemedi" }, { status: 500 });
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Analyze ingredient error:", error);
    return NextResponse.json({ error: "Analiz sırasında hata oluştu" }, { status: 500 });
  }
}
