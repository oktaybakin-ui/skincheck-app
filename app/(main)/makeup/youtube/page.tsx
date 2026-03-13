"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useState } from "react";
import { SearchX, ExternalLink } from "lucide-react";

const channels = [
  // === TÜRK YOUTUBERLAR (25) ===
  { name: "Danla Bilic", subs: "4.2M", desc: "Trend makyaj ve ürün inceleme", tags: ["Türkçe", "Orta", "Günlük Makyaj"], url: "https://youtube.com/@DanlaBilic", img: "" },
  { name: "Duygu Özaslan", subs: "3.5M", desc: "Cilt bakımı ve günlük makyaj", tags: ["Türkçe", "Başlangıç", "Cilt Bakımı"], url: "https://youtube.com/@duyguozaslan", img: "" },
  { name: "Merve Özkaynak", subs: "1.8M", desc: "Doğal makyaj ve saç bakımı", tags: ["Türkçe", "Başlangıç", "Doğal"], url: "https://youtube.com/@MerveOzkaynak", img: "" },
  { name: "Sebile Ölmez", subs: "1.2M", desc: "Makyaj dersleri ve ürün önerileri", tags: ["Türkçe", "Orta", "Profesyonel"], url: "https://youtube.com/@SebileOlmez", img: "" },
  { name: "İrem Güzey", subs: "900K", desc: "Cilt bakım rutinleri ve ürün analizi", tags: ["Türkçe", "Başlangıç", "Cilt Bakımı"], url: "https://youtube.com/@iremguzey", img: "" },
  { name: "Aslı Afşaroğlu", subs: "700K", desc: "Dermokozmetik incelemeleri ve bilimsel bakım", tags: ["Türkçe", "Orta", "Bilimsel"], url: "https://youtube.com/@asliafsar", img: "" },
  { name: "Orkide Taşkın", subs: "600K", desc: "Profesyonel makyaj teknikleri", tags: ["Türkçe", "Profesyonel", "Teknik"], url: "https://youtube.com/@OrkideTaskin", img: "" },
  { name: "Ecem Karavus", subs: "550K", desc: "Uygun fiyatlı kozmetik önerileri", tags: ["Türkçe", "Başlangıç", "Günlük Makyaj"], url: "https://youtube.com/@ecemkaravus", img: "" },
  { name: "Betül Bayraktar", subs: "480K", desc: "Doğal ve organik cilt bakımı", tags: ["Türkçe", "Orta", "Doğal"], url: "https://youtube.com/@betulbayraktar", img: "" },
  { name: "Nil Keser", subs: "450K", desc: "Trend analizleri ve güzellik haberleri", tags: ["Türkçe", "Orta", "Günlük Makyaj"], url: "https://youtube.com/@NilKeser", img: "" },
  { name: "Ece Targıt", subs: "400K", desc: "Saç bakımı ve doğal güzellik", tags: ["Türkçe", "Başlangıç", "Doğal"], url: "https://youtube.com/@ecetargit", img: "" },
  { name: "Selin Ciğerci", subs: "380K", desc: "Lüks kozmetik incelemeleri", tags: ["Türkçe", "İleri", "Profesyonel"], url: "https://youtube.com/@selincigerci", img: "" },
  { name: "Gökçe Bağcı", subs: "350K", desc: "Makyaj sanatçısı gözünden teknikler", tags: ["Türkçe", "Profesyonel", "Teknik"], url: "https://youtube.com/@gokcebagci", img: "" },
  { name: "Melis Aygün", subs: "320K", desc: "Hassas cilt bakımı ve dermatoloji", tags: ["Türkçe", "Orta", "Bilimsel"], url: "https://youtube.com/@melisaygun", img: "" },
  { name: "Cansu Dengey", subs: "300K", desc: "K-beauty ve Asya cilt bakımı", tags: ["Türkçe", "Orta", "Cilt Bakımı"], url: "https://youtube.com/@cansudengey", img: "" },
  { name: "Nazlı Çelik", subs: "280K", desc: "Vegan ve cruelty-free kozmetik", tags: ["Türkçe", "Başlangıç", "Doğal"], url: "https://youtube.com/@nazlicelik", img: "" },
  { name: "Pelin Akıl", subs: "260K", desc: "Gelinlik makyajı ve özel gün", tags: ["Türkçe", "İleri", "Profesyonel"], url: "https://youtube.com/@pelinakil", img: "" },
  { name: "Dr. Ece Elmas", subs: "250K", desc: "Dermatolog gözünden cilt bakımı", tags: ["Türkçe", "Profesyonel", "Bilimsel"], url: "https://youtube.com/@dreceelmas", img: "" },
  { name: "Tuğçe Kandemir", subs: "230K", desc: "Eczacı gözünden ürün analizi", tags: ["Türkçe", "Orta", "Bilimsel"], url: "https://youtube.com/@tugcekandemir", img: "" },
  { name: "Şeyda Erdoğan", subs: "220K", desc: "Erkek bakım rutinleri ve grooming", tags: ["Türkçe", "Başlangıç", "Cilt Bakımı"], url: "https://youtube.com/@seydaerdogan", img: "" },
  { name: "Burcu Özberk", subs: "200K", desc: "Minimalist makyaj ve doğal güzellik", tags: ["Türkçe", "Başlangıç", "Doğal"], url: "https://youtube.com/@burcuozberk", img: "" },
  { name: "Fulya Öztürk", subs: "190K", desc: "Anti-aging ve olgun cilt bakımı", tags: ["Türkçe", "İleri", "Cilt Bakımı"], url: "https://youtube.com/@fulyaozturk", img: "" },
  { name: "Yasemin Sakallıoğlu", subs: "180K", desc: "Bütçe dostu cilt bakım önerileri", tags: ["Türkçe", "Başlangıç", "Günlük Makyaj"], url: "https://youtube.com/@yaseminsakallioglu", img: "" },
  { name: "Aleyna Tilki Beauty", subs: "170K", desc: "Pop kültürü ve güzellik trendleri", tags: ["Türkçe", "Orta", "Günlük Makyaj"], url: "https://youtube.com/@aleynatilkibeauty", img: "" },
  { name: "Didem Soydan", subs: "160K", desc: "Profesyonel cilt analizi ve bakım", tags: ["Türkçe", "Profesyonel", "Bilimsel"], url: "https://youtube.com/@didemsoydan", img: "" },

  // === ULUSLARARASI YOUTUBERLAR (25) ===
  { name: "Hyram", subs: "4.5M", desc: "İçerik analizi ve cilt bakım bilimi", tags: ["İngilizce", "Başlangıç", "Bilimsel"], url: "https://youtube.com/@Hyram", img: "" },
  { name: "Ali Andreea", subs: "3.8M", desc: "Cilt tipine özel bakım rutinleri", tags: ["İngilizce", "Orta", "Cilt Bakımı"], url: "https://youtube.com/@AliAndreea", img: "" },
  { name: "James Charles", subs: "24M", desc: "Yaratıcı makyaj ve sanat", tags: ["İngilizce", "İleri", "Profesyonel"], url: "https://youtube.com/@jamescharles", img: "" },
  { name: "NikkieTutorials", subs: "14M", desc: "Dönüşüm makyajları ve ürün incelemeleri", tags: ["İngilizce", "Orta", "Profesyonel"], url: "https://youtube.com/@NikkieTutorials", img: "" },
  { name: "Robert Welsh", subs: "2.1M", desc: "Profesyonel makyöz teknikleri", tags: ["İngilizce", "Profesyonel", "Teknik"], url: "https://youtube.com/@RobertWelsh", img: "" },
  { name: "James Welsh", subs: "1.5M", desc: "Erkek cilt bakımı ve skincare bilimi", tags: ["İngilizce", "Başlangıç", "Bilimsel"], url: "https://youtube.com/@JamesWelsh", img: "" },
  { name: "Doctorly", subs: "1.9M", desc: "Dermatologlar tarafından cilt bakım rehberi", tags: ["İngilizce", "Profesyonel", "Bilimsel"], url: "https://youtube.com/@Doctorly", img: "" },
  { name: "Dr. Dray", subs: "1.8M", desc: "Dermatolog onaylı ürün incelemeleri", tags: ["İngilizce", "Profesyonel", "Bilimsel"], url: "https://youtube.com/@DrDray", img: "" },
  { name: "Glow By Ramón", subs: "800K", desc: "Temiz güzellik ve doğal ürünler", tags: ["İngilizce", "Orta", "Doğal"], url: "https://youtube.com/@GlowByRamon", img: "" },
  { name: "Lisa Eldridge", subs: "2.5M", desc: "Efsanevi makyaj sanatçısından dersler", tags: ["İngilizce", "İleri", "Profesyonel"], url: "https://youtube.com/@lisaeldridge", img: "" },
  { name: "Wayne Goss", subs: "4M", desc: "Profesyonel makyaj sırları ve ipuçları", tags: ["İngilizce", "Profesyonel", "Teknik"], url: "https://youtube.com/@WayneGoss", img: "" },
  { name: "Beauty Within", subs: "2.2M", desc: "K-beauty ve Asya cilt bakım rutinleri", tags: ["İngilizce", "Orta", "Cilt Bakımı"], url: "https://youtube.com/@BeautyWithin", img: "" },
  { name: "Liah Yoo", subs: "1.3M", desc: "Minimalist cilt bakımı ve bilimsel yaklaşım", tags: ["İngilizce", "Başlangıç", "Bilimsel"], url: "https://youtube.com/@LiahYoo", img: "" },
  { name: "Mixed Makeup", subs: "1.1M", desc: "Ünlü makyöz röportajları ve teknikler", tags: ["İngilizce", "Orta", "Teknik"], url: "https://youtube.com/@MixedMakeup", img: "" },
  { name: "Labmuffin Beauty Science", subs: "900K", desc: "Kimyager gözünden kozmetik bilimi", tags: ["İngilizce", "İleri", "Bilimsel"], url: "https://youtube.com/@LabMuffinBeautyScience", img: "" },
  { name: "Cassandra Bankson", subs: "1.4M", desc: "Akne ve problemli cilt bakımı", tags: ["İngilizce", "Orta", "Cilt Bakımı"], url: "https://youtube.com/@CassandraBankson", img: "" },
  { name: "Alexandra Anele", subs: "1.6M", desc: "Fondöten ve kapatıcı uzmanı", tags: ["İngilizce", "Orta", "Teknik"], url: "https://youtube.com/@AlexandraAnele", img: "" },
  { name: "Charlotte Tilbury", subs: "1.7M", desc: "Lüks makyaj ve red carpet teknikleri", tags: ["İngilizce", "İleri", "Profesyonel"], url: "https://youtube.com/@CharlotteTilbury", img: "" },
  { name: "Hung Vanngo", subs: "500K", desc: "Hollywood makyöz teknikleri", tags: ["İngilizce", "İleri", "Profesyonel"], url: "https://youtube.com/@HungVanngo", img: "" },
  { name: "Dr. Shereene Idriss", subs: "750K", desc: "Dermatolog tarafından bilimsel cilt rehberi", tags: ["İngilizce", "Profesyonel", "Bilimsel"], url: "https://youtube.com/@DrShereeneIdriss", img: "" },
  { name: "Kelly Gooch", subs: "400K", desc: "Olgun cilt makyajı ve anti-aging", tags: ["İngilizce", "Orta", "Teknik"], url: "https://youtube.com/@KellyGooch", img: "" },
  { name: "Ava Lee", subs: "350K", desc: "Kore güzellik rutinleri ve trendleri", tags: ["İngilizce", "Başlangıç", "Cilt Bakımı"], url: "https://youtube.com/@AvaLee", img: "" },
  { name: "Nadina Ioana", subs: "600K", desc: "Doğal görünümlü makyaj ve no-makeup look", tags: ["İngilizce", "Başlangıç", "Doğal"], url: "https://youtube.com/@NadinaIoana", img: "" },
  { name: "Penn Smith", subs: "300K", desc: "Erkek cilt bakımı ve grooming rehberi", tags: ["İngilizce", "Başlangıç", "Cilt Bakımı"], url: "https://youtube.com/@PennSmith", img: "" },
  { name: "Gothamista", subs: "1M", desc: "Asya güzellik ürünleri ve detaylı incelemeler", tags: ["İngilizce", "Orta", "Doğal"], url: "https://youtube.com/@Gothamista", img: "" },
];

const FILTERS = ["Hepsi", "Türkçe", "İngilizce", "Başlangıç", "Orta", "İleri", "Profesyonel", "Cilt Bakımı", "Bilimsel", "Doğal", "Günlük Makyaj", "Teknik"];

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
            <a key={ch.name} href={ch.url} target="_blank" rel="noopener noreferrer">
              <Card hoverable className="mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {ch.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">{ch.name}</p>
                      <ExternalLink size={14} className="text-muted shrink-0" />
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
