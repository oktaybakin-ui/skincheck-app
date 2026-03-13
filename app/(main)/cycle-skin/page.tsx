"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useState, useEffect, useMemo } from "react";
import {
  Droplets, Sun, Egg, Moon, Sparkles, ShieldCheck,
  Lightbulb, AlertTriangle, FlaskConical, Heart,
} from "lucide-react";

const CYCLE_KEY = "skincheck_period_data";

interface PeriodData {
  periods: string[];
  cycleLength: number;
  periodLength: number;
}

function loadData(): PeriodData {
  if (typeof window === "undefined") return { periods: [], cycleLength: 28, periodLength: 5 };
  try {
    const raw = localStorage.getItem(CYCLE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { periods: [], cycleLength: 28, periodLength: 5 };
}

type Phase = "menstruation" | "follicular" | "ovulation" | "luteal";

interface PhaseInfo {
  key: Phase;
  label: string;
  icon: typeof Droplets;
  color: string;
  bgColor: string;
  dayRange: string;
  hormones: string;
  skinChanges: string[];
  routineSteps: { step: string; detail: string }[];
  ingredients: string[];
  avoid: string[];
  tips: string[];
  productTypes: string[];
}

function getPhaseInfos(cycleLength: number, periodLength: number): PhaseInfo[] {
  const ovDay = cycleLength - 14;
  return [
    {
      key: "menstruation",
      label: "Menstruasyon Fazı",
      icon: Droplets,
      color: "text-danger",
      bgColor: "bg-danger/10",
      dayRange: `1-${periodLength}. gün`,
      hormones: "Estrojen ve progesteron en düşük seviyede",
      skinChanges: [
        "Cilt hassas ve kuru olabilir",
        "Kızarıklık ve irritasyon riski artar",
        "Cilt bariyeri zayıflar",
        "Sivilce ve akne belirginleşebilir",
        "Göz altı morlukları daha belirgin",
      ],
      routineSteps: [
        { step: "Nazik temizlik", detail: "Sülfatsız, pH dengeli temizleyici kullan. Köpüklü temizleyicilerden kaçın." },
        { step: "Nemlendirme", detail: "Zengin, besleyici nemlendirici uygula. Hyaluronik asit serum ekleme" },
        { step: "Göz çevresi", detail: "Kafeinli göz kremi ile şişliği ve koyu halkaları azalt" },
        { step: "Güneş koruma", detail: "SPF 30+ mineral güneş kremi (cildi daha az tahriş eder)" },
        { step: "Gece bakımı", detail: "Onarıcı gece kremi veya uyku maskesi uygula" },
      ],
      ingredients: ["Hyaluronik asit", "Ceramide", "Centella Asiatica", "Aloe vera", "Panthenol", "Niacinamide"],
      avoid: ["AHA/BHA peeling", "Retinol", "Vitamin C (yüksek konsantrasyon)", "Alkollü ürünler", "Sert scrub"],
      tips: [
        "Sıcak su yerine ılık su ile yıka",
        "Pamuklu yastık kılıfı kullan",
        "Bol su iç, cildi içten nemlendir",
        "Makyajı hafif tut, cilde nefes aldır",
        "Anti-inflamatuar çay (papatya, zencefil) iç",
      ],
      productTypes: ["Nazik temizleyici", "Nemlendirici krem", "Hyaluronik asit serum", "Göz kremi", "Mineral SPF"],
    },
    {
      key: "follicular",
      label: "Foliküler Faz",
      icon: Sun,
      color: "text-safe",
      bgColor: "bg-safe/10",
      dayRange: `${periodLength + 1}-${ovDay - 3}. gün`,
      hormones: "Estrojen yükselmeye başlar, cilt canlanır",
      skinChanges: [
        "Cilt parlamaya ve canlanmaya başlar",
        "Kolajen üretimi artar",
        "Cilt bariyeri güçlenir",
        "Nem dengesi iyileşir",
        "Doğal bir ışıltı kazanırsın",
      ],
      routineSteps: [
        { step: "Aktif temizlik", detail: "Hafif AHA/BHA temizleyici ile ölü hücreleri temizle" },
        { step: "Exfoliation", detail: "Haftada 1-2 kez kimyasal peeling uygula (glikolik veya laktik asit)" },
        { step: "Serum", detail: "Vitamin C serum ile parlaklığı artır ve antioksidan koruma sağla" },
        { step: "Hafif nem", detail: "Jel kıvamında hafif nemlendirici yeterli" },
        { step: "SPF", detail: "Günlük güneş koruma, tercihen hafif formül" },
      ],
      ingredients: ["Vitamin C", "Glikolik asit", "Niacinamide", "Hyaluronik asit", "Yeşil çay", "Peptitler"],
      avoid: ["Çok ağır kremler", "Fazla yağlı ürünler"],
      tips: [
        "Bu dönem yeni ürünleri denemek için ideal!",
        "Profesyonel cilt bakımı (facial) yaptırmak için en iyi zaman",
        "Egzersiz yaparak kan dolaşımını artır",
        "Antioksidan zengin besinler tüket (meyve, sebze)",
        "Cildini besle ama aşırı katmanlamadan kaçın",
      ],
      productTypes: ["AHA/BHA toner", "Vitamin C serum", "Hafif nemlendirici", "Peeling maskesi", "SPF"],
    },
    {
      key: "ovulation",
      label: "Ovulasyon Fazı",
      icon: Egg,
      color: "text-info",
      bgColor: "bg-info/10",
      dayRange: `${ovDay - 2}-${ovDay + 2}. gün`,
      hormones: "Estrojen zirve yapıyor, testosteron hafif artıyor",
      skinChanges: [
        "Cildin en parlak ve sağlıklı göründüğü dönem!",
        "Doğal ışıltı ve nem dengesi mükemmel",
        "Gözenekler biraz genişleyebilir",
        "Yağlanma hafif artabilir (T bölgesi)",
        "Dudaklar daha dolgun görünür",
      ],
      routineSteps: [
        { step: "Dengeleyici temizlik", detail: "Gözenek temizleyici jel ile nazik temizlik" },
        { step: "Toner", detail: "Gözenek sıkılaştırıcı toner uygula (niacinamide içeren)" },
        { step: "Hafif serum", detail: "Niacinamide veya hyaluronik asit serum" },
        { step: "Nemlendirici", detail: "Oil-free, matlaştırıcı nemlendirici (yağlı bölgeler için)" },
        { step: "SPF", detail: "Mat formüllü güneş koruma" },
      ],
      ingredients: ["Niacinamide", "Salisilik asit (hafif)", "Çinko", "Hyaluronik asit", "Witch hazel"],
      avoid: ["Ağır yağlar", "Komedojenik ürünler", "Aşırı nemlendirme"],
      tips: [
        "Minimal makyajla doğal güzelliğini göster!",
        "Hafif bir bronzer veya highlighter yeterli",
        "Kil maskesi ile gözenekleri temizle",
        "Su bazlı ürünleri tercih et",
        "Bu dönemde doğal parlaklığın zaten var, abartma",
      ],
      productTypes: ["Gözenek temizleyici", "Niacinamide serum", "Mat nemlendirici", "Kil maskesi", "SPF"],
    },
    {
      key: "luteal",
      label: "Luteal Faz",
      icon: Moon,
      color: "text-warning",
      bgColor: "bg-warning/10",
      dayRange: `${ovDay + 3}-${cycleLength}. gün`,
      hormones: "Progesteron yükselir, estrojen düşer. PMS dönemi başlar.",
      skinChanges: [
        "Sebum üretimi artar, cilt yağlanır",
        "Sivilce ve akne riski en yüksek dönem",
        "Cilt ödemli ve şiş görünebilir",
        "Gözenekler genişler",
        "Ciltte hassasiyet ve kızarıklık artabilir",
        "Hiperpigmentasyon riski artar",
      ],
      routineSteps: [
        { step: "Derin temizlik", detail: "Salisilik asit içeren temizleyici ile gözenekleri temizle" },
        { step: "BHA toner", detail: "Salisilik asit toner ile yağlanmayı kontrol et" },
        { step: "Spot tedavi", detail: "Sivilce noktalarına benzoyl peroksit veya tea tree oil uygula" },
        { step: "Hafif nem", detail: "Yağsız, non-komedojenik nemlendirici" },
        { step: "Gece bakımı", detail: "Retinol (düşük konsantrasyon) ile hücre yenilenmesini destekle" },
        { step: "SPF", detail: "Mat, oil-free güneş koruma" },
      ],
      ingredients: ["Salisilik asit", "Tea tree oil", "Retinol", "Çinko", "Benzoyl peroksit", "Niacinamide", "Bakuchiol"],
      avoid: ["Ağır kremler ve yağlar", "Şekerli ve süt ürünleri (cildi kötü etkiler)", "Sert scrub (iltihabı yayar)", "Alkollü ürünler"],
      tips: [
        "Yüzüne dokunmaktan kaçın!",
        "Yastık kılıfını sık değiştir",
        "Stresi azalt (yoga, meditasyon)",
        "Omega-3 zengin besinler tüket (balık, ceviz)",
        "Çikolata ve şeker tüketimini azalt",
        "Uyku düzenine dikkat et (en az 7 saat)",
        "Makyaj fırçalarını temizle",
      ],
      productTypes: ["Salisilik asit temizleyici", "BHA toner", "Spot tedavi", "Oil-free nemlendirici", "Retinol serum", "Kil maskesi"],
    },
  ];
}

export default function CycleSkinPage() {
  const [data, setData] = useState<PeriodData>({ periods: [], cycleLength: 28, periodLength: 5 });
  const [selectedPhase, setSelectedPhase] = useState<Phase | null>(null);

  useEffect(() => {
    setData(loadData());
  }, []);

  const phases = useMemo(() => getPhaseInfos(data.cycleLength, data.periodLength), [data]);

  const currentPhase = useMemo(() => {
    if (data.periods.length === 0) return null;
    const sorted = [...data.periods].sort();
    const lastStart = new Date(sorted[sorted.length - 1]);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - lastStart.getTime()) / (1000 * 60 * 60 * 24));
    const dayInCycle = (diffDays % data.cycleLength) + 1;
    const ovDay = data.cycleLength - 14;

    let phase: Phase;
    if (dayInCycle <= data.periodLength) phase = "menstruation";
    else if (dayInCycle <= ovDay - 3) phase = "follicular";
    else if (dayInCycle <= ovDay + 2) phase = "ovulation";
    else phase = "luteal";

    return { phase, dayInCycle };
  }, [data]);

  const activePhase = selectedPhase
    ? phases.find((p) => p.key === selectedPhase)!
    : currentPhase
      ? phases.find((p) => p.key === currentPhase.phase)!
      : phases[0];

  return (
    <>
      <Header title="Döngü & Cilt Bakımı" showBack />
      <main className="px-4 py-4 space-y-4 pb-28">
        {/* Current Phase Banner */}
        {currentPhase && (
          <div className={`rounded-2xl p-5 text-center ${activePhase.bgColor}`}>
            {(() => { const Icon = activePhase.icon; return <Icon size={40} className={`mx-auto ${activePhase.color}`} />; })()}
            <h2 className={`text-lg font-bold mt-2 ${activePhase.color}`}>
              {currentPhase ? `Döngünün ${currentPhase.dayInCycle}. Günü` : "Döngü Takibi"}
            </h2>
            <p className="text-sm text-muted mt-1">
              {currentPhase ? `Şu an: ${phases.find(p => p.key === currentPhase.phase)?.label}` : "Aşağıdan bir faz seçin"}
            </p>
          </div>
        )}

        {!currentPhase && (
          <Card className="border-primary/20 bg-primary/5 text-center">
            <Sparkles size={32} className="mx-auto text-primary" />
            <p className="text-sm font-semibold mt-2">Döngü Verisi Bulunamadı</p>
            <p className="text-xs text-muted mt-1">
              Ana sayfadaki Regl Takibi'nden döngü bilgilerinizi girin
            </p>
          </Card>
        )}

        {/* Phase Selector */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {phases.map((p) => {
            const Icon = p.icon;
            const isActive = activePhase.key === p.key;
            const isCurrent = currentPhase?.phase === p.key;
            return (
              <button
                key={p.key}
                onClick={() => setSelectedPhase(p.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  isActive ? `${p.bgColor} ${p.color} ring-2 ring-current/20` : "bg-gray-100 text-muted hover:bg-gray-200"
                }`}
              >
                <Icon size={14} />
                {p.label.replace(" Fazı", "")}
                {isCurrent && !selectedPhase && <span className="w-2 h-2 rounded-full bg-current animate-pulse" />}
              </button>
            );
          })}
        </div>

        {/* Phase Detail */}
        <Card>
          <div className="flex items-center gap-3 mb-3">
            {(() => { const Icon = activePhase.icon; return <Icon size={24} className={activePhase.color} />; })()}
            <div>
              <h3 className="font-bold text-sm">{activePhase.label}</h3>
              <p className="text-xs text-muted">{activePhase.dayRange} | {activePhase.hormones}</p>
            </div>
          </div>
        </Card>

        {/* Skin Changes */}
        <Card>
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className={activePhase.color} />
            Cildinde Ne Değişir?
          </h3>
          <ul className="space-y-2">
            {activePhase.skinChanges.map((change, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className={activePhase.color}>•</span>
                <span>{change}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Routine Steps */}
        <Card>
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <ShieldCheck size={16} className="text-primary" />
            Bakım Rutini
          </h3>
          <div className="space-y-3">
            {activePhase.routineSteps.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${activePhase.bgColor} ${activePhase.color}`}>
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold">{step.step}</p>
                  <p className="text-xs text-muted mt-0.5">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Ingredients */}
        <Card>
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
            <FlaskConical size={16} className="text-safe" />
            Ara: Bu İçerikler
          </h3>
          <div className="flex flex-wrap gap-2">
            {activePhase.ingredients.map((ing) => (
              <Badge key={ing} variant="safe" size="md">{ing}</Badge>
            ))}
          </div>
        </Card>

        {/* Avoid */}
        <Card>
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
            <AlertTriangle size={16} className="text-danger" />
            Kaçın: Bu Dönem Değil
          </h3>
          <div className="flex flex-wrap gap-2">
            {activePhase.avoid.map((item) => (
              <Badge key={item} variant="danger" size="md">{item}</Badge>
            ))}
          </div>
        </Card>

        {/* Product Types */}
        <Card>
          <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
            <Heart size={16} className="text-primary" />
            Önerilen Ürün Tipleri
          </h3>
          <div className="flex flex-wrap gap-2">
            {activePhase.productTypes.map((p) => (
              <Badge key={p} variant="primary" size="md">{p}</Badge>
            ))}
          </div>
        </Card>

        {/* Tips */}
        <Card>
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <Lightbulb size={16} className="text-warning" />
            Bu Dönem İçin İpuçları
          </h3>
          <ul className="space-y-2">
            {activePhase.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Sparkles size={14} className="text-primary mt-0.5 shrink-0" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* All Phases Overview */}
        <Card>
          <h3 className="font-bold text-sm mb-3">Tüm Fazlar</h3>
          <div className="space-y-2">
            {phases.map((p) => {
              const Icon = p.icon;
              const isCurrent = currentPhase?.phase === p.key;
              return (
                <button
                  key={p.key}
                  onClick={() => setSelectedPhase(p.key)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    activePhase.key === p.key ? `${p.bgColor}` : "hover:bg-gray-50"
                  }`}
                >
                  <Icon size={20} className={p.color} />
                  <div className="text-left flex-1">
                    <p className="text-sm font-semibold">{p.label}</p>
                    <p className="text-xs text-muted">{p.dayRange}</p>
                  </div>
                  {isCurrent && (
                    <Badge variant="primary" size="sm">Şu an</Badge>
                  )}
                </button>
              );
            })}
          </div>
        </Card>
      </main>
    </>
  );
}
