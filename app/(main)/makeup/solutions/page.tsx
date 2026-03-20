"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { MAKEUP_SOLUTIONS } from "@/lib/constants/makeup-solutions";
import { SOLUTION_ICONS } from "@/lib/constants/icons";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n/I18nContext";

type DifficultyFilter = "all" | "Kolay" | "Orta" | "İleri";
type SkinFilter = "all" | "Yağlı" | "Kuru" | "Karma" | "Hassas" | "Olgun";

const DIFF_KEYS: { value: DifficultyFilter; key: string }[] = [
  { value: "all", key: "sol_all_levels" },
  { value: "Kolay", key: "sol_easy" },
  { value: "Orta", key: "sol_medium" },
  { value: "İleri", key: "sol_hard" },
];

const SKIN_KEYS: { value: SkinFilter; key: string }[] = [
  { value: "all", key: "sol_all_skin" },
  { value: "Yağlı", key: "sol_oily" },
  { value: "Kuru", key: "sol_dry" },
  { value: "Karma", key: "sol_combo" },
  { value: "Hassas", key: "sol_sensitive" },
  { value: "Olgun", key: "sol_mature" },
];

export default function SolutionsPage() {
  const { t } = useI18n();
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [skinType, setSkinType] = useState<SkinFilter>("all");

  const filtered = MAKEUP_SOLUTIONS.filter((s) => {
    if (difficulty !== "all" && s.difficulty !== difficulty) return false;
    if (skinType !== "all" && !s.skinTypes?.includes(skinType) && !s.skinTypes?.includes("Tüm Ciltler")) return false;
    return true;
  });

  return (
    <>
      <Header title={t.sol_title} showBack />
      <main className="px-4 py-4 space-y-4">
        {/* Difficulty Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {DIFF_KEYS.map((d) => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                difficulty === d.value ? "bg-primary text-white" : "bg-gray-100 text-muted hover:bg-gray-200"
              }`}
            >
              {t[d.key as keyof typeof t]}
            </button>
          ))}
        </div>

        {/* Skin Type Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {SKIN_KEYS.map((s) => (
            <button
              key={s.value}
              onClick={() => setSkinType(s.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                skinType === s.value ? "bg-secondary text-white" : "bg-gray-100 text-muted hover:bg-gray-200"
              }`}
            >
              {t[s.key as keyof typeof t]}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted">{filtered.length} {t.sol_found}</p>

        <div className="space-y-2">
          {filtered.map((s) => {
            const Icon = SOLUTION_ICONS[s.slug] || Sparkles;
            return (
              <Link key={s.slug} href={`/makeup/solutions/${s.slug}`}>
                <Card hoverable>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon size={20} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{s.title}</p>
                      <p className="text-xs text-muted mt-0.5 line-clamp-1">{s.desc}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <Badge variant={s.difficulty === "Kolay" ? "safe" : s.difficulty === "Orta" ? "warning" : "danger"} size="sm">
                        {s.difficulty}
                      </Badge>
                      <Badge variant="muted" size="sm">{s.duration}</Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted">{t.sol_no_results}</p>
          </div>
        )}
      </main>
    </>
  );
}
