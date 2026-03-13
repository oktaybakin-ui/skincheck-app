"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import { Check, Globe } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";
import { LOCALE_NAMES, Locale } from "@/lib/i18n/translations";

const LOCALES: Locale[] = ["tr", "en", "ar", "de", "fr"];

export default function LanguagePage() {
  const { locale, setLocale, t } = useI18n();

  return (
    <>
      <Header title={t.language} showBack />
      <main className="px-4 py-4 space-y-4 pb-28">
        <Card className="bg-primary/5 border-primary/20">
          <div className="flex gap-3">
            <Globe size={20} className="text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted">
              {t.lang_info}
            </p>
          </div>
        </Card>

        <Card>
          <div className="divide-y divide-gray-50">
            {LOCALES.map((code) => {
              const lang = LOCALE_NAMES[code];
              const isSelected = code === locale;
              return (
                <button
                  key={code}
                  onClick={() => setLocale(code)}
                  className="flex items-center justify-between w-full py-3.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{lang.flag}</span>
                    <div className="text-left">
                      <p className="text-sm font-medium">{lang.label}</p>
                      <p className="text-xs text-muted">{lang.native}</p>
                    </div>
                  </div>
                  {isSelected && <Check size={18} className="text-primary" />}
                </button>
              );
            })}
          </div>
        </Card>
      </main>
    </>
  );
}
