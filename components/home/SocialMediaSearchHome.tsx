"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { Search } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

const TikTokIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13.2a8.28 8.28 0 005.58 2.16v-3.45a4.85 4.85 0 01-2.49-.72V6.69h2.49z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const YouTubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function SocialMediaSearchHome() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");

  const searchQuery = query.trim();
  const encoded = encodeURIComponent(`${searchQuery} review`);

  const platforms = [
    {
      name: "TikTok",
      icon: <TikTokIcon />,
      url: `https://www.tiktok.com/search?q=${encoded}`,
      bg: "bg-gray-900 hover:bg-black",
    },
    {
      name: "Instagram",
      icon: <InstagramIcon />,
      url: `https://www.instagram.com/explore/tags/${encodeURIComponent(searchQuery.replace(/\s+/g, "").toLowerCase())}/`,
      bg: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400",
    },
    {
      name: "YouTube",
      icon: <YouTubeIcon />,
      url: `https://www.youtube.com/results?search_query=${encoded}`,
      bg: "bg-red-600 hover:bg-red-700",
    },
  ];

  return (
    <section>
      <h3 className="text-lg font-bold mb-3">{t.sm_title}</h3>
      <Card>
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.sm_placeholder}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
          />
        </div>
        <div className="flex gap-2">
          {platforms.map((p) => (
            <a
              key={p.name}
              href={searchQuery ? p.url : "#"}
              target={searchQuery ? "_blank" : undefined}
              rel="noopener noreferrer"
              onClick={(e) => !searchQuery && e.preventDefault()}
              className={`flex-1 flex items-center justify-center gap-1.5 ${p.bg} text-white py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${!searchQuery ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {p.icon}
              {p.name}
            </a>
          ))}
        </div>
        <p className="text-[10px] text-muted text-center mt-2">{t.sm_desc}</p>
      </Card>
    </section>
  );
}
