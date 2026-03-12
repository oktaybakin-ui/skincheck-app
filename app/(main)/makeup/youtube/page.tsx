"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useState } from "react";
import { SearchX, ExternalLink } from "lucide-react";

const channels = [
  { name: "Duygu Özaslan", subs: "3.5M", desc: "Cilt bakımı ve günlük makyaj", tags: ["Türkçe", "Başlangıç", "Cilt Bakımı"], url: "https://youtube.com/@duyguozaslan", img: "/images/channels/duygu-ozaslan.jpg" },
  { name: "Danla Bilic", subs: "4.2M", desc: "Trend makyaj ve ürün inceleme", tags: ["Türkçe", "Orta", "Günlük Makyaj"], url: "https://youtube.com/@DanlaBilic", img: "/images/channels/danla-bilic.jpg" },
  { name: "Merve Özkaynak", subs: "1.8M", desc: "Doğal makyaj ve saç bakımı", tags: ["Türkçe", "Başlangıç", "Doğal"], url: "https://youtube.com/@MerveOzkaynak", img: "/images/channels/merve-ozkaynak.jpg" },
  { name: "Sebile Ölmez", subs: "1.2M", desc: "Makyaj dersleri ve ürün önerileri", tags: ["Türkçe", "Orta", "Profesyonel"], url: "https://youtube.com/@SebileOlmez" },
  { name: "Robert Welsh", subs: "2.1M", desc: "Profesyonel makyöz teknikleri", tags: ["İngilizce", "Profesyonel", "Teknik"], url: "https://youtube.com/@RobertWelsh", img: "/images/channels/robert-welsh.jpg" },
  { name: "Ali Andreea", subs: "3.8M", desc: "Cilt tipine özel bakım rutinleri", tags: ["İngilizce", "Orta", "Cilt Bakımı"], url: "https://youtube.com/@AliAndreea" },
  { name: "Hyram", subs: "4.5M", desc: "İçerik analizi ve cilt bakım bilimi", tags: ["İngilizce", "Başlangıç", "Bilimsel"], url: "https://youtube.com/@Hyram", img: "/images/channels/hyram.jpg" },
  { name: "James Welsh", subs: "1.5M", desc: "Erkek cilt bakımı ve skincare bilimi", tags: ["İngilizce", "Başlangıç", "Bilimsel"], url: "https://youtube.com/@JamesWelsh" },
  { name: "Doctorly", subs: "1.9M", desc: "Dermatologlar tarafından cilt bakım rehberi", tags: ["İngilizce", "Profesyonel", "Bilimsel"], url: "https://youtube.com/@Doctorly", img: "/images/channels/doctorly.jpg" },
  { name: "Glow By Ramón", subs: "800K", desc: "Temiz güzellik ve doğal ürünler", tags: ["İngilizce", "Orta", "Doğal"], url: "https://youtube.com/@GlowByRamon" },
];

const FILTERS = ["Hepsi", "Türkçe", "İngilizce", "Başlangıç", "Orta", "Profesyonel", "Cilt Bakımı", "Bilimsel", "Doğal"];

export default function YoutubePage() {
  const [activeFilter, setActiveFilter] = useState("Hepsi");

  const filtered = activeFilter === "Hepsi"
    ? channels
    : channels.filter((ch) => ch.tags.includes(activeFilter));

  return (
    <>
      <Header title="YouTube Önerileri" showBack />
      <main className="px-4 py-4 space-y-4">
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
            <a key={ch.name} href={ch.url} target="_blank" rel="noopener noreferrer">
              <Card hoverable className="mb-3">
                <div className="flex items-start gap-3">
                  {ch.img ? (
                    <img src={ch.img} alt={ch.name} className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-white shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {ch.name[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">{ch.name}</p>
                      <ExternalLink size={14} className="text-muted shrink-0" />
                    </div>
                    <p className="text-xs text-muted">{ch.subs} abone</p>
                    <p className="text-sm text-muted mt-1">{ch.desc}</p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {ch.tags.map((t) => (
                        <Badge key={t} variant="secondary" size="sm">{t}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </a>
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
