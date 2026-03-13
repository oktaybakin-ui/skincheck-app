"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/lib/context/AuthContext";

export interface RoutineItem {
  id: string;
  user_id: string;
  product_id: string;
  days_of_week: number[];
  time_of_day: "morning" | "evening" | "both";
  order_index: number;
  created_at: string;
  product?: {
    id: string;
    name: string;
    brand: string | null;
    category: string | null;
    image_url: string | null;
  };
}

const DAY_NAMES = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

export function useRoutine() {
  const { user } = useAuthContext();
  const [items, setItems] = useState<RoutineItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!user) { setItems([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("skincare_routines")
      .select("*, product:products(id, name, brand, category, image_url)")
      .eq("user_id", user.id)
      .order("order_index", { ascending: true });
    setItems((data as RoutineItem[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const addItem = async (productId: string, timeOfDay: RoutineItem["time_of_day"], daysOfWeek?: number[]) => {
    if (!user) return null;
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order_index)) + 1 : 0;
    const { data, error } = await supabase
      .from("skincare_routines")
      .insert({
        user_id: user.id,
        product_id: productId,
        time_of_day: timeOfDay,
        days_of_week: daysOfWeek || [0, 1, 2, 3, 4, 5, 6],
        order_index: maxOrder,
      })
      .select("*, product:products(id, name, brand, category, image_url)")
      .single();
    if (!error && data) {
      setItems(prev => [...prev, data as RoutineItem]);
    }
    return { data, error };
  };

  const updateItem = async (id: string, updates: Partial<RoutineItem>) => {
    const { error } = await supabase
      .from("skincare_routines")
      .update(updates)
      .eq("id", id);
    if (!error) {
      setItems(prev => prev.map(i => (i.id === id ? { ...i, ...updates } : i)));
    }
    return { error };
  };

  const removeItem = async (id: string) => {
    const { error } = await supabase
      .from("skincare_routines")
      .delete()
      .eq("id", id);
    if (!error) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
    return { error };
  };

  const reorder = async (reorderedItems: RoutineItem[]) => {
    setItems(reorderedItems);
    for (let i = 0; i < reorderedItems.length; i++) {
      await supabase
        .from("skincare_routines")
        .update({ order_index: i })
        .eq("id", reorderedItems[i].id);
    }
  };

  // Get today's routine
  const today = new Date().getDay();
  const todayMorning = items
    .filter(i => i.days_of_week.includes(today) && (i.time_of_day === "morning" || i.time_of_day === "both"))
    .sort((a, b) => a.order_index - b.order_index);
  const todayEvening = items
    .filter(i => i.days_of_week.includes(today) && (i.time_of_day === "evening" || i.time_of_day === "both"))
    .sort((a, b) => a.order_index - b.order_index);

  // Get routine for a specific day
  const getRoutineForDay = (dayIndex: number) => ({
    morning: items.filter(i => i.days_of_week.includes(dayIndex) && (i.time_of_day === "morning" || i.time_of_day === "both")).sort((a, b) => a.order_index - b.order_index),
    evening: items.filter(i => i.days_of_week.includes(dayIndex) && (i.time_of_day === "evening" || i.time_of_day === "both")).sort((a, b) => a.order_index - b.order_index),
  });

  return {
    items, loading, fetchItems,
    addItem, updateItem, removeItem, reorder,
    todayMorning, todayEvening, getRoutineForDay,
    DAY_NAMES,
  };
}
