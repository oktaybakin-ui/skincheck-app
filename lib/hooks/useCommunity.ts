"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/lib/context/AuthContext";

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  pros: string | null;
  cons: string | null;
  skin_type_at_review: string | null;
  helpful_count: number;
  created_at: string;
  profile?: {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
    skin_type: string | null;
  };
  product?: {
    id: string;
    name: string;
    brand: string | null;
    image_url: string | null;
  };
}

export function useCommunity() {
  const { user } = useAuthContext();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async (tab: "discover" | "following" | "similar", skinType?: string | null) => {
    setLoading(true);
    let query = supabase
      .from("reviews")
      .select("*, profile:profiles!reviews_user_id_fkey(id, full_name, username, avatar_url, skin_type), product:products!reviews_product_id_fkey(id, name, brand, image_url)")
      .order("created_at", { ascending: false })
      .limit(50);

    if (tab === "following" && user) {
      const { data: followData } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", user.id);
      const followingIds = followData?.map((f) => f.following_id) || [];
      if (followingIds.length > 0) {
        query = query.in("user_id", followingIds);
      } else {
        setReviews([]);
        setLoading(false);
        return;
      }
    }

    if (tab === "similar" && skinType) {
      query = query.eq("skin_type_at_review", skinType);
    }

    const { data } = await query;
    setReviews((data as Review[]) || []);
    setLoading(false);
  }, [user]);

  const addReview = async (review: {
    product_id: string;
    rating: number;
    comment: string;
    pros?: string;
    cons?: string;
  }) => {
    if (!user) return null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("skin_type")
      .eq("id", user.id)
      .single();

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        user_id: user.id,
        product_id: review.product_id,
        rating: review.rating,
        comment: review.comment,
        pros: review.pros || null,
        cons: review.cons || null,
        skin_type_at_review: profile?.skin_type || null,
      })
      .select("*, profile:profiles!reviews_user_id_fkey(id, full_name, username, avatar_url, skin_type), product:products!reviews_product_id_fkey(id, name, brand, image_url)")
      .single();

    if (!error && data) {
      setReviews((prev) => [data as Review, ...prev]);
    }
    return { data, error };
  };

  const toggleFollow = async (targetUserId: string) => {
    if (!user) return;
    const { data: existing } = await supabase
      .from("follows")
      .select("*")
      .eq("follower_id", user.id)
      .eq("following_id", targetUserId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", targetUserId);
      return false;
    } else {
      await supabase
        .from("follows")
        .insert({ follower_id: user.id, following_id: targetUserId });
      return true;
    }
  };

  const isFollowing = async (targetUserId: string) => {
    if (!user) return false;
    const { data } = await supabase
      .from("follows")
      .select("*")
      .eq("follower_id", user.id)
      .eq("following_id", targetUserId)
      .maybeSingle();
    return !!data;
  };

  return { reviews, loading, fetchReviews, addReview, toggleFollow, isFollowing };
}
