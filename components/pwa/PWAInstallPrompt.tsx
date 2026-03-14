"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner if not dismissed before
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
        <div className="flex items-center gap-3">
          <img src="/icons/app-icon.svg" alt="Beauty Check" className="w-12 h-12 rounded-xl shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">Beauty Check&apos;i Yükle</p>
            <p className="text-xs text-muted">Ana ekranına ekle, hızlı eriş</p>
          </div>
          <button onClick={handleDismiss} className="text-muted text-lg shrink-0">×</button>
        </div>
        <div className="flex gap-2 mt-3">
          <Button variant="outline" size="sm" onClick={handleDismiss}>Sonra</Button>
          <Button size="sm" onClick={handleInstall}>Yükle</Button>
        </div>
      </div>
    </div>
  );
}
