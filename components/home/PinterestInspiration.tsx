"use client";

import { ChevronRight, ExternalLink } from "lucide-react";

interface PinCategory {
  title: string;
  query: string;
  gradient: string;
  icon: string;
  tall?: boolean;
}

const pinCategories: PinCategory[] = [
  { title: "Doğal Makyaj", query: "natural makeup looks everyday", gradient: "from-rose-300/60 to-pink-200/40", icon: "soft", tall: true },
  { title: "Göz Makyajı", query: "eye makeup tutorial trending", gradient: "from-violet-300/60 to-purple-200/40", icon: "eye" },
  { title: "Dudak Renkleri", query: "lip color trends 2025", gradient: "from-red-300/60 to-rose-200/40", icon: "lip" },
  { title: "Kontur & Aydınlatıcı", query: "contour highlight tutorial", gradient: "from-amber-300/60 to-yellow-200/40", icon: "contour", tall: true },
  { title: "Cilt Bakımı", query: "skincare routine glass skin", gradient: "from-teal-300/60 to-emerald-200/40", icon: "skin" },
  { title: "Saç Modelleri", query: "hair styling trends 2025", gradient: "from-orange-300/60 to-amber-200/40", icon: "hair" },
];

function CategoryIcon({ type, className = "" }: { type: string; className?: string }) {
  const base = `w-8 h-8 ${className}`;
  switch (type) {
    case "soft":
      return (
        <svg className={base} viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="16" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M12 28c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="17" cy="15" r="1" fill="currentColor" />
          <circle cx="23" cy="15" r="1" fill="currentColor" />
          <path d="M18 18.5c1 1 3 1 4 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "eye":
      return (
        <svg className={base} viewBox="0 0 40 40" fill="none">
          <path d="M6 20s6-10 14-10 14 10 14 10-6 10-14 10S6 20 6 20z" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
          <circle cx="20" cy="20" r="2" fill="currentColor" />
          <path d="M15 12c2-2 5-3 8-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      );
    case "lip":
      return (
        <svg className={base} viewBox="0 0 40 40" fill="none">
          <path d="M8 20c0 0 4 10 12 10s12-10 12-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M8 20c0 0 4-6 8-6 2 0 3 3 4 3s2-3 4-3c4 0 8 6 8 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M14 20h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "contour":
      return (
        <svg className={base} viewBox="0 0 40 40" fill="none">
          <ellipse cx="20" cy="20" rx="10" ry="14" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M14 12c2 4 2 12 0 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" />
          <path d="M26 12c-2 4-2 12 0 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" />
          <circle cx="20" cy="14" r="1.5" fill="currentColor" opacity="0.5" />
          <circle cx="20" cy="26" r="1.5" fill="currentColor" opacity="0.5" />
        </svg>
      );
    case "skin":
      return (
        <svg className={base} viewBox="0 0 40 40" fill="none">
          <rect x="12" y="6" rx="4" width="16" height="28" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M16 14h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="20" cy="22" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M20 20v4M18 22h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case "hair":
      return (
        <svg className={base} viewBox="0 0 40 40" fill="none">
          <path d="M14 34V20c0-6 2.7-10 6-10s6 4 6 10v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M10 30c0-10 2-18 10-20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M30 30c0-10-2-18-10-20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="20" cy="8" r="2" fill="currentColor" opacity="0.4" />
        </svg>
      );
    default:
      return null;
  }
}

const PinterestIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

export default function PinterestInspiration() {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <PinterestIcon size={20} className="text-[#E60023]" />
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
        {pinCategories.map((cat) => (
          <a
            key={cat.title}
            href={`https://pinterest.com/search/pins/?q=${encodeURIComponent(cat.query)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative bg-gradient-to-br ${cat.gradient} rounded-2xl overflow-hidden group
              transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]
              ${cat.tall ? "row-span-2" : "row-span-1"}`}
          >
            {/* Decorative circles */}
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
            <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-white/10" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-3">
              <div className="text-gray-700/80 group-hover:text-gray-800 group-hover:scale-110 transition-all duration-300">
                <CategoryIcon type={cat.icon} />
              </div>
              <p className="text-[13px] font-bold text-gray-800 text-center leading-tight mt-1.5">
                {cat.title}
              </p>
              <div className="flex items-center gap-1 mt-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                <ExternalLink size={9} className="text-gray-600" />
                <span className="text-[10px] text-gray-600 font-medium">Keşfet</span>
              </div>
            </div>

            {/* Pinterest Badge */}
            <div className="absolute top-1.5 right-1.5 bg-white/70 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <PinterestIcon size={10} className="text-[#E60023]" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
