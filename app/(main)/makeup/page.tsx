"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Link from "next/link";
import { Palette, Sparkles, Youtube, ChevronRight, LucideIcon, Scissors, Crown, Camera } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function MakeupPage() {
  const { t } = useI18n();

  const sections: { href: string; icon: LucideIcon; title: string; desc: string }[] = [
    { href: "/makeup/undertone", icon: Palette, title: t.makeup_undertone, desc: t.makeup_undertone_desc },
    { href: "/makeup/solutions", icon: Sparkles, title: t.makeup_solutions_link, desc: t.makeup_solutions_link_desc },
    { href: "/makeup/youtube", icon: Youtube, title: t.makeup_youtube_link, desc: t.makeup_youtube_link_desc },
    { href: "/hair", icon: Scissors, title: t.makeup_hair_link, desc: t.makeup_hair_link_desc },
    { href: "/best-look", icon: Crown, title: t.makeup_bestlook_link, desc: t.makeup_bestlook_link_desc },
    { href: "/routine-builder", icon: Camera, title: t.makeup_routine_link, desc: t.makeup_routine_link_desc },
  ];

  return (
    <>
      <Header title={t.makeup_title} />
      <main className="px-4 py-4 space-y-4">
        <div className="bg-gradient-to-br from-secondary to-primary rounded-3xl p-6 text-white">
          <h2 className="text-xl font-bold mb-1">{t.makeup_guide}</h2>
          <p className="text-white/80 text-sm">{t.makeup_guide_desc}</p>
        </div>

        <div className="space-y-3">
          {sections.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.href} href={s.href}>
                <Card hoverable className="flex items-center gap-4 mb-3">
                  <Icon size={28} className="text-primary shrink-0" />
                  <div>
                    <p className="font-semibold">{s.title}</p>
                    <p className="text-sm text-muted">{s.desc}</p>
                  </div>
                  <ChevronRight size={20} className="ml-auto text-muted" />
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
