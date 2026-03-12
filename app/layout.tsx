import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";
import PWAInstallPrompt from "@/components/pwa/PWAInstallPrompt";
import { AuthProvider } from "@/lib/context/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SkinCheck - Kozmetik Ürün Dedektifi",
  description: "Kozmetik ürün içerik analizi, hamilelikte güvenli mi kontrolü ve kişiselleştirilmiş cilt bakım rehberi",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SkinCheck",
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
          <div className="max-w-lg mx-auto min-h-screen pb-20">
            {children}
          </div>
          <BottomNav />
          <PWAInstallPrompt />
        </AuthProvider>
      </body>
    </html>
  );
}
