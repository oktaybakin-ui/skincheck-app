"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useEffect, useState, useCallback } from "react";
import {
  Tag,
  Sparkles,
  FlaskConical,
  Scissors,
  Flower,
  Sun,
  ShoppingCart,
  Ticket,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Clock,
  Store,
  TrendingDown,
  Percent,
  ShoppingBag,
  Search,
  X,
  type LucideIcon,
} from "lucide-react";

interface Deal {
  id: string;
  store_slug: string;
  store_name: string;
  campaign_title: string;
  campaign_url: string;
  product_name: string | null;
  brand: string | null;
  category: string | null;
  original_price: number | null;
  sale_price: number | null;
  discount_percent: number | null;
  coupon_code: string | null;
  valid_until: string | null;
  image_url: string | null;
  source_type: string;
  last_scraped_at: string | null;
  is_active: boolean;
}

interface Retailer {
  id: string;
  store_slug: string;
  store_name: string;
  store_url: string;
  campaign_page_url: string | null;
  scrape_enabled: boolean;
  logo_emoji: string | null;
  description: string | null;
}

const CATEGORIES: { label: string; icon: LucideIcon; value: string | null }[] = [
  { label: "Tümü", icon: Tag, value: null },
  { label: "Makyaj", icon: Sparkles, value: "makyaj" },
  { label: "Cilt Bakımı", icon: FlaskConical, value: "cilt bakımı" },
  { label: "Saç Bakımı", icon: Scissors, value: "saç bakımı" },
  { label: "Parfüm", icon: Flower, value: "parfüm" },
  { label: "Güneş", icon: Sun, value: "güneş" },
];

const STORE_LOGOS: Record<string, string> = {
  gratis: "/logos/gratis.svg",
  watsons: "/logos/watsons.svg",
  rossmann: "/logos/rossmann.svg",
  trendyol: "/logos/trendyol.svg",
  hepsiburada: "/logos/hepsiburada.svg",
  sephora: "/logos/sephora.svg",
  flormar: "/logos/flormar.svg",
  mac: "/logos/mac.svg",
  akakce: "/logos/akakce.svg",
};

const STORE_COLORS: Record<string, string> = {
  gratis: "from-green-500/20 to-green-600/5 border-green-500/30",
  watsons: "from-blue-500/20 to-blue-600/5 border-blue-500/30",
  rossmann: "from-red-500/20 to-red-600/5 border-red-500/30",
  trendyol: "from-orange-500/20 to-orange-600/5 border-orange-500/30",
  hepsiburada: "from-yellow-500/20 to-yellow-600/5 border-yellow-500/30",
  sephora: "from-gray-800/20 to-gray-900/5 border-gray-700/30",
  flormar: "from-purple-500/20 to-purple-600/5 border-purple-500/30",
  mac: "from-gray-700/20 to-gray-800/5 border-gray-600/30",
  akakce: "from-blue-600/20 to-blue-700/5 border-blue-600/30",
};

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "az önce";
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} saat önce`;
  return `${Math.floor(hours / 24)} gün önce`;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastScrape, setLastScrape] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeStore, setActiveStore] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDeals = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (activeStore) params.set("store", activeStore);
      if (activeCategory) params.set("category", activeCategory);

      const res = await fetch(`https://einypelxufqmqwuzmped.supabase.co/functions/v1/deals?${params.toString()}`);
      const data = await res.json();

      setDeals(data.deals || []);
      setRetailers(data.retailers || []);
      setLastScrape(data.lastScrape);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [activeStore, activeCategory]);

  useEffect(() => {
    setLoading(true);
    fetchDeals();
  }, [fetchDeals]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Kampanyalar arka planda (sunucu tarafı) güncellenir; burada sadece en güncel veriyi yeniden çekiyoruz.
      await fetchDeals();
    } catch {
      // silently fail
    } finally {
      setRefreshing(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const scrapedDeals = deals.filter((d) => {
    if (d.source_type !== "scraped") return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (d.product_name && d.product_name.toLowerCase().includes(q)) ||
      (d.brand && d.brand.toLowerCase().includes(q)) ||
      (d.campaign_title && d.campaign_title.toLowerCase().includes(q)) ||
      (d.store_name && d.store_name.toLowerCase().includes(q))
    );
  });
  const hasDeals = scrapedDeals.length > 0;

  return (
    <>
      <Header title="Fırsatlar" />
      <main className="px-4 py-4 space-y-5 pb-28">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted flex items-center gap-1">
              <Clock size={12} />
              {lastScrape ? `Son güncelleme: ${timeAgo(lastScrape)}` : "Henüz güncellenmedi"}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Güncelleniyor..." : "Yenile"}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ürün, marka veya mağaza ara..."
            className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Store Campaign Cards */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Store size={16} />
            Mağaza Kampanyaları
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {retailers.map((r) => {
              const logo = STORE_LOGOS[r.store_slug];
              const colors = STORE_COLORS[r.store_slug] || "from-gray-500/20 to-gray-600/5 border-gray-500/30";
              const storeDeals = deals.filter((d) => d.store_slug === r.store_slug);
              const dealCount = storeDeals.length;

              return (
                <a
                  key={r.id}
                  href={r.campaign_page_url || r.store_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative bg-gradient-to-br ${colors} border rounded-2xl p-3.5 hover:scale-[1.02] active:scale-[0.98] transition-transform`}
                >
                  <div className="flex items-start justify-between mb-2">
                    {logo ? (
                      <img src={logo} alt={r.store_name} className="h-7 w-auto object-contain" loading="lazy" />
                    ) : (
                      <Store size={24} className="text-muted" />
                    )}
                    <ExternalLink size={12} className="text-muted/60" />
                  </div>
                  <p className="font-bold text-sm">{r.store_name}</p>
                  {r.description && (
                    <p className="text-[10px] text-muted mt-0.5 line-clamp-1">{r.description}</p>
                  )}
                  {dealCount > 0 && (
                    <div className="mt-2 flex items-center gap-1">
                      <Badge variant="danger" size="sm">
                        {dealCount} fırsat
                      </Badge>
                    </div>
                  )}
                </a>
              );
            })}
          </div>
        </section>

        {/* Store Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveStore(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              !activeStore
                ? "bg-primary text-white"
                : "bg-gray-100 text-muted hover:bg-gray-200"
            }`}
          >
            Tüm Mağazalar
          </button>
          {retailers.map((r) => (
            <button
              key={r.store_slug}
              onClick={() => setActiveStore(activeStore === r.store_slug ? null : r.store_slug)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                activeStore === r.store_slug
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-muted hover:bg-gray-200"
              }`}
            >
              {STORE_LOGOS[r.store_slug] ? (
                <img src={STORE_LOGOS[r.store_slug]} alt="" className="h-3.5 w-auto object-contain" />
              ) : (
                <Store size={12} />
              )}
              {r.store_name}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.label}
                onClick={() => setActiveCategory(c.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeCategory === c.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-muted hover:bg-gray-200"
                }`}
              >
                <Icon size={14} /> {c.label}
              </button>
            );
          })}
        </div>

        {/* Scraped Deals */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingDown size={16} />
            Güncel İndirimler
            {hasDeals && (
              <span className="text-xs font-normal text-muted">({scrapedDeals.length} ürün)</span>
            )}
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : !hasDeals ? (
            <Card>
              <div className="text-center py-8">
                <ShoppingBag size={40} className="text-muted/40 mx-auto" />
                <p className="font-semibold mt-3 text-sm">İndirimler yükleniyor</p>
                <p className="text-xs text-muted mt-1.5 max-w-[280px] mx-auto">
                  Mağazalardan kampanya bilgileri çekiliyor. &quot;Yenile&quot; butonuna tıklayarak güncelleme başlatabilirsiniz.
                </p>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
                >
                  <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
                  {refreshing ? "Güncelleniyor..." : "Kampanyaları Yükle"}
                </button>
              </div>
            </Card>
          ) : (
            <div className="space-y-3">
              {scrapedDeals.map((deal) => (
                <Card key={deal.id} hoverable>
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      {deal.image_url ? (
                        <img
                          src={deal.image_url}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <ShoppingCart size={20} className="text-muted/40" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Store + brand */}
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {STORE_LOGOS[deal.store_slug] ? (
                          <img src={STORE_LOGOS[deal.store_slug]} alt="" className="h-3 w-auto object-contain" />
                        ) : (
                          <Store size={12} className="text-muted" />
                        )}
                        <span className="text-[10px] text-muted font-medium">{deal.store_name}</span>
                        {deal.brand && (
                          <>
                            <span className="text-muted/30">·</span>
                            <span className="text-[10px] text-muted">{deal.brand}</span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <p className="font-semibold text-sm leading-tight line-clamp-2">
                        {deal.product_name || deal.campaign_title}
                      </p>

                      {/* Prices */}
                      <div className="flex items-center gap-2 mt-1.5">
                        {deal.original_price != null && (
                          <span className="text-xs text-muted line-through">
                            ₺{deal.original_price.toFixed(0)}
                          </span>
                        )}
                        {deal.sale_price != null && (
                          <span className="text-base font-bold text-danger">
                            ₺{deal.sale_price.toFixed(0)}
                          </span>
                        )}
                        {deal.discount_percent != null && (
                          <Badge variant="danger" size="sm">
                            <Percent size={10} className="inline" />
                            {deal.discount_percent}
                          </Badge>
                        )}
                      </div>

                      {/* Coupon */}
                      {deal.coupon_code && (
                        <button
                          onClick={() => copyCode(deal.coupon_code!)}
                          className="mt-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-xs font-mono text-primary flex items-center gap-1.5"
                        >
                          {copiedCode === deal.coupon_code ? (
                            "Kopyalandı ✓"
                          ) : (
                            <>
                              <Ticket size={12} /> {deal.coupon_code}
                            </>
                          )}
                        </button>
                      )}

                      {/* Link */}
                      {deal.campaign_url && (
                        <a
                          href={deal.campaign_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                        >
                          Fırsata Git <ChevronRight size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
