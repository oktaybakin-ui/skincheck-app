"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useState } from "react";
import { SearchX, ExternalLink, Instagram } from "lucide-react";
import { youtubeChannels as channels } from "@/lib/constants/youtube-channels";

const FILTERS = ["Hepsi", "Türkçe", "İngilizce", "Başlangıç", "Orta", "İleri", "Profesyonel", "Cilt Bakımı", "Bilimsel", "Doğal", "Günlük Makyaj", "Teknik"];

function ChannelAvatar({ ch }: { ch: (typeof channels)[number] }) {
  const [error, setError] = useState(false);

  if (error || !ch.img) {
    return (
      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
        {ch.name[0]}
      </div>
    );
  }

  return (
    <img
      src={ch.img}
      alt={ch.name}
      className="w-12 h-12 rounded-full object-cover shrink-0 bg-gray-100"
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}

export default function YoutubePage() {
  const [activeFilter, setActiveFilter] = useState("Hepsi");

  const filtered = activeFilter === "Hepsi"
    ? channels
    : channels.filter((ch) => ch.tags.includes(activeFilter));

  return (
    <>
      <Header title="YouTube Önerileri" showBack />
      <main className="px-4 py-4 space-y-4 pb-28">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                activeFilter === f
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-muted hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted">{filtered.length} kanal bulundu</p>

        {/* Channels */}
        <div className="space-y-3">
          {filtered.map((ch) => (
            <Card key={ch.name} hoverable className="mb-3">
              <div className="flex items-start gap-3">
                <ChannelAvatar ch={ch} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold truncate">{ch.name}</p>
                    <a href={ch.url} target="_blank" rel="noopener noreferrer" className="shrink-0" aria-label="YouTube">
                      <ExternalLink size={14} className="text-muted hover:text-primary transition-colors" />
                    </a>
                    {"ig" in ch && ch.ig && (
                      <a href={`https://instagram.com/${ch.ig}`} target="_blank" rel="noopener noreferrer" className="shrink-0" aria-label="Instagram">
                        <Instagram size={14} className="text-pink-400 hover:text-pink-600 transition-colors" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-muted">{ch.subs} abone</p>
                  <p className="text-sm text-muted mt-1">{ch.desc}</p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {ch.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" size="sm">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-8">
            <SearchX size={40} className="mx-auto text-muted" />
            <p className="text-muted text-sm mt-2">Bu filtreye uygun kanal bulunamadı</p>
          </div>
        )}
      </main>
    </>
  );
}
