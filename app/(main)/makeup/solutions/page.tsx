"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { MAKEUP_SOLUTIONS } from "@/lib/constants/makeup-solutions";
import { SOLUTION_ICONS } from "@/lib/constants/icons";
import { Sparkles } from "lucide-react";

export default function SolutionsPage() {
  return (
    <>
      <Header title="Makyaj Çözümleri" showBack />
      <main className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {MAKEUP_SOLUTIONS.map((s) => {
            const Icon = SOLUTION_ICONS[s.slug] || Sparkles;
            return (
            <Link key={s.slug} href={`/makeup/solutions/${s.slug}`}>
              <Card hoverable className="h-full">
                <div className="text-center">
                  <Icon size={28} className="mx-auto text-primary" />
                  <p className="font-semibold text-sm mt-2">{s.title}</p>
                  <p className="text-xs text-muted mt-1">{s.desc}</p>
                  <div className="flex justify-center gap-1 mt-2">
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
      </main>
    </>
  );
}
