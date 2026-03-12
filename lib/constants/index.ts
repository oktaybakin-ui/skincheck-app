export const SKIN_TYPES = [
  { value: "oily", label: "Yağlı", icon: "💧", description: "Gözenekler belirgin, gün içinde parlarım" },
  { value: "dry", label: "Kuru", icon: "🏜️", description: "Sıkılma hissi, pul pul dökülme" },
  { value: "combination", label: "Karma", icon: "⚖️", description: "T-bölge yağlı, yanaklar kuru" },
  { value: "sensitive", label: "Hassas", icon: "🌸", description: "Kolayca kızarır, yanar" },
  { value: "acne_prone", label: "Akneye Eğilimli", icon: "🔴", description: "Sık sık sivilce çıkar" },
  { value: "rosacea", label: "Rozasea", icon: "🌡️", description: "Kronik kızarıklık, damarlar görünür" },
] as const;

export const SPECIAL_CONDITIONS = [
  { value: "none", label: "Normal", description: "Özel bir durumum yok" },
  { value: "pregnant", label: "Hamileyim", description: "Trimester seçimi yapabilirsiniz" },
  { value: "breastfeeding", label: "Emziriyorum", description: "" },
  { value: "ivf", label: "IVF Tedavisi", description: "IVF tedavisi görüyorum" },
  { value: "hormonal_treatment", label: "Hormonal Tedavi", description: "Hormonal tedavi kullanıyorum" },
] as const;

export const COMMON_ALLERGENS = [
  "Parfüm/Koku",
  "Paraben",
  "Lanolin",
  "Nikel",
  "Lateks",
  "Formaldehit",
  "Gluten",
  "Fındık/Nut",
] as const;

export const RISK_LEVELS = {
  safe: { label: "Güvenli", color: "bg-safe", textColor: "text-safe" },
  low: { label: "Düşük Risk", color: "bg-warning", textColor: "text-warning" },
  moderate: { label: "Orta Risk", color: "bg-orange-500", textColor: "text-orange-500" },
  high: { label: "Yüksek Risk", color: "bg-danger", textColor: "text-danger" },
} as const;

export const SAFETY_SCORE_RANGES = [
  { min: 80, max: 100, label: "Güvenli", color: "text-safe", bg: "bg-safe", emoji: "🟢" },
  { min: 60, max: 79, label: "Dikkatli Ol", color: "text-warning", bg: "bg-warning", emoji: "🟡" },
  { min: 40, max: 59, label: "Riskli İçerikler Var", color: "text-orange-500", bg: "bg-orange-500", emoji: "🟠" },
  { min: 0, max: 39, label: "Önerilmez", color: "text-danger", bg: "bg-danger", emoji: "🔴" },
] as const;
