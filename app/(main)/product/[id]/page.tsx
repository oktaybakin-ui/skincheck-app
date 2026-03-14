"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { supabase } from "@/lib/supabase";
import { useAuthContext } from "@/lib/context/AuthContext";
import { SAFETY_SCORE_RANGES, RISK_LEVELS } from "@/lib/constants";
import { FlaskConical, CheckCircle, AlertTriangle, XCircle, HelpCircle, ChevronUp, ChevronDown } from "lucide-react";
import SocialMediaSearch from "@/components/ui/SocialMediaSearch";

interface Product {
  id: string;
  name: string;
  brand: string | null;
  category: string | null;
  image_url: string | null;
  ingredients: string[] | null;
  barcode: string | null;
}

interface IngredientAnalysis {
  common_name_tr: string;
  simple_explanation: string;
  function: string;
  risk_assessment: {
    general: string;
    for_skin_type: string;
    pregnancy: string;
    reasoning: string;
  };
  comedogenic_score: number;
  irritancy_score: number;
  good_for: string[];
  bad_for: string[];
  alternatives: string[];
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { profile, user } = useAuthContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState<Record<string, IngredientAnalysis>>({});
  const [expandedIngredient, setExpandedIngredient] = useState<string | null>(null);
  const [analyzingIngredient, setAnalyzingIngredient] = useState<string | null>(null);
  const [showCabinetModal, setShowCabinetModal] = useState(false);
  const [cabinetForm, setCabinetForm] = useState({ status: "active", expiry_date: "", opened_date: "", pao_months: "", routine_time: "none" });
  const [addingToCabinet, setAddingToCabinet] = useState(false);
  const [addedToCabinet, setAddedToCabinet] = useState(false);

  const handleAddToCabinet = async () => {
    if (!user || !product) return;
    setAddingToCabinet(true);
    const { error } = await supabase.from("user_cabinet").insert({
      user_id: user.id,
      product_id: product.id,
      status: cabinetForm.status,
      expiry_date: cabinetForm.expiry_date || null,
      opened_date: cabinetForm.opened_date || null,
      pao_months: cabinetForm.pao_months ? parseInt(cabinetForm.pao_months) : null,
      routine_time: cabinetForm.routine_time,
    });
    setAddingToCabinet(false);
    if (!error) {
      setAddedToCabinet(true);
      setShowCabinetModal(false);
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      setProduct(data);
      setLoading(false);
    };
    if (id) fetchProduct();
  }, [id]);

  const analyzeIngredient = async (inci: string) => {
    if (analyses[inci]) {
      setExpandedIngredient(expandedIngredient === inci ? null : inci);
      return;
    }

    setAnalyzingIngredient(inci);
    setExpandedIngredient(inci);

    try {
      const res = await fetch("/api/analyze-ingredient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          inci_name: inci,
          user_skin_type: profile?.skin_type,
          user_condition: profile?.special_condition,
        }),
      });
      const data = await res.json();
      setAnalyses((prev) => ({ ...prev, [inci]: data }));
    } catch {
      // silently fail
    }
    setAnalyzingIngredient(null);
  };

  const calculateSafetyScore = (): number => {
    if (!product?.ingredients?.length) return 75;
    const analyzed = Object.values(analyses);
    if (analyzed.length === 0) return 75;

    let score = 100;
    for (const a of analyzed) {
      const risk = a.risk_assessment?.general;
      if (risk === "high") score -= 20;
      else if (risk === "moderate") score -= 10;
      else if (risk === "low") score -= 3;
    }
    return Math.max(0, Math.min(100, score));
  };

  const getScoreInfo = (score: number) => {
    return SAFETY_SCORE_RANGES.find((r) => score >= r.min && score <= r.max) || SAFETY_SCORE_RANGES[0];
  };

  const getRiskBadge = (risk: string) => {
    const info = RISK_LEVELS[risk as keyof typeof RISK_LEVELS];
    if (!info) return <Badge variant="muted">Bilinmiyor</Badge>;
    const variantMap: Record<string, "safe" | "warning" | "danger"> = {
      safe: "safe", low: "warning", moderate: "warning", high: "danger",
    };
    return <Badge variant={variantMap[risk] || "muted"}>{info.label}</Badge>;
  };

  if (loading) {
    return (
      <>
        <Header title="Ürün Detay" showBack />
        <main className="px-4 py-20 text-center">
          <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header title="Ürün Detay" showBack />
        <main className="px-4 py-20 text-center">
          <p className="text-muted">Ürün bulunamadı</p>
        </main>
      </>
    );
  }

  const safetyScore = calculateSafetyScore();
  const scoreInfo = getScoreInfo(safetyScore);
  const borderColor = safetyScore >= 80 ? "border-safe" : safetyScore >= 60 ? "border-warning" : safetyScore >= 40 ? "border-orange-500" : "border-danger";
  const textColor = safetyScore >= 80 ? "text-safe" : safetyScore >= 60 ? "text-warning" : safetyScore >= 40 ? "text-orange-500" : "text-danger";

  return (
    <>
      <Header title="Ürün Detay" showBack />
      <main className="px-4 py-4 space-y-4">
        {/* Product Header */}
        <Card>
          <div className="flex gap-4">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-20 h-20 rounded-xl object-cover" />
            ) : (
              <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center">
                <FlaskConical className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              {product.brand && <p className="text-xs text-muted">{product.brand}</p>}
              <h2 className="font-bold text-lg leading-tight">{product.name}</h2>
              {product.category && <Badge variant="primary" className="mt-1">{product.category}</Badge>}
              {product.barcode && <p className="text-xs text-muted mt-1">Barkod: {product.barcode}</p>}
            </div>
          </div>
        </Card>

        {/* Safety Score */}
        <Card className="text-center">
          <p className="text-sm text-muted mb-2">Güvenlik Skoru</p>
          <div className={`w-24 h-24 mx-auto rounded-full border-4 ${borderColor} flex items-center justify-center`}>
            <span className={`text-3xl font-bold ${textColor}`}>{safetyScore}</span>
          </div>
          <p className={`${textColor} font-semibold mt-2 flex items-center justify-center gap-1.5`}>
            <span className={`w-3 h-3 rounded-full inline-block ${scoreInfo.emoji === "safe" ? "bg-safe" : scoreInfo.emoji === "warning" ? "bg-warning" : scoreInfo.emoji === "orange" ? "bg-orange-500" : "bg-danger"}`} />
            {scoreInfo.label}
          </p>
        </Card>

        {/* Personal Fit */}
        {profile && (
          <Card>
            <h3 className="font-bold text-sm mb-3">Senin Cildine Uygunluğu</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Cilt tipi</span>
                <span className="font-medium">{profile.skin_type || "Belirtilmemiş"}</span>
              </div>
              {profile.special_condition === "pregnant" && (
                <div className="flex justify-between">
                  <span className="text-muted">Hamilelik güvenliği</span>
                  <span className="text-safe font-medium">Analiz için içeriklere tıkla</span>
                </div>
              )}
              {profile.allergies && profile.allergies.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted">Alerjen kontrolü</span>
                  <span className="font-medium">Aktif</span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Ingredients List */}
        <Card>
          <h3 className="font-bold text-sm mb-3">
            İçerik Listesi ({product.ingredients?.length || 0} madde)
          </h3>
          {product.ingredients && product.ingredients.length > 0 ? (
            <div className="space-y-2">
              {product.ingredients.map((inci, idx) => {
                const analysis = analyses[inci];
                const isExpanded = expandedIngredient === inci;
                const isAnalyzing = analyzingIngredient === inci;

                return (
                  <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden">
                    <button
                      onClick={() => analyzeIngredient(inci)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <span className="text-sm font-medium">{inci}</span>
                        {analysis && (
                          <span className="ml-2">{getRiskBadge(analysis.risk_assessment?.general)}</span>
                        )}
                      </div>
                      <span className="text-muted">{isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</span>
                    </button>

                    {isExpanded && (
                      <div className="px-3 pb-3 border-t border-gray-50">
                        {isAnalyzing ? (
                          <div className="flex items-center gap-2 py-4">
                            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                            <span className="text-xs text-muted">Analiz ediliyor...</span>
                          </div>
                        ) : analysis ? (
                          <div className="space-y-3 pt-3">
                            {analysis.common_name_tr && (
                              <p className="text-xs"><span className="text-muted">Türkçe:</span> <strong>{analysis.common_name_tr}</strong></p>
                            )}
                            <p className="text-sm text-muted">{analysis.simple_explanation}</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <span className="text-muted">Fonksiyon:</span>
                                <p className="font-medium">{analysis.function}</p>
                              </div>
                              <div>
                                <span className="text-muted">Komedojenik:</span>
                                <p className="font-medium">{analysis.comedogenic_score}/5</p>
                              </div>
                              <div>
                                <span className="text-muted">Tahriş:</span>
                                <p className="font-medium">{analysis.irritancy_score}/5</p>
                              </div>
                              {analysis.risk_assessment?.pregnancy && (
                                <div>
                                  <span className="text-muted">Hamilelik:</span>
                                  <p className="font-medium flex items-center gap-1">
                                    {analysis.risk_assessment.pregnancy === "safe" ? <><CheckCircle className="w-4 h-4 text-safe inline" /> Güvenli</> :
                                     analysis.risk_assessment.pregnancy === "caution" ? <><AlertTriangle className="w-4 h-4 text-warning inline" /> Dikkat</> :
                                     analysis.risk_assessment.pregnancy === "avoid" ? <><XCircle className="w-4 h-4 text-danger inline" /> Kaçın</> : <><HelpCircle className="w-4 h-4 text-muted inline" /> Bilinmiyor</>}
                                  </p>
                                </div>
                              )}
                            </div>
                            {analysis.risk_assessment?.reasoning && (
                              <p className="text-xs text-muted italic">{analysis.risk_assessment.reasoning}</p>
                            )}
                            {analysis.alternatives?.length > 0 && (
                              <div className="text-xs">
                                <span className="text-muted">Alternatifler:</span>
                                <p className="font-medium">{analysis.alternatives.join(", ")}</p>
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted text-center py-4">İçerik listesi bulunamadı</p>
          )}
        </Card>

        {/* Social Media Reviews */}
        <Card>
          <SocialMediaSearch productName={product.name} brand={product.brand} />
        </Card>

        {/* Actions */}
        <div className="flex gap-3">
          {addedToCabinet ? (
            <Button variant="outline" fullWidth disabled>Dolabına Eklendi ✓</Button>
          ) : (
            <Button variant="primary" fullWidth onClick={() => user ? setShowCabinetModal(true) : null}>
              Dolabıma Ekle
            </Button>
          )}
          <Button variant="outline" fullWidth>Yorum Yaz</Button>
        </div>
      </main>

      {/* Add to Cabinet Modal */}
      <Modal isOpen={showCabinetModal} onClose={() => setShowCabinetModal(false)} title="Dolabıma Ekle">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Durum</label>
            <select
              value={cabinetForm.status}
              onChange={(e) => setCabinetForm({ ...cabinetForm, status: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
            >
              <option value="active">Aktif (Kullanıyorum)</option>
              <option value="wishlist">Wishlist (Almak İstiyorum)</option>
            </select>
          </div>

          {cabinetForm.status === "active" && (
            <>
              <div>
                <label className="text-sm font-medium mb-1 block">Açılma Tarihi</label>
                <input
                  type="date"
                  value={cabinetForm.opened_date}
                  onChange={(e) => setCabinetForm({ ...cabinetForm, opened_date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Son Kullanma Tarihi</label>
                <input
                  type="date"
                  value={cabinetForm.expiry_date}
                  onChange={(e) => setCabinetForm({ ...cabinetForm, expiry_date: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">PAO (Ay)</label>
                <input
                  type="number"
                  placeholder="12"
                  value={cabinetForm.pao_months}
                  onChange={(e) => setCabinetForm({ ...cabinetForm, pao_months: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Rutin</label>
                <select
                  value={cabinetForm.routine_time}
                  onChange={(e) => setCabinetForm({ ...cabinetForm, routine_time: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
                >
                  <option value="none">Belirtilmedi</option>
                  <option value="morning">Sabah</option>
                  <option value="evening">Akşam</option>
                  <option value="both">Sabah + Akşam</option>
                </select>
              </div>
            </>
          )}

          <Button onClick={handleAddToCabinet} loading={addingToCabinet} fullWidth>
            Ekle
          </Button>
        </div>
      </Modal>
    </>
  );
}
