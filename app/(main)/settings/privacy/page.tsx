"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useState, useEffect } from "react";
import { Shield, Eye, EyeOff, Trash2, Download, Lock } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

const STORAGE_KEY = "skincheck_privacy";

interface PrivacySettings {
  profilePublic: boolean;
  showSkinType: boolean;
  showReviews: boolean;
  analyticsEnabled: boolean;
  personalizedAds: boolean;
}

const defaults: PrivacySettings = {
  profilePublic: true,
  showSkinType: true,
  showReviews: true,
  analyticsEnabled: true,
  personalizedAds: false,
};

export default function PrivacyPage() {
  const { t } = useI18n();
  const [settings, setSettings] = useState<PrivacySettings>(defaults);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setSettings({ ...defaults, ...JSON.parse(saved) }); } catch {}
    }
  }, []);

  const update = (key: keyof PrivacySettings) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const Toggle = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
        value ? "bg-primary" : "bg-gray-200"
      }`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
        value ? "translate-x-5" : ""
      }`} />
    </button>
  );

  return (
    <>
      <Header title={t.privacy} showBack />
      <main className="px-4 py-4 space-y-4 pb-28">
        {/* Profile Visibility */}
        <div>
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-1">{t.privacy_profile_visibility}</h3>
          <Card>
            <div className="space-y-0 divide-y divide-gray-50">
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-start gap-3 flex-1">
                  <Eye size={18} className="text-muted mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{t.privacy_public_profile}</p>
                    <p className="text-xs text-muted mt-0.5">{t.privacy_public_desc}</p>
                  </div>
                </div>
                <Toggle value={settings.profilePublic} onToggle={() => update("profilePublic")} />
              </div>
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-start gap-3 flex-1">
                  <Shield size={18} className="text-muted mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{t.privacy_show_skin}</p>
                    <p className="text-xs text-muted mt-0.5">{t.privacy_show_skin_desc}</p>
                  </div>
                </div>
                <Toggle value={settings.showSkinType} onToggle={() => update("showSkinType")} />
              </div>
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-start gap-3 flex-1">
                  <EyeOff size={18} className="text-muted mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{t.privacy_show_reviews}</p>
                    <p className="text-xs text-muted mt-0.5">{t.privacy_show_reviews_desc}</p>
                  </div>
                </div>
                <Toggle value={settings.showReviews} onToggle={() => update("showReviews")} />
              </div>
            </div>
          </Card>
        </div>

        {/* Data & Analytics */}
        <div>
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-1">{t.privacy_data}</h3>
          <Card>
            <div className="space-y-0 divide-y divide-gray-50">
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-start gap-3 flex-1">
                  <Lock size={18} className="text-muted mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{t.privacy_analytics}</p>
                    <p className="text-xs text-muted mt-0.5">{t.privacy_analytics_desc}</p>
                  </div>
                </div>
                <Toggle value={settings.analyticsEnabled} onToggle={() => update("analyticsEnabled")} />
              </div>
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-start gap-3 flex-1">
                  <Shield size={18} className="text-muted mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{t.privacy_personalized}</p>
                    <p className="text-xs text-muted mt-0.5">{t.privacy_personalized_desc}</p>
                  </div>
                </div>
                <Toggle value={settings.personalizedAds} onToggle={() => update("personalizedAds")} />
              </div>
            </div>
          </Card>
        </div>

        {/* Data Actions */}
        <div>
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-1">{t.privacy_my_data}</h3>
          <Card>
            <div className="space-y-0 divide-y divide-gray-50">
              <button className="flex items-center gap-3 w-full py-3.5 text-left">
                <Download size={18} className="text-muted" />
                <div>
                  <p className="text-sm font-medium">{t.privacy_download}</p>
                  <p className="text-xs text-muted mt-0.5">{t.privacy_download_desc}</p>
                </div>
              </button>
              <button className="flex items-center gap-3 w-full py-3.5 text-left text-danger">
                <Trash2 size={18} />
                <div>
                  <p className="text-sm font-medium">{t.privacy_delete_account}</p>
                  <p className="text-xs text-muted mt-0.5">{t.privacy_delete_desc}</p>
                </div>
              </button>
            </div>
          </Card>
        </div>

        <p className="text-xs text-muted text-center px-4 pt-2">
          {t.privacy_note}
        </p>
      </main>
    </>
  );
}
