"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";
import {
  Search,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  TrendingUp,
  ShoppingBag,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

interface SimilarProduct {
  name: string;
  brand: string;
  score: number;
  price_range: string;
}

interface SatisfactionData {
  product_name: string;
  brand: string;
  overall_score: number;
  total_reviews_estimate: string;
  satisfaction_percent: number;
  pros: string[];
  cons: string[];
  best_for: string[];
  avoid_if: string[];
  price_range: string;
  repurchase_rate: number;
  category: string;
  similar_products: SimilarProduct[];
  verdict: string;
  error?: string;
}

export default function ProductSatisfaction() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SatisfactionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q || q.length < 2) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch("/api/ai/satisfaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const result = await res.json();

      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
      }
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return "text-safe";
    if (score >= 3) return "text-warning";
    return "text-danger";
  };

  const getPercentColor = (pct: number) => {
    if (pct >= 70) return "bg-safe";
    if (pct >= 50) return "bg-warning";
    return "bg-danger";
  };

  const reset = () => {
    setData(null);
    setError(null);
    setQuery("");
  };

  return (
    <section>
      <h3 className="text-lg font-bold mb-3">Ürün Memnuniyet Skoru</h3>
      <Card>
        {/* Search */}
        {!data && (
          <>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Ürün veya marka adı..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
                />
              </div>
              <Button onClick={handleSearch} disabled={loading || query.trim().length < 2} className="shrink-0">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <BarChart3 size={16} />}
              </Button>
            </div>
            <p className="text-[10px] text-muted text-center mt-2">
              Ürün adı yazın, AI memnuniyet skorunu ve kullanıcı yorumlarını analiz etsin
            </p>
          </>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-4">
            <AlertTriangle size={24} className="text-warning mx-auto" />
            <p className="text-sm text-muted mt-2">{error}</p>
            <button onClick={reset} className="text-primary text-xs font-medium mt-2">
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-6">
            <Loader2 size={28} className="animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted mt-2">Memnuniyet verileri analiz ediliyor...</p>
          </div>
        )}

        {/* Results */}
        {data && !data.error && (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-sm">{data.product_name}</p>
                <p className="text-xs text-muted">{data.brand}</p>
                <Badge variant="primary" size="sm" className="mt-1">{data.category}</Badge>
              </div>
              <div className="text-right">
                <p className={`text-2xl font-black ${getScoreColor(data.overall_score)}`}>
                  {data.overall_score.toFixed(1)}
                </p>
                <StarRating rating={data.overall_score} size={12} />
                <p className="text-[10px] text-muted mt-0.5">{data.total_reviews_estimate} yorum</p>
              </div>
            </div>

            {/* Score Bars */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-muted">Memnuniyet</span>
                  <span className="text-xs font-bold">{data.satisfaction_percent}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getPercentColor(data.satisfaction_percent)}`}
                    style={{ width: `${data.satisfaction_percent}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-muted">Tekrar Alma</span>
                  <span className="text-xs font-bold">{data.repurchase_rate}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getPercentColor(data.repurchase_rate)}`}
                    style={{ width: `${data.repurchase_rate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2">
                <ShoppingBag size={14} className="text-primary" />
                <span className="text-xs font-medium">Fiyat Aralığı</span>
              </div>
              <span className="text-sm font-bold text-primary">{data.price_range}</span>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-bold mb-1.5 flex items-center gap-1">
                  <ThumbsUp size={12} className="text-safe" /> Olumlu
                </p>
                <div className="space-y-1">
                  {data.pros.map((p, i) => (
                    <p key={i} className="text-[11px] text-foreground/80 flex items-start gap-1.5">
                      <CheckCircle size={10} className="text-safe shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold mb-1.5 flex items-center gap-1">
                  <ThumbsDown size={12} className="text-danger" /> Olumsuz
                </p>
                <div className="space-y-1">
                  {data.cons.map((c, i) => (
                    <p key={i} className="text-[11px] text-foreground/80 flex items-start gap-1.5">
                      <AlertTriangle size={10} className="text-danger shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Best for / Avoid if */}
            <div className="space-y-2">
              {data.best_for.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-muted mr-1">Uygun:</span>
                  {data.best_for.map((b, i) => (
                    <Badge key={i} variant="safe" size="sm">{b}</Badge>
                  ))}
                </div>
              )}
              {data.avoid_if.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-muted mr-1">Dikkat:</span>
                  {data.avoid_if.map((a, i) => (
                    <Badge key={i} variant="danger" size="sm">{a}</Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Verdict */}
            <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-xs leading-relaxed text-foreground/80">{data.verdict}</p>
            </div>

            {/* Similar Products */}
            {data.similar_products && data.similar_products.length > 0 && (
              <div>
                <p className="text-xs font-bold mb-2 flex items-center gap-1">
                  <TrendingUp size={12} className="text-primary" /> Benzer Ürünler
                </p>
                <div className="space-y-1.5">
                  {data.similar_products.map((sp, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium truncate">{sp.brand} {sp.name}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className={`text-xs font-bold ${getScoreColor(sp.score)}`}>{sp.score.toFixed(1)}</span>
                        <span className="text-[10px] text-muted">{sp.price_range}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Google Search Link */}
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(data.product_name + " " + data.brand + " yorumları")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-medium transition-colors"
            >
              Daha fazla yorum oku <ChevronRight size={14} />
            </a>

            {/* Reset */}
            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-primary font-medium py-2"
            >
              <RefreshCw size={12} /> Başka Ürün Ara
            </button>
          </div>
        )}
      </Card>
    </section>
  );
}
