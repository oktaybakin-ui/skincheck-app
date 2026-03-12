"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Settings } from "lucide-react";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSettings?: boolean;
}

export default function Header({ title = "SkinCheck", showBack = false, showSettings = true }: HeaderProps) {
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
