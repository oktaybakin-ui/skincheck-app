import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";
import PWAInstallPrompt from "@/components/pwa/PWAInstallPrompt";
import { AuthProvider } from "@/lib/context/AuthContext";
import { I18nProvider } from "@/lib/i18n/I18nContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Beauty Check - Kozmetik Ürün Dedektifi",
  description: "Kozmetik ürün içerik analizi, hamilelikte güvenli mi kontrolü ve kişiselleştirilmiş cilt bakım rehberi",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Beauty Check",
  },
};

export const viewport: Viewport = {
  themeColor: "#D4627A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} font-sans antialiased bg-background min-h-screen`}>
        <AuthProvider>
          <I18nProvider>
            <div className="max-w-lg mx-auto min-h-screen pb-20">
              {children}
            </div>
            <BottomNav />
            <PWAInstallPrompt />
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
