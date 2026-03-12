"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import Link from "next/link";
import { useAuthContext } from "@/lib/context/AuthContext";
import { useCabinet } from "@/lib/hooks/useCabinet";
import { useCommunity, Review } from "@/lib/hooks/useCommunity";
import { useEffect, useState } from "react";
import { SKIN_TYPES } from "@/lib/constants";
import { ScanLine, Archive, Palette, Sparkles, AlertTriangle, Clock, CheckCircle, Target, type LucideIcon } from "lucide-react";

const quickActions: { href: string; icon: LucideIcon; label: string; desc: string }[] = [
  { href: "/scan", icon: ScanLine, label: "Ürün Tara", desc: "Barkod veya INCI oku" },
  { href: "/cabinet", icon: Archive, label: "Dolabım", desc: "Ürünlerini yönet" },
  { href: "/makeup/undertone", icon: Palette, label: "Alt Ton Analizi", desc: "Renk tonunu keşfet" },
  { href: "/makeup/solutions", icon: Sparkles, label: "Makyaj Çözümleri", desc: "Sorunlara öneriler" },
];

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "az önce";
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
  return `${Math.floor(diff / 86400)} gün önce`;
}

export default function HomePage() {
  const { user, profile } = useAuthContext();
  const { expiringSoon, expired, totalActive } = useCabinet();
  const { reviews, fetchReviews } = useCommunity();
  const [latestReviews, setLatestReviews] = useState<Review[]>([]);

  const skinTypeLabel = SKIN_TYPES.find((t) => t.value === profile?.skin_type)?.label;

  useEffect(() => {
    fetchReviews("discover");
  }, [fetchReviews]);

  useEffect(() => {
    setLatestReviews(reviews.slice(0, 3));
  }, [reviews]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Günaydın";
    if (hour < 18) return "İyi günler";
    return "İyi akşamlar";
  };

  return (
    <>
      <Header />
      <main className="px-4 py-6 space-y-6 pb-28">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary to-secondary rounded-3xl p-6 text-white">
          <h2 className="text-2xl font-bold mb-1">
            {greeting()}!
          </h2>
          {profile?.full_name && <p className="text-white/90 text-sm font-medium">{profile.full_name}</p>}
          <p className="text-white/70 text-sm mt-1">
            {profile?.skin_type
              ? `${skinTypeLabel} cilt tipine özel öneriler hazır`
              : "Kozmetik ürünlerinin içeriğini analiz et"}
          </p>
          <Link
            href="/scan"
            className="inline-block mt-4 bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors"
          >
            Ürün Tara →
          </Link>
        </div>

        {/* Profile Banner (if not set up) */}
        {user && !profile?.skin_type && (
          <Link href="/profile-setup">
            <Card className="border-primary/30 bg-primary/5">
              <div className="flex items-center gap-3">
                <Target size={24} className="text-primary" />
                <div>
                  <p className="text-sm font-bold text-primary">Profilini Tamamla</p>
                  <p className="text-xs text-muted">Kişiselleştirilmiş öneriler için cilt tipini belirle</p>
                </div>
                <span className="ml-auto text-primary">→</span>
              </div>
            </Card>
          </Link>
        )}

        {/* Quick Actions */}
        <section>
          <h3 className="text-lg font-bold mb-3">Hızlı İşlemler</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
              <Link key={action.href} href={action.href}>
                <Card hoverable className="text-center">
                  <Icon size={28} className="text-primary mx-auto" />
                  <p className="font-semibold mt-2 text-sm">{action.label}</p>
                  <p className="text-xs text-muted mt-0.5">{action.desc}</p>
                </Card>
              </Link>
              );
            })}
          </div>
        </section>

        {/* SKT Alerts */}
        {user && (totalActive > 0 || expiringSoon.length > 0 || expired.length > 0) && (
          <section>
            <h3 className="text-lg font-bold mb-3">Ürün Durumu</h3>
            <div className="space-y-2">
              {expired.length > 0 && (
                <Link href="/cabinet">
                  <Card className="border-danger/30 bg-danger/5 mb-2">
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={24} className="text-danger" />
                      <div>
                        <p className="text-sm font-bold text-danger">{expired.length} ürünün süresi doldu!</p>
                        <p className="text-xs text-muted">Dolabını kontrol et</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              )}
              {expiringSoon.length > 0 && (
                <Link href="/cabinet">
                  <Card className="border-warning/30 bg-warning/5 mb-2">
                    <div className="flex items-center gap-3">
                      <Clock size={24} className="text-warning" />
                      <div>
                        <p className="text-sm font-medium">{expiringSoon.length} ürünün süresi yaklaşıyor</p>
                        <p className="text-xs text-muted">30 gün içinde dolacak</p>
                      </div>
                    </div>
                  </Card>
                </Link>
              )}
              {totalActive > 0 && expired.length === 0 && expiringSoon.length === 0 && (
                <Card className="border-safe/30 bg-safe/5">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={24} className="text-safe" />
                    <div>
                      <p className="text-sm font-medium">{totalActive} aktif ürün</p>
                      <p className="text-xs text-muted">Tüm ürünlerin güvende</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </section>
        )}

        {!user && (
          <section>
            <Card className="border-warning/30 bg-warning/5">
              <div className="flex items-center gap-3">
                <Clock size={24} className="text-warning" />
                <div>
                  <p className="text-sm font-medium">Ürün sürelerini takip et</p>
                  <p className="text-xs text-muted">Dolabına ürün ekleyerek SKT takibi yap</p>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Community */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold">Topluluktan</h3>
            <Link href="/community" className="text-primary text-sm font-medium">Tümünü Gör →</Link>
          </div>
          {latestReviews.length === 0 ? (
            <Card>
              <p className="text-sm text-muted text-center py-4">
                Henüz yorum yok. İlk yorumu sen yaz!
              </p>
            </Card>
          ) : (
            <div className="space-y-2">
              {latestReviews.map((review) => (
                <Card key={review.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary text-xs font-bold">
                      {review.profile?.full_name?.[0] || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{review.profile?.full_name || "Anonim"}</p>
                      <p className="text-[10px] text-muted">{timeAgo(review.created_at)}</p>
                    </div>
                    {review.profile?.skin_type && <Badge variant="primary" size="sm">{review.profile.skin_type}</Badge>}
                  </div>
                  {review.product && (
                    <p className="text-xs font-medium">{review.product.brand} - {review.product.name}</p>
                  )}
                  <StarRating rating={review.rating} size={12} className="mt-1" />
                  {review.comment && <p className="text-xs text-muted mt-1 line-clamp-2">{review.comment}</p>}
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
