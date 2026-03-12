"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Card from "@/components/ui/Card";
import { CalendarHeart, Droplets, ChevronLeft, ChevronRight, Egg, CalendarDays } from "lucide-react";

const CYCLE_KEY = "skincheck_period_data";
const DAY_NAMES = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];
const MONTH_NAMES = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

interface PeriodData {
  periods: string[]; // Array of period start dates (YYYY-MM-DD)
  cycleLength: number;
  periodLength: number;
}

function loadData(): PeriodData {
  if (typeof window === "undefined") return { periods: [], cycleLength: 28, periodLength: 5 };
  try {
    const raw = localStorage.getItem(CYCLE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate from old format
      if (parsed.lastPeriodStart && !parsed.periods) {
        return {
          periods: [parsed.lastPeriodStart],
          cycleLength: parsed.cycleLength || 28,
          periodLength: 5,
        };
      }
      return parsed;
    }
  } catch { /* ignore */ }
  return { periods: [], cycleLength: 28, periodLength: 5 };
}

function saveData(data: PeriodData) {
  localStorage.setItem(CYCLE_KEY, JSON.stringify(data));
}

function dateStr(d: Date): string {
  return d.toISOString().split("T")[0];
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function PeriodTracker() {
  const [data, setData] = useState<PeriodData>({ periods: [], cycleLength: 28, periodLength: 5 });
  const [showCalendar, setShowCalendar] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setData(loadData());
  }, []);

  const save = useCallback((newData: PeriodData) => {
    setData(newData);
    saveData(newData);
  }, []);

  const togglePeriodDate = useCallback((date: string) => {
    const newPeriods = data.periods.includes(date)
      ? data.periods.filter((d) => d !== date)
      : [...data.periods, date].sort();
    save({ ...data, periods: newPeriods });
  }, [data, save]);

  // Calculate cycle info from the most recent period
  const cycleInfo = useMemo(() => {
    if (data.periods.length === 0) return null;
    const sorted = [...data.periods].sort();
    const lastStart = new Date(sorted[sorted.length - 1]);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - lastStart.getTime()) / (1000 * 60 * 60 * 24));
    const dayInCycle = (diffDays % data.cycleLength) + 1;
    const daysUntilNext = data.cycleLength - (diffDays % data.cycleLength);
    const nextPeriod = addDays(today, daysUntilNext);
    const ovulationDay = data.cycleLength - 14;
    const daysUntilOvulation = ovulationDay - dayInCycle;
    const ovulationDate = addDays(today, daysUntilOvulation);

    let phase: string;
    let phaseColor: string;
    if (dayInCycle <= data.periodLength) { phase = "Regl Dönemi"; phaseColor = "text-danger"; }
    else if (dayInCycle <= ovulationDay - 3) { phase = "Foliküler Faz"; phaseColor = "text-safe"; }
    else if (dayInCycle <= ovulationDay + 2) { phase = "Ovülasyon"; phaseColor = "text-info"; }
    else { phase = "Luteal Faz"; phaseColor = "text-warning"; }

    return {
      dayInCycle,
      daysUntilNext,
      nextPeriod,
      ovulationDate,
      daysUntilOvulation,
      phase,
      phaseColor,
      progress: dayInCycle / data.cycleLength,
      lastStart,
    };
  }, [data]);

  // Calendar helpers
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // Monday = 0 start
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const days: (Date | null)[] = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }
    return days;
  }, [viewDate]);

  // Determine day type for calendar coloring
  const getDayType = useCallback((date: Date): string => {
    const ds = dateStr(date);
    const today = new Date();

    // Is this a marked period day?
    if (data.periods.includes(ds)) return "period";

    // Predicted period days (from last period + cycle length)
    if (data.periods.length > 0 && cycleInfo) {
      const lastStart = cycleInfo.lastStart;
      // Generate predicted periods (up to 3 future cycles)
      for (let cycle = 0; cycle <= 3; cycle++) {
        const predictedStart = addDays(lastStart, data.cycleLength * (cycle + 1));
        for (let d = 0; d < data.periodLength; d++) {
          if (isSameDay(date, addDays(predictedStart, d))) return "predicted-period";
        }
        // Ovulation window (ovulation day +/- 2)
        const ovDay = data.cycleLength - 14;
        const ovDate = addDays(predictedStart, ovDay - data.cycleLength);
        for (let d = -2; d <= 2; d++) {
          if (isSameDay(date, addDays(ovDate, d))) return "ovulation";
        }
      }
      // Current cycle ovulation
      const currentOvDate = addDays(lastStart, data.cycleLength - 14);
      for (let d = -2; d <= 2; d++) {
        if (isSameDay(date, addDays(currentOvDate, d))) return "ovulation";
      }
      // Current cycle period days (already marked ones handled above)
      for (let d = 0; d < data.periodLength; d++) {
        if (isSameDay(date, addDays(lastStart, d))) return "period";
      }
    }

    if (isSameDay(date, today)) return "today";
    return "normal";
  }, [data, cycleInfo]);

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  // No data yet - show setup
  if (data.periods.length === 0 && !showCalendar) {
    return (
      <section>
        <h3 className="text-lg font-bold mb-3">Regl Takibi</h3>
        <Card className="border-primary/20 bg-primary/5">
          <div className="flex items-center gap-3">
            <CalendarHeart size={28} className="text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold">Döngünü Takip Et</p>
              <p className="text-xs text-muted mt-0.5">Regl takibi ile cilt bakımını optimize et</p>
            </div>
            <button
              onClick={() => setShowCalendar(true)}
              className="bg-primary text-white text-xs font-medium px-3 py-1.5 rounded-lg"
            >
              Başla
            </button>
          </div>
        </Card>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold">Regl Takibi</h3>
        <button onClick={() => setShowCalendar(!showCalendar)} className="text-primary text-sm font-medium flex items-center gap-1">
          <CalendarDays size={14} />
          {showCalendar ? "Kapat" : "Takvim"}
        </button>
      </div>

      {/* Summary Card */}
      {cycleInfo && !showCalendar && (
        <Card>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#f0f0f0" strokeWidth="5" />
                <circle
                  cx="32" cy="32" r="28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeDasharray={`${cycleInfo.progress * 175.9} 175.9`}
                  strokeLinecap="round"
                  className={cycleInfo.phaseColor}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold">{cycleInfo.dayInCycle}. gün</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-bold ${cycleInfo.phaseColor}`}>{cycleInfo.phase}</p>
              <div className="flex items-center gap-1 mt-1">
                <Droplets size={12} className="text-danger" />
                <p className="text-xs text-muted">
                  Sonraki regl: <span className="font-medium text-foreground">{cycleInfo.daysUntilNext} gün</span> ({cycleInfo.nextPeriod.toLocaleDateString("tr-TR", { day: "numeric", month: "short" })})
                </p>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Egg size={12} className="text-info" />
                <p className="text-xs text-muted">
                  Tahmini yumurtlama: <span className="font-medium text-foreground">
                    {cycleInfo.daysUntilOvulation > 0
                      ? `${cycleInfo.daysUntilOvulation} gün`
                      : cycleInfo.daysUntilOvulation === 0
                        ? "Bugün"
                        : "Geçti"
                    }
                  </span> ({cycleInfo.ovulationDate.toLocaleDateString("tr-TR", { day: "numeric", month: "short" })})
                </p>
              </div>
              <p className="text-[10px] text-muted mt-1.5 leading-relaxed">
                {cycleInfo.dayInCycle <= data.periodLength && "Hassas cilt dönemi - nazik ürünler tercih et"}
                {cycleInfo.dayInCycle > data.periodLength && cycleInfo.dayInCycle <= data.cycleLength - 17 && "Cilt en parlak döneminde - yeni ürünler deneyebilirsin"}
                {cycleInfo.dayInCycle > data.cycleLength - 17 && cycleInfo.dayInCycle <= data.cycleLength - 12 && "Nem dengesi önemli - nemlendirici kullan"}
                {cycleInfo.dayInCycle > data.cycleLength - 12 && "Yağlanma artabilir - temizleyiciye önem ver"}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Calendar View */}
      {showCalendar && (
        <Card>
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-gray-100">
              <ChevronLeft size={18} className="text-muted" />
            </button>
            <p className="text-sm font-bold">
              {MONTH_NAMES[viewDate.getMonth()]} {viewDate.getFullYear()}
            </p>
            <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-gray-100">
              <ChevronRight size={18} className="text-muted" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAY_NAMES.map((d) => (
              <div key={d} className="text-center text-[10px] text-muted font-medium py-1">{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, i) => {
              if (!date) return <div key={`empty-${i}`} />;
              const type = getDayType(date);
              const ds = dateStr(date);
              const isToday = isSameDay(date, new Date());
              const isMarked = data.periods.includes(ds);

              let bgClass = "";
              if (type === "period") bgClass = "bg-danger/20 text-danger font-bold";
              else if (type === "predicted-period") bgClass = "bg-danger/10 text-danger/70 border border-dashed border-danger/30";
              else if (type === "ovulation") bgClass = "bg-info/15 text-info font-medium";
              else if (isToday) bgClass = "bg-primary/10 text-primary font-bold ring-1 ring-primary/30";

              return (
                <button
                  key={ds}
                  onClick={() => togglePeriodDate(ds)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-xs transition-all ${bgClass} ${!bgClass ? "hover:bg-gray-100" : ""} ${isMarked ? "ring-2 ring-danger" : ""}`}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-danger/20 ring-1 ring-danger" />
              <span className="text-[10px] text-muted">Regl günü</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-danger/10 border border-dashed border-danger/40" />
              <span className="text-[10px] text-muted">Tahmini regl</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-info/20" />
              <span className="text-[10px] text-muted">Yumurtlama</span>
            </div>
          </div>

          {/* Settings toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full text-center text-xs text-primary font-medium mt-3 pt-2 border-t border-gray-100"
          >
            {showSettings ? "Ayarları Gizle" : "Döngü Ayarları"}
          </button>

          {showSettings && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted">Döngü süresi (gün)</label>
                <input
                  type="number"
                  value={data.cycleLength}
                  onChange={(e) => save({ ...data, cycleLength: parseInt(e.target.value) || 28 })}
                  min="21"
                  max="40"
                  className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-xs text-center focus:outline-none focus:border-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted">Regl süresi (gün)</label>
                <input
                  type="number"
                  value={data.periodLength}
                  onChange={(e) => save({ ...data, periodLength: parseInt(e.target.value) || 5 })}
                  min="3"
                  max="8"
                  className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-xs text-center focus:outline-none focus:border-primary"
                />
              </div>
              {data.periods.length > 0 && (
                <button
                  onClick={() => { save({ periods: [], cycleLength: 28, periodLength: 5 }); setShowCalendar(false); }}
                  className="w-full text-xs text-danger py-1.5 border border-danger/20 rounded-lg mt-1"
                >
                  Tüm Verileri Sıfırla
                </button>
              )}
            </div>
          )}

          <p className="text-[10px] text-muted text-center mt-3">
            Regl günlerini takvimde isaretlemek icin günlere dokun
          </p>
        </Card>
      )}
    </section>
  );
}
