"use client";

import Button from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";
import { useAuthContext } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuthContext();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı");
      return;
    }
    setLoading(true);
    const { data, error } = await signUp(email, password, name);
    setLoading(false);
    if (error) {
      setError(error.message);
    } else if (data?.session) {
      // Oturum açıldı (email onayı kapalı) → kuruluma geç
      router.push("/profile-setup");
    } else {
      // Email onayı açıksa oturum gelmez; kullanıcıyı boş sayfada bırakma, bilgilendir
      setInfo(
        "Hesabın oluşturuldu! Lütfen e-postana gönderilen doğrulama bağlantısına tıkla, ardından giriş yap."
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <button
        type="button"
        onClick={() => {
          if (typeof window !== "undefined" && window.history.length > 1) router.back();
          else router.push("/");
        }}
        aria-label="Geri"
        className="absolute left-5 w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-gray-200 text-foreground text-xl"
        style={{ top: "calc(env(safe-area-inset-top, 0px) + 1rem)" }}
      >
        ←
      </button>
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <img src="/icons/logo-full.svg" alt="Beauty Check" className="h-24 mx-auto" />
          <p className="text-muted mt-2">Hesap Oluştur</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="bg-danger/10 text-danger text-sm p-3 rounded-xl">{error}</div>
          )}
          {info && (
            <div className="bg-primary/10 text-primary text-sm p-3 rounded-xl">{info}</div>
          )}
          <input
            type="text"
            placeholder="Ad Soyad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-surface"
          />
          <input
            type="email"
            placeholder="E-posta adresin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-surface"
          />
          <input
            type="password"
            placeholder="Şifre (min. 6 karakter)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-surface"
          />
          <Button type="submit" fullWidth loading={loading}>Kayıt Ol</Button>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-muted">veya</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="space-y-3">
          <Button variant="outline" fullWidth disabled className="opacity-50">
            Google ile Kayıt Ol
            <span className="ml-2 text-[10px] text-muted">(Yakında)</span>
          </Button>
          <Button variant="outline" fullWidth disabled className="opacity-50">
            Apple ile Kayıt Ol
            <span className="ml-2 text-[10px] text-muted">(Yakında)</span>
          </Button>
        </div>

        <p className="text-center text-sm text-muted">
          Zaten hesabın var mı?{" "}
          <Link href="/login" className="text-primary font-semibold">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}
