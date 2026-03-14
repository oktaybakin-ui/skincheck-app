"use client";

import { useState } from "react";
import { ChevronRight, ExternalLink } from "lucide-react";

interface PinCategory {
  title: string;
  query: string;
  gradient: string;
  emoji: string;
  tall?: boolean;
}

const pinCategories: PinCategory[] = [
  { title: "Doğal Makyaj", query: "natural makeup looks everyday", gradient: "from-rose-200 to-pink-100", emoji: "🌸", tall: true },
  { title: "Göz Makyajı", query: "eye makeup tutorial trending", gradient: "from-purple-200 to-indigo-100", emoji: "👁️" },
  { title: "Dudak Renkleri", query: "lip color trends 2025", gradient: "from-red-200 to-rose-100", emoji: "💋" },
  { title: "Kontur & Aydınlatıcı", query: "contour highlight tutorial", gradient: "from-amber-200 to-yellow-100", emoji: "✨", tall: true },
  { title: "Cilt Bakımı", query: "skincare routine glass skin", gradient: "from-teal-200 to-emerald-100", emoji: "🧴" },
  { title: "Saç Modelleri", query: "hair styling trends 2025", gradient: "from-orange-200 to-amber-100", emoji: "💇‍♀️" },
];

export default function PinterestInspiration() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#E60023">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
          </svg>
          <h3 className="text-lg font-bold">Makyaj İlhamı</h3>
        </div>
        <a
          href="https://pinterest.com/search/pins/?q=makeup+trends+2025"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E60023] text-sm font-medium flex items-center gap-0.5"
        >
          Tümü <ChevronRight size={14} />
        </a>
      </div>

      {/* Masonry Grid */}
      <div className="grid grid-cols-2 gap-2.5 auto-rows-[80px]">
        {pinCategories.map((cat, idx) => (
          <a
            key={cat.title}
            href={`https://pinterest.com/search/pins/?q=${encodeURIComponent(cat.query)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative bg-gradient-to-br ${cat.gradient} rounded-2xl overflow-hidden group transition-all duration-300 ${
              cat.tall ? "row-span-2" : "row-span-1"
            } ${hoveredIdx === idx ? "scale-[1.02] shadow-lg" : ""}`}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
              <span className="text-3xl mb-1.5 group-hover:scale-110 transition-transform duration-300">
                {cat.emoji}
              </span>
              <p className="text-sm font-bold text-gray-800 text-center leading-tight">
                {cat.title}
              </p>
              <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[10px] text-gray-600 font-medium">Keşfet</span>
                <ExternalLink size={10} className="text-gray-600" />
              </div>
            </div>

            {/* Pinterest Badge */}
            <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#E60023">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
              </svg>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
