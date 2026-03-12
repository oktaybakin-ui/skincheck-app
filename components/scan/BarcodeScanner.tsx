"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  active: boolean;
}

export default function BarcodeScanner({ onScan, active }: BarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrcodeRef = useRef<unknown>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!active || !scannerRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let scanner: any = null;
    let unmounted = false;

    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (unmounted) return;
        const html5Qrcode = new Html5Qrcode("barcode-reader");
        html5QrcodeRef.current = html5Qrcode;
        scanner = html5Qrcode;

        await html5Qrcode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 150 },
            aspectRatio: 0.75,
          },
          (decodedText: string) => {
            if (unmounted) return;
            if (navigator.vibrate) navigator.vibrate(100);
            onScan(decodedText);
            html5Qrcode.stop().catch(() => {});
          },
          () => {}
        );
      } catch (err) {
        if (!unmounted) {
          setError("Kamera erişimi reddedildi veya kamera bulunamadı.");
        }
      }
    };

    startScanner();

    return () => {
      unmounted = true;
      if (scanner) {
        try {
          scanner.stop().catch(() => {});
        } catch {
          // scanner may already be stopped
        }
      }
    };
  }, [active, onScan]);

  if (error) {
    return (
      <div className="aspect-[3/4] bg-gray-900 rounded-2xl flex items-center justify-center p-6">
        <div className="text-center">
          <Camera size={40} className="text-white/80" />
          <p className="text-white/80 text-sm mt-3">{error}</p>
          <p className="text-white/50 text-xs mt-2">Tarayıcı ayarlarından kamera iznini kontrol edin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div id="barcode-reader" ref={scannerRef} className="rounded-2xl overflow-hidden" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-40">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-primary rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-primary rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-primary rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-primary rounded-br-lg" />
        </div>
      </div>
    </div>
  );
}
