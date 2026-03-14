"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/ui/StarRating";
import PeriodTracker from "@/components/period/PeriodTracker";
import Link from "next/link";
import { useAuthContext } from "@/lib/context/AuthContext";
import { useCabinet } from "@/lib/hooks/useCabinet";
import { useCommunity, Review } from "@/lib/hooks/useCommunity";
import { useEffect, useState, useRef, useMemo } from "react";
import { SKIN_TYPES } from "@/lib/constants";
import { useI18n } from "@/lib/i18n/I18nContext";
import { ScanLine, Archive, Palette, Sparkles, AlertTriangle, Clock, CheckCircle, Target, Play, ChevronRight, FlaskConical, Tag, Instagram, type LucideIcon } from "lucide-react";
import { youtubeChannels } from "@/lib/constants/youtube-channels";
import PinterestInspiration from "@/components/home/PinterestInspiration";
import SocialMediaSearchHome from "@/components/home/SocialMediaSearchHome";

export default function HomePage() {
  const { user, profile } = useAuthContext();
  const { expiringSoon, expired, totalActive } = useCabinet();
  const { reviews, fetchReviews } = useCommunity();
  const [latestReviews, setLatestReviews] = useState<Review[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  const skinTypeLabel = profile?.skin_type
    ? profile.skin_type.split(",").map(st => SKIN_TYPES.find(s => s.value === st)?.label).filter(Boolean).join(", ")
    : undefined;

  const quickActions: { href: string; icon: LucideIcon; label: string; desc: string }[] = useMemo(() => [
    { href: "/scan", icon: ScanLine, label: t.scan_product, desc: t.scan_desc },
    { href: "/cabinet", icon: Archive, label: t.my_cabinet, desc: t.cabinet_desc },
    { href: "/makeup/undertone", icon: Palette, label: t.undertone_analysis, desc: t.undertone_desc },
    { href: "/makeup/solutions", icon: Sparkles, label: t.makeup_solutions, desc: t.solutions_desc },
  ], [t]);

  const timeAgo = (dateStr: string): string => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return t.time_just_now;
    if (diff < 3600) return `${Math.floor(diff / 60)} ${t.time_minutes_ago}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ${t.time_hours_ago}`;
    return `${Math.floor(diff / 86400)} ${t.time_days_ago}`;
  };

  useEffect(() => {
    fetchReviews("discover");
  }, [fetchReviews]);

  useEffect(() => {
    setLatestReviews(reviews.slice(0, 3));
  }, [reviews]);

  // Auto-scroll YouTube channels
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let paused = false;
    let raf: number;
    const speed = 0.5; // px per frame

    const step = () => {
      if (!paused && el) {
        el.scrollLeft += speed;
        // Reset to start when reaching end
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
          el.scrollLeft = 0;
        }
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const pause = () => { paused = true; };
    const resume = () => { paused = false; };
    el.addEventListener("pointerdown", pause);
    el.addEventListener("pointerup", resume);
    el.addEventListener("pointerleave", resume);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("pointerup", resume);
      el.removeEventListener("pointerleave", resume);
    };
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.greeting_morning;
    if (hour < 18) return t.greeting_afternoon;
    return t.greeting_evening;
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
              ? `${skinTypeLabel} ${t.custom_recommendations}`
              : t.analyze_ingredients}
          </p>
          <Link
            href="/scan"
            className="inline-block mt-4 bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-colors"
          >
            {t.scan_product} →
          </Link>
        </div>

        {/* Profile Banner (if not set up) */}
        {user && !profile?.skin_type && (
          <Link href="/profile-setup">
            <Card className="border-primary/30 bg-primary/5">
              <div className="flex items-center gap-3">
                <Target size={24} className="text-primary" />
                <div>
                  <p className="text-sm font-bold text-primary">{t.complete_profile}</p>
                  <p className="text-xs text-muted">{t.complete_profile_desc}</p>
                </div>
                <span className="ml-auto text-primary">→</span>
              </div>
            </Card>
          </Link>
        )}

        {/* Quick Actions */}
        <section>
          <h3 className="text-lg font-bold mb-3">{t.quick_actions}</h3>
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
            <h3 className="text-lg font-bold mb-3">{t.product_status}</h3>
            <div className="space-y-2">
              {expired.length > 0 && (
                <Link href="/cabinet">
                  <Card className="border-danger/30 bg-danger/5 mb-2">
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={24} className="text-danger" />
                      <div>
                        <p className="text-sm font-bold text-danger">{expired.length} {t.expired_products}</p>
                        <p className="text-xs text-muted">{t.check_cabinet}</p>
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
                        <p className="text-sm font-medium">{expiringSoon.length} {t.expiring_products}</p>
                        <p className="text-xs text-muted">{t.within_30_days}</p>
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
                      <p className="text-sm font-medium">{totalActive} {t.active_products}</p>
                      <p className="text-xs text-muted">{t.all_safe}</p>
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
                  <p className="text-sm font-medium">{t.track_expiry}</p>
                  <p className="text-xs text-muted">{t.track_expiry_desc}</p>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Period Tracker */}
        <PeriodTracker />

        {/* Compatibility Checker & Deals */}
        <section>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/compatibility">
              <Card hoverable className="text-center h-full">
                <FlaskConical size={28} className="text-primary mx-auto" />
                <p className="font-semibold mt-2 text-sm">{t.product_compatibility}</p>
                <p className="text-xs text-muted mt-0.5">{t.compatibility_desc}</p>
              </Card>
            </Link>
            <Link href="/deals">
              <Card hoverable className="text-center h-full">
                <Tag size={28} className="text-primary mx-auto" />
                <p className="font-semibold mt-2 text-sm">{t.deals}</p>
                <p className="text-xs text-muted mt-0.5">{t.deals_desc}</p>
              </Card>
            </Link>
          </div>
        </section>

        {/* Social Media Product Search */}
        <SocialMediaSearchHome />

        {/* Pinterest Inspiration */}
        <PinterestInspiration />

        {/* YouTube Channels */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold">{t.beauty_channels}</h3>
            <Link href="/makeup/youtube" className="text-primary text-sm font-medium flex items-center gap-0.5">
              {t.view_all} <ChevronRight size={14} />
            </Link>
          </div>
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
            {youtubeChannels.map((ch) => (
              <div key={ch.name} className="shrink-0 w-36">
                <Card hoverable className="!p-3 text-center">
                  <img
                    src={ch.img}
                    alt={ch.name}
                    className="w-14 h-14 mx-auto rounded-full object-cover shadow-md ring-2 ring-white"
                  />
                  <p className="font-semibold text-xs mt-2 truncate">{ch.name}</p>
                  <p className="text-[10px] text-muted">{ch.subs} {t.subscribers}</p>
                  <div className="flex items-center justify-center gap-2 mt-1.5">
                    <a href={ch.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:opacity-70 transition-opacity">
                      <Play size={10} className="text-danger" fill="currentColor" />
                      <span className="text-[10px] text-muted">YouTube</span>
                    </a>
                    {ch.ig && (
                      <a href={`https://instagram.com/${ch.ig}`} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                        <Instagram size={12} className="text-pink-400" />
                      </a>
                    )}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </section>

        {/* Community */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold">{t.from_community}</h3>
            <Link href="/community" className="text-primary text-sm font-medium">{t.view_all_long} →</Link>
          </div>
          {latestReviews.length === 0 ? (
            <Card>
              <p className="text-sm text-muted text-center py-4">
                {t.no_reviews_short}. {t.first_review}
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
                      <p className="text-xs font-semibold truncate">{review.profile?.full_name || t.anonymous}</p>
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
