"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { MAKEUP_SOLUTIONS } from "@/lib/constants/makeup-solutions";
import { SOLUTION_ICONS } from "@/lib/constants/icons";
import { useParams } from "next/navigation";
import { useState } from "react";
import PinterestButton from "@/components/ui/PinterestButton";
import { Sparkles, Lightbulb, Clock, ThumbsUp, ThumbsDown, ExternalLink, ShoppingBag } from "lucide-react";

export default function SolutionDetailPage() {
  const { slug } = useParams();
  const solution = MAKEUP_SOLUTIONS.find((s) => s.slug === slug);
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

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

        {/* Product Types with Seller Links */}
        <div>
          <h3 className="font-bold text-sm mb-2">Önerilen Ürün Tipleri</h3>
          <div className="space-y-2">
            {solution.productTypes.map((p) => (
              <Card key={p} className="!p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={14} className="text-primary" />
                    <span className="text-sm font-medium">{p}</span>
                  </div>
                  <div className="flex gap-1.5">
                    <a
                      href={`https://www.trendyol.com/sr?q=${encodeURIComponent(p)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-medium flex items-center gap-1 hover:bg-orange-100 transition-colors"
                    >
                      Trendyol <ExternalLink size={10} />
                    </a>
                    <a
                      href={`https://www.gratis.com/arama?q=${encodeURIComponent(p)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-medium flex items-center gap-1 hover:bg-green-100 transition-colors"
                    >
                      Gratis <ExternalLink size={10} />
                    </a>
                    <a
                      href={`https://www.sephora.com.tr/search?q=${encodeURIComponent(p)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-medium flex items-center gap-1 hover:bg-gray-200 transition-colors"
                    >
                      Sephora <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Search Buttons */}
        <div className="flex gap-2">
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(solution.title + " nasıl yapılır makyaj")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google&apos;da Ara
          </a>
          <PinterestButton query={`${solution.title} makeup tutorial`} className="flex-1" />
        </div>

        {/* Feedback */}
        <Card className="text-center">
          <p className="font-semibold text-sm mb-3">Bu çözüm işe yaradı mı?</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setFeedback("up")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                feedback === "up" ? "bg-safe/20 text-safe" : "bg-gray-100 text-muted hover:bg-safe/10"
              }`}
            >
              <ThumbsUp size={18} /> Evet, harika!
            </button>
            <button
              onClick={() => setFeedback("down")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                feedback === "down" ? "bg-danger/20 text-danger" : "bg-gray-100 text-muted hover:bg-danger/10"
              }`}
            >
              <ThumbsDown size={18} /> Pek değil
            </button>
          </div>
          {feedback && (
            <p className="text-xs text-muted mt-2">
              {feedback === "up" ? "Geri bildiriminiz için teşekkürler!" : "Daha iyi çözümler üzerinde çalışıyoruz!"}
            </p>
          )}
        </Card>
      </main>
    </>
  );
}
