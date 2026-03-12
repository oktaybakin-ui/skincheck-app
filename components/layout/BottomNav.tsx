"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ScanLine, Sparkles, Users, UserCircle, LucideIcon } from "lucide-react";

interface Tab {
  href: string;
  label: string;
  icon: LucideIcon;
}

const tabs: Tab[] = [
  { href: "/", label: "Ana Sayfa", icon: Home },
  { href: "/scan", label: "Tara", icon: ScanLine },
  { href: "/makeup", label: "Makyaj", icon: Sparkles },
  { href: "/community", label: "Topluluk", icon: Users },
  { href: "/settings", label: "Profilim", icon: UserCircle },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Hide on auth pages
  if (pathname?.startsWith("/login") || pathname?.startsWith("/register") || pathname?.startsWith("/profile-setup")) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-gray-200 safe-area-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {tabs.map((tab) => {
          const isActive = tab.href === "/"
            ? pathname === "/"
            : pathname?.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted hover:text-primary-light"
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] mt-0.5 font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
