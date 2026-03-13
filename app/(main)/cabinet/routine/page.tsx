"use client";

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useRoutine, RoutineItem } from "@/lib/hooks/useRoutine";
import { useCabinet } from "@/lib/hooks/useCabinet";
import { useAuthContext } from "@/lib/context/AuthContext";
import { useState } from "react";
import Link from "next/link";
import { Lock, Sun, Moon, Plus, Trash2, GripVertical, FlaskConical, ChevronLeft, ChevronRight } from "lucide-react";

const DAY_NAMES_FULL = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
const DAY_NAMES_SHORT = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];

function RoutineProductCard({ item, onRemove }: { item: RoutineItem; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
      <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
        {item.product?.image_url ? (
          <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
        ) : (
          <FlaskConical className="w-5 h-5 text-gray-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.product?.name || "Ürün"}</p>
        {item.product?.brand && <p className="text-xs text-muted">{item.product.brand}</p>}
      </div>
      <button onClick={onRemove} className="text-gray-400 hover:text-danger transition-colors shrink-0">
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export default function RoutinePage() {
  const { user } = useAuthContext();
  const { items: routineItems, loading, todayMorning, todayEvening, getRoutineForDay, addItem, removeItem, DAY_NAMES } = useRoutine();
  const { items: cabinetItems } = useCabinet();
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [showAddModal, setShowAddModal] = useState(false);
  const [addTimeOfDay, setAddTimeOfDay] = useState<"morning" | "evening" | "both">("morning");
  const [view, setView] = useState<"today" | "week">("today");

  const activeProducts = cabinetItems.filter(i => i.status === "active");
  const routineProductIds = new Set(routineItems.map(i => i.product_id));
  const availableProducts = activeProducts.filter(p => !routineProductIds.has(p.product_id));

  const dayRoutine = getRoutineForDay(selectedDay);

  const handleAdd = async (productId: string) => {
    await addItem(productId, addTimeOfDay, [0, 1, 2, 3, 4, 5, 6]);
    setShowAddModal(false);
  };

  if (!user) {
    return (
      <>
        <Header title="Bakım Rutini" />
        <main className="px-4 py-12 text-center">
          <Lock className="w-12 h-12 text-gray-400 mx-auto" />
          <p className="font-semibold mt-4">Giriş yapmalısın</p>
          <p className="text-sm text-muted mt-1">Rutin takvimini kullanmak için giriş yap</p>
          <Link href="/login"><Button className="mt-4">Giriş Yap</Button></Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title="Bakım Rutini" />
      <main className="px-4 py-4 space-y-4 pb-28">
        {/* View Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setView("today")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${view === "today" ? "bg-white shadow-sm text-primary" : "text-muted"}`}
          >
            Bugün
          </button>
          <button
            onClick={() => setView("week")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${view === "week" ? "bg-white shadow-sm text-primary" : "text-muted"}`}
          >
            Haftalık
          </button>
        </div>

        {view === "today" ? (
          <>
            {/* Today's Routine */}
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Sun className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm">Sabah Rutini</h3>
                <Badge variant="primary" size="sm">{todayMorning.length} ürün</Badge>
              </div>
              {todayMorning.length === 0 ? (
                <p className="text-sm text-muted text-center py-4">Sabah rutini boş</p>
              ) : (
                <div className="space-y-2">
                  {todayMorning.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <span className="text-xs text-muted w-5 text-center">{idx + 1}</span>
                      <div className="flex-1 flex items-center gap-2 p-2 bg-amber-50 rounded-lg">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                          {item.product?.image_url ? (
                            <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <FlaskConical className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate">{item.product?.name}</p>
                          {item.product?.category && <p className="text-[10px] text-muted">{item.product.category}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Moon className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-sm">Akşam Rutini</h3>
                <Badge variant="info" size="sm">{todayEvening.length} ürün</Badge>
              </div>
              {todayEvening.length === 0 ? (
                <p className="text-sm text-muted text-center py-4">Akşam rutini boş</p>
              ) : (
                <div className="space-y-2">
                  {todayEvening.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <span className="text-xs text-muted w-5 text-center">{idx + 1}</span>
                      <div className="flex-1 flex items-center gap-2 p-2 bg-indigo-50 rounded-lg">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                          {item.product?.image_url ? (
                            <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <FlaskConical className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium truncate">{item.product?.name}</p>
                          {item.product?.category && <p className="text-[10px] text-muted">{item.product.category}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </>
        ) : (
          <>
            {/* Week View - Day Selector */}
            <div className="flex gap-1.5">
              {DAY_NAMES_SHORT.map((day, idx) => {
                const isToday = idx === new Date().getDay();
                const hasRoutine = getRoutineForDay(idx).morning.length > 0 || getRoutineForDay(idx).evening.length > 0;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDay(idx)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium transition-colors relative ${
                      selectedDay === idx
                        ? "bg-primary text-white"
                        : isToday
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-100 text-muted"
                    }`}
                  >
                    {day}
                    {hasRoutine && selectedDay !== idx && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            <h3 className="font-bold text-sm">{DAY_NAMES_FULL[selectedDay]}</h3>

            {/* Morning for selected day */}
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Sun className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-sm">Sabah</h3>
                <Badge variant="primary" size="sm">{dayRoutine.morning.length}</Badge>
              </div>
              {dayRoutine.morning.length === 0 ? (
                <p className="text-xs text-muted text-center py-3">Ürün eklenmemiş</p>
              ) : (
                <div className="space-y-2">
                  {dayRoutine.morning.map(item => (
                    <RoutineProductCard key={item.id} item={item} onRemove={() => removeItem(item.id)} />
                  ))}
                </div>
              )}
            </Card>

            {/* Evening for selected day */}
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <Moon className="w-5 h-5 text-indigo-500" />
                <h3 className="font-semibold text-sm">Akşam</h3>
                <Badge variant="info" size="sm">{dayRoutine.evening.length}</Badge>
              </div>
              {dayRoutine.evening.length === 0 ? (
                <p className="text-xs text-muted text-center py-3">Ürün eklenmemiş</p>
              ) : (
                <div className="space-y-2">
                  {dayRoutine.evening.map(item => (
                    <RoutineProductCard key={item.id} item={item} onRemove={() => removeItem(item.id)} />
                  ))}
                </div>
              )}
            </Card>
          </>
        )}

        {/* Add Button */}
        <Button
          fullWidth
          variant="outline"
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Rutine Ürün Ekle
        </Button>

        {/* Quick Link to Cabinet */}
        {activeProducts.length === 0 && (
          <div className="text-center py-4">
            <p className="text-sm text-muted">Dolabında aktif ürün yok</p>
            <Link href="/scan">
              <Button variant="ghost" size="sm" className="mt-2">Ürün Tara ve Ekle</Button>
            </Link>
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Rutine Ürün Ekle">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Rutin Zamanı</label>
            <div className="flex gap-2">
              {[
                { key: "morning" as const, label: "Sabah", icon: <Sun size={14} /> },
                { key: "evening" as const, label: "Akşam", icon: <Moon size={14} /> },
                { key: "both" as const, label: "İkisi de", icon: null },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setAddTimeOfDay(opt.key)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-1 transition-colors ${
                    addTimeOfDay === opt.key ? "bg-primary text-white" : "bg-gray-100 text-muted"
                  }`}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Dolabındaki Ürünler</label>
            {availableProducts.length === 0 ? (
              <p className="text-sm text-muted text-center py-6">
                {activeProducts.length === 0 ? "Dolabında aktif ürün yok" : "Tüm ürünler zaten rutinde"}
              </p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {availableProducts.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleAdd(item.product_id)}
                    className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-primary/5 rounded-xl transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                      {item.product?.image_url ? (
                        <img src={item.product.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <FlaskConical className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product?.name}</p>
                      {item.product?.brand && <p className="text-xs text-muted">{item.product.brand}</p>}
                    </div>
                    <Plus size={18} className="text-primary shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
