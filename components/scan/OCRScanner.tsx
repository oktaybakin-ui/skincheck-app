"use client";

import { useState, useRef } from "react";
import Button from "@/components/ui/Button";
import { Camera } from "lucide-react";

interface OCRScannerProps {
  onResult: (text: string) => void;
}

export default function OCRScanner({ onResult }: OCRScannerProps) {
  const [processing, setProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = async (file: File) => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    setProcessing(true);

    try {
      const Tesseract = await import("tesseract.js");
      const { data } = await Tesseract.recognize(file, "eng", {});
      const cleaned = data.text
        .replace(/\n/g, ", ")
        .replace(/\s+/g, " ")
        .trim();
      setOcrText(cleaned);
    } catch {
      setOcrText("OCR işlemi başarısız oldu. Lütfen metni manuel girin.");
    }
    setProcessing(false);
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="aspect-[3/4] bg-gray-900 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
        >
          <Camera size={48} className="text-white/80 mb-3" />
          <p className="text-white/80 text-sm">INCI listesinin fotoğrafını çek</p>
          <p className="text-white/50 text-xs mt-1">veya galeriden seç</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleCapture(file);
            }}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <img src={preview} alt="INCI" className="w-full rounded-2xl max-h-48 object-cover" />

          {processing ? (
            <div className="flex items-center justify-center gap-2 py-6">
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-sm text-muted">INCI listesi okunuyor...</span>
            </div>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium mb-1 block">Okunan INCI Listesi</label>
                <textarea
                  value={ocrText}
                  onChange={(e) => setOcrText(e.target.value)}
                  rows={6}
                  placeholder="INCI listesi burada görünecek. Gerekirse düzenleyebilirsiniz..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface resize-none"
                />
                <p className="text-xs text-muted mt-1">Hatalı okuma varsa düzeltebilirsiniz</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => { setPreview(null); setOcrText(""); }} fullWidth>
                  Tekrar Çek
                </Button>
                <Button onClick={() => onResult(ocrText)} disabled={!ocrText.trim()} fullWidth>
                  Analiz Et
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
