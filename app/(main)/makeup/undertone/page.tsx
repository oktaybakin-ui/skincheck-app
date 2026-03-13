"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PinterestButton from "@/components/ui/PinterestButton";
import { useState } from "react";
import { Leaf, Snowflake, Flower, LucideIcon } from "lucide-react";

const questions = [
  {
    q: "Bileklerindeki damarlar hangi renk?",
    options: [
      { label: "Yeşil", value: "warm", desc: "Sıcak ton göstergesi" },
      { label: "Mavi-Mor", value: "cool", desc: "Soğuk ton göstergesi" },
      { label: "İkisi de", value: "neutral", desc: "Nötr ton göstergesi" },
    ],
  },
  {
    q: "Güneşte cildin ne yapar?",
    options: [
      { label: "Kolayca bronzlaşırım", value: "warm" },
      { label: "Kızarırım / yanarım", value: "cool" },
      { label: "Önce kızarır sonra bronzlaşır", value: "neutral" },
    ],
  },
  {
    q: "Altın mı gümüş mü daha çok yakışır?",
    options: [
      { label: "Altın takılar", value: "warm" },
      { label: "Gümüş takılar", value: "cool" },
      { label: "İkisi de eşit yakışır", value: "neutral" },
    ],
  },
  {
    q: "Göz rengin hangisine yakın?",
    options: [
      { label: "Kahverengi / Yeşil / Bal rengi", value: "warm" },
      { label: "Mavi / Gri / Koyu siyah", value: "cool" },
      { label: "Ela / Yeşil-gri karışık", value: "neutral" },
    ],
  },
  {
    q: "Krem beyaz mı saf beyaz mı yakışır?",
    options: [
      { label: "Krem beyaz / Ekru", value: "warm" },
      { label: "Saf beyaz / Kar beyazı", value: "cool" },
      { label: "İkisi de fark etmez", value: "neutral" },
    ],
  },
  {
    q: "Saç rengin doğal haliyle ne?",
    options: [
      { label: "Sıcak kahve / Kızıl / Karamel", value: "warm" },
      { label: "Koyu siyah / Kül kahverengi / Platin", value: "cool" },
      { label: "Orta kahverengi / Kumral", value: "neutral" },
    ],
  },
  {
    q: "Turuncu mu pembe mi daha çok yakışır?",
    options: [
      { label: "Turuncu ve şeftali tonları", value: "warm" },
      { label: "Pembe ve fuşya tonları", value: "cool" },
      { label: "İkisi de yakışır", value: "neutral" },
    ],
  },
  {
    q: "Yeşil mi mavi mı seni daha iyi gösterir?",
    options: [
      { label: "Zeytin yeşili / Hardal", value: "warm" },
      { label: "Deniz mavisi / Lavanta", value: "cool" },
      { label: "Orman yeşili / Teal", value: "neutral" },
    ],
  },
];

interface BrandProduct {
  brand: string;
  product: string;
  shade: string;
}

interface ToneResult {
  tone: string;
  season: string;
  icon: LucideIcon;
  colors: string[];
  colorNames: string[];
  lipColors: { name: string; hex: string }[];
  eyeColors: { name: string; hex: string }[];
  blushColors: { name: string; hex: string }[];
  avoid: string[];
  foundationTip: string;
  jewelryTip: string;
  brandExamples: {
    foundation: BrandProduct[];
    lipstick: BrandProduct[];
  };
}

const RESULTS: Record<string, ToneResult> = {
  warm: {
    tone: "Sıcak",
    season: "Sonbahar",
    icon: Leaf,
    colors: ["#C2185B", "#E65100", "#F57F17", "#558B2F", "#795548", "#FF8F00", "#BF360C"],
    colorNames: ["Bordo", "Turuncu", "Hardal", "Zeytin Yeşili", "Kahve", "Amber", "Kızıl"],
    lipColors: [
      { name: "Tuğla Kırmızı", hex: "#B71C1C" },
      { name: "Şeftali", hex: "#FF8A65" },
      { name: "Terracotta", hex: "#BF360C" },
      { name: "Nude Bej", hex: "#D7A98C" },
    ],
    eyeColors: [
      { name: "Bakır", hex: "#BF6B3A" },
      { name: "Altın", hex: "#C9A84C" },
      { name: "Haki", hex: "#6B7821" },
      { name: "Kahverengi", hex: "#5D4037" },
    ],
    blushColors: [
      { name: "Şeftali", hex: "#FFAB91" },
      { name: "Kayısı", hex: "#FF8A65" },
      { name: "Bronz", hex: "#A1887F" },
    ],
    avoid: ["Gümüş tonları", "Mavi bazlı pembeler", "Siyah-beyaz kontrast", "Fuşya"],
    foundationTip: "Sarımsı veya altın bazlı fondötenler seç. 'Warm', 'Golden', 'Honey' alt tonlu ürünler sana uyar.",
    jewelryTip: "Altın, rose gold ve bakır tonlu takılar cildinle uyum sağlar.",
    brandExamples: {
      foundation: [
        { brand: "MAC", product: "Studio Fix", shade: "NC serisi (NC15, NC25, NC35)" },
        { brand: "Maybelline", product: "Fit Me", shade: "Warm Nude (128), Warm Honey (322)" },
        { brand: "L'Oréal", product: "True Match", shade: "Golden (W) serisi" },
        { brand: "Flormar", product: "Perfect Coverage", shade: "Warm tonlar (121, 131)" },
      ],
      lipstick: [
        { brand: "MAC", product: "Lipstick", shade: "Marrakesh, Velvet Teddy" },
        { brand: "Maybelline", product: "SuperStay", shade: "Caramel, Chai Genius" },
        { brand: "Golden Rose", product: "Velvet Matte", shade: "07 (Terracotta), 31 (Nude)" },
      ],
    },
  },
  cool: {
    tone: "Soğuk",
    season: "Kış",
    icon: Snowflake,
    colors: ["#AD1457", "#4A148C", "#1565C0", "#00695C", "#37474F", "#880E4F", "#283593"],
    colorNames: ["Fuşya", "Mor", "Kobalt Mavi", "Deniz Mavisi", "Antrasit", "Berry", "Lacivert"],
    lipColors: [
      { name: "Berry", hex: "#880E4F" },
      { name: "Mavi Kırmızı", hex: "#C62828" },
      { name: "Mürdüm", hex: "#6A1B9A" },
      { name: "Mauve Nude", hex: "#C48B9F" },
    ],
    eyeColors: [
      { name: "Gümüş", hex: "#9E9E9E" },
      { name: "Lavanta", hex: "#9575CD" },
      { name: "Taupe", hex: "#8D6E63" },
      { name: "Lacivert", hex: "#283593" },
    ],
    blushColors: [
      { name: "Pembe", hex: "#F48FB1" },
      { name: "Mauve", hex: "#CE93D8" },
      { name: "Berry", hex: "#AD1457" },
    ],
    avoid: ["Turuncu", "Sarı-altın tonları", "Sıcak kahverengiler", "Hardal"],
    foundationTip: "Pembe veya kırmızı bazlı fondötenler seç. 'Cool', 'Pink', 'Porcelain' alt tonlu ürünler sana uyar.",
    jewelryTip: "Gümüş, beyaz altın ve platin takılar cildinle uyum sağlar.",
    brandExamples: {
      foundation: [
        { brand: "MAC", product: "Studio Fix", shade: "NW serisi (NW15, NW25, NW35)" },
        { brand: "Maybelline", product: "Fit Me", shade: "Porcelain (110), Cool Ivory (115)" },
        { brand: "L'Oréal", product: "True Match", shade: "Cool (C) serisi" },
        { brand: "Flormar", product: "Perfect Coverage", shade: "Cool tonlar (101, 102)" },
      ],
      lipstick: [
        { brand: "MAC", product: "Lipstick", shade: "Ruby Woo, Diva" },
        { brand: "Maybelline", product: "SuperStay", shade: "Pioneer, Lover" },
        { brand: "Golden Rose", product: "Velvet Matte", shade: "12 (Berry), 18 (Mauve)" },
      ],
    },
  },
  neutral: {
    tone: "Nötr",
    season: "İlkbahar",
    icon: Flower,
    colors: ["#D81B60", "#8E24AA", "#1E88E5", "#43A047", "#6D4C41", "#00897B", "#F4511E"],
    colorNames: ["Pembe", "Mor", "Mavi", "Yeşil", "Kahve", "Teal", "Mercan"],
    lipColors: [
      { name: "Klasik Kırmızı", hex: "#D32F2F" },
      { name: "Dusty Rose", hex: "#C9787C" },
      { name: "Nude Pembe", hex: "#D4A89A" },
      { name: "Mercan", hex: "#FF7043" },
    ],
    eyeColors: [
      { name: "Şampanya", hex: "#D4C19C" },
      { name: "Taupe", hex: "#8D6E63" },
      { name: "Rose Gold", hex: "#C9917A" },
      { name: "Bronz", hex: "#8D6E4C" },
    ],
    blushColors: [
      { name: "Dusty Pink", hex: "#E8A0B2" },
      { name: "Şeftali Pembe", hex: "#FFAB91" },
      { name: "Soft Mercan", hex: "#FF8A65" },
    ],
    avoid: ["Çok neon renkler", "Çok soğuk gümüşler", "Çok sıcak sarılar"],
    foundationTip: "Nötr alt tonlu fondötenler seç. 'Neutral', 'Natural', 'Beige' etiketli ürünler sana uyar. Hem sıcak hem soğuk tonları taşıyabilirsin!",
    jewelryTip: "Rose gold, hem altın hem gümüş yakışır. En şanslı tondasın!",
    brandExamples: {
      foundation: [
        { brand: "MAC", product: "Studio Fix", shade: "N serisi (N4, N6, N8)" },
        { brand: "Maybelline", product: "Fit Me", shade: "Natural Beige (220), Natural Buff (230)" },
        { brand: "L'Oréal", product: "True Match", shade: "Neutral (N) serisi" },
        { brand: "Flormar", product: "Perfect Coverage", shade: "Neutral tonlar (111, 115)" },
      ],
      lipstick: [
        { brand: "MAC", product: "Lipstick", shade: "Twig, Mehr" },
        { brand: "Maybelline", product: "SuperStay", shade: "Seductress, Amazonian" },
        { brand: "Golden Rose", product: "Velvet Matte", shade: "01 (Dusty Rose), 27 (Nude)" },
      ],
    },
  },
};

export default function UndertonePage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (value: string) => {
    const next = [...answers, value];
    setAnswers(next);
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
    } else {
      setShowResult(true);
    }
  };

  const getResultKey = (): string => {
    const counts = { warm: 0, cool: 0, neutral: 0 };
    answers.forEach((a) => counts[a as keyof typeof counts]++);
    if (counts.warm > counts.cool && counts.warm > counts.neutral) return "warm";
    if (counts.cool > counts.warm && counts.cool > counts.neutral) return "cool";
    return "neutral";
  };

  if (showResult) {
    const key = getResultKey();
    const result = RESULTS[key];

    return (
      <>
        <Header title="Sonucun" showBack />
        <main className="px-4 py-6 space-y-6 pb-28">
          {/* Hero */}
          <div className="text-center">
            <result.icon size={56} className="mx-auto text-primary" />
            <h2 className="text-2xl font-bold mt-2">
              Sen <span className="text-primary">{result.tone} {result.season}</span> tonlusun!
            </h2>
          </div>

          {/* Colors */}
          <Card>
            <h3 className="font-bold mb-3">Sana Yakışan Renkler</h3>
            <div className="flex gap-2 flex-wrap">
              {result.colors.map((c, i) => (
                <div key={c} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: c }} />
                  <span className="text-[10px] text-muted">{result.colorNames[i]}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Lip Colors */}
          <Card>
            <h3 className="font-bold mb-3">Ruj Tonları</h3>
            <div className="grid grid-cols-2 gap-3">
              {result.lipColors.map((l) => (
                <div key={l.name} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border shadow-sm shrink-0" style={{ backgroundColor: l.hex }} />
                  <span className="text-sm">{l.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Eye Colors */}
          <Card>
            <h3 className="font-bold mb-3">Far Tonları</h3>
            <div className="grid grid-cols-2 gap-3">
              {result.eyeColors.map((e) => (
                <div key={e.name} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border shadow-sm shrink-0" style={{ backgroundColor: e.hex }} />
                  <span className="text-sm">{e.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Blush */}
          <Card>
            <h3 className="font-bold mb-3">Allık Tonları</h3>
            <div className="flex gap-3">
              {result.blushColors.map((b) => (
                <div key={b.name} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full border shadow-sm" style={{ backgroundColor: b.hex }} />
                  <span className="text-xs text-muted">{b.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Brand Examples - Foundation */}
          <Card>
            <h3 className="font-bold mb-3">Fondöten Önerileri (Marka Bazlı)</h3>
            <div className="space-y-3">
              {result.brandExamples.foundation.map((f) => (
                <div key={f.brand} className="flex items-start gap-2">
                  <Badge variant="primary" size="sm">{f.brand}</Badge>
                  <div>
                    <p className="text-sm font-medium">{f.product}</p>
                    <p className="text-xs text-muted">{f.shade}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted mt-3 leading-relaxed">{result.foundationTip}</p>
          </Card>

          {/* Brand Examples - Lipstick */}
          <Card>
            <h3 className="font-bold mb-3">Ruj Önerileri (Marka Bazlı)</h3>
            <div className="space-y-3">
              {result.brandExamples.lipstick.map((l) => (
                <div key={l.brand} className="flex items-start gap-2">
                  <Badge variant="secondary" size="sm">{l.brand}</Badge>
                  <div>
                    <p className="text-sm font-medium">{l.product}</p>
                    <p className="text-xs text-muted">{l.shade}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Tips */}
          <Card>
            <h3 className="font-bold mb-3">Takı Önerisi</h3>
            <p className="text-sm text-muted leading-relaxed">{result.jewelryTip}</p>
          </Card>

          {/* Avoid */}
          <Card>
            <h3 className="font-bold mb-3">Kaçınılacak Tonlar</h3>
            <div className="flex flex-wrap gap-2">
              {result.avoid.map((a) => (
                <Badge key={a} variant="danger" size="md">{a}</Badge>
              ))}
            </div>
          </Card>

          <PinterestButton query={`${result.tone} undertone makeup looks ${result.season}`} className="w-full" />

          <Button onClick={() => { setShowResult(false); setCurrentQ(0); setAnswers([]); }} variant="outline" fullWidth>
            Tekrar Dene
          </Button>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Alt Ton Analizi" showBack />
      <main className="px-4 py-6 space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted">{currentQ + 1} / {questions.length}</p>
          <div className="flex gap-1 mt-2">
            {questions.map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full ${i <= currentQ ? "bg-primary" : "bg-gray-200"}`} />
            ))}
          </div>
        </div>

        <h2 className="text-xl font-bold text-center">{questions[currentQ].q}</h2>

        <div className="space-y-3">
          {questions[currentQ].options.map((opt) => (
            <Card key={opt.label} hoverable onClick={() => handleAnswer(opt.value)}>
              <p className="font-semibold text-center">{opt.label}</p>
              {"desc" in opt && opt.desc && <p className="text-xs text-muted text-center">{opt.desc}</p>}
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
