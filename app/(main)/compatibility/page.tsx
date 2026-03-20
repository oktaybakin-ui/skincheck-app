"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n/I18nContext";
import { useState } from "react";
import { FlaskConical, Plus, X, CheckCircle, AlertTriangle, XCircle, ArrowRight, Trash2, Sunrise, Moon, Clock } from "lucide-react";

type TimeSlot = "morning" | "evening" | "both";

interface CompatibilityResult {
  compatible: boolean;
  warnings: string[];
  tips: string[];
  conflicts: { ingredient1: string; ingredient2: string; reason: string }[];
  routineSuggestion: { morning: string[]; evening: string[] };
}

// Ingredient → best time mapping
const INGREDIENT_TIME: { keywords: string[]; time: TimeSlot; label: string }[] = [
  { keywords: ["vitamin c", "ascorbic acid", "l-ascorbic acid"], time: "morning", label: "C Vitamini → Sabah" },
  { keywords: ["retinol", "retinoid", "retinal", "tretinoin", "adapalene", "retinoic acid"], time: "evening", label: "Retinol → Akşam" },
  { keywords: ["aha", "glycolic acid", "lactic acid", "mandelic acid"], time: "evening", label: "AHA → Akşam" },
  { keywords: ["bha", "salicylic acid"], time: "evening", label: "BHA → Akşam" },
  { keywords: ["niacinamide", "nicotinamide"], time: "both", label: "Niasinamid → Sabah/Akşam" },
  { keywords: ["hyaluronic acid"], time: "both", label: "Hyaluronik Asit → Sabah/Akşam" },
  { keywords: ["benzoyl peroxide"], time: "evening", label: "Benzoil Peroksit → Akşam" },
  { keywords: ["ceramide"], time: "both", label: "Ceramide → Sabah/Akşam" },
  { keywords: ["squalane"], time: "both", label: "Squalane → Sabah/Akşam" },
  { keywords: ["vitamin e", "tocopherol"], time: "morning", label: "E Vitamini → Sabah" },
  { keywords: ["ferulic acid"], time: "morning", label: "Ferulik Asit → Sabah" },
  { keywords: ["copper peptide", "copper tripeptide"], time: "evening", label: "Bakır Peptid → Akşam" },
  { keywords: ["azelaic acid"], time: "both", label: "Azelaik Asit → Sabah/Akşam" },
  { keywords: ["spf", "sunscreen", "güneş kremi"], time: "morning", label: "SPF → Sabah" },
];

// Known ingredient conflicts
const CONFLICT_RULES: { a: string[]; b: string[]; reason: string }[] = [
  {
    a: ["retinol", "retinoid", "retinal", "tretinoin", "adapalene", "retinoic acid"],
    b: ["vitamin c", "ascorbic acid", "l-ascorbic acid"],
    reason: "Retinol ve C Vitamini birlikte kullanıldığında birbirinin etkisini azaltabilir ve ciltte tahrişe yol açabilir. Sabah: C Vitamini → Akşam: Retinol",
  },
  {
    a: ["retinol", "retinoid", "retinal", "tretinoin", "adapalene"],
    b: ["aha", "glycolic acid", "lactic acid", "mandelic acid", "bha", "salicylic acid"],
    reason: "Retinol ile AHA/BHA birlikte kullanılması aşırı soyulmaya ve tahrişe neden olabilir. Farklı günlerde dönüşümlü kullanın veya Akşam 1: AHA/BHA → Akşam 2: Retinol",
  },
  {
    a: ["vitamin c", "ascorbic acid", "l-ascorbic acid"],
    b: ["niacinamide", "nicotinamide"],
    reason: "C Vitamini ve Niasinamid yüksek konsantrasyonlarda birbirinin etkisini azaltabilir. Sabah: C Vitamini → Akşam: Niasinamid veya araya 15-20 dk bekleyin.",
  },
  {
    a: ["benzoyl peroxide"],
    b: ["retinol", "retinoid", "tretinoin", "vitamin c", "ascorbic acid"],
    reason: "Benzoil Peroksit, Retinol ve C Vitamini'ni oksitleyerek etkisiz hale getirebilir. Sabah: C Vitamini → Akşam: Benzoil Peroksit (Retinol farklı gün)",
  },
  {
    a: ["aha", "glycolic acid", "lactic acid"],
    b: ["vitamin c", "ascorbic acid"],
    reason: "AHA ve C Vitamini birlikte pH dengesini bozarak tahrişe neden olabilir. Sabah: C Vitamini → Akşam: AHA",
  },
  {
    a: ["copper peptide", "copper tripeptide"],
    b: ["vitamin c", "ascorbic acid", "aha", "bha", "retinol"],
    reason: "Bakır peptidleri direkt asitler ve retinol ile uyumsuz olabilir. Akşam 1: Bakır Peptid → Akşam 2: Asitler/Retinol (dönüşümlü)",
  },
  {
    a: ["retinol", "retinoid", "tretinoin"],
    b: ["benzoyl peroxide"],
    reason: "Benzoil Peroksit retinolü oksitleyerek etkisiz hale getirir. Farklı zamanlarda kullanın: Sabah: Benzoil Peroksit → Akşam: Retinol",
  },
  {
    a: ["aha", "glycolic acid", "lactic acid"],
    b: ["bha", "salicylic acid"],
    reason: "AHA ve BHA birlikte kullanmak aşırı eksfoliyasyona neden olabilir. Aynı gün ikisini birden kullanmayın, dönüşümlü tercih edin.",
  },
  {
    a: ["vitamin c", "ascorbic acid"],
    b: ["benzoyl peroxide"],
    reason: "Benzoil Peroksit C Vitamini'ni oksitleyerek etkisiz kılar. Sabah: C Vitamini → Akşam: Benzoil Peroksit",
  },
  {
    a: ["retinol", "retinoid"],
    b: ["vitamin c", "ascorbic acid"],
    reason: "Retinol ve C Vitamini farklı pH seviyelerinde çalışır. Aynı rutinde kullanıldığında birbirinin etkisini azaltır. Sabah: C Vitamini → Akşam: Retinol",
  },
];

// Known synergies
const SYNERGY_TIPS: { a: string[]; b: string[]; tip: string }[] = [
  {
    a: ["hyaluronic acid"],
    b: ["niacinamide"],
    tip: "Hyaluronik Asit + Niasinamid: Harika bir ikili! Birlikte nem bariyerini güçlendirir.",
  },
  {
    a: ["vitamin c", "ascorbic acid"],
    b: ["vitamin e", "tocopherol", "ferulic acid"],
    tip: "C Vitamini + E Vitamini/Ferulik Asit: Antioksidan etkiyi 8 kata kadar artırır.",
  },
  {
    a: ["retinol"],
    b: ["hyaluronic acid", "ceramide", "squalane"],
    tip: "Retinol + Nemlendirici (HA/Ceramide): Retinolün kurutucu etkisini dengeler.",
  },
  {
    a: ["niacinamide"],
    b: ["salicylic acid"],
    tip: "Niasinamid + Salisilik Asit: Yağlı ciltler için harika. Gözenekleri sıkılaştırır.",
  },
  {
    a: ["retinol"],
    b: ["peptide", "peptides"],
    tip: "Retinol + Peptidler: Dönüşümlü kullanımda anti-aging etkiyi güçlendirir.",
  },
  {
    a: ["azelaic acid"],
    b: ["niacinamide"],
    tip: "Azelaik Asit + Niasinamid: Hiperpigmentasyon ve akne izleri için güçlü kombinasyon.",
  },
  {
    a: ["hyaluronic acid"],
    b: ["ceramide", "squalane"],
    tip: "Hyaluronik Asit + Ceramide/Squalane: Nem katmanlama tekniği — HA nemi çeker, ceramide kilitler.",
  },
  {
    a: ["vitamin c", "ascorbic acid"],
    b: ["spf", "sunscreen"],
    tip: "C Vitamini + SPF: Antioksidan + UV koruma birleşimi, foto-yaşlanmaya karşı en güçlü savunma.",
  },
];

function getIngredientTime(ingredient: string): TimeSlot {
  const lower = ingredient.toLowerCase();
  for (const it of INGREDIENT_TIME) {
    if (it.keywords.some((k) => lower.includes(k))) return it.time;
  }
  return "both";
}

function checkCompatibility(ingredients: string[]): CompatibilityResult {
  const lower = ingredients.map((i) => i.toLowerCase().trim());
  const conflicts: CompatibilityResult["conflicts"] = [];
  const tips: string[] = [];

  // Check conflicts
  for (const rule of CONFLICT_RULES) {
    const matchA = lower.find((i) => rule.a.some((a) => i.includes(a)));
    const matchB = lower.find((i) => rule.b.some((b) => i.includes(b)));
    if (matchA && matchB) {
      conflicts.push({
        ingredient1: ingredients[lower.indexOf(matchA)],
        ingredient2: ingredients[lower.indexOf(matchB)],
        reason: rule.reason,
      });
    }
  }

  // Check synergies
  for (const syn of SYNERGY_TIPS) {
    const matchA = lower.find((i) => syn.a.some((a) => i.includes(a)));
    const matchB = lower.find((i) => syn.b.some((b) => i.includes(b)));
    if (matchA && matchB) {
      tips.push(syn.tip);
    }
  }

  // Build routine suggestion
  const morning: string[] = [];
  const evening: string[] = [];
  for (const ing of ingredients) {
    const time = getIngredientTime(ing);
    if (time === "morning") morning.push(ing);
    else if (time === "evening") evening.push(ing);
    else { morning.push(ing); evening.push(ing); }
  }

  const warnings = conflicts.map((c) => `${c.ingredient1} + ${c.ingredient2}`);

  return {
    compatible: conflicts.length === 0,
    warnings,
    tips,
    conflicts,
    routineSuggestion: { morning, evening },
  };
}

const POPULAR_INGREDIENTS = [
  "Retinol", "Vitamin C", "Niacinamide", "Hyaluronic Acid",
  "Salicylic Acid", "Glycolic Acid", "Benzoyl Peroxide",
  "Ceramide", "Squalane", "Vitamin E", "Ferulic Acid",
  "Lactic Acid", "Copper Peptide", "Azelaic Acid",
];

export default function CompatibilityPage() {
  const { t } = useI18n();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<CompatibilityResult | null>(null);

  const addIngredient = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setInputValue("");
      setResult(null);
    }
  };

  const removeIngredient = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
    setResult(null);
  };

  const analyze = () => {
    if (ingredients.length >= 2) {
      setResult(checkCompatibility(ingredients));
    }
  };

  const reset = () => {
    setIngredients([]);
    setResult(null);
    setInputValue("");
  };

  return (
    <>
      <Header title={t.compatibility_title} showBack />
      <main className="px-4 py-4 space-y-4 pb-28">
        {/* Info */}
        <Card className="bg-primary/5 border-primary/20">
          <div className="flex gap-3">
            <FlaskConical size={24} className="text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">{t.compatibility_info}</p>
              <p className="text-xs text-muted mt-1">
                {t.compatibility_info_desc}
              </p>
            </div>
          </div>
        </Card>

        {/* Input */}
        <Card>
          <label className="text-sm font-medium mb-2 block">{t.add_ingredient}</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addIngredient(inputValue)}
              placeholder={t.ingredient_placeholder}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
            />
            <button
              onClick={() => addIngredient(inputValue)}
              disabled={!inputValue.trim()}
              className="px-3 py-2 bg-primary text-white rounded-xl disabled:opacity-40"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Popular */}
          <div className="mt-3">
            <p className="text-xs text-muted mb-2">{t.popular_ingredients}</p>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_INGREDIENTS.filter((p) => !ingredients.includes(p)).slice(0, 8).map((p) => (
                <button
                  key={p}
                  onClick={() => addIngredient(p)}
                  className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-muted transition-colors"
                >
                  + {p}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Selected Ingredients */}
        {ingredients.length > 0 && (
          <Card>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">{t.selected_ingredients} ({ingredients.length})</label>
              <button onClick={reset} className="text-xs text-muted flex items-center gap-1 hover:text-danger">
                <Trash2 size={12} /> {t.clear}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ing, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 rounded-full text-sm font-medium text-primary"
                >
                  {ing}
                  <button onClick={() => removeIngredient(i)} className="hover:text-danger transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <Button
              onClick={analyze}
              disabled={ingredients.length < 2}
              fullWidth
              className="mt-3"
            >
              <span className="flex items-center justify-center gap-2">
                <FlaskConical size={16} /> {t.check_compatibility}
              </span>
            </Button>
          </Card>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-3">
            {/* Overall */}
            <Card className={result.compatible ? "border-safe/30 bg-safe/5" : "border-danger/30 bg-danger/5"}>
              <div className="flex items-center gap-3">
                {result.compatible ? (
                  <CheckCircle size={28} className="text-safe" />
                ) : (
                  <AlertTriangle size={28} className="text-danger" />
                )}
                <div>
                  <p className="font-bold text-sm">
                    {result.compatible ? t.compatible : t.incompatible}
                  </p>
                  <p className="text-xs text-muted">
                    {result.compatible
                      ? t.compatible_desc
                      : `${result.conflicts.length} ${t.incompatible_conflicts}`}
                  </p>
                </div>
              </div>
            </Card>

            {/* Conflicts */}
            {result.conflicts.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-danger flex items-center gap-1.5">
                  <XCircle size={16} /> {t.incompatible_ingredients}
                </h4>
                {result.conflicts.map((c, i) => (
                  <Card key={i} className="border-danger/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="danger" size="sm">{c.ingredient1}</Badge>
                      <ArrowRight size={12} className="text-muted" />
                      <Badge variant="danger" size="sm">{c.ingredient2}</Badge>
                    </div>
                    <p className="text-xs text-muted">{c.reason}</p>
                  </Card>
                ))}
              </div>
            )}

            {/* Synergies */}
            {result.tips.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-safe flex items-center gap-1.5">
                  <CheckCircle size={16} /> {t.synergistic_effects}
                </h4>
                {result.tips.map((tip, i) => (
                  <Card key={i} className="border-safe/20 bg-safe/5">
                    <p className="text-xs text-muted">{tip}</p>
                  </Card>
                ))}
              </div>
            )}

            {/* Routine Suggestion */}
            {(result.routineSuggestion.morning.length > 0 || result.routineSuggestion.evening.length > 0) && (
              <Card>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-1.5">
                  <Clock size={16} className="text-primary" /> {t.compat_routine}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {/* Morning */}
                  <div className="bg-amber-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Sunrise size={14} className="text-amber-600" />
                      <span className="text-xs font-semibold text-amber-700">{t.compat_morning}</span>
                    </div>
                    <div className="space-y-1">
                      {result.routineSuggestion.morning.length > 0 ? (
                        result.routineSuggestion.morning.map((ing, i) => (
                          <p key={i} className="text-[11px] text-amber-800 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-amber-500 shrink-0" />
                            {ing}
                          </p>
                        ))
                      ) : (
                        <p className="text-[11px] text-amber-600 italic">{t.compat_no_morning}</p>
                      )}
                    </div>
                  </div>
                  {/* Evening */}
                  <div className="bg-indigo-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Moon size={14} className="text-indigo-600" />
                      <span className="text-xs font-semibold text-indigo-700">{t.compat_evening}</span>
                    </div>
                    <div className="space-y-1">
                      {result.routineSuggestion.evening.length > 0 ? (
                        result.routineSuggestion.evening.map((ing, i) => (
                          <p key={i} className="text-[11px] text-indigo-800 flex items-center gap-1">
                            <span className="w-1 h-1 rounded-full bg-indigo-500 shrink-0" />
                            {ing}
                          </p>
                        ))
                      ) : (
                        <p className="text-[11px] text-indigo-600 italic">{t.compat_no_evening}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Usage Tips */}
        <Card>
          <h4 className="text-sm font-semibold mb-2">{t.usage_tips}</h4>
          <ul className="space-y-2 text-xs text-muted">
            <li className="flex gap-2">
              <span className="text-primary font-bold">1.</span>
              {t.tip_1}
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">2.</span>
              {t.tip_2}
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">3.</span>
              {t.tip_3}
            </li>
            <li className="flex gap-2">
              <span className="text-primary font-bold">4.</span>
              {t.tip_4}
            </li>
          </ul>
        </Card>
      </main>
    </>
  );
}
