"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import StarRating from "@/components/ui/StarRating";
import { useCommunity, Review } from "@/lib/hooks/useCommunity";
import { useAuthContext } from "@/lib/context/AuthContext";
import { useI18n } from "@/lib/i18n/I18nContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FlaskConical, ThumbsUp, MessageCircle, PenLine, Users, Star, GraduationCap, Quote, ExternalLink, RefreshCw } from "lucide-react";

type Tab = "discover" | "following" | "similar" | "experts";

function timeAgo(dateStr: string, t: Record<string, string>): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return t.time_just_now;
  if (diff < 3600) return `${Math.floor(diff / 60)} ${t.time_minutes_ago}`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ${t.time_hours_ago}`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ${t.time_days_ago}`;
  return `${Math.floor(diff / 604800)} ${t.time_weeks_ago}`;
}

function ReviewCard({ review }: { review: Review }) {
  const { t } = useI18n();
  const profile = review.profile;
  const product = review.product;
  const initial = profile?.full_name?.[0] || profile?.username?.[0] || "?";

  return (
    <Card>
      <div className="flex items-center gap-3 mb-3">
        <Link href={`/community/profile/${review.user_id}`}>
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold shrink-0">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
            ) : initial}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href={`/community/profile/${review.user_id}`}>
            <p className="font-semibold text-sm truncate">{profile?.full_name || profile?.username || t.anonymous}</p>
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            {profile?.skin_type && <Badge variant="primary" size="sm">{profile.skin_type}</Badge>}
            <span className="text-xs text-muted">{timeAgo(review.created_at, t)}</span>
          </div>
        </div>
      </div>

      {product && (
        <Link href={`/product/${product.id}`}>
          <div className="flex items-center gap-2 mb-2 bg-gray-50 rounded-lg p-2">
            {product.image_url ? (
              <img src={product.image_url} alt="" className="w-8 h-8 rounded object-cover" />
            ) : (
              <FlaskConical size={20} className="text-muted" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{product.name}</p>
              {product.brand && <p className="text-xs text-muted">{product.brand}</p>}
            </div>
          </div>
        </Link>
      )}

      <StarRating rating={review.rating} />

      {review.comment && (
        <p className="text-sm text-muted mt-2 line-clamp-3">{review.comment}</p>
      )}

      {(review.pros || review.cons) && (
        <div className="flex gap-4 mt-2 text-xs">
          {review.pros && (
            <div className="flex-1">
              <span className="text-safe font-medium">{t.pros}: </span>
              <span className="text-muted">{review.pros}</span>
            </div>
          )}
          {review.cons && (
            <div className="flex-1">
              <span className="text-danger font-medium">{t.cons}: </span>
              <span className="text-muted">{review.cons}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
        <button className="text-xs text-muted flex items-center gap-1 hover:text-primary transition-colors">
          <ThumbsUp size={14} /> {review.helpful_count > 0 ? review.helpful_count : ""} {t.helpful}
        </button>
        <button className="text-xs text-muted flex items-center gap-1 hover:text-primary transition-colors">
          <MessageCircle size={14} /> {t.comment}
        </button>
      </div>
    </Card>
  );
}

interface ExpertTip {
  id: string;
  expert: string;
  title: string;
  topic: string;
  content: string;
  tags: string[];
  pubmed_id?: string;
}

export default function CommunityPage() {
  const { user, profile } = useAuthContext();
  const { t, locale } = useI18n();
  const { reviews, loading, fetchReviews, addReview } = useCommunity();
  const [tab, setTab] = useState<Tab>("experts");
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ product_id: "", rating: 5, comment: "", pros: "", cons: "" });
  const [submitting, setSubmitting] = useState(false);
  const [expertTips, setExpertTips] = useState<ExpertTip[]>([]);
  const [expertLoading, setExpertLoading] = useState(false);

  useEffect(() => {
    if (tab !== "experts") {
      fetchReviews(tab, profile?.skin_type);
    }
  }, [tab, fetchReviews, profile?.skin_type]);

  const fetchExpertTips = async () => {
    setExpertLoading(true);
    try {
      const res = await fetch(`https://einypelxufqmqwuzmped.supabase.co/functions/v1/expert-tips?locale=${locale}`);
      const data = await res.json();
      if (data.tips && data.tips.length > 0) {
        setExpertTips(data.tips);
      }
    } catch {
      // silently fail
    } finally {
      setExpertLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "experts" && expertTips.length === 0) {
      fetchExpertTips();
    }
  }, [tab]);

  const disabledTabs: Tab[] = ["discover", "following", "similar"];

  const tabs: { key: Tab; label: string }[] = [
    { key: "experts", label: t.experts },
    { key: "discover", label: t.discover },
    { key: "following", label: t.following },
    { key: "similar", label: t.similar_skin },
  ];

  const handleSubmitReview = async () => {
    if (!reviewForm.comment.trim()) return;
    setSubmitting(true);
    await addReview({
      product_id: reviewForm.product_id,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      pros: reviewForm.pros,
      cons: reviewForm.cons,
    });
    setSubmitting(false);
    setShowWriteReview(false);
    setReviewForm({ product_id: "", rating: 5, comment: "", pros: "", cons: "" });
  };

  return (
    <>
      <Header title={t.community_title} />
      <main className="px-4 py-4 space-y-4 pb-28">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tabItem) => {
            const isDisabled = disabledTabs.includes(tabItem.key);
            return (
              <button
                key={tabItem.key}
                onClick={() => !isDisabled && setTab(tabItem.key)}
                disabled={isDisabled}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap relative ${
                  isDisabled
                    ? "bg-gray-100 text-muted/50 cursor-not-allowed"
                    : tab === tabItem.key
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-muted"
                }`}
              >
                {tabItem.label}
                {isDisabled && (
                  <span className="ml-1.5 text-[9px] bg-warning/20 text-warning px-1.5 py-0.5 rounded-full font-semibold">
                    Yakında
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Write Review Button */}
        {user && (
          <Button variant="outline" fullWidth onClick={() => setShowWriteReview(true)}>
            <span className="flex items-center justify-center gap-2"><PenLine size={16} /> {t.write_review}</span>
          </Button>
        )}

        {/* Content */}
        {tab === "experts" ? (
          <div className="space-y-3">
            <Card className="bg-secondary/5 border-secondary/20">
              <div className="flex gap-3">
                <GraduationCap size={24} className="text-secondary shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{t.experts_title}</p>
                  <p className="text-xs text-muted">{t.experts_desc}</p>
                  <p className="text-[10px] text-muted mt-1">{t.experts_source}</p>
                </div>
                <button onClick={fetchExpertTips} disabled={expertLoading} className="text-secondary hover:text-secondary-dark transition-colors">
                  <RefreshCw size={18} className={expertLoading ? "animate-spin" : ""} />
                </button>
              </div>
            </Card>
            {expertLoading && expertTips.length === 0 ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-3 border-secondary/30 border-t-secondary rounded-full animate-spin" />
              </div>
            ) : expertTips.map((tip) => (
              <Card key={tip.id}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center text-secondary font-bold shrink-0">
                    {tip.expert?.[0] || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{tip.expert}</p>
                    <p className="text-xs text-muted">{tip.title}</p>
                  </div>
                  {tip.pubmed_id && (
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/${tip.pubmed_id}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover:text-secondary transition-colors"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
                <div className="bg-gray-50 rounded-xl p-3 mb-2">
                  <div className="flex gap-2">
                    <Quote size={14} className="text-muted shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold mb-1">{tip.topic}</p>
                      <p className="text-xs text-muted leading-relaxed">{tip.content}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {tip.tags?.map((tagItem) => (
                    <Badge key={tagItem} variant="secondary" size="sm">{tagItem}</Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        ) : loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="text-muted mx-auto" />
            <p className="font-semibold mt-4">
              {tab === "following" ? t.following_empty :
               tab === "similar" ? t.similar_empty :
               t.no_reviews_short}
            </p>
            <p className="text-sm text-muted mt-1">{t.first_review}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </main>

      {/* Write Review Modal */}
      <Modal isOpen={showWriteReview} onClose={() => setShowWriteReview(false)} title={t.write_review}>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">{t.score}</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                  className="transition-colors"
                >
                  <Star
                    size={24}
                    className={s <= reviewForm.rating ? "text-warning fill-warning" : "text-gray-300"}
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">{t.your_review}</label>
            <textarea
              placeholder={t.review_placeholder}
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block text-safe">{t.pros}</label>
              <input
                placeholder={t.pros_placeholder}
                value={reviewForm.pros}
                onChange={(e) => setReviewForm({ ...reviewForm, pros: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-danger">{t.cons}</label>
              <input
                placeholder={t.cons_placeholder}
                value={reviewForm.cons}
                onChange={(e) => setReviewForm({ ...reviewForm, cons: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
              />
            </div>
          </div>

          <Button onClick={handleSubmitReview} loading={submitting} disabled={!reviewForm.comment.trim()} fullWidth>
            {t.share_review}
          </Button>
        </div>
      </Modal>
    </>
  );
}
