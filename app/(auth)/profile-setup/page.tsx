"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { SKIN_TYPES, SPECIAL_CONDITIONS, COMMON_ALLERGENS } from "@/lib/constants";
import { SKIN_TYPE_ICONS } from "@/lib/constants/icons";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/lib/context/AuthContext";
import { CheckCircle } from "lucide-react";

const STEPS = ["Cilt Tipi", "Özel Durum", "Alerjiler", "Favori Markalar", "Tamamla"];

const POPULAR_BRANDS = [
  "MAC", "Charlotte Tilbury", "NARS", "Fenty Beauty", "Maybelline",
  "L'Oréal", "NYX", "Urban Decay", "Too Faced", "Benefit",
  "Kérastase", "Moroccanoil", "The Ordinary", "CeraVe", "La Roche-Posay",
  "Clinique", "Estée Lauder", "Bobbi Brown", "Rare Beauty", "Glossier",
  "Flormar", "Golden Rose", "Gratis", "Sephora Collection", "Inglot",
];

export default function ProfileSetupPage() {
  const router = useRouter();
  const { updateProfile } = useAuthContext();
  const [step, setStep] = useState(0);
  const [skinType, setSkinType] = useState("");
  const [condition, setCondition] = useState("none");
  const [trimester, setTrimester] = useState<number | null>(null);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [otherAllergy, setOtherAllergy] = useState("");
  const [favoriteBrands, setFavoriteBrands] = useState<string[]>([]);
  const [customBrand, setCustomBrand] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleBrand = (b: string) => {
    setFavoriteBrands((prev) => prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]);
  };

  const addCustomBrand = () => {
    if (customBrand.trim() && !favoriteBrands.includes(customBrand.trim())) {
      setFavoriteBrands((prev) => [...prev, customBrand.trim()]);
      setCustomBrand("");
    }
  };

  const toggleAllergy = (a: string) => {
    setAllergies((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  };

  const canNext = () => {
    if (step === 0) return !!skinType;
    return true;
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-sm mx-auto">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div className={`h-1.5 w-full rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-gray-200"}`} />
              <span className={`text-[10px] ${i <= step ? "text-primary font-medium" : "text-muted"}`}>{s}</span>
            </div>
          ))}
        </div>

        {/* Step 0: Skin Type */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center">Cilt tipini seç</h2>
            <div className="grid grid-cols-2 gap-3">
              {SKIN_TYPES.map((type) => {
                const Icon = SKIN_TYPE_ICONS[type.value];
                return (
                  <Card key={type.value} selected={skinType === type.value} onClick={() => setSkinType(type.value)}>
                    <div className="text-center">
                      {Icon && <Icon size={28} className={skinType === type.value ? "text-primary mx-auto" : "text-muted mx-auto"} />}
                      <p className="font-semibold text-sm mt-2">{type.label}</p>
                      <p className="text-xs text-muted mt-1">{type.description}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 1: Special Condition */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center">Özel bir durumun var mı?</h2>
            <div className="space-y-3">
              {SPECIAL_CONDITIONS.map((c) => (
                <Card key={c.value} selected={condition === c.value} onClick={() => setCondition(c.value)}>
                  <p className="font-semibold text-sm">{c.label}</p>
                  {c.description && <p className="text-xs text-muted">{c.description}</p>}
                </Card>
              ))}
            </div>
            {condition === "pregnant" && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Trimester:</p>
                <div className="flex gap-3">
                  {[1, 2, 3].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTrimester(t)}
                      className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-all ${
                        trimester === t ? "border-primary bg-primary/10 text-primary" : "border-gray-200 text-muted"
                      }`}
                    >
                      {t}. Trimester
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Allergies */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center">Bilinen alerjilerin var mı?</h2>
            <div className="space-y-2">
              {COMMON_ALLERGENS.map((a) => (
                <label key={a} className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-gray-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={allergies.includes(a)}
                    onChange={() => toggleAllergy(a)}
                    className="w-5 h-5 rounded accent-primary"
                  />
                  <span className="text-sm">{a}</span>
                </label>
              ))}
              <label className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-gray-100 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allergies.includes("yok")}
                  onChange={() => { setAllergies(["yok"]); setOtherAllergy(""); }}
                  className="w-5 h-5 rounded accent-primary"
                />
                <span className="text-sm">Yok / Bilmiyorum</span>
              </label>
              <input
                type="text"
                placeholder="Diğer (virgülle ayır)..."
                value={otherAllergy}
                onChange={(e) => setOtherAllergy(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
              />
            </div>
          </div>
        )}

        {/* Step 3: Favorite Brands */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-center">Favori markaların</h2>
            <p className="text-sm text-muted text-center">Seçtiğin markalara göre kişisel öneriler alacaksın</p>

            {/* Selected brands */}
            {favoriteBrands.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {favoriteBrands.map((b) => (
                  <button
                    key={b}
                    onClick={() => toggleBrand(b)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-medium"
                  >
                    {b} <span className="opacity-70">×</span>
                  </button>
                ))}
              </div>
            )}

            {/* Custom brand input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Başka marka ekle..."
                value={customBrand}
                onChange={(e) => setCustomBrand(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomBrand()}
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
              />
              <button
                onClick={addCustomBrand}
                disabled={!customBrand.trim()}
                className="px-4 py-3 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-40"
              >
                Ekle
              </button>
            </div>

            {/* Popular brands grid */}
            <div className="grid grid-cols-3 gap-2">
              {POPULAR_BRANDS.filter((b) => !favoriteBrands.includes(b)).map((brand) => (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className="py-2.5 px-2 rounded-xl border border-gray-200 text-xs font-medium hover:border-primary hover:bg-primary/5 transition-colors truncate"
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {step === 4 && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-safe/10 rounded-full flex items-center justify-center">
              <CheckCircle size={40} className="text-safe" />
            </div>
            <h2 className="text-xl font-bold">Harika! SkinCheck&apos;e hoş geldin!</h2>
            <Card>
              <div className="text-left space-y-2 text-sm">
                <p><span className="text-muted">Cilt tipi:</span> <strong>{SKIN_TYPES.find((t) => t.value === skinType)?.label}</strong></p>
                <p><span className="text-muted">Özel durum:</span> <strong>{SPECIAL_CONDITIONS.find((c) => c.value === condition)?.label}</strong></p>
                {trimester && <p><span className="text-muted">Trimester:</span> <strong>{trimester}</strong></p>}
                <p><span className="text-muted">Alerjiler:</span> <strong>{allergies.length > 0 ? allergies.join(", ") : "Belirtilmedi"}</strong></p>
                <p><span className="text-muted">Favori markalar:</span> <strong>{favoriteBrands.length > 0 ? favoriteBrands.join(", ") : "Belirtilmedi"}</strong></p>
              </div>
            </Card>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <Button variant="outline" onClick={() => setStep((s) => s - 1)} fullWidth>
              Geri
            </Button>
          )}
          {step < 4 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()} fullWidth>
              {step === 1 ? "İleri" : step === 3 ? (favoriteBrands.length > 0 ? "Devam" : "Atla") : "Devam"}
            </Button>
          ) : (
            <Button loading={saving} onClick={async () => {
              setSaving(true);
              const allAllergies = [...allergies.filter(a => a !== "yok")];
              if (otherAllergy) allAllergies.push(...otherAllergy.split(",").map(s => s.trim()).filter(Boolean));
              await updateProfile({
                skin_type: skinType,
                special_condition: condition,
                trimester: condition === "pregnant" ? trimester : null,
                allergies: allAllergies.length > 0 ? allAllergies : null,
                favorite_brands: favoriteBrands.length > 0 ? favoriteBrands : null,
              });
              setSaving(false);
              router.push("/");
            }} fullWidth>
              Başla
            </Button>
          )}
        </div>

        {step < 4 && (
          <button onClick={() => router.push("/")} className="w-full text-center text-sm text-muted mt-4 hover:text-primary">
            Atla, sonra tamamlarım
          </button>
        )}
      </div>
    </div>
  );
}
