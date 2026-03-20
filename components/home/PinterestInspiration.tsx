"use client";

import { ChevronRight, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n/I18nContext";

interface PinCategory {
  titleKey: string;
  query: string;
  image: string;
  overlay: string;
  tall?: boolean;
}

const pinCategories: PinCategory[] = [
  {
    titleKey: "pin_natural",
    query: "natural makeup looks everyday",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=500&fit=crop&q=60",
    overlay: "from-rose-900/60 via-rose-800/40 to-transparent",
    tall: true,
  },
  {
    titleKey: "pin_eye",
    query: "eye makeup tutorial trending",
    image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=300&fit=crop&q=60",
    overlay: "from-purple-900/60 via-purple-800/40 to-transparent",
  },
  {
    titleKey: "pin_lip",
    query: "lip color trends 2025",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=300&fit=crop&q=60",
    overlay: "from-red-900/60 via-red-800/40 to-transparent",
  },
  {
    titleKey: "pin_contour",
    query: "contour highlight tutorial",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=500&fit=crop&q=60",
    overlay: "from-amber-900/60 via-amber-800/40 to-transparent",
    tall: true,
  },
  {
    titleKey: "pin_skincare",
    query: "skincare routine glass skin",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop&q=60",
    overlay: "from-teal-900/60 via-teal-800/40 to-transparent",
  },
  {
    titleKey: "pin_hair",
    query: "hair styling trends 2025",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop&q=60",
    overlay: "from-orange-900/60 via-orange-800/40 to-transparent",
  },
];

const PinterestIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

export default function PinterestInspiration() {
  const { t } = useI18n();

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <PinterestIcon size={20} className="text-[#E60023]" />
          <h3 className="text-lg font-bold">{t.pin_title}</h3>
        </div>
        <a
          href="https://pinterest.com/search/pins/?q=makeup+trends+2025"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E60023] text-sm font-medium flex items-center gap-0.5"
        >
          {t.pin_all} <ChevronRight size={14} />
        </a>
      </div>

      {/* Masonry Grid */}
      <div className="grid grid-cols-2 gap-2.5 auto-rows-[80px]">
        {pinCategories.map((cat) => (
          <a
            key={cat.titleKey}
            href={`https://pinterest.com/search/pins/?q=${encodeURIComponent(cat.query)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative rounded-2xl overflow-hidden group
              transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]
              ${cat.tall ? "row-span-2" : "row-span-1"}`}
          >
            <img
              src={cat.image}
              alt={t[cat.titleKey as keyof typeof t]}
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-55 transition-opacity duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${cat.overlay}`} />
            <div className="absolute inset-0 bg-white/30 -z-10" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-3 z-10">
              <p className="text-sm font-bold text-white text-center leading-tight drop-shadow-md">
                {t[cat.titleKey as keyof typeof t]}
              </p>
              <div className="flex items-center gap-1 mt-1.5 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                <ExternalLink size={10} className="text-white/90" />
                <span className="text-[10px] text-white/90 font-medium">{t.pin_explore}</span>
              </div>
            </div>
            <div className="absolute top-1.5 right-1.5 bg-white/80 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <PinterestIcon size={10} className="text-[#E60023]" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
