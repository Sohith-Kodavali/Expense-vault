"use client";

import { motion } from "framer-motion";
import type { Expense } from "@/lib/types";
import { formatCurrency, formatDate, getCategoryInfo } from "@/lib/utils";

interface RecentExpensesProps {
  expenses: Expense[];
  currency?: string;
  onToggleFavorite?: (id: string) => void;
  onTogglePin?: (id: string) => void;
}

export default function RecentExpenses({ expenses, currency = "₹", onToggleFavorite, onTogglePin }: RecentExpensesProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-gray-400 dark:text-gray-500">No expenses recorded yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-gray-800">
      {expenses.slice(0, 8).map((exp, idx) => {
        const cat = getCategoryInfo(exp.category);
        return (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="flex items-center justify-between py-3 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-lg" style={{ backgroundColor: `${cat.color}15` }}>
                {cat.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{exp.name}</span>
                  {exp.isPinned && <span className="text-[10px]">📌</span>}
                  {exp.isFavorite && <span className="text-[10px]">⭐</span>}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                  <span>{cat.label}</span>
                  <span className="text-gray-300 dark:text-gray-600">·</span>
                  <span>{formatDate(exp.date)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900 dark:text-white tabular-nums">
                {formatCurrency(exp.amount, currency)}
              </span>
              <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {onTogglePin && (
                  <button onClick={(e) => { e.stopPropagation(); onTogglePin(exp.id); }} className="w-6 h-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-xs" title={exp.isPinned ? "Unpin" : "Pin"}>📌</button>
                )}
                {onToggleFavorite && (
                  <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(exp.id); }} className="w-6 h-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-xs" title={exp.isFavorite ? "Remove favorite" : "Favorite"}>{exp.isFavorite ? "⭐" : "☆"}</button>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
