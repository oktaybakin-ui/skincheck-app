"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useCabinet, CabinetItem } from "@/lib/hooks/useCabinet";
import { useAuthContext } from "@/lib/context/AuthContext";
import { useState } from "react";
import Link from "next/link";

type FilterType = "all" | "active" | "expiring" | "wishlist" | "favorites";

function daysUntilExpiry(expiryDate: string | null): number | null {
  if (!expiryDate) return null;
  const now = new Date();
  const exp = new Date(expiryDate);
  return Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function ExpiryBadge({ expiryDate }: { expiryDate: string | null }) {
  const days = daysUntilExpiry(expiryDate);
  if (days === null) return <Badge variant="muted" size="sm">SKT Yok</Badge>;
  if (days < 0) return <Badge variant="danger" size="sm">Süresi Doldu</Badge>;
  if (days <= 7) return <Badge variant="danger" size="sm">{days} gün kaldı</Badge>;
  if (days <= 30) return <Badge variant="warning" size="sm">{days} gün kaldı</Badge>;
  return <Badge variant="safe" size="sm">{days} gün kaldı</Badge>;
}

function CabinetItemCard({ item, onToggleFav, onRemove, onEdit }: {
  item: CabinetItem;
  onToggleFav: () => void;
  onRemove: () => void;
  onEdit: () => void;
}) {
  const product = item.product;
  return (
    <Card className="relative">
      <div className="flex gap-3">
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
          {product?.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl">{item.status === "wishlist" ? "💝" : "🧴"}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{product?.name || "Bilinmeyen Ürün"}</p>
              {product?.brand && <p className="text-xs text-muted">{product.brand}</p>}
            </div>
            <button onClick={onToggleFav} className="text-lg shrink-0">
              {item.is_favorite ? "❤️" : "🤍"}
            </button>
          </div>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <Badge variant={item.status === "active" ? "safe" : item.status === "wishlist" ? "info" : "muted"} size="sm">
              {item.status === "active" ? "Aktif" : item.status === "wishlist" ? "Wishlist" : item.status === "finished" ? "Bitti" : "Süresi Doldu"}
            </Badge>
            {item.status === "active" && <ExpiryBadge expiryDate={item.expiry_date} />}
            {item.routine_time && item.routine_time !== "none" && (
              <Badge variant="secondary" size="sm">
                {item.routine_time === "morning" ? "Sabah" : item.routine_time === "evening" ? "Akşam" : "Sabah+Akşam"}
              </Badge>
            )}
          </div>

          <div className="flex gap-2 mt-2">
            <Link href={`/product/${item.product_id}`} className="text-xs text-primary font-medium">
              Detay
            </Link>
            <button onClick={onEdit} className="text-xs text-muted hover:text-primary">Düzenle</button>
            <button onClick={onRemove} className="text-xs text-danger hover:text-danger/80">Kaldır</button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function CabinetPage() {
  const { user } = useAuthContext();
  const { items, loading, totalActive, totalWishlist, totalFavorite, expiringSoon, expired, toggleFavorite, removeItem, updateItem } = useCabinet();
  const [filter, setFilter] = useState<FilterType>("all");
  const [editItem, setEditItem] = useState<CabinetItem | null>(null);
  const [editForm, setEditForm] = useState({ status: "", expiry_date: "", opened_date: "", pao_months: "", routine_time: "", notes: "" });

  const filters: { key: FilterType; label: string; count?: number }[] = [
    { key: "all", label: "Tümü", count: items.length },
    { key: "active", label: "Aktif", count: totalActive },
    { key: "expiring", label: "SKT Uyarı", count: expiringSoon.length + expired.length },
    { key: "wishlist", label: "Wishlist", count: totalWishlist },
    { key: "favorites", label: "Favoriler", count: totalFavorite },
  ];

  const filteredItems = items.filter((i) => {
    switch (filter) {
      case "active": return i.status === "active";
      case "expiring": {
        const days = daysUntilExpiry(i.expiry_date);
        return i.status === "active" && days !== null && days <= 30;
      }
      case "wishlist": return i.status === "wishlist";
      case "favorites": return i.is_favorite;
      default: return true;
    }
  });

  const openEdit = (item: CabinetItem) => {
    setEditItem(item);
    setEditForm({
      status: item.status,
      expiry_date: item.expiry_date || "",
      opened_date: item.opened_date || "",
      pao_months: item.pao_months?.toString() || "",
      routine_time: item.routine_time || "none",
      notes: item.notes || "",
    });
  };

  const saveEdit = async () => {
    if (!editItem) return;
    await updateItem(editItem.id, {
      status: editForm.status as CabinetItem["status"],
      expiry_date: editForm.expiry_date || null,
      opened_date: editForm.opened_date || null,
      pao_months: editForm.pao_months ? parseInt(editForm.pao_months) : null,
      routine_time: (editForm.routine_time || "none") as CabinetItem["routine_time"],
      notes: editForm.notes || null,
    });
    setEditItem(null);
  };

  if (!user) {
    return (
      <>
        <Header title="Dolabım" />
        <main className="px-4 py-12 text-center">
          <span className="text-5xl">🔒</span>
          <p className="font-semibold mt-4">Giriş yapmalısın</p>
          <p className="text-sm text-muted mt-1">Dolabını kullanmak için giriş yap</p>
          <Link href="/login">
            <Button className="mt-4">Giriş Yap</Button>
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Dolabım" />
      <main className="px-4 py-4 space-y-4 pb-28">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="text-center">
            <p className="text-2xl font-bold text-primary">{totalActive}</p>
            <p className="text-xs text-muted">Aktif Ürün</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-danger">{expiringSoon.length + expired.length}</p>
            <p className="text-xs text-muted">SKT Uyarı</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-warning">{totalFavorite}</p>
            <p className="text-xs text-muted">Favori</p>
          </Card>
        </div>

        {/* Expiry Alerts */}
        {expired.length > 0 && (
          <Card className="border-danger/30 bg-danger/5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⚠️</span>
              <p className="font-bold text-sm text-danger">{expired.length} ürünün süresi doldu!</p>
            </div>
            <div className="space-y-1">
              {expired.slice(0, 3).map((i) => (
                <p key={i.id} className="text-xs text-muted">{i.product?.name} - {i.product?.brand}</p>
              ))}
            </div>
          </Card>
        )}

        {expiringSoon.length > 0 && (
          <Card className="border-warning/30 bg-warning/5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⏰</span>
              <p className="font-bold text-sm text-warning">{expiringSoon.length} ürünün süresi yaklaşıyor</p>
            </div>
            <div className="space-y-1">
              {expiringSoon.slice(0, 3).map((i) => (
                <p key={i.id} className="text-xs text-muted">{i.product?.name} - {daysUntilExpiry(i.expiry_date)} gün kaldı</p>
              ))}
            </div>
          </Card>
        )}

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
                filter === f.key
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-muted hover:bg-gray-200"
              }`}
            >
              {f.label}
              {f.count !== undefined && (
                <span className={`text-[10px] ${filter === f.key ? "text-white/70" : "text-muted"}`}>
                  ({f.count})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Items */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-5xl">{filter === "wishlist" ? "💝" : filter === "favorites" ? "❤️" : "🗄️"}</span>
            <p className="font-semibold mt-4">
              {filter === "all" ? "Dolabın boş" : `${filters.find(f => f.key === filter)?.label} kategorisinde ürün yok`}
            </p>
            <p className="text-sm text-muted mt-1">Ürün tarayarak dolabına ekle</p>
            <Link href="/scan">
              <Button className="mt-4">Ürün Tara</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <CabinetItemCard
                key={item.id}
                item={item}
                onToggleFav={() => toggleFavorite(item.id)}
                onRemove={() => removeItem(item.id)}
                onEdit={() => openEdit(item)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Edit Modal */}
      <Modal isOpen={!!editItem} onClose={() => setEditItem(null)} title="Ürünü Düzenle">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Durum</label>
            <select
              value={editForm.status}
              onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
            >
              <option value="active">Aktif</option>
              <option value="wishlist">Wishlist</option>
              <option value="finished">Bitti</option>
              <option value="expired">Süresi Doldu</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Açılma Tarihi</label>
            <input
              type="date"
              value={editForm.opened_date}
              onChange={(e) => setEditForm({ ...editForm, opened_date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Son Kullanma Tarihi</label>
            <input
              type="date"
              value={editForm.expiry_date}
              onChange={(e) => setEditForm({ ...editForm, expiry_date: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">PAO (Ay)</label>
            <input
              type="number"
              placeholder="12"
              value={editForm.pao_months}
              onChange={(e) => setEditForm({ ...editForm, pao_months: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
            />
            <p className="text-xs text-muted mt-1">Period After Opening - Açıldıktan sonra kaç ay kullanılabilir</p>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Rutin Zamanı</label>
            <select
              value={editForm.routine_time}
              onChange={(e) => setEditForm({ ...editForm, routine_time: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface"
            >
              <option value="none">Belirtilmedi</option>
              <option value="morning">Sabah</option>
              <option value="evening">Akşam</option>
              <option value="both">Sabah + Akşam</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Notlar</label>
            <textarea
              placeholder="Ürünle ilgili notlarınız..."
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none text-sm bg-surface resize-none"
            />
          </div>

          <Button onClick={saveEdit} fullWidth>Kaydet</Button>
        </div>
      </Modal>
    </>
  );
}
