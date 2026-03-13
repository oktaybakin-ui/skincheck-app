"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useAuthContext } from "@/lib/context/AuthContext";
import { useState } from "react";
import Link from "next/link";
import PinterestButton from "@/components/ui/PinterestButton";
import { Lock, Sparkles, Sun, Briefcase, Heart, Crown } from "lucide-react";

type LookType = "daily" | "work" | "special" | "date";
type SkinTone = "warm" | "cool" | "neutral";
type FaceShape = "oval" | "round" | "square" | "heart" | "long";

const LOOK_TYPES = [
  { key: "daily" as const, label: "Günlük", icon: Sun, desc: "Doğal ve hızlı" },
  { key: "work" as const, label: "İş / Ofis", icon: Briefcase, desc: "Profesyonel ve şık" },
  { key: "special" as const, label: "Özel Gün", icon: Crown, desc: "Göz alıcı ve etkileyici" },
  { key: "date" as const, label: "Randevu", icon: Heart, desc: "Romantik ve çekici" },
];

const FACE_SHAPES = [
  { key: "oval" as const, label: "Oval", icon: "🥚" },
  { key: "round" as const, label: "Yuvarlak", icon: "⭕" },
  { key: "square" as const, label: "Kare", icon: "⬜" },
  { key: "heart" as const, label: "Kalp", icon: "💛" },
  { key: "long" as const, label: "Uzun", icon: "📏" },
];

interface LookGuide {
  title: string;
  makeup: { step: string; detail: string }[];
  hair: string[];
  extras: string[];
  colors: string[];
}

function generateLook(lookType: LookType, tone: SkinTone, face: FaceShape): LookGuide {
  const toneColors: Record<SkinTone, { lip: string; eye: string; blush: string }> = {
    warm: { lip: "şeftali, tuğla kırmızı, nude bej", eye: "bakır, altın, haki", blush: "şeftali veya kayısı" },
    cool: { lip: "berry, mauve, mavi kırmızı", eye: "gümüş, lavanta, taupe", blush: "pembe veya mauve" },
    neutral: { lip: "dusty rose, mercan, klasik kırmızı", eye: "şampanya, rose gold, bronz", blush: "dusty pink veya şeftali pembe" },
  };

  const faceContour: Record<FaceShape, string> = {
    oval: "Minimal kontur yeterli - elmacık kemiklerini vurgula",
    round: "Şakaklar ve çene hattına kontur uygula, yüzü uzat",
    square: "Köşeleri yumuşat, çene kenarlarına ve alın köşelerine kontur",
    heart: "Çene uçlarını aydınlat, geniş alına hafif kontur",
    long: "Alın ve çene altına kontur, yanakları genişlet",
  };

  const c = toneColors[tone];

  const looks: Record<LookType, LookGuide> = {
    daily: {
      title: "Günlük Doğal Güzellik",
      makeup: [
        { step: "Hafif baz", detail: "BB krem veya tinted moisturizer + kapatıcı sadece gerekli yerlere" },
        { step: "Kaşlar", detail: "Kaş jeli ile tara, gerekirse kalemle seyrek yerleri doldur" },
        { step: "Göz", detail: `Tek renk far yeterli: ${c.eye.split(",")[0]} tonu` },
        { step: "Yanak", detail: `${c.blush} allık, hafifçe uygula` },
        { step: "Dudak", detail: `Lip tint veya renkli balm: ${c.lip.split(",")[0]} tonu` },
        { step: "Maskara", detail: "Bir kat maskara, doğal etki" },
      ],
      hair: ["Doğal dalgalar bırak", "Yarım topuz veya at kuyruğu", "Saç bandı ile pratik şekil"],
      extras: ["SPF unutma!", "Minimal takı - küçük küpeler", "Ferah parfüm"],
      colors: [c.lip.split(",")[0].trim(), c.eye.split(",")[0].trim(), c.blush],
    },
    work: {
      title: "Profesyonel Ofis Görünümü",
      makeup: [
        { step: "Baz", detail: "Orta kapatıcılıkta fondöten + primer ile kalıcı baz" },
        { step: "Kontur", detail: faceContour[face] },
        { step: "Göz", detail: `Nötr tonlarda 2-3 renkli göz makyajı: ${c.eye}` },
        { step: "Eyeliner", detail: "İnce kahverengi veya siyah eyeliner, abartısız" },
        { step: "Yanak", detail: `${c.blush} allık, doğal parlaklık` },
        { step: "Dudak", detail: `Kalıcı ruj: ${c.lip.split(",")[2]?.trim() || c.lip.split(",")[0].trim()} tonu` },
        { step: "Sabitleme", detail: "Sabitleyici sprey ile gün boyu dayanıklı" },
      ],
      hair: ["Düz fön veya hafif dalgalar", "Düşük topuz (chignon)", "Saç tokası ile zarif stil"],
      extras: ["İnce altın/gümüş takılar", "İyi bir parfüm", "Temiz, bakımlı tırnaklar"],
      colors: [c.lip.split(",")[0].trim(), c.eye.split(",")[1]?.trim() || c.eye.split(",")[0].trim(), c.blush],
    },
    special: {
      title: "Özel Gün Işıltısı",
      makeup: [
        { step: "Kusursuz baz", detail: "Full coverage fondöten + kapatıcı + pudra + primer" },
        { step: "Kontur & highlight", detail: `${faceContour[face]}. Highlighter ile elmacık kemikleri, burun sırtı ve cupid's bow parlatın` },
        { step: "Göz", detail: `Dramatik göz makyajı: ${c.eye}, simli accent ekle` },
        { step: "Eyeliner", detail: "Wing eyeliner veya smokey eye" },
        { step: "Kirpik", detail: "Takma kirpik veya 2-3 kat maskara" },
        { step: "Yanak", detail: `${c.blush} allık + hafif highlighter` },
        { step: "Dudak", detail: `Cesur ruj: ${c.lip.split(",")[1]?.trim() || c.lip.split(",")[0].trim()}` },
        { step: "Sabitleme", detail: "Katman katman sabitleyici sprey" },
      ],
      hair: ["Hollywood dalgaları", "Şık topuz veya yarım topuz", "Saç aksesuarı (taç, toka)"],
      extras: ["Göz alıcı takılar", "Kalıcı parfüm", "Işıltılı vücut losyonu"],
      colors: [c.lip.split(",")[1]?.trim() || c.lip.split(",")[0].trim(), c.eye, c.blush],
    },
    date: {
      title: "Romantik Randevu",
      makeup: [
        { step: "Parlak baz", detail: "Işıltılı primer + hafif-orta kapatıcı fondöten" },
        { step: "Göz", detail: `Sıcak tonlarda yumuşak far: ${c.eye.split(",")[0]} ve ${c.eye.split(",")[1]?.trim() || "nötr ton"}` },
        { step: "Kirpik", detail: "İyi kıvırılmış kirpikler + hacimli maskara" },
        { step: "Yanak", detail: `${c.blush} allık, doğal kızarıklık efekti` },
        { step: "Dudak", detail: `Çekici ama abartısız: ${c.lip.split(",")[0]} tonu. Glossy bitiriş` },
        { step: "Highlighter", detail: "Elmacık kemiklerine ışıltı ekle" },
      ],
      hair: ["Soft waves - doğal dalgalar", "Yarım topuz, yüzü çerçeveleyen bukler", "Saç parfümü kullan"],
      extras: ["Çekici ama abartısız parfüm", "Küçük ama dikkat çekici takı", "Bakımlı eller ve tırnaklar"],
      colors: [c.lip.split(",")[0].trim(), c.eye.split(",")[0].trim(), c.blush],
    },
  };

  return looks[lookType];
}

export default function BestLookPage() {
  const { user } = useAuthContext();
  const [step, setStep] = useState<"look" | "tone" | "face" | "result">("look");
  const [lookType, setLookType] = useState<LookType | null>(null);
  const [tone, setTone] = useState<SkinTone | null>(null);
  const [faceShape, setFaceShape] = useState<FaceShape | null>(null);

  const handleLook = (l: LookType) => { setLookType(l); setStep("tone"); };
  const handleTone = (t: SkinTone) => { setTone(t); setStep("face"); };
  const handleFace = (f: FaceShape) => { setFaceShape(f); setStep("result"); };

  if (step === "result" && lookType && tone && faceShape) {
    const look = generateLook(lookType, tone, faceShape);
    return (
      <>
        <Header title="En İyi Halin" showBack />
        <main className="px-4 py-4 space-y-4 pb-28">
          <div className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl p-5 text-center">
            <Sparkles size={40} className="mx-auto text-primary" />
            <h2 className="text-lg font-bold mt-2">{look.title}</h2>
            <div className="flex justify-center gap-2 mt-2">
              <Badge variant="primary" size="sm">{LOOK_TYPES.find(l => l.key === lookType)?.label}</Badge>
              <Badge variant="secondary" size="sm">{tone === "warm" ? "Sıcak Ton" : tone === "cool" ? "Soğuk Ton" : "Nötr Ton"}</Badge>
              <Badge variant="muted" size="sm">{FACE_SHAPES.find(f => f.key === faceShape)?.label} Yüz</Badge>
            </div>
          </div>

          {/* Makeup Steps */}
          <Card>
            <h3 className="font-bold text-sm mb-3">Makyaj Adımları</h3>
            <div className="space-y-3">
              {look.makeup.map((m, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i + 1}</div>
                  <div>
                    <p className="text-sm font-semibold">{m.step}</p>
                    <p className="text-xs text-muted mt-0.5">{m.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Hair */}
          <Card>
            <h3 className="font-bold text-sm mb-3">Saç Önerileri</h3>
            <ul className="space-y-2">
              {look.hair.map((h, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-primary">•</span> {h}
                </li>
              ))}
            </ul>
          </Card>

          {/* Extras */}
          <Card>
            <h3 className="font-bold text-sm mb-3">Ekstra Dokunuşlar</h3>
            <ul className="space-y-2">
              {look.extras.map((e, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Sparkles size={14} className="text-primary shrink-0" /> {e}
                </li>
              ))}
            </ul>
          </Card>

          {/* Recommended Colors */}
          <Card>
            <h3 className="font-bold text-sm mb-2">Önerilen Renkler</h3>
            <div className="flex flex-wrap gap-2">
              {look.colors.map((c, i) => (
                <Badge key={i} variant="info" size="md">{c}</Badge>
              ))}
            </div>
          </Card>

          <PinterestButton
            query={`${look.title} makeup look ${tone === "warm" ? "warm tone" : tone === "cool" ? "cool tone" : "neutral tone"}`}
            className="w-full"
          />

          <Button onClick={() => { setStep("look"); setLookType(null); setTone(null); setFaceShape(null); }} variant="outline" fullWidth>
            Farklı Look Dene
          </Button>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="En İyi Halin" showBack />
      <main className="px-4 py-4 space-y-4">
        {step === "look" && (
          <>
            <div className="text-center">
              <Sparkles size={40} className="mx-auto text-primary" />
              <h2 className="text-lg font-bold mt-2">En İyi Halini Keşfet</h2>
              <p className="text-sm text-muted mt-1">Hangi ortam için hazırlanıyorsun?</p>
            </div>
            <div className="space-y-3">
              {LOOK_TYPES.map(l => {
                const Icon = l.icon;
                return (
                  <Card key={l.key} hoverable onClick={() => handleLook(l.key)}>
                    <div className="flex items-center gap-4">
                      <Icon size={28} className="text-primary shrink-0" />
                      <div>
                        <p className="font-semibold">{l.label}</p>
                        <p className="text-xs text-muted">{l.desc}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {step === "tone" && (
          <>
            <h2 className="text-lg font-bold text-center">Alt Tonun Ne?</h2>
            <p className="text-sm text-muted text-center">
              Emin değilsen <Link href="/makeup/undertone" className="text-primary underline">Alt Ton Testini</Link> yap
            </p>
            <div className="space-y-3 mt-4">
              {([
                { key: "warm" as const, label: "Sıcak Ton", desc: "Altın, şeftali, toprak tonları", color: "bg-amber-100" },
                { key: "cool" as const, label: "Soğuk Ton", desc: "Gümüş, pembe, mavi tonları", color: "bg-blue-100" },
                { key: "neutral" as const, label: "Nötr Ton", desc: "Her iki tondan da taşıyabilirsin", color: "bg-purple-100" },
              ]).map(t => (
                <Card key={t.key} hoverable onClick={() => handleTone(t.key)}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${t.color}`} />
                    <div>
                      <p className="font-semibold">{t.label}</p>
                      <p className="text-xs text-muted">{t.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <button onClick={() => setStep("look")} className="w-full py-2 text-sm text-muted hover:text-primary">Geri</button>
          </>
        )}

        {step === "face" && (
          <>
            <h2 className="text-lg font-bold text-center">Yüz Şeklin Ne?</h2>
            <div className="grid grid-cols-2 gap-3 mt-4">
              {FACE_SHAPES.map(f => (
                <Card key={f.key} hoverable onClick={() => handleFace(f.key)}>
                  <div className="text-center">
                    <span className="text-2xl">{f.icon}</span>
                    <p className="font-semibold text-sm mt-1">{f.label}</p>
                  </div>
                </Card>
              ))}
            </div>
            <button onClick={() => setStep("tone")} className="w-full py-2 text-sm text-muted hover:text-primary">Geri</button>
          </>
        )}
      </main>
    </>
  );
}
