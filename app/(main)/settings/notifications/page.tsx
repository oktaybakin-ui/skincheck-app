"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import { useState, useEffect } from "react";
import { Bell, Clock, Tag, FlaskConical, Users, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

interface NotificationSetting {
  key: string;
  label: string;
  description: string;
  icon: typeof Bell;
  enabled: boolean;
}

const STORAGE_KEY = "skincheck_notifications";

const staticConfig = [
  { key: "expiry", icon: Clock, enabled: true },
  { key: "deals", icon: Tag, enabled: true },
  { key: "ingredients", icon: FlaskConical, enabled: true },
  { key: "community", icon: Users, enabled: true },
  { key: "tips", icon: Sparkles, enabled: false },
  { key: "marketing", icon: Bell, enabled: false },
] as const;

export default function NotificationsPage() {
  const { t } = useI18n();

  const translatedLabels: Record<string, { label: string; description: string }> = {
    expiry: { label: t.notif_expiry, description: t.notif_expiry_desc },
    deals: { label: t.notif_deals, description: t.notif_deals_desc },
    ingredients: { label: t.notif_ingredients, description: t.notif_ingredients_desc },
    community: { label: t.notif_community, description: t.notif_community_desc },
    tips: { label: t.notif_tips, description: t.notif_tips_desc },
    marketing: { label: t.notif_marketing, description: t.notif_marketing_desc },
  };

  const defaultSettings: NotificationSetting[] = staticConfig.map((c) => ({
    key: c.key,
    icon: c.icon,
    enabled: c.enabled,
    label: translatedLabels[c.key].label,
    description: translatedLabels[c.key].description,
  }));

  const [settings, setSettings] = useState<NotificationSetting[]>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Record<string, boolean>;
        setSettings((prev) =>
          prev.map((s) => ({ ...s, enabled: parsed[s.key] ?? s.enabled }))
        );
      } catch {}
    }
  }, []);

  // Keep labels in sync with locale changes
  useEffect(() => {
    setSettings((prev) =>
      prev.map((s) => ({
        ...s,
        label: translatedLabels[s.key].label,
        description: translatedLabels[s.key].description,
      }))
    );
  }, [t]);

  const toggle = (key: string) => {
    setSettings((prev) => {
      const updated = prev.map((s) =>
        s.key === key ? { ...s, enabled: !s.enabled } : s
      );
      const map: Record<string, boolean> = {};
      updated.forEach((s) => { map[s.key] = s.enabled; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
      return updated;
    });
  };

  return (
    <>
      <Header title={t.notifications} showBack />
      <main className="px-4 py-4 space-y-4 pb-28">
        <Card>
          <div className="divide-y divide-gray-50">
            {settings.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.key} className="flex items-center justify-between py-3.5">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Icon size={18} className="text-muted mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{s.label}</p>
                      <p className="text-xs text-muted mt-0.5">{s.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggle(s.key)}
                    className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ml-3 ${
                      s.enabled ? "bg-primary" : "bg-gray-200"
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                        s.enabled ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>

        <p className="text-xs text-muted text-center px-4">
          {t.notif_device_note}
        </p>
      </main>
    </>
  );
}
