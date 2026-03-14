"use client";

import Button from "@/components/ui/Button";
import Link from "next/link";
import { useState } from "react";
import { useAuthContext } from "@/lib/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuthContext();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error.message === "Invalid login credentials" ? "E-posta veya şifre hatalı" : error.message);
    } else {
      router.push("/");
    }
  };

  const handleGoogle = async () => {
    await signInWithGoogle();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <img src="/icons/logo-full.svg" alt="Beauty Check" className="h-24 mx-auto" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-danger/10 text-danger text-sm p-3 rounded-xl">{error}</div>
          )}
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
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-surface"
          />
          <Button type="submit" fullWidth loading={loading}>Giriş Yap</Button>
        </form>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-muted">veya</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="space-y-3">
          <Button variant="outline" fullWidth onClick={handleGoogle}>
            Google ile Giriş Yap
          </Button>
          <Button variant="outline" fullWidth disabled>
            Apple ile Giriş Yap
          </Button>
        </div>

        <p className="text-center text-sm text-muted">
          Hesabın yok mu?{" "}
          <Link href="/register" className="text-primary font-semibold">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
}
