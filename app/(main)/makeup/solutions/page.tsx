"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { MAKEUP_SOLUTIONS } from "@/lib/constants/makeup-solutions";
import { SOLUTION_ICONS } from "@/lib/constants/icons";
import { Sparkles } from "lucide-react";
import { useState } from "react";

type DifficultyFilter = "all" | "Kolay" | "Orta" | "İleri";
type SkinFilter = "all" | "Yağlı" | "Kuru" | "Karma" | "Hassas" | "Olgun";

export default function SolutionsPage() {
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [skinType, setSkinType] = useState<SkinFilter>("all");

  const filtered = MAKEUP_SOLUTIONS.filter((s) => {
    if (difficulty !== "all" && s.difficulty !== difficulty) return false;
    if (skinType !== "all" && !s.skinTypes?.includes(skinType) && !s.skinTypes?.includes("Tüm Ciltler")) return false;
    return true;
  });

  return (
    <>
      <Header title="Makyaj Çözümleri" showBack />
      <main className="px-4 py-4 space-y-4">
        {/* Difficulty Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(["all", "Kolay", "Orta", "İleri"] as DifficultyFilter[]).map((d) => (
            <button
              key={d}
              onClick={() => setDifficulty(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                difficulty === d ? "bg-primary text-white" : "bg-gray-100 text-muted hover:bg-gray-200"
              }`}
            >
              {d === "all" ? "Tüm Seviyeler" : d}
            </button>
          ))}
        </div>

        {/* Skin Type Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {(["all", "Yağlı", "Kuru", "Karma", "Hassas", "Olgun"] as SkinFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setSkinType(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                skinType === s ? "bg-secondary text-white" : "bg-gray-100 text-muted hover:bg-gray-200"
              }`}
            >
              {s === "all" ? "Tüm Cilt Tipleri" : s}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted">{filtered.length} çözüm bulundu</p>

        <div className="grid grid-cols-2 gap-3">
          {filtered.map((s) => {
            const Icon = SOLUTION_ICONS[s.slug] || Sparkles;
            return (
              <Link key={s.slug} href={`/makeup/solutions/${s.slug}`}>
                <Card hoverable className="h-full">
                  <div className="text-center">
                    <Icon size={28} className="mx-auto text-primary" />
                    <p className="font-semibold text-sm mt-2">{s.title}</p>
                    <p className="text-xs text-muted mt-1">{s.desc}</p>
                    <div className="flex justify-center gap-1 mt-2 flex-wrap">
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
            <p className="text-muted">Bu filtrelere uygun çözüm bulunamadı</p>
          </div>
        )}
      </main>
    </>
  );
}
