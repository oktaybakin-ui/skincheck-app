"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import { Heart, Github, Mail, Shield, FileText, Star } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <>
      <Header title={t.about} showBack />
      <main className="px-4 py-4 space-y-4 pb-28">
        {/* App Info */}
        <Card className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            SC
          </div>
          <h2 className="text-xl font-bold mt-3">SkinCheck</h2>
          <p className="text-sm text-muted">{t.app_tagline}</p>
          <p className="text-xs text-muted mt-1">v1.0.0</p>
        </Card>

        {/* Description */}
        <Card>
          <p className="text-sm text-muted leading-relaxed">
            {t.about_desc}
          </p>
        </Card>

        {/* Features */}
        <div>
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-1">{t.about_features_title}</h3>
          <Card>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-3">
                <Shield size={18} className="text-primary shrink-0 mt-0.5" />
                <span>{t.about_feature_ai}</span>
              </li>
              <li className="flex gap-3">
                <Star size={18} className="text-primary shrink-0 mt-0.5" />
                <span>{t.about_feature_personalized}</span>
              </li>
              <li className="flex gap-3">
                <Heart size={18} className="text-primary shrink-0 mt-0.5" />
                <span>{t.about_feature_pregnancy}</span>
              </li>
              <li className="flex gap-3">
                <FileText size={18} className="text-primary shrink-0 mt-0.5" />
                <span>{t.about_feature_expiry}</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-1">{t.about_legal_title}</h3>
          <Card>
            <div className="divide-y divide-gray-50">
              <button className="flex items-center gap-3 w-full py-3.5">
                <FileText size={18} className="text-muted" />
                <span className="text-sm font-medium">{t.about_terms}</span>
              </button>
              <button className="flex items-center gap-3 w-full py-3.5">
                <Shield size={18} className="text-muted" />
                <span className="text-sm font-medium">{t.about_privacy_policy}</span>
              </button>
              <button className="flex items-center gap-3 w-full py-3.5">
                <FileText size={18} className="text-muted" />
                <span className="text-sm font-medium">{t.about_licenses}</span>
              </button>
            </div>
          </Card>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-1">{t.about_contact_title}</h3>
          <Card>
            <div className="divide-y divide-gray-50">
              <button className="flex items-center gap-3 w-full py-3.5">
                <Mail size={18} className="text-muted" />
                <span className="text-sm font-medium">{t.about_feedback}</span>
              </button>
              <button className="flex items-center gap-3 w-full py-3.5">
                <Github size={18} className="text-muted" />
                <span className="text-sm font-medium">GitHub</span>
              </button>
            </div>
          </Card>
        </div>

        <p className="text-xs text-muted text-center pt-2">
          {t.about_disclaimer}
        </p>
      </main>
    </>
  );
}
