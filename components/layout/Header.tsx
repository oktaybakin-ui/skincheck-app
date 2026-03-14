"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Settings } from "lucide-react";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSettings?: boolean;
}

export default function Header({ title = "Beauty Check", showBack = false, showSettings = true }: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={handleBack} className="text-foreground p-1 rounded-lg hover:bg-gray-100 transition-colors">
              <ArrowLeft size={20} />
            </button>
          )}
          {!showBack && (
            <svg width="28" height="28" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" className="rounded-lg">
              <defs>
                <linearGradient id="bg_h" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#FFF5F7"/><stop offset="100%" stopColor="#FEF0E8"/></linearGradient>
                <linearGradient id="rg_h" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F4A7BB"/><stop offset="100%" stopColor="#D4849A"/></linearGradient>
                <linearGradient id="gd_h" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#E8C77B"/><stop offset="100%" stopColor="#C9A44E"/></linearGradient>
              </defs>
              <rect width="1024" height="1024" rx="200" fill="url(#bg_h)"/>
              <circle cx="512" cy="440" r="200" fill="none" stroke="url(#gd_h)" strokeWidth="12"/>
              <line x1="647" y1="578" x2="720" y2="670" stroke="url(#gd_h)" strokeWidth="20" strokeLinecap="round"/>
              <path d="M420 350Q458 316 496 345" fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round" opacity="0.7"/>
              <circle cx="432" cy="326" r="9" fill="#fff" opacity="0.6"/>
              <path d="M435 440L490 498L600 382" fill="none" stroke="url(#rg_h)" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          <h1 className="text-lg font-bold text-primary">{title}</h1>
        </div>
        {showSettings && (
          <Link href="/settings" className="text-muted hover:text-primary transition-colors p-1 rounded-lg hover:bg-gray-100">
            <Settings size={20} />
          </Link>
        )}
      </div>
    </header>
  );
}
