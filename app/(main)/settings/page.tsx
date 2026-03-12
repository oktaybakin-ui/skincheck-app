"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import { useAuthContext } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, FlaskConical, Palette, Bell, Globe, Lock, Info, LogOut, ChevronRight, LucideIcon } from "lucide-react";
import Badge from "@/components/ui/Badge";

export default function SettingsPage() {
  const { user, profile, signOut } = useAuthContext();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const menuItems: { icon: LucideIcon; label: string; href: string | null; value?: string }[] = [
    { icon: User, label: "Profil Düzenle", href: "/profile-setup" },
    { icon: FlaskConical, label: "Cilt Tipim", href: "/profile-setup", value: profile?.skin_type || "Belirtilmemiş" },
    { icon: Palette, label: "Alt Tonum", href: "/makeup/undertone", value: profile?.undertone || "Belirtilmemiş" },
    { icon: Bell, label: "Bildirimler", href: null },
    { icon: Globe, label: "Dil", href: null, value: "Türkçe" },
    { icon: Lock, label: "Gizlilik", href: null },
    { icon: Info, label: "Hakkında", href: null },
  ];

  return (
    <>
      <Header title="Ayarlar" showBack />
      <main className="px-4 py-4 space-y-4 pb-28">
        {/* Profile Summary */}
        {user && (
          <Card className="text-center">
            <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center text-primary text-2xl font-bold">
              {profile?.full_name?.[0] || profile?.username?.[0] || "?"}
            </div>
            <p className="font-bold mt-2">{profile?.full_name || "Kullanıcı"}</p>
            {profile?.username && <p className="text-xs text-muted">@{profile.username}</p>}
            <p className="text-xs text-muted mt-1">{user.email}</p>
          </Card>
        )}

        {/* Menu Items */}
        <Card className="divide-y divide-gray-50">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const content = (
              <div className="flex items-center justify-between py-3.5">
                <div className="flex items-center gap-3">
                  <Icon size={18} className="text-muted" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  {!item.href && <Badge variant="muted" size="sm">Yakinda</Badge>}
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

        {/* Sign Out */}
        {user && (
          <Card>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full py-1 text-danger"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Çıkış Yap</span>
            </button>
          </Card>
        )}

        {/* App Info */}
        <div className="text-center text-xs text-muted pt-4">
          <p>SkinCheck v1.0.0</p>
          <p className="mt-1">Kozmetik Ürün Dedektifi</p>
        </div>
      </main>
    </>
  );
}
