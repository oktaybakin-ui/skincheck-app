"use client";

import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import BarcodeScanner from "@/components/scan/BarcodeScanner";
import OCRScanner from "@/components/scan/OCRScanner";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SearchX } from "lucide-react";
import { searchByBarcode, parseIngredients } from "@/lib/api/openBeautyFacts";
import { supabase } from "@/lib/supabase";

type Tab = "barcode" | "ocr" | "manual";

export default function ScanPage() {
  const [activeTab, setActiveTab] = useState<Tab>("barcode");
  const [loading, setLoading] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualBrand, setManualBrand] = useState("");
  const [manualInci, setManualInci] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const router = useRouter();

  const handleBarcodeScan = useCallback(async (barcode: string) => {
    setLoading(true);
    setScannedBarcode(barcode);

    // Check local DB first
    const { data: existing } = await supabase
      .from("products")
      .select("id")
      .eq("barcode", barcode)
      .single();

    if (existing) {
      router.push(`/product/${existing.id}`);
      return;
    }

    // Try Open Beauty Facts
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
            { key: "barcode" as Tab, label: "Barkod Tara" },
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

        {/* Manual Entry Button */}
        {!notFound && (
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
