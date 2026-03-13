"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import { useAuthContext } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useRef } from "react";
import { User, FlaskConical, Palette, Bell, Globe, Lock, Info, LogOut, ChevronRight, Archive, Heart, Star, Camera, LucideIcon } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n/I18nContext";
import { LOCALE_NAMES } from "@/lib/i18n/translations";

type MenuItem = { icon: LucideIcon; label: string; href: string | null; value?: string };

export default function SettingsPage() {
  const { user, profile, signOut, uploadAvatar } = useAuthContext();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { locale, t } = useI18n();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await uploadAvatar(file);
    setUploading(false);
  };

  const myItems: MenuItem[] = [
    { icon: Archive, label: t.my_cabinet, href: "/cabinet" },
    { icon: Heart, label: t.my_favorites, href: "/cabinet" },
    { icon: Star, label: t.my_reviews, href: "/community" },
  ];

  const profileItems: MenuItem[] = [
    { icon: User, label: t.edit_profile, href: "/profile-setup" },
    { icon: FlaskConical, label: t.my_skin_type, href: "/profile-setup", value: profile?.skin_type || t.not_specified },
    { icon: Palette, label: t.my_undertone, href: "/makeup/undertone", value: profile?.undertone || t.not_specified },
  ];

  const settingsItems: MenuItem[] = [
    { icon: Bell, label: t.notifications, href: "/settings/notifications" },
    { icon: Globe, label: t.language, href: "/settings/language", value: LOCALE_NAMES[locale].native },
    { icon: Lock, label: t.privacy, href: "/settings/privacy" },
    { icon: Info, label: t.about, href: "/settings/about" },
  ];

  const renderMenuSection = (items: MenuItem[]) => (
    <Card className="divide-y divide-gray-50">
      {items.map((item) => {
        const Icon = item.icon;
        const content = (
          <div className="flex items-center justify-between py-3.5">
            <div className="flex items-center gap-3">
              <Icon size={18} className="text-muted" />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <div className="flex items-center gap-1">
              {!item.href && <Badge variant="muted" size="sm">{t.coming_soon}</Badge>}
              {item.value && <span className="text-sm text-muted">{item.value}</span>}
              {item.href && <ChevronRight size={16} className="text-muted" />}
            </div>
          </div>
        );

        if (item.href) {
          return <Link key={item.label} href={item.href}>{content}</Link>;
        }
        return <div key={item.label} className="opacity-60 cursor-default">{content}</div>;
      })}
    </Card>
  );

  return (
    <>
      <Header title={t.settings_title} showBack showSettings={false} />
      <main className="px-4 py-4 space-y-4 pb-28">
        {/* Profile Summary */}
        {user && (
          <Card className="text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="relative w-20 h-20 mx-auto group"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={t.profile}
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/20"
                />
              ) : (
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
                  {profile?.full_name?.[0] || profile?.username?.[0] || "?"}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-md border-2 border-white group-hover:scale-110 transition-transform">
                {uploading ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera size={14} className="text-white" />
                )}
              </div>
            </button>
            <p className="font-bold mt-2">{profile?.full_name || t.user_fallback}</p>
            {profile?.username && <p className="text-xs text-muted">@{profile.username}</p>}
            <p className="text-xs text-muted mt-1">{user.email}</p>
          </Card>
        )}

        {/* My Items */}
        <div>
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-1">{t.my_items}</h3>
          {renderMenuSection(myItems)}
        </div>

        {/* Profile Settings */}
        <div>
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-1">{t.profile}</h3>
          {renderMenuSection(profileItems)}
        </div>

        {/* App Settings */}
        <div>
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 px-1">{t.settings}</h3>
          {renderMenuSection(settingsItems)}
        </div>

        {/* Sign Out */}
        {user && (
          <Card>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full py-1 text-danger"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">{t.logout}</span>
            </button>
          </Card>
        )}

        {/* App Info */}
        <div className="text-center text-xs text-muted pt-4">
          <p>SkinCheck v1.0.0</p>
          <p className="mt-1">{t.app_tagline}</p>
        </div>
      </main>
    </>
  );
}
