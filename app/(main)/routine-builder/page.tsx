"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useState } from "react";
import {
  Camera,
  Upload,
  Loader2,
  Sunrise,
  Moon,
  AlertTriangle,
  Plus,
  X,
  Sparkles,
  CheckCircle,
  Info,
} from "lucide-react";

interface Product {
  name: string;
  brand: string;
  category: string;
  time: "morning" | "evening" | "both";
}

interface RoutineStep {
  order: number;
  product: string;
  step: string;
  tip: string;
}

interface RoutineResult {
  products: Product[];
  morning_routine: RoutineStep[];
  evening_routine: RoutineStep[];
  warnings: string[];
  missing: string[];
  error?: string;
}

export default function RoutineBuilderPage() {
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoutineResult | null>(null);

  const addPhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setPhotos((prev) => [...prev, reader.result as string]);
        setResult(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (idx: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
    setResult(null);
  };

  const analyzePhotos = async () => {
    if (photos.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: photos }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPhotos([]);
    setResult(null);
  };

  return (
    <>
      <Header title="Rutin Oluşturucu" showBack />
      <main className="px-4 py-4 space-y-4 pb-28">
        {/* Info */}
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex gap-3">
            <Sparkles size={24} className="text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">AI Rutin Oluşturucu</p>
              <p className="text-xs text-muted mt-1">
                Cilt bakım ürünlerinin fotoğraflarını yükle, AI bunları tanısın ve sana kişisel sabah-akşam rutini oluştursun.
              </p>
            </div>
          </div>
        </Card>

        {/* Photo Upload */}
        {!result && (
          <Card>
            <p className="text-sm font-semibold mb-3">Ürün Fotoğrafları</p>

            {/* Uploaded photos */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {photos.map((photo, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                    <img src={photo} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-danger text-white rounded-full flex items-center justify-center"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add photo buttons */}
            <div className="flex gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 py-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                <Camera size={20} className="text-muted" />
                <span className="text-sm text-muted">Fotoğraf Çek</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) addPhoto(file);
                  }}
                />
              </label>
              <label className="flex-1 flex items-center justify-center gap-2 py-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                <Upload size={20} className="text-muted" />
                <span className="text-sm text-muted">Galeriden Seç</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files) {
                      Array.from(files).forEach((f) => addPhoto(f));
                    }
                  }}
                />
              </label>
            </div>

            <p className="text-[10px] text-muted mt-2 text-center">
              Birden fazla ürün fotoğrafı ekleyebilirsin ({photos.length}/10)
            </p>

            {photos.length > 0 && (
              <Button onClick={analyzePhotos} loading={loading} fullWidth className="mt-3">
                <span className="flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Ürünler tanınıyor...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> Rutin Oluştur ({photos.length} fotoğraf)
                    </>
                  )}
                </span>
              </Button>
            )}
          </Card>
        )}

        {/* Results */}
        {result && !result.error && (
          <>
            {/* Detected Products */}
            <Card>
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-safe" /> Tanınan Ürünler ({result.products.length})
              </h3>
              <div className="space-y-2">
                {result.products.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.brand} {p.name}</p>
                      <p className="text-[10px] text-muted">{p.category}</p>
                    </div>
                    <Badge
                      variant={p.time === "morning" ? "info" : p.time === "evening" ? "secondary" : "muted"}
                      size="sm"
                    >
                      {p.time === "morning" ? "Sabah" : p.time === "evening" ? "Akşam" : "Sabah/Akşam"}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Morning Routine */}
            {result.morning_routine.length > 0 && (
              <Card>
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <Sunrise size={16} className="text-amber-500" /> Sabah Rutini
                </h3>
                <div className="space-y-3">
                  {result.morning_routine.map((step) => (
                    <div key={step.order} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                        {step.order}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{step.product}</p>
                        <p className="text-xs text-muted">{step.step}</p>
                        {step.tip && (
                          <p className="text-[11px] text-primary mt-0.5 italic">Tip: {step.tip}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Evening Routine */}
            {result.evening_routine.length > 0 && (
              <Card>
                <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
                  <Moon size={16} className="text-indigo-500" /> Akşam Rutini
                </h3>
                <div className="space-y-3">
                  {result.evening_routine.map((step) => (
                    <div key={step.order} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                        {step.order}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{step.product}</p>
                        <p className="text-xs text-muted">{step.step}</p>
                        {step.tip && (
                          <p className="text-[11px] text-primary mt-0.5 italic">Tip: {step.tip}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Warnings */}
            {result.warnings && result.warnings.length > 0 && (
              <Card className="border-danger/20 bg-danger/5">
                <h3 className="font-bold text-sm mb-2 flex items-center gap-2 text-danger">
                  <AlertTriangle size={16} /> Uyarılar
                </h3>
                <div className="space-y-1.5">
                  {result.warnings.map((w, i) => (
                    <p key={i} className="text-xs text-muted flex items-start gap-2">
                      <span className="text-danger mt-0.5 shrink-0">!</span> {w}
                    </p>
                  ))}
                </div>
              </Card>
            )}

            {/* Missing products */}
            {result.missing && result.missing.length > 0 && (
              <Card className="border-info/20 bg-info/5">
                <h3 className="font-bold text-sm mb-2 flex items-center gap-2 text-info">
                  <Info size={16} /> Eksik Ürün Önerileri
                </h3>
                <div className="space-y-1.5">
                  {result.missing.map((m, i) => (
                    <p key={i} className="text-xs text-muted flex items-start gap-2">
                      <Plus size={12} className="text-info shrink-0 mt-0.5" /> {m}
                    </p>
                  ))}
                </div>
              </Card>
            )}

            <Button onClick={reset} variant="outline" fullWidth>
              Yeni Analiz Yap
            </Button>
          </>
        )}

        {result?.error && (
          <Card className="border-danger/20 bg-danger/5">
            <div className="text-center py-4">
              <AlertTriangle size={32} className="text-danger mx-auto" />
              <p className="text-sm font-semibold mt-2">{result.error}</p>
              <Button onClick={reset} variant="outline" className="mt-3">
                Tekrar Dene
              </Button>
            </div>
          </Card>
        )}
      </main>
    </>
  );
}
