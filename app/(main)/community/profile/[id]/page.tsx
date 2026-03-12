"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";
import { supabase, Profile } from "@/lib/supabase";
import { useAuthContext } from "@/lib/context/AuthContext";
import { useCommunity, Review } from "@/lib/hooks/useCommunity";
import Link from "next/link";
import { SKIN_TYPES } from "@/lib/constants";
import { FlaskConical } from "lucide-react";

export default function UserProfilePage() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { toggleFollow, isFollowing: checkFollowing } = useCommunity();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;

      const [profileRes, reviewsRes, followersRes, followingRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).single(),
        supabase.from("reviews")
          .select("*, product:products!reviews_product_id_fkey(id, name, brand, image_url)")
          .eq("user_id", id)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", id),
        supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", id),
      ]);

      setProfile(profileRes.data as Profile);
      setReviews((reviewsRes.data as Review[]) || []);
      setFollowerCount(followersRes.count || 0);
      setFollowingCount(followingRes.count || 0);

      if (user && user.id !== id) {
        const following = await checkFollowing(id as string);
        setIsFollowing(following);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [id, user, checkFollowing]);

  const handleToggleFollow = async () => {
    if (!id || followLoading) return;
    setFollowLoading(true);
    const result = await toggleFollow(id as string);
    setIsFollowing(!!result);
    setFollowerCount((prev) => result ? prev + 1 : prev - 1);
    setFollowLoading(false);
  };

  if (loading) {
    return (
      <>
        <Header title="Profil" showBack />
        <main className="px-4 py-20 text-center">
          <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
        </main>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Header title="Profil" showBack />
        <main className="px-4 py-20 text-center">
          <p className="text-muted">Kullanıcı bulunamadı</p>
        </main>
      </>
    );
  }

  const skinTypeInfo = SKIN_TYPES.find((t) => t.value === profile.skin_type);
  const initial = profile.full_name?.[0] || profile.username?.[0] || "?";
  const isOwnProfile = user?.id === id;

  return (
    <>
      <Header title="Profil" showBack />
      <main className="px-4 py-4 space-y-4 pb-28">
        {/* Profile Card */}
        <Card className="text-center">
          <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center text-primary text-3xl font-bold overflow-hidden">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : initial}
          </div>
          <h2 className="font-bold text-lg mt-3">{profile.full_name || "Anonim"}</h2>
          {profile.username && <p className="text-sm text-muted">@{profile.username}</p>}

          <div className="flex justify-center gap-2 mt-2 flex-wrap">
            {skinTypeInfo && <Badge variant="primary">{skinTypeInfo.label}</Badge>}
            {profile.undertone && (
              <Badge variant="secondary">
                {profile.undertone === "warm" ? "Sıcak Ton" : profile.undertone === "cool" ? "Soğuk Ton" : "Nötr Ton"}
              </Badge>
            )}
          </div>

          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div><strong>{followerCount}</strong> <span className="text-muted">Takipçi</span></div>
            <div><strong>{followingCount}</strong> <span className="text-muted">Takip</span></div>
            <div><strong>{reviews.length}</strong> <span className="text-muted">Yorum</span></div>
          </div>

          {!isOwnProfile && user && (
            <Button
              variant={isFollowing ? "outline" : "primary"}
              size="sm"
              className="mt-3"
              loading={followLoading}
              onClick={handleToggleFollow}
            >
              {isFollowing ? "Takipten Çık" : "Takip Et"}
            </Button>
          )}

          {isOwnProfile && (
            <Link href="/settings">
              <Button variant="outline" size="sm" className="mt-3">Profili Düzenle</Button>
            </Link>
          )}
        </Card>

        {/* Reviews */}
        <div>
          <h3 className="font-bold text-sm mb-3">Yorumları ({reviews.length})</h3>
          {reviews.length === 0 ? (
            <Card>
              <p className="text-sm text-muted text-center py-4">Henüz yorum yapmamış</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {reviews.map((review) => (
                <Card key={review.id}>
                  {review.product && (
                    <Link href={`/product/${review.product.id}`}>
                      <div className="flex items-center gap-2 mb-2">
                        {review.product.image_url ? (
                          <img src={review.product.image_url} alt="" className="w-8 h-8 rounded object-cover" />
                        ) : (
                          <FlaskConical size={20} className="text-muted" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{review.product.name}</p>
                          {review.product.brand && <p className="text-xs text-muted">{review.product.brand}</p>}
                        </div>
                      </div>
                    </Link>
                  )}
                  <StarRating rating={review.rating} />
                  {review.comment && <p className="text-sm text-muted mt-2">{review.comment}</p>}
                  {(review.pros || review.cons) && (
                    <div className="flex gap-4 mt-2 text-xs">
                      {review.pros && <div><span className="text-safe font-medium">+</span> {review.pros}</div>}
                      {review.cons && <div><span className="text-danger font-medium">-</span> {review.cons}</div>}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
