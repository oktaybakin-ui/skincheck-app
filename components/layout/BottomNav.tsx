"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ScanLine, Sparkles, Users, Tag, LucideIcon } from "lucide-react";
import { useAuthContext } from "@/lib/context/AuthContext";
import { useI18n } from "@/lib/i18n/I18nContext";

export default function BottomNav() {
  const pathname = usePathname();
  const { profile } = useAuthContext();
  const { t } = useI18n();

  const tabs: { href: string; label: string; icon: LucideIcon }[] = [
    { href: "/", label: t.nav_home, icon: Home },
    { href: "/scan", label: t.nav_scan, icon: ScanLine },
    { href: "/makeup", label: t.nav_makeup, icon: Sparkles },
    { href: "/community", label: t.nav_community, icon: Users },
    { href: "/deals", label: t.nav_deals, icon: Tag },
  ];

  // Hide on auth pages
  if (pathname?.startsWith("/login") || pathname?.startsWith("/register") || pathname?.startsWith("/profile-setup")) {
    return null;
  }

  const isSettingsActive = pathname?.startsWith("/settings");

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

        {/* Profile tab with avatar */}
        <Link
          href="/settings"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isSettingsActive
              ? "text-primary"
              : "text-muted hover:text-primary-light"
          }`}
        >
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt=""
              className={`w-6 h-6 rounded-full object-cover ${isSettingsActive ? "ring-2 ring-primary" : "ring-1 ring-gray-200"}`}
            />
          ) : (
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
              isSettingsActive ? "bg-primary text-white" : "bg-gray-200 text-muted"
            }`}>
              {profile?.full_name?.[0] || "?"}
            </div>
          )}
          <span className="text-[10px] mt-0.5 font-medium">{t.nav_profile}</span>
        </Link>
      </div>
    </nav>
  );
}
