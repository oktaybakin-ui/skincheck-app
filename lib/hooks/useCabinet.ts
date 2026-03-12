"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/lib/context/AuthContext";

export interface CabinetItem {
  id: string;
  user_id: string;
  product_id: string;
  opened_date: string | null;
  expiry_date: string | null;
  pao_months: number | null;
  status: "active" | "expired" | "finished" | "wishlist";
  notes: string | null;
  is_favorite: boolean;
  routine_time: "morning" | "evening" | "both" | "none" | null;
  created_at: string;
  product?: {
    id: string;
    name: string;
    brand: string | null;
    category: string | null;
    image_url: string | null;
    ingredients: string[] | null;
  };
}

export function useCabinet() {
  const { user } = useAuthContext();
  const [items, setItems] = useState<CabinetItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!user) { setItems([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("user_cabinet")
      .select("*, product:products(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setItems((data as CabinetItem[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const addItem = async (productId: string, opts?: Partial<CabinetItem>) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("user_cabinet")
      .insert({
        user_id: user.id,
        product_id: productId,
        status: opts?.status || "active",
        opened_date: opts?.opened_date || null,
        expiry_date: opts?.expiry_date || null,
        pao_months: opts?.pao_months || null,
        notes: opts?.notes || null,
        is_favorite: opts?.is_favorite || false,
        routine_time: opts?.routine_time || "none",
      })
      .select("*, product:products(*)")
      .single();
    if (!error && data) {
      setItems((prev) => [data as CabinetItem, ...prev]);
    }
    return { data, error };
  };

  const updateItem = async (id: string, updates: Partial<CabinetItem>) => {
    const { error } = await supabase
      .from("user_cabinet")
      .update(updates)
      .eq("id", id);
    if (!error) {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
    }
    return { error };
  };

  const removeItem = async (id: string) => {
    const { error } = await supabase
      .from("user_cabinet")
      .delete()
      .eq("id", id);
    if (!error) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
    return { error };
  };

  const toggleFavorite = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    return updateItem(id, { is_favorite: !item.is_favorite });
  };

  // Stats
  const totalActive = items.filter((i) => i.status === "active").length;
  const totalWishlist = items.filter((i) => i.status === "wishlist").length;
  const totalFavorite = items.filter((i) => i.is_favorite).length;

  const now = new Date();
  const expiringSoon = items.filter((i) => {
    if (!i.expiry_date || i.status !== "active") return false;
    const exp = new Date(i.expiry_date);
    const daysLeft = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 30 && daysLeft >= 0;
  });

  const expired = items.filter((i) => {
    if (!i.expiry_date || i.status !== "active") return false;
    return new Date(i.expiry_date) < now;
  });

  return {
    items, loading, fetchItems,
    addItem, updateItem, removeItem, toggleFavorite,
    totalActive, totalWishlist, totalFavorite,
    expiringSoon, expired,
  };
}
