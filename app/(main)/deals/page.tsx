"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Deal {
  id: string;
  store_name: string;
  store_type: string | null;
  original_price: number | null;
  sale_price: number | null;
  discount_percent: number | null;
  coupon_code: string | null;
  valid_until: string | null;
  url: string | null;
  is_verified: boolean;
  created_at: string;
  product?: {
    id: string;
    name: string;
    brand: string | null;
    category: string | null;
    image_url: string | null;
  };
}

const CATEGORIES = [
  { label: "Tümü", icon: "🏷️", value: null },
  { label: "Makyaj", icon: "💄", value: "makyaj" },
  { label: "Cilt Bakımı", icon: "🧴", value: "cilt bakımı" },
  { label: "Saç Bakımı", icon: "💇", value: "saç bakımı" },
  { label: "Parfüm", icon: "🌸", value: "parfüm" },
  { label: "Güneş", icon: "☀️", value: "güneş" },
];

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      let query = supabase
        .from("deals")
        .select("*, product:products(id, name, brand, category, image_url)")
        .order("created_at", { ascending: false })
        .limit(50);

      if (activeCategory) {
        query = query.eq("product.category", activeCategory);
      }

      const { data } = await query;
      setDeals((data as Deal[]) || []);
      setLoading(false);
    };
    fetchDeals();
  }, [activeCategory]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const daysLeft = (date: string | null) => {
    if (!date) return null;
    const d = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return d > 0 ? d : null;
  };

  return (
    <>
      <Header title="Fırsatlar" />
      <main className="px-4 py-4 space-y-4 pb-28">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.label}
              onClick={() => setActiveCategory(c.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeCategory === c.value
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-muted hover:bg-gray-200"
              }`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Deals */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : deals.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-5xl">🏷️</span>
            <p className="font-semibold mt-4">Henüz fırsat yok</p>
            <p className="text-sm text-muted mt-1">Kozmetik indirimleri burada listelenecek</p>
          </div>
        ) : (
          <div className="space-y-3">
            {deals.map((deal) => (
              <Card key={deal.id} hoverable>
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                    {deal.product?.image_url ? (
                      <img src={deal.product.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">🧴</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {deal.product?.brand && <p className="text-xs text-muted">{deal.product.brand}</p>}
                    <p className="font-semibold text-sm truncate">{deal.product?.name || "Ürün"}</p>

                    <div className="flex items-center gap-2 mt-1">
                      {deal.original_price && (
                        <span className="text-xs text-muted line-through">₺{deal.original_price}</span>
                      )}
                      {deal.sale_price && (
                        <span className="text-lg font-bold text-danger">₺{deal.sale_price}</span>
                      )}
                      {deal.discount_percent && (
                        <Badge variant="danger" size="sm">%{deal.discount_percent}</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">{deal.store_type === "online" ? "💻" : deal.store_type === "physical" ? "🏪" : "🛒"}</span>
                        <span className="text-xs text-muted">{deal.store_name}</span>
                      </div>
                      {deal.is_verified && <Badge variant="safe" size="sm">Doğrulanmış</Badge>}
                      {deal.valid_until && daysLeft(deal.valid_until) && (
                        <Badge variant="warning" size="sm">{daysLeft(deal.valid_until)} gün kaldı</Badge>
                      )}
                    </div>

                    {deal.coupon_code && (
                      <button
                        onClick={() => copyCode(deal.coupon_code!)}
                        className="mt-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-xs font-mono text-primary"
                      >
                        {copiedCode === deal.coupon_code ? "Kopyalandı ✓" : `🎫 ${deal.coupon_code}`}
                      </button>
                    )}

                    {deal.url && (
                      <a
                        href={deal.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-2 text-xs text-primary font-medium"
                      >
                        Fırsata Git →
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
