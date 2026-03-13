"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useState } from "react";
import PinterestButton from "@/components/ui/PinterestButton";
import { Scissors, Droplets, Wind, Sparkles, AlertTriangle, Leaf } from "lucide-react";

type HairType = "straight" | "wavy" | "curly" | "coily";
type HairIssue = "dry" | "oily" | "dandruff" | "loss" | "colored" | "damaged";

const HAIR_TYPES: { key: HairType; label: string; desc: string; icon: string }[] = [
  { key: "straight", label: "Düz", desc: "Kaymak gibi düz saçlar", icon: "💇‍♀️" },
  { key: "wavy", label: "Dalgalı", desc: "Hafif dalgalı, S şekilli", icon: "🌊" },
  { key: "curly", label: "Kıvırcık", desc: "Belirgin bukleler", icon: "🌀" },
  { key: "coily", label: "Çok Kıvırcık", desc: "Sıkı bukleler veya afro", icon: "💫" },
];

const HAIR_ISSUES: { key: HairIssue; label: string; icon: typeof Droplets }[] = [
  { key: "dry", label: "Kuru & Mat", icon: Droplets },
  { key: "oily", label: "Yağlı", icon: Wind },
  { key: "dandruff", label: "Kepek", icon: Sparkles },
  { key: "loss", label: "Dökülme", icon: AlertTriangle },
  { key: "colored", label: "Boyalı", icon: Scissors },
  { key: "damaged", label: "Yıpranmış", icon: Leaf },
];

interface HairAdvice {
  routine: { step: string; detail: string }[];
  products: string[];
  tips: string[];
  avoid: string[];
  ingredients: string[];
}

function getAdvice(type: HairType, issue: HairIssue): HairAdvice {
  const base: Record<HairType, { routine: { step: string; detail: string }[]; products: string[] }> = {
    straight: {
      routine: [
        { step: "Hafif şampuan ile yıkayın", detail: "Hacim veren, hafif formüllü şampuan tercih edin. Düz saçlar ağır ürünlerle yapışır." },
        { step: "Saç uçlarına krem sürün", detail: "Sadece uçlara hafif bir krem uygulayın, köklere sürmeyin." },
        { step: "Soğuk su ile durulayın", detail: "Son durulama soğuk su ile yapın, parlak ve düz görünüm sağlar." },
      ],
      products: ["Hacim şampuanı", "Hafif saç kremi", "Parlak sprey", "Isı koruyucu"],
    },
    wavy: {
      routine: [
        { step: "Sülfatsız şampuan kullanın", detail: "Dalgaları kurutmayan nazik formüller seçin." },
        { step: "Saç maskesi haftada 1 uygulayın", detail: "Nem veren maske ile dalgaları besleyin." },
        { step: "Difüzörle kurutun", detail: "Difüzör başlığı ile saçı kurutun, dalgalar daha belirgin olur." },
      ],
      products: ["Sülfatsız şampuan", "Curl cream", "Difüzör", "Deniz tuzu spreyi"],
    },
    curly: {
      routine: [
        { step: "Co-wash yöntemi deneyin", detail: "Her yıkamada şampuan yerine saç kremi ile yıkayın, haftada 1 şampuan kullanın." },
        { step: "Leave-in conditioner uygulayın", detail: "Islak saça durulanmayan krem uygulayın, bukleleri tanımlayın." },
        { step: "Havlu yerine tişört kullanın", detail: "Pamuklu havlu yerine mikrofiber veya eski tişört ile saçı kurutun." },
      ],
      products: ["Co-wash kremi", "Leave-in conditioner", "Curl defining gel", "Mikrofiber havlu"],
    },
    coily: {
      routine: [
        { step: "Haftada 1 şampuanlayın", detail: "Çok kıvırcık saçlar daha az yıkanmalı. Aralarında co-wash yapın." },
        { step: "LOC yöntemi uygulayın", detail: "Liquid (su) → Oil (yağ) → Cream (krem) sırası ile nemlendirin." },
        { step: "Protective style deneyin", detail: "Örgü, twist-out gibi koruyucu stiller saçı yıpranmadan korur." },
      ],
      products: ["Nemlendirici şampuan", "Shea butter", "Coconut oil", "Örgü bandı"],
    },
  };

  const issueAdvice: Record<HairIssue, { tips: string[]; avoid: string[]; ingredients: string[] }> = {
    dry: {
      tips: [
        "Haftada 2 kez derin nemlendirici maske uygulayın",
        "Saç yağı (argan, jojoba) uçlara düzenli sürün",
        "Çok sık yıkamaktan kaçının, 2-3 günde bir yeterli",
        "Bol su için, nem içeriden başlar",
      ],
      avoid: ["Sülfatlı şampuanlar", "Alkol içeren ürünler", "Çok sıcak fön", "Günlük yıkama"],
      ingredients: ["Hyaluronik asit", "Argan yağı", "Shea butter", "Gliserin", "Keratin"],
    },
    oily: {
      tips: [
        "Köklere odaklanarak yıkayın, uçlara şampuan sürmeyin",
        "Hafif formüllü, yağsız ürünler tercih edin",
        "Saçı çok sık ellemekten kaçının, yağ transferi olur",
        "Kuru şampuan acil çözüm için ideal",
      ],
      avoid: ["Ağır yağlar ve butter ürünler", "Silikon bazlı ürünler (köklere)", "Çok sıcak su ile yıkama"],
      ingredients: ["Çay ağacı yağı", "Salisilik asit", "Kil", "Nane özü", "Limon özü"],
    },
    dandruff: {
      tips: [
        "Kepeğe özel şampuanı haftada 2-3 kez kullanın",
        "Şampuanı 3-5 dakika bekletin, hemen durlamayın",
        "Saç derisini tırnaklarla değil parmak uçlarıyla masaj yapın",
        "Stres ve beslenme de kepek tetikleyebilir",
      ],
      avoid: ["Sıcak su ile yıkama", "Çok sık saç kurutma", "Parfümlü saç ürünleri", "Saç derisi irritanları"],
      ingredients: ["Zinc pyrithione", "Ketoconazole", "Selenyum sülfür", "Çay ağacı yağı"],
    },
    loss: {
      tips: [
        "Dermatologa danışın, altta yatan neden olabilir",
        "Saç derisine masaj yapın, kan dolaşımını artırır",
        "Biotin, demir ve çinko takviyesi alın (doktor onayı ile)",
        "Sıkı topuz ve at kuyruğundan kaçının (traction alopecia)",
      ],
      avoid: ["Sıkı saç modelleri", "Kimyasal işlemler", "Aşırı ısı uygulaması", "Sülfatlı şampuanlar"],
      ingredients: ["Biotin", "Kafein", "Niasinamid", "Saw palmetto", "Minoxidil (reçeteli)"],
    },
    colored: {
      tips: [
        "Renk koruyucu şampuan ve krem kullanın",
        "UV koruyucu saç ürünleri tercih edin",
        "Yıkama sıklığını azaltın, renk daha uzun kalır",
        "Soğuk su ile durulama rengi mühürler",
      ],
      avoid: ["Sülfatlı şampuanlar", "Çok sıcak su", "Klor ve tuzlu su", "UV korumasız dışarı çıkma"],
      ingredients: ["Keratin", "Argan yağı", "UV filtreleri", "Amino asitler", "Panthenol"],
    },
    damaged: {
      tips: [
        "Protein içeren maske haftada 1 uygulayın",
        "Kırık uçları düzenli kestirin (8 haftada bir)",
        "Isı aleti kullanımını minimuma indirin",
        "Uyumadan önce saten yastık kılıfı kullanın",
      ],
      avoid: ["Günlük ısı aleti", "Kimyasal işlemler", "Islak saçı tarama", "Pamuk havlu ile ovalama"],
      ingredients: ["Keratin", "Silk protein", "Bond repair (Olaplex benzeri)", "Argan yağı", "Biotin"],
    },
  };

  return {
    routine: base[type].routine,
    products: base[type].products,
    ...issueAdvice[issue],
  };
}

export default function HairCarePage() {
  const [step, setStep] = useState<"type" | "issue" | "result">("type");
  const [hairType, setHairType] = useState<HairType | null>(null);
  const [hairIssue, setHairIssue] = useState<HairIssue | null>(null);

  const handleTypeSelect = (type: HairType) => {
    setHairType(type);
    setStep("issue");
  };

  const handleIssueSelect = (issue: HairIssue) => {
    setHairIssue(issue);
    setStep("result");
  };

  const reset = () => {
    setStep("type");
    setHairType(null);
    setHairIssue(null);
  };

  if (step === "result" && hairType && hairIssue) {
    const advice = getAdvice(hairType, hairIssue);
    const typeLabel = HAIR_TYPES.find(t => t.key === hairType)?.label;
    const issueLabel = HAIR_ISSUES.find(i => i.key === hairIssue)?.label;

    return (
      <>
        <Header title="Saç Bakım Rehberi" showBack />
        <main className="px-4 py-4 space-y-4 pb-28">
          <div className="text-center">
            <h2 className="text-lg font-bold">{typeLabel} Saç - {issueLabel}</h2>
            <p className="text-sm text-muted mt-1">Sana özel bakım rehberin hazır!</p>
          </div>

          {/* Routine */}
          <Card>
            <h3 className="font-bold text-sm mb-3">Bakım Rutini</h3>
            <div className="space-y-3">
              {advice.routine.map((r, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{r.step}</p>
                    <p className="text-xs text-muted mt-0.5">{r.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Products */}
          <Card>
            <h3 className="font-bold text-sm mb-3">Önerilen Ürün Kategorileri</h3>
            <div className="flex flex-wrap gap-2">
              {advice.products.map(p => (
                <Badge key={p} variant="primary" size="md">{p}</Badge>
              ))}
            </div>
          </Card>

          {/* Tips */}
          <Card>
            <h3 className="font-bold text-sm mb-3">İpuçları</h3>
            <ul className="space-y-2">
              {advice.tips.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Sparkles size={14} className="text-primary mt-0.5 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Ingredients */}
          <Card>
            <h3 className="font-bold text-sm mb-3">Araman Gereken İçerikler</h3>
            <div className="flex flex-wrap gap-2">
              {advice.ingredients.map(ing => (
                <Badge key={ing} variant="safe" size="md">{ing}</Badge>
              ))}
            </div>
          </Card>

          {/* Avoid */}
          <Card>
            <h3 className="font-bold text-sm mb-3">Kaçınman Gerekenler</h3>
            <div className="flex flex-wrap gap-2">
              {advice.avoid.map(a => (
                <Badge key={a} variant="danger" size="md">{a}</Badge>
              ))}
            </div>
          </Card>

          <PinterestButton
            query={`${hairType === "straight" ? "straight" : hairType === "wavy" ? "wavy" : hairType === "curly" ? "curly" : "coily"} hair care routine`}
            className="w-full"
          />

          <button onClick={reset} className="w-full py-3 text-sm text-primary font-medium hover:underline">
            Tekrar Seç
          </button>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Saç Bakım Rehberi" showBack />
      <main className="px-4 py-4 space-y-4">
        {step === "type" && (
          <>
            <h2 className="text-lg font-bold text-center">Saç Tipin Ne?</h2>
            <p className="text-sm text-muted text-center">Saç tipini seç, sana özel bakım rehberi oluşturalım</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {HAIR_TYPES.map(t => (
                <Card key={t.key} hoverable onClick={() => handleTypeSelect(t.key)}>
                  <div className="text-center">
                    <span className="text-3xl">{t.icon}</span>
                    <p className="font-semibold text-sm mt-2">{t.label}</p>
                    <p className="text-xs text-muted mt-1">{t.desc}</p>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {step === "issue" && (
          <>
            <h2 className="text-lg font-bold text-center">Saç Sorunun Ne?</h2>
            <p className="text-sm text-muted text-center">En çok seni rahatsız eden sorunu seç</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {HAIR_ISSUES.map(issue => {
                const Icon = issue.icon;
                return (
                  <Card key={issue.key} hoverable onClick={() => handleIssueSelect(issue.key)}>
                    <div className="text-center">
                      <Icon size={28} className="mx-auto text-primary" />
                      <p className="font-semibold text-sm mt-2">{issue.label}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
            <button onClick={() => setStep("type")} className="w-full py-2 text-sm text-muted hover:text-primary">
              Geri Dön
            </button>
          </>
        )}
      </main>
    </>
  );
}
