"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { SKIN_TYPES, SPECIAL_CONDITIONS, COMMON_ALLERGENS } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/lib/context/AuthContext";

const STEPS = ["Cilt Tipi", "Özel Durum", "Alerjiler", "Tamamla"];

export default function ProfileSetupPage() {
  const router = useRouter();
  const { updateProfile } = useAuthContext();
  const [step, setStep] = useState(0);
  const [skinType, setSkinType] = useState("");
  const [condition, setCondition] = useState("none");
  const [trimester, setTrimester] = useState<number | null>(null);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [otherAllergy, setOtherAllergy] = useState("");
  const [saving, setSaving] = useState(false);

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
              {SKIN_TYPES.map((type) => (
                <Card key={type.value} selected={skinType === type.value} onClick={() => setSkinType(type.value)}>
                  <div className="text-center">
                    <span className="text-3xl">{type.icon}</span>
                    <p className="font-semibold text-sm mt-2">{type.label}</p>
                    <p className="text-xs text-muted mt-1">{type.description}</p>
                  </div>
                </Card>
              ))}
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

        {/* Step 3: Complete */}
        {step === 3 && (
          <div className="text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <h2 className="text-xl font-bold">Harika! SkinCheck&apos;e hoş geldin!</h2>
            <Card>
              <div className="text-left space-y-2 text-sm">
                <p><span className="text-muted">Cilt tipi:</span> <strong>{SKIN_TYPES.find((t) => t.value === skinType)?.label}</strong></p>
                <p><span className="text-muted">Özel durum:</span> <strong>{SPECIAL_CONDITIONS.find((c) => c.value === condition)?.label}</strong></p>
                {trimester && <p><span className="text-muted">Trimester:</span> <strong>{trimester}</strong></p>}
                <p><span className="text-muted">Alerjiler:</span> <strong>{allergies.length > 0 ? allergies.join(", ") : "Belirtilmedi"}</strong></p>
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
          {step < 3 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()} fullWidth>
              {step === 1 ? "İleri" : "Devam"}
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
              });
              setSaving(false);
              router.push("/");
            }} fullWidth>
              Başla
            </Button>
          )}
        </div>

        {step < 3 && (
          <button onClick={() => router.push("/")} className="w-full text-center text-sm text-muted mt-4 hover:text-primary">
            Atla, sonra tamamlarım
          </button>
        )}
      </div>
    </div>
  );
}
