"use client";

import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import BarcodeScanner from "@/components/scan/BarcodeScanner";
import OCRScanner from "@/components/scan/OCRScanner";
import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { SearchX, Camera, CheckCircle, Edit3, Loader2 } from "lucide-react";
import { searchByBarcode, parseIngredients } from "@/lib/api/openBeautyFacts";
import { supabase } from "@/lib/supabase";

type Tab = "barcode" | "ocr" | "photo";

interface PhotoResult {
  found: boolean;
  product_name: string | null;
  brand: string | null;
  category: string | null;
  ingredients_text: string | null;
  confidence: string;
  description: string;
}

export default function ScanPage() {
  const [activeTab, setActiveTab] = useState<Tab>("photo");
  const [loading, setLoading] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualBrand, setManualBrand] = useState("");
  const [manualInci, setManualInci] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const router = useRouter();

  // Photo recognition state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoResult, setPhotoResult] = useState<PhotoResult | null>(null);
  const [photoAnalyzing, setPhotoAnalyzing] = useState(false);
  const [editingResult, setEditingResult] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBarcodeScan = useCallback(async (barcode: string) => {
    setLoading(true);
    setScannedBarcode(barcode);

    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("barcode", barcode)
      .single();

    if (existing) {
      router.push(`/product/${existing.id}`);
      return;
    }

    const obfProduct = await searchByBarcode(barcode);
    if (obfProduct && obfProduct.product_name) {
      const ingredients = obfProduct.ingredients_text
        ? parseIngredients(obfProduct.ingredients_text)
        : [];

      const { data: newProduct } = await supabase
        .from("products")
        .insert({
          barcode,
          name: obfProduct.product_name,
          brand: obfProduct.brands,
          category: obfProduct.categories?.split(",")[0]?.trim() || null,
          image_url: obfProduct.image_url || null,
          ingredients: ingredients,
          open_beauty_facts_id: barcode,
        })
        .select("id")
        .single();

      if (newProduct) {
        router.push(`/product/${newProduct.id}`);
        return;
      }
    }

    setLoading(false);
    setNotFound(true);
  }, [router]);

  const handleOCRResult = async (text: string) => {
    const ingredients = parseIngredients(text);
    setLoading(true);

    const { data: newProduct } = await supabase
      .from("products")
      .insert({
        name: "OCR ile taranan ürün",
        ingredients: ingredients,
      })
      .select("id")
      .single();

    setLoading(false);
    if (newProduct) {
      router.push(`/product/${newProduct.id}`);
    }
  };

  const handleManualSubmit = async () => {
    if (!manualInci.trim()) return;
    setLoading(true);
    const ingredients = parseIngredients(manualInci);

    const { data: newProduct } = await supabase
      .from("products")
      .insert({
        barcode: scannedBarcode || null,
        name: manualName || "Manuel girilen ürün",
        brand: manualBrand || null,
        ingredients: ingredients,
      })
      .select("id")
      .single();

    setLoading(false);
    if (newProduct) {
      router.push(`/product/${newProduct.id}`);
    }
  };

  // Photo recognition handlers
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

    // Search DB for existing product by name+brand
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
  };

  if (loading) {
    return (
      <>
        <Header title="Ürün Tara" showBack />
        <main className="px-4 py-20 text-center">
          <div className="w-12 h-12 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-muted mt-4">Ürün aranıyor...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Ürün Tara" showBack />
      <main className="px-4 py-4">
        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
          {[
            { key: "photo" as Tab, label: "📸 Fotoğraf" },
            { key: "barcode" as Tab, label: "Barkod" },
            { key: "ocr" as Tab, label: "INCI Oku" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setNotFound(false); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.key ? "bg-surface text-primary shadow-sm" : "text-muted"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Barcode Tab */}
        {activeTab === "barcode" && !notFound && (
          <BarcodeScanner onScan={handleBarcodeScan} active={activeTab === "barcode"} />
        )}

        {/* Not Found */}
        {notFound && (
          <div className="text-center py-12 space-y-4">
            <SearchX size={48} className="text-muted mx-auto" />
            <h3 className="font-bold text-lg">Ürün bulunamadı</h3>
            <p className="text-sm text-muted">Barkod: {scannedBarcode}</p>
            <div className="space-y-3">
              <Button onClick={() => setShowManual(true)} fullWidth>Manuel Ekle</Button>
              <Button variant="outline" onClick={() => { setNotFound(false); setScannedBarcode(""); }} fullWidth>
                Tekrar Tara
              </Button>
            </div>
          </div>
        )}

        {/* OCR Tab */}
        {activeTab === "ocr" && (
          <OCRScanner onResult={handleOCRResult} />
        )}

        {/* Photo Recognition Tab */}
        {activeTab === "photo" && (
          <div className="space-y-4">
            {!photoPreview ? (
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
                  <Camera size={48} className="mx-auto text-primary" />
                  <h3 className="font-bold mt-3">Ürün Fotoğrafı Çek</h3>
                  <p className="text-sm text-muted mt-1">
                    Kozmetik ürününün fotoğrafını çek, AI tanısın
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <Button onClick={() => fileInputRef.current?.click()} fullWidth>
                  <Camera size={18} className="mr-2" />
                  Fotoğraf Çek
                </Button>
                <Button variant="outline" onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.removeAttribute("capture");
                    fileInputRef.current.click();
                    fileInputRef.current.setAttribute("capture", "environment");
                  }
                }} fullWidth>
                  Galeriden Seç
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
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

                    <div className="space-y-2">
                      {photoResult.found && (
                        <Button onClick={handlePhotoSave} fullWidth>
                          Ürünü Kaydet ve İncele
                        </Button>
                      )}
                      <Button variant="outline" onClick={resetPhoto} fullWidth>
                        Yeni Fotoğraf Çek
                      </Button>
                      <Button variant="ghost" onClick={() => setShowManual(true)} fullWidth>
                        Manuel Giriş
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* Manual Entry Button */}
        {!notFound && activeTab !== "photo" && (
          <button
            onClick={() => setShowManual(true)}
            className="w-full text-center text-sm text-primary font-medium mt-4 py-2"
          >
            Manuel Giriş →
          </button>
        )}

        {/* Manual Entry Modal */}
        <Modal isOpen={showManual} onClose={() => setShowManual(false)} title="Manuel Ürün Girişi">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Ürün adı"
              value={manualName}
              onChange={(e) => setManualName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
            />
            <input
              type="text"
              placeholder="Marka"
              value={manualBrand}
              onChange={(e) => setManualBrand(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
            />
            <div>
              <textarea
                placeholder="INCI listesini yapıştır (virgülle ayrılmış)..."
                value={manualInci}
                onChange={(e) => setManualInci(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface resize-none"
              />
              <p className="text-xs text-muted mt-1">Örn: Aqua, Glycerin, Niacinamide, ...</p>
            </div>
            <Button onClick={handleManualSubmit} disabled={!manualInci.trim()} fullWidth loading={loading}>
              Analiz Et
            </Button>
          </div>
        </Modal>
      </main>
    </>
  );
}
