"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExpenses } from "@/hooks/useExpenses";
import { useSettings } from "@/context/SettingsContext";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DEFAULT_CATEGORIES } from "@/lib/types";
import type { Expense } from "@/lib/types";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const { expenses } = useExpenses();
  const { currency, categories } = useSettings();
  const allCats = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;

  const monthExpenses = useMemo(
    () => expenses.filter((e) => e.date.startsWith(monthKey)),
    [expenses, monthKey]
  );

  const dayMap = useMemo(() => {
    const map: Record<string, { expenses: Expense[]; total: number }> = {};
    monthExpenses.forEach((e) => {
      if (!map[e.date]) map[e.date] = { expenses: [], total: 0 };
      map[e.date].expenses.push(e);
      map[e.date].total += e.amount;
    });
    return map;
  }, [monthExpenses]);

  const maxDayTotal = Math.max(...Object.values(dayMap).map((d) => d.total), 1);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthTotal = monthExpenses.reduce((s, e) => s + e.amount, 0);

  const prevMonth = () => { if (month === 0) { setYear(year - 1); setMonth(11); } else setMonth(month - 1); };
  const nextMonth = () => { if (month === 11) { setYear(year + 1); setMonth(0); } else setMonth(month + 1); };
  const goToday = () => { setYear(today.getFullYear()); setMonth(today.getMonth()); };

  const selectedDayData = selectedDate ? dayMap[selectedDate] : null;
  const monthName = new Date(year, month).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 space-y-5 pt-6 pb-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Calendar</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatCurrency(monthTotal, currency)} this month</p>
          </div>
        </div>
      </motion.div>

      {/* Month Navigator */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <button onClick={goToday} className="text-lg font-bold text-gray-900 dark:text-white hover:text-violet-600 transition-colors">
          {monthName}
        </button>
        <button onClick={nextMonth} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      {/* Calendar Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={monthKey}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="glass-card rounded-2xl p-4"
        >
          <div className="grid grid-cols-7 gap-1">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-[11px] font-semibold text-gray-400 uppercase py-2">{d}</div>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <div key={`e${i}`} className="aspect-square" />;

            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const data = dayMap[dateStr];
            const isToday = dateStr === today.toISOString().split("T")[0];
            const isSelected = dateStr === selectedDate;
            const intensity = data ? data.total / maxDayTotal : 0;

            return (
              <motion.button
                key={dateStr}
                whileTap={{ scale: 0.92 }}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs transition-all relative
                  ${isToday ? "ring-2 ring-violet-400" : ""}
                  ${isSelected ? "bg-violet-600 text-white shadow-lg" : "hover:bg-gray-100 dark:hover:bg-gray-800"}
                `}
                style={!isSelected && data ? {
                  backgroundColor: `rgba(124, 58, 237, ${0.1 + intensity * 0.4})`,
                } : {}}
              >
                <span className={`font-semibold ${isSelected ? "text-white" : isToday ? "text-violet-600" : "text-gray-700 dark:text-gray-300"}`}>
                  {day}
                </span>
                {data && (
                  <span className={`text-[9px] font-bold ${isSelected ? "text-white/80" : "text-violet-500"}`}>
                    {formatCurrency(data.total, currency)}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
        </motion.div>
      </AnimatePresence>

      {/* Day Detail Modal */}
      <Modal isOpen={!!selectedDate} onClose={() => setSelectedDate(null)} title={selectedDate ? formatDate(selectedDate) : ""} size="md">
        {selectedDayData && selectedDayData.expenses.length > 0 ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total: <strong>{formatCurrency(selectedDayData.total, currency)}</strong> · {selectedDayData.expenses.length} expense{selectedDayData.expenses.length > 1 ? "s" : ""}
            </p>
            {selectedDayData.expenses.map((exp) => {
              const cat = allCats.find((c) => c.value === exp.category);
              return (
                <div key={exp.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-lg">{cat?.icon || "📌"}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{exp.name}</p>
                      <p className="text-xs text-gray-400">
                        {cat?.label || exp.category}
                        {exp.paymentMode === "online" ? " · 💳" : " · 💵"}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white ml-2 shrink-0">
                    {formatCurrency(exp.amount, currency)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState title="No expenses" description={`No expenses on ${selectedDate ? formatDate(selectedDate) : "this day"}`} />
        )}
      </Modal>
    </div>
  );
}
