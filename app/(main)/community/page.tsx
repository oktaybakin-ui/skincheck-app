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
import { FlaskConical, ThumbsUp, MessageCircle, PenLine, Users, Star, GraduationCap, Quote } from "lucide-react";

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

const EXPERT_TIPS = [
  {
    id: 1,
    expert: "Dr. Elif Benar",
    title: "Dermatolog",
    avatar: null,
    topic: "Retinol Kullanımı",
    content: "Retinol'e yeni başlıyorsanız haftada 2 gece, düşük konsantrasyonla başlayın (0.25%). Cildiniz alıştıkça kademeli artırın. Her zaman SPF kullanın.",
    tags: ["Retinol", "Anti-Aging", "Başlangıç"],
  },
  {
    id: 2,
    expert: "Ecz. Ayşe Kılıç",
    title: "Kozmetik Eczacı",
    avatar: null,
    topic: "C Vitamini Seçimi",
    content: "L-Ascorbic Acid en etkili form ama en hassas olanı. Hassas ciltler için Sodium Ascorbyl Phosphate veya Ascorbyl Glucoside tercih edin. pH 3.5 altı en etkili.",
    tags: ["C Vitamini", "Antioksidan", "Hassas Cilt"],
  },
  {
    id: 3,
    expert: "Dr. Mehmet Öz",
    title: "Dermatolog",
    avatar: null,
    topic: "SPF Efsaneleri",
    content: "SPF 30 güneş ışınlarının %97'sini, SPF 50 ise %98'ini engeller. SPF 100 ile SPF 50 arasındaki fark minimumdur. Önemli olan yeterli miktarda ve düzenli yeniden sürmek.",
    tags: ["SPF", "Güneş Koruma", "Bilimsel"],
  },
  {
    id: 4,
    expert: "Ecz. Zeynep Demir",
    title: "Dermokozmetik Uzmanı",
    avatar: null,
    topic: "Niasinamid Kullanımı",
    content: "Niasinamid (B3 Vitamini) neredeyse tüm cilt tipleri için uygundur. Gözenek küçültür, sebum dengeler, leke açar. %5 konsantrasyon çoğu kişi için yeterli.",
    tags: ["Niasinamid", "Gözenek", "Her Cilt"],
  },
  {
    id: 5,
    expert: "Dr. Selin Aksoy",
    title: "Dermatolog",
    avatar: null,
    topic: "Cilt Bariyeri",
    content: "Cilt bariyeri bozulduysa tüm aktif içerikleri bırakın. Sadece nazik temizleyici + ceramide içeren nemlendirici + SPF kullanın. 2-4 haftada düzelir.",
    tags: ["Cilt Bariyeri", "Ceramide", "Onarım"],
  },
  {
    id: 6,
    expert: "Dr. Can Yılmaz",
    title: "Estetik Dermatolog",
    avatar: null,
    topic: "AHA vs BHA",
    content: "AHA (glikolik, laktik asit) kuru ve normal ciltler için ideal - yüzeyi pürüzsüzleştirir. BHA (salisilik asit) yağlı ve akneli ciltler için - gözeneklerin derinliğine iner.",
    tags: ["AHA", "BHA", "Peeling"],
  },
];

export default function CommunityPage() {
  const { user, profile } = useAuthContext();
  const { t } = useI18n();
  const { reviews, loading, fetchReviews, addReview } = useCommunity();
  const [tab, setTab] = useState<Tab>("discover");
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ product_id: "", rating: 5, comment: "", pros: "", cons: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (tab !== "experts") {
      fetchReviews(tab, profile?.skin_type);
    }
  }, [tab, fetchReviews, profile?.skin_type]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "discover", label: t.discover },
    { key: "following", label: t.following },
    { key: "similar", label: t.similar_skin },
    { key: "experts", label: t.experts },
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
        <div className="flex gap-2">
          {tabs.map((tabItem) => (
            <button
              key={tabItem.key}
              onClick={() => setTab(tabItem.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === tabItem.key ? "bg-primary text-white" : "bg-gray-100 text-muted"
              }`}
            >
              {tabItem.label}
            </button>
          ))}
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
                <div>
                  <p className="text-sm font-semibold">{t.experts_title}</p>
                  <p className="text-xs text-muted">{t.experts_desc}</p>
                </div>
              </div>
            </Card>
            {EXPERT_TIPS.map((tip) => (
              <Card key={tip.id}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center text-secondary font-bold shrink-0">
                    {tip.expert[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{tip.expert}</p>
                    <p className="text-xs text-muted">{tip.title}</p>
                  </div>
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
                  {tip.tags.map((tagItem) => (
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
