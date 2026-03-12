"use client";

import Link from "next/link";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showSettings?: boolean;
}

export default function Header({ title = "SkinCheck", showBack = false, showSettings = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={() => window.history.back()} className="text-foreground p-1">
              ←
            </button>
          )}
          <h1 className="text-lg font-bold text-primary">{title}</h1>
        </div>
        {showSettings && (
          <Link href="/settings" className="text-muted hover:text-primary transition-colors">
            ⚙️
          </Link>
        )}
      </div>
    </header>
  );
}
