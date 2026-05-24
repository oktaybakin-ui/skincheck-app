"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import PinterestButton from "@/components/ui/PinterestButton";
import { useState, useRef, useCallback, useEffect } from "react";
import { Leaf, Snowflake, Flower, LucideIcon, Camera, ClipboardList, Sparkles, RotateCcw, Upload, SwitchCamera, Info, Eye, Palette, Gem, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

// ─── Quiz Data ───────────────────────────────────────────
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

// ─── Result Types & Data ─────────────────────────────────
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

// ─── AI Result Type ──────────────────────────────────────
interface AIAnalysisResult {
  success: boolean;
  undertone?: "warm" | "cool" | "neutral";
  confidence?: "high" | "medium" | "low";
  analysis?: {
    skin_tone: string;
    vein_observation: string;
    surface_tone: string;
    overall_warmth: string;
  };
  season?: string;
  season_detail?: string;
  recommendations?: {
    foundation_tone: string;
    best_colors: string[];
    avoid_colors: string[];
    metal: string;
    lip_tip: string;
    blush_tip: string;
  };
  description?: string;
  error?: string;
}

// ─── Main Component ──────────────────────────────────────
export default function UndertonePage() {
  const { t } = useI18n();
  const [mode, setMode] = useState<"select" | "quiz" | "ai">("select");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  // AI states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // ─── Camera Functions ──────────────────────────────────
  const startCamera = useCallback(async (facing: "user" | "environment" = facingMode) => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 1280 }, height: { ideal: 960 } },
          audio: false,
        });
      } catch {
        // Fallback: try opposite camera or any camera
        const fallback = facing === "user" ? "environment" : "user";
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: fallback, width: { ideal: 1280 }, height: { ideal: 960 } },
            audio: false,
          });
          setFacingMode(fallback);
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        }
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setShowCamera(true);
    } catch {
      alert(t.ut_camera_denied);
    }
  }, [facingMode, t]);

  // İlk açılışta <video> henüz DOM'da olmadığından stream bağlanamıyordu
  // (kamera ilk denemede açılmıyordu). showCamera açılıp video mount edilince
  // stream'i bağla ve oynat.
  useEffect(() => {
    if (showCamera && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [showCamera]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setCapturedImage(dataUrl);
    stopCamera();
  }, [stopCamera]);

  const switchCamera = useCallback(() => {
    const newFacing = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacing);
    startCamera(newFacing);
  }, [facingMode, startCamera]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCapturedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const analyzeWithAI = useCallback(async () => {
    if (!capturedImage) return;
    setAiLoading(true);
    setAiResult(null);
    try {
      const res = await fetch("https://einypelxufqmqwuzmped.supabase.co/functions/v1/analyze-undertone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: capturedImage }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiResult({ success: false, error: data.error || t.ut_analysis_failed });
      } else {
        setAiResult(data);
      }
    } catch {
      setAiResult({ success: false, error: t.ut_connection_error });
    } finally {
      setAiLoading(false);
    }
  }, [capturedImage, t]);

  // ─── Quiz Functions ────────────────────────────────────
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

  const resetAll = () => {
    setMode("select");
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
    setAiResult(null);
    setCapturedImage(null);
    setAiLoading(false);
    stopCamera();
  };

  // ─── Confidence Badge ──────────────────────────────────
  const confidenceBadge = (level?: string) => {
    const map: Record<string, { label: string; variant: "safe" | "warning" | "danger" }> = {
      high: { label: t.ut_high_confidence, variant: "safe" },
      medium: { label: t.ut_medium_confidence, variant: "warning" },
      low: { label: t.ut_low_confidence, variant: "danger" },
    };
    const info = map[level || "low"];
    return <Badge variant={info.variant} size="sm">{info.label}</Badge>;
  };

  // ─── AI Result View ────────────────────────────────────
  if (mode === "ai" && aiResult?.success && aiResult.undertone) {
    const key = aiResult.undertone;
    const result = RESULTS[key];
    const ai = aiResult;

    return (
      <>
        <Header title={t.ut_ai_result_title} showBack />
        <main className="px-4 py-6 space-y-5 pb-28">
          {/* Hero */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto">
              <Sparkles size={32} className="text-primary" />
            </div>
            <h2 className="text-2xl font-bold">
              {t.ut_tone_result.replace("{tone}", result.tone).replace("{season}", ai.season || result.season)}
            </h2>
            <div className="flex justify-center gap-2">
              {confidenceBadge(ai.confidence)}
              <Badge variant="secondary" size="sm">{t.ut_ai_analysis}</Badge>
            </div>
          </div>

          {/* AI Description */}
          {ai.description && (
            <Card className="bg-gradient-to-r from-primary/5 to-transparent border-primary/20">
              <div className="flex gap-3">
                <Info size={20} className="text-primary shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed">{ai.description}</p>
              </div>
            </Card>
          )}

          {/* AI Analysis Details */}
          {ai.analysis && (
            <Card>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <Eye size={18} className="text-primary" />
                {t.ut_ai_observations}
              </h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted">{t.ut_skin_tone}</span>
                  <span className="text-sm font-medium text-right max-w-[60%]">{ai.analysis.skin_tone}</span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted">{t.ut_vein_color}</span>
                  <span className="text-sm font-medium text-right max-w-[60%]">{ai.analysis.vein_observation}</span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted">{t.ut_surface_tone}</span>
                  <span className="text-sm font-medium text-right max-w-[60%]">{ai.analysis.surface_tone}</span>
                </div>
                <div className="h-px bg-gray-100" />
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted">{t.ut_overall_assessment}</span>
                  <span className="text-sm font-medium text-right max-w-[60%]">{ai.analysis.overall_warmth}</span>
                </div>
              </div>
            </Card>
          )}

          {/* AI Recommendations */}
          {ai.recommendations && (
            <>
              <Card>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Palette size={18} className="text-primary" />
                  {t.ut_ai_color_recommendations}
                </h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-muted uppercase tracking-wide">{t.ut_matching_colors}</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {ai.recommendations.best_colors.map((c) => (
                        <Badge key={c} variant="safe" size="sm">{c}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted uppercase tracking-wide">{t.ut_avoid_colors}</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {ai.recommendations.avoid_colors.map((c) => (
                        <Badge key={c} variant="danger" size="sm">{c}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Gem size={18} className="text-primary" />
                  {t.ut_personalized_tips}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-2">
                    <span className="text-muted shrink-0">{t.ut_foundation_label}</span>
                    <span>{ai.recommendations.foundation_tone}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted shrink-0">{t.ut_lipstick_label}</span>
                    <span>{ai.recommendations.lip_tip}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted shrink-0">{t.ut_blush_label}</span>
                    <span>{ai.recommendations.blush_tip}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-muted shrink-0">{t.ut_jewelry_label}</span>
                    <span>{ai.recommendations.metal}</span>
                  </div>
                </div>
              </Card>
            </>
          )}

          {/* Standard Color Swatches from result data */}
          <Card>
            <h3 className="font-bold mb-3">{t.ut_color_palette}</h3>
            <div className="flex gap-2 flex-wrap">
              {result.colors.map((c, i) => (
                <div key={c} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: c }} />
                  <span className="text-[10px] text-muted">{result.colorNames[i]}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Lip / Eye / Blush from result */}
          <Card>
            <h3 className="font-bold mb-3">{t.ut_lip_shades}</h3>
            <div className="grid grid-cols-2 gap-3">
              {result.lipColors.map((l) => (
                <div key={l.name} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border shadow-sm shrink-0" style={{ backgroundColor: l.hex }} />
                  <span className="text-sm">{l.name}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold mb-3">{t.ut_eye_shades}</h3>
            <div className="grid grid-cols-2 gap-3">
              {result.eyeColors.map((e) => (
                <div key={e.name} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border shadow-sm shrink-0" style={{ backgroundColor: e.hex }} />
                  <span className="text-sm">{e.name}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Brand Examples */}
          <Card>
            <h3 className="font-bold mb-3">{t.ut_foundation_recommendations}</h3>
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
          </Card>

          <Card>
            <h3 className="font-bold mb-3">{t.ut_lipstick_recommendations}</h3>
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

          <PinterestButton query={`${result.tone} undertone makeup looks ${ai.season || result.season}`} className="w-full" />

          <Button onClick={resetAll} variant="outline" fullWidth>
            <RotateCcw size={16} className="inline mr-2" />
            {t.ut_start_over}
          </Button>
        </main>
      </>
    );
  }

  // ─── Quiz Result View ──────────────────────────────────
  if (mode === "quiz" && showResult) {
    const key = getResultKey();
    const result = RESULTS[key];

    return (
      <>
        <Header title={t.ut_result_title} showBack />
        <main className="px-4 py-6 space-y-6 pb-28">
          <div className="text-center">
            <result.icon size={56} className="mx-auto text-primary" />
            <h2 className="text-2xl font-bold mt-2">
              {t.ut_tone_result.replace("{tone}", result.tone).replace("{season}", result.season)}
            </h2>
            <Badge variant="secondary" size="sm" className="mt-2">{t.ut_quiz_result}</Badge>
          </div>

          <Card>
            <h3 className="font-bold mb-3">{t.ut_your_matching_colors}</h3>
            <div className="flex gap-2 flex-wrap">
              {result.colors.map((c, i) => (
                <div key={c} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-md" style={{ backgroundColor: c }} />
                  <span className="text-[10px] text-muted">{result.colorNames[i]}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold mb-3">{t.ut_lip_shades}</h3>
            <div className="grid grid-cols-2 gap-3">
              {result.lipColors.map((l) => (
                <div key={l.name} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border shadow-sm shrink-0" style={{ backgroundColor: l.hex }} />
                  <span className="text-sm">{l.name}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold mb-3">{t.ut_eye_shades}</h3>
            <div className="grid grid-cols-2 gap-3">
              {result.eyeColors.map((e) => (
                <div key={e.name} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full border shadow-sm shrink-0" style={{ backgroundColor: e.hex }} />
                  <span className="text-sm">{e.name}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold mb-3">{t.ut_blush_shades}</h3>
            <div className="flex gap-3">
              {result.blushColors.map((b) => (
                <div key={b.name} className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full border shadow-sm" style={{ backgroundColor: b.hex }} />
                  <span className="text-xs text-muted">{b.name}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-bold mb-3">{t.ut_foundation_recommendations}</h3>
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

          <Card>
            <h3 className="font-bold mb-3">{t.ut_lipstick_recommendations}</h3>
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

          <Card>
            <h3 className="font-bold mb-3">{t.ut_jewelry_recommendation}</h3>
            <p className="text-sm text-muted leading-relaxed">{result.jewelryTip}</p>
          </Card>

          <Card>
            <h3 className="font-bold mb-3">{t.ut_avoid_tones}</h3>
            <div className="flex flex-wrap gap-2">
              {result.avoid.map((a) => (
                <Badge key={a} variant="danger" size="md">{a}</Badge>
              ))}
            </div>
          </Card>

          <PinterestButton query={`${result.tone} undertone makeup looks ${result.season}`} className="w-full" />

          <Button onClick={resetAll} variant="outline" fullWidth>
            <RotateCcw size={16} className="inline mr-2" />
            {t.ut_start_over}
          </Button>
        </main>
      </>
    );
  }

  // ─── Quiz Mode ─────────────────────────────────────────
  if (mode === "quiz") {
    return (
      <>
        <Header title={t.ut_page_title} showBack />
        <main className="px-4 py-6 space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted">{currentQ + 1} / {questions.length}</p>
            <div className="flex gap-1 mt-2">
              {questions.map((_, i) => (
                <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors ${i <= currentQ ? "bg-primary" : "bg-gray-200"}`} />
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

          <Button onClick={resetAll} variant="ghost" fullWidth size="sm">
            {t.ut_go_back}
          </Button>
        </main>
      </>
    );
  }

  // ─── AI Camera Mode ────────────────────────────────────
  if (mode === "ai") {
    return (
      <>
        <Header title={t.ut_ai_page_title} showBack />
        <main className="px-4 py-6 space-y-5 pb-28">

          {/* Camera View */}
          {showCamera && (
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[3/4]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Overlay guide */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-white/40 rounded-full" />
              </div>
              <div className="absolute bottom-0 inset-x-0 p-4 flex justify-center gap-4 bg-gradient-to-t from-black/60">
                <button
                  onClick={switchCamera}
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <SwitchCamera size={22} />
                </button>
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                >
                  <div className="w-14 h-14 rounded-full border-4 border-primary" />
                </button>
                <button
                  onClick={() => { stopCamera(); if (!capturedImage) setMode("select"); }}
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <X size={22} />
                </button>
              </div>
            </div>
          )}

          {/* Captured Image Preview */}
          {capturedImage && !showCamera && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={capturedImage} alt={t.ut_captured_photo_alt} className="w-full" />
              </div>

              {/* AI Error */}
              {aiResult && !aiResult.success && (
                <Card className="border-red-200 bg-red-50">
                  <p className="text-sm text-red-700">{aiResult.error}</p>
                </Card>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={analyzeWithAI}
                  loading={aiLoading}
                  fullWidth
                  size="lg"
                >
                  <Sparkles size={18} className="inline mr-2" />
                  {aiLoading ? t.ut_analyzing : t.ut_analyze_with_ai}
                </Button>
              </div>

              <div className="flex gap-3">
                <Button onClick={() => { setCapturedImage(null); startCamera(); }} variant="outline" fullWidth size="sm">
                  <Camera size={16} className="inline mr-2" />
                  {t.ut_retake}
                </Button>
                <Button onClick={() => { setCapturedImage(null); setAiResult(null); setMode("select"); }} variant="ghost" fullWidth size="sm">
                  {t.ut_go_back}
                </Button>
              </div>
            </div>
          )}

          {/* Initial AI Mode - No Camera Yet */}
          {!showCamera && !capturedImage && (
            <div className="space-y-5">
              <div className="text-center space-y-2">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-purple-100 flex items-center justify-center mx-auto">
                  <Sparkles size={36} className="text-primary" />
                </div>
                <h2 className="text-xl font-bold">{t.ut_ai_page_title}</h2>
                <p className="text-sm text-muted leading-relaxed max-w-xs mx-auto">
                  {t.ut_ai_desc}
                </p>
                <p className="text-[10px] text-muted/60 mt-1">{t.ut_ai_privacy}</p>
              </div>

              {/* Tips */}
              <Card className="bg-amber-50 border-amber-200">
                <h3 className="font-semibold text-sm mb-2">{t.ut_best_result_title}</h3>
                <ul className="text-xs text-muted space-y-1.5">
                  <li className="flex gap-2"><span>1.</span> {t.ut_best_result_1}</li>
                  <li className="flex gap-2"><span>2.</span> {t.ut_best_result_2}</li>
                  <li className="flex gap-2"><span>3.</span> {t.ut_best_result_3}</li>
                  <li className="flex gap-2"><span>4.</span> {t.ut_best_result_4}</li>
                </ul>
              </Card>

              <Button onClick={() => startCamera()} fullWidth size="lg">
                <Camera size={20} className="inline mr-2" />
                {t.ut_open_camera}
              </Button>

              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-muted">{t.ut_or}</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <Button onClick={() => fileInputRef.current?.click()} variant="outline" fullWidth>
                <Upload size={18} className="inline mr-2" />
                {t.ut_pick_from_gallery}
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />

              <Button onClick={() => setMode("select")} variant="ghost" fullWidth size="sm">
                {t.ut_go_back}
              </Button>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </main>
      </>
    );
  }

  // ─── Mode Selection (Default) ──────────────────────────
  return (
    <>
      <Header title={t.ut_page_title} showBack />
      <main className="px-4 py-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold">{t.ut_discover}</h2>
          <p className="text-sm text-muted leading-relaxed">
            {t.ut_discover_desc}
          </p>
        </div>

        <div className="space-y-4">
          {/* AI Option */}
          <Card hoverable onClick={() => setMode("ai")} className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
            <div className="flex gap-4 items-start">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0">
                <Camera size={26} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{t.ut_ai_photo_analysis}</h3>
                  <Badge variant="primary" size="sm">{t.ut_new}</Badge>
                </div>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  {t.ut_ai_photo_desc}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-primary font-medium">
                  <Sparkles size={14} />
                  <span>{t.ut_claude_vision}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Quiz Option */}
          <Card hoverable onClick={() => setMode("quiz")}>
            <div className="flex gap-4 items-start">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0">
                <ClipboardList size={26} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{t.ut_quiz_analysis}</h3>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  {t.ut_quiz_desc}
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-600 font-medium">
                  <ClipboardList size={14} />
                  <span>{t.ut_quiz_duration}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Info Box */}
        <Card className="bg-gray-50 border-gray-200">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Info size={16} className="text-primary" />
            {t.ut_what_is_undertone}
          </h4>
          <p className="text-xs text-muted leading-relaxed">
            {t.ut_what_is_undertone_desc}
          </p>
        </Card>
      </main>
    </>
  );
}
