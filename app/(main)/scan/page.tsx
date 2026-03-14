"use client";

import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { SearchX, Camera, CheckCircle, Edit3, Loader2, AlertTriangle, ShieldCheck, CircleDot, FlaskConical, Upload } from "lucide-react";
import { parseIngredients } from "@/lib/api/openBeautyFacts";
import { supabase } from "@/lib/supabase";

interface KeyIngredient {
  name: string;
  inci_name: string;
  benefit: string;
  warning: string | null;
  rating: "good" | "neutral" | "caution";
  category?: string;
  concentration_hint?: "yüksek" | "orta" | "düşük";
}

interface PhotoResult {
  found: boolean;
  product_name: string | null;
  brand: string | null;
  category: string | null;
  ingredients_text: string | null;
  confidence: string;
  description: string;
  key_ingredients?: KeyIngredient[];
  warnings?: string[];
  suitable_for?: string[];
  not_suitable_for?: string[];
}

export default function ScanPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoResult, setPhotoResult] = useState<PhotoResult | null>(null);
  const [photoAnalyzing, setPhotoAnalyzing] = useState(false);
  const [editingResult, setEditingResult] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      setPhotoPreview(dataUrl);
      setPhotoResult(null);
      setPhotoAnalyzing(true);

      try {
        const res = await fetch("/api/recognize-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: dataUrl }),
        });
        const result = await res.json();
        setPhotoResult(result);
        if (result.product_name) {
          setEditName(result.product_name);
          setEditBrand(result.brand || "");
        }
      } catch {
        setPhotoResult({
          found: false,
          product_name: null,
          brand: null,
          category: null,
          ingredients_text: null,
          confidence: "low",
          description: "Fotoğraf analiz edilemedi. Lütfen tekrar deneyin.",
        });
      }
      setPhotoAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoSave = async () => {
    if (!photoResult?.found) return;
    setLoading(true);

    const name = editingResult ? editName : (photoResult.product_name || "Fotoğrafla tanınan ürün");
    const brand = editingResult ? editBrand : photoResult.brand;
    const ingredients = photoResult.ingredients_text
      ? parseIngredients(photoResult.ingredients_text)
      : [];

    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .ilike("name", `%${name}%`)
      .limit(1)
      .single();

    if (existing) {
      router.push(`/product/${existing.id}`);
      return;
    }

    const { data: newProduct } = await supabase
      .from("products")
      .insert({
        name,
        brand: brand || null,
        category: photoResult.category || null,
        ingredients: ingredients.length > 0 ? ingredients : null,
        image_url: photoPreview || null,
      })
      .select("id")
      .single();

    setLoading(false);
    if (newProduct) {
      router.push(`/product/${newProduct.id}`);
    }
  };

  const resetPhoto = () => {
    setPhotoPreview(null);
    setPhotoResult(null);
    setEditingResult(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  if (loading) {
    return (
      <>
        <Header title="Ürün Tara" showBack />
        <main className="px-4 py-20 text-center">
          <div className="w-12 h-12 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted mt-4">Ürün kaydediliyor...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Ürün Tara" showBack />
      <main className="px-4 py-4 space-y-4 pb-28">
        {!photoPreview ? (
          <>
            {/* Hero */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
              <Camera size={48} className="mx-auto text-primary" />
              <h3 className="font-bold text-lg mt-3">Ürün Fotoğrafı Çek</h3>
              <p className="text-sm text-muted mt-1">
                Kozmetik ürününün fotoğrafını çek, AI tanısın ve içeriğini analiz etsin
              </p>
              <p className="text-[10px] text-muted/60 mt-2 flex items-center justify-center gap-1">
                <ShieldCheck size={10} /> Fotoğrafın anlık olarak değerlendirilir, sunucuda saklanmaz.
              </p>
            </div>

            {/* Camera + Gallery buttons */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoSelect}
              className="hidden"
            />

            <div className="space-y-3">
              <Button onClick={() => fileInputRef.current?.click()} fullWidth>
                <Camera size={18} className="mr-2" />
                Fotoğraf Çek
              </Button>
              <Button variant="outline" onClick={() => galleryInputRef.current?.click()} fullWidth>
                <Upload size={18} className="mr-2" />
                Galeriden Seç
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Photo Preview */}
            <div className="relative rounded-2xl overflow-hidden">
              <img src={photoPreview} alt="Ürün fotoğrafı" className="w-full max-h-64 object-contain bg-gray-50" />
              {photoAnalyzing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Loader2 size={32} className="animate-spin mx-auto" />
                    <p className="text-sm mt-2">AI analiz ediyor...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Result */}
            {photoResult && (
              <>
                {photoResult.found ? (
                  <Card className="border-safe/30 bg-safe/5">
                    <div className="flex items-start gap-3">
                      <CheckCircle size={24} className="text-safe shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-sm">Ürün Tanındı!</p>
                          <Badge
                            variant={photoResult.confidence === "high" ? "safe" : photoResult.confidence === "medium" ? "warning" : "danger"}
                            size="sm"
                          >
                            {photoResult.confidence === "high" ? "Yüksek" : photoResult.confidence === "medium" ? "Orta" : "Düşük"} güven
                          </Badge>
                        </div>

                        {!editingResult ? (
                          <>
                            {photoResult.product_name && <p className="text-sm font-semibold">{photoResult.product_name}</p>}
                            {photoResult.brand && <p className="text-xs text-muted">{photoResult.brand}</p>}
                            {photoResult.category && <Badge variant="primary" size="sm" className="mt-1">{photoResult.category}</Badge>}
                            {photoResult.description && <p className="text-xs text-muted mt-2">{photoResult.description}</p>}
                            <button
                              onClick={() => setEditingResult(true)}
                              className="flex items-center gap-1 text-xs text-primary mt-2"
                            >
                              <Edit3 size={12} /> Düzenle
                            </button>
                          </>
                        ) : (
                          <div className="space-y-2 mt-2">
                            <input
                              type="text"
                              placeholder="Ürün adı"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Marka"
                              value={editBrand}
                              onChange={(e) => setEditBrand(e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary outline-none text-sm"
                            />
                            <button
                              onClick={() => setEditingResult(false)}
                              className="text-xs text-primary"
                            >
                              Tamam
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card className="border-warning/30 bg-warning/5">
                    <div className="flex items-start gap-3">
                      <SearchX size={24} className="text-warning shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm">Ürün Tanınamadı</p>
                        <p className="text-xs text-muted mt-1">{photoResult.description}</p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Key Ingredients - Detailed List */}
                {photoResult.found && photoResult.key_ingredients && photoResult.key_ingredients.length > 0 && (
                  <Card>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FlaskConical size={18} className="text-primary" />
                        <h4 className="font-bold text-sm">İçerik Analizi</h4>
                      </div>
                      <div className="flex gap-1.5">
                        <Badge variant="safe" size="sm">
                          {photoResult.key_ingredients.filter(i => i.rating === "good").length} iyi
                        </Badge>
                        <Badge variant="muted" size="sm">
                          {photoResult.key_ingredients.filter(i => i.rating === "neutral").length} nötr
                        </Badge>
                        <Badge variant="danger" size="sm">
                          {photoResult.key_ingredients.filter(i => i.rating === "caution").length} dikkat
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {photoResult.key_ingredients.map((ing, i) => (
                        <div key={i} className={`rounded-xl border p-3 ${
                          ing.rating === "good"
                            ? "border-safe/30 bg-safe/5"
                            : ing.rating === "caution"
                              ? "border-danger/30 bg-danger/5"
                              : "border-gray-200 bg-gray-50"
                        }`}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                ing.rating === "good"
                                  ? "bg-safe/20 text-safe"
                                  : ing.rating === "caution"
                                    ? "bg-danger/20 text-danger"
                                    : "bg-gray-200 text-gray-500"
                              }`}>
                                {ing.rating === "good" ? <CheckCircle size={14} /> : ing.rating === "caution" ? <AlertTriangle size={14} /> : <CircleDot size={14} />}
                              </div>
                              <div>
                                <p className="text-sm font-bold">{ing.name}</p>
                                <p className="text-[10px] text-muted font-mono">{ing.inci_name}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-0.5">
                              {ing.category && (
                                <Badge variant="primary" size="sm">{ing.category}</Badge>
                              )}
                              {ing.concentration_hint && (
                                <span className={`text-[9px] font-medium ${
                                  ing.concentration_hint === "yüksek" ? "text-primary" : ing.concentration_hint === "orta" ? "text-muted" : "text-muted/60"
                                }`}>
                                  {ing.concentration_hint === "yüksek" ? "Yüksek oran" : ing.concentration_hint === "orta" ? "Orta oran" : "Düşük oran"}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-xs text-foreground/80 leading-relaxed mt-1">{ing.benefit}</p>

                          {ing.warning && (
                            <div className="flex items-start gap-1.5 mt-2 p-2 bg-danger/10 rounded-lg">
                              <AlertTriangle size={12} className="text-danger shrink-0 mt-0.5" />
                              <p className="text-[11px] text-danger leading-relaxed">{ing.warning}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {photoResult.ingredients_text && (
                      <details className="mt-3">
                        <summary className="text-[11px] text-muted cursor-pointer hover:text-primary transition-colors">
                          Tam INCI Listesi
                        </summary>
                        <p className="text-[10px] text-muted/70 mt-1.5 font-mono leading-relaxed p-2 bg-gray-50 rounded-lg">
                          {photoResult.ingredients_text}
                        </p>
                      </details>
                    )}
                  </Card>
                )}

                {/* Warnings */}
                {photoResult.found && photoResult.warnings && photoResult.warnings.length > 0 && (
                  <Card className="border-danger/20 bg-danger/5">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={16} className="text-danger" />
                      <h4 className="font-bold text-sm text-danger">Dikkat Edilmesi Gerekenler</h4>
                    </div>
                    <div className="space-y-1.5">
                      {photoResult.warnings.map((w, i) => (
                        <p key={i} className="text-xs text-muted flex items-start gap-2">
                          <span className="text-danger shrink-0 mt-0.5">!</span> {w}
                        </p>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Suitability */}
                {photoResult.found && (photoResult.suitable_for?.length || photoResult.not_suitable_for?.length) && (
                  <Card>
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck size={16} className="text-primary" />
                      <h4 className="font-bold text-sm">Uygunluk</h4>
                    </div>
                    {photoResult.suitable_for && photoResult.suitable_for.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {photoResult.suitable_for.map((s, i) => (
                          <Badge key={i} variant="safe" size="sm">{s}</Badge>
                        ))}
                      </div>
                    )}
                    {photoResult.not_suitable_for && photoResult.not_suitable_for.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {photoResult.not_suitable_for.map((s, i) => (
                          <Badge key={i} variant="danger" size="sm">{s}</Badge>
                        ))}
                      </div>
                    )}
                  </Card>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  {photoResult.found && (
                    <Button onClick={handlePhotoSave} fullWidth>
                      Ürünü Kaydet ve İncele
                    </Button>
                  )}
                  <Button variant="outline" onClick={resetPhoto} fullWidth>
                    Yeni Fotoğraf Çek
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </>
  );
}
