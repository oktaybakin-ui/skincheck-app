"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { MAKEUP_SOLUTIONS } from "@/lib/constants/makeup-solutions";
import { SOLUTION_ICONS } from "@/lib/constants/icons";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Sparkles, Lightbulb, Clock } from "lucide-react";

export default function SolutionDetailPage() {
  const { slug } = useParams();
  const solution = MAKEUP_SOLUTIONS.find((s) => s.slug === slug);
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  if (!solution) {
    return (
      <>
        <Header title="Bulunamadı" showBack />
        <main className="px-4 py-8 text-center">
          <p className="text-muted">Bu çözüm bulunamadı.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title={solution.title} showBack />
      <main className="px-4 py-4 space-y-5 pb-28">
        {/* Hero */}
        <div className="bg-gradient-to-br from-secondary/10 to-primary/10 rounded-2xl p-5 text-center">
          {(() => { const Icon = SOLUTION_ICONS[solution.slug] || Sparkles; return <Icon size={48} className="mx-auto text-primary" />; })()}
          <h2 className="text-lg font-bold mt-2">{solution.title}</h2>
          <p className="text-sm text-muted mt-1">{solution.desc}</p>
          <div className="flex justify-center gap-2 mt-3">
            <Badge variant={solution.difficulty === "Kolay" ? "safe" : solution.difficulty === "Orta" ? "warning" : "danger"}>
              {solution.difficulty}
            </Badge>
            <Badge variant="info"><Clock size={12} className="inline -mt-0.5 mr-1" />{solution.duration}</Badge>
          </div>
        </div>

        {/* Tools */}
        <div>
          <h3 className="font-bold text-sm mb-2">Gerekli Malzemeler</h3>
          <div className="flex flex-wrap gap-2">
            {solution.tools.map((t) => (
              <Badge key={t} variant="secondary" size="md">{t}</Badge>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div>
          <h3 className="font-bold text-sm mb-3">Adım Adım Uygulama</h3>
          <div className="space-y-2">
            {solution.steps.map((step, i) => (
              <Card
                key={i}
                onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                className="cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    expandedStep === i ? "bg-primary text-white" : "bg-primary/10 text-primary"
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{step.title}</p>
                    {expandedStep === i && (
                      <p className="text-sm text-muted mt-2 leading-relaxed">{step.detail}</p>
                    )}
                  </div>
                  <span className={`text-muted text-xs transition-transform ${expandedStep === i ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div>
          <h3 className="font-bold text-sm mb-2">İpuçları</h3>
          <Card>
            <ul className="space-y-2">
              {solution.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Lightbulb size={16} className="text-primary mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Product Types */}
        <div>
          <h3 className="font-bold text-sm mb-2">Önerilen Ürün Tipleri</h3>
          <div className="flex flex-wrap gap-2">
            {solution.productTypes.map((p) => (
              <Badge key={p} variant="primary" size="md">{p}</Badge>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
