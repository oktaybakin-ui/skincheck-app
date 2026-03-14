"use client";

interface SocialMediaSearchProps {
  productName: string;
  brand?: string | null;
  className?: string;
}

const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13.2a8.28 8.28 0 005.58 2.16v-3.45a4.85 4.85 0 01-2.49-.72V6.69h2.49z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const YouTubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export default function SocialMediaSearch({ productName, brand, className = "" }: SocialMediaSearchProps) {
  const searchQuery = brand ? `${brand} ${productName}` : productName;
  const encodedQuery = encodeURIComponent(`${searchQuery} review`);

  const platforms = [
    {
      name: "TikTok",
      icon: <TikTokIcon />,
      url: `https://www.tiktok.com/search?q=${encodedQuery}`,
      bg: "bg-gray-900 hover:bg-black",
      text: "text-white",
    },
    {
      name: "Instagram",
      icon: <InstagramIcon />,
      url: `https://www.instagram.com/explore/tags/${encodeURIComponent((searchQuery).replace(/\s+/g, "").toLowerCase())}/`,
      bg: "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500",
      text: "text-white",
    },
    {
      name: "YouTube",
      icon: <YouTubeIcon />,
      url: `https://www.youtube.com/results?search_query=${encodedQuery}`,
      bg: "bg-red-600 hover:bg-red-700",
      text: "text-white",
    },
  ];

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="white">
            <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm3.5 8h-3v3a.5.5 0 01-1 0V9h-3a.5.5 0 010-1h3V5a.5.5 0 011 0v3h3a.5.5 0 010 1z"/>
          </svg>
        </div>
        <h4 className="text-sm font-bold text-gray-800">Sosyal Medya Yorumları</h4>
      </div>
      <p className="text-xs text-gray-500 mb-3">Bu ürünün gerçek kullanıcı yorumlarını sosyal medyada keşfet</p>
      <div className="flex gap-2">
        {platforms.map((p) => (
          <a
            key={p.name}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 flex items-center justify-center gap-1.5 ${p.bg} ${p.text} py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95`}
          >
            {p.icon}
            {p.name}
          </a>
        ))}
      </div>
    </div>
  );
}
