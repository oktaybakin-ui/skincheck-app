"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useCommunity, Review } from "@/lib/hooks/useCommunity";
import { useAuthContext } from "@/lib/context/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";

type Tab = "discover" | "following" | "similar";

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return "az önce";
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} gün önce`;
  return `${Math.floor(diff / 604800)} hafta önce`;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={`text-sm ${s <= rating ? "text-warning" : "text-gray-300"}`}>★</span>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
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
            <p className="font-semibold text-sm truncate">{profile?.full_name || profile?.username || "Anonim"}</p>
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            {profile?.skin_type && <Badge variant="primary" size="sm">{profile.skin_type}</Badge>}
            <span className="text-xs text-muted">{timeAgo(review.created_at)}</span>
          </div>
        </div>
      </div>

      {product && (
        <Link href={`/product/${product.id}`}>
          <div className="flex items-center gap-2 mb-2 bg-gray-50 rounded-lg p-2">
            {product.image_url ? (
              <img src={product.image_url} alt="" className="w-8 h-8 rounded object-cover" />
            ) : (
              <span className="text-lg">🧴</span>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{product.name}</p>
              {product.brand && <p className="text-xs text-muted">{product.brand}</p>}
            </div>
          </div>
        </Link>
      )}

      <Stars rating={review.rating} />

      {review.comment && (
        <p className="text-sm text-muted mt-2 line-clamp-3">{review.comment}</p>
      )}

      {(review.pros || review.cons) && (
        <div className="flex gap-4 mt-2 text-xs">
          {review.pros && (
            <div className="flex-1">
              <span className="text-safe font-medium">Artı: </span>
              <span className="text-muted">{review.pros}</span>
            </div>
          )}
          {review.cons && (
            <div className="flex-1">
              <span className="text-danger font-medium">Eksi: </span>
              <span className="text-muted">{review.cons}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
        <button className="text-xs text-muted flex items-center gap-1">
          👍 {review.helpful_count > 0 ? review.helpful_count : ""} Faydalı
        </button>
        <button className="text-xs text-muted flex items-center gap-1">
          💬 Yorum Yap
        </button>
      </div>
    </Card>
  );
}

export default function CommunityPage() {
  const { user, profile } = useAuthContext();
  const { reviews, loading, fetchReviews, addReview } = useCommunity();
  const [tab, setTab] = useState<Tab>("discover");
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ product_id: "", rating: 5, comment: "", pros: "", cons: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews(tab, profile?.skin_type);
  }, [tab, fetchReviews, profile?.skin_type]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "discover", label: "Keşfet" },
    { key: "following", label: "Takip Ettiklerim" },
    { key: "similar", label: "Benzer Ciltler" },
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
      <Header title="Topluluk" />
      <main className="px-4 py-4 space-y-4 pb-28">
        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                tab === t.key ? "bg-primary text-white" : "bg-gray-100 text-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Write Review Button */}
        {user && (
          <Button variant="outline" fullWidth onClick={() => setShowWriteReview(true)}>
            ✍️ Yorum Yaz
          </Button>
        )}

        {/* Reviews Feed */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-5xl">👥</span>
            <p className="font-semibold mt-4">
              {tab === "following" ? "Takip ettiklerinin yorumları burada görünecek" :
               tab === "similar" ? "Benzer cilt tipindeki yorumlar burada görünecek" :
               "Henüz yorum yok"}
            </p>
            <p className="text-sm text-muted mt-1">İlk yorumu sen yaz!</p>
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
      <Modal isOpen={showWriteReview} onClose={() => setShowWriteReview(false)} title="Yorum Yaz">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Puan</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                  className={`text-2xl ${s <= reviewForm.rating ? "text-warning" : "text-gray-300"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Yorumun</label>
            <textarea
              placeholder="Bu ürün hakkında ne düşünüyorsun?"
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium mb-1 block text-safe">Artılar</label>
              <input
                placeholder="Neyi beğendin?"
                value={reviewForm.pros}
                onChange={(e) => setReviewForm({ ...reviewForm, pros: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block text-danger">Eksiler</label>
              <input
                placeholder="Neyi beğenmedin?"
                value={reviewForm.cons}
                onChange={(e) => setReviewForm({ ...reviewForm, cons: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
              />
            </div>
          </div>

          <Button onClick={handleSubmitReview} loading={submitting} disabled={!reviewForm.comment.trim()} fullWidth>
            Yorumu Paylaş
          </Button>
        </div>
      </Modal>
    </>
  );
}
