"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { formatCurrency, formatDate, formatTime, getCategoryInfo } from "@/lib/utils";
import type { Expense } from "@/lib/types";
import { PAYMENT_APPS } from "@/lib/types";

interface ExpenseCardProps {
  expense: Expense;
  onEdit?: (expense: Expense) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onTogglePin?: (id: string) => void;
}

export default function ExpenseCard({ expense, onEdit, onDelete, onToggleFavorite, onTogglePin }: ExpenseCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cat = getCategoryInfo(expense.category);

  return (
    <motion.div layout className="glass-card rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg" style={{ backgroundColor: `${cat.color}18` }}>
            {cat.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{expense.name}</span>
              {expense.isPinned && <span className="text-xs">📌</span>}
              {expense.isFavorite && <span className="text-xs">⭐</span>}
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold inline-block mt-0.5" style={{ backgroundColor: `${cat.color}18`, color: cat.color }}>
              {cat.label}
            </span>
            <div className="text-xs text-gray-400 mt-1">
              {formatDate(expense.date)}
              {expense.time && <span> · {formatTime(expense.time)}</span>}
              <span> · </span>
              {expense.paymentMode === "online"
                ? <span>💳 {PAYMENT_APPS.find(a => a.value === expense.paymentApp)?.label || "Online"}</span>
                : <span>💵 Cash</span>}
            </div>
          </div>
        </div>
        <div className="text-right shrink-0 ml-2">
          <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(expense.amount)}</span>
          {expense.notes && <p className="text-[11px] text-gray-400 mt-0.5 max-w-[120px] truncate">{expense.notes}</p>}
        </div>
      </div>

      <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        {onEdit && <button onClick={() => onEdit(expense)} className="flex-1 py-1.5 text-xs font-semibold text-gray-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">Edit</button>}
        {onTogglePin && (
          <button onClick={() => onTogglePin(expense.id)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${expense.isPinned ? "text-violet-600 bg-violet-50" : "text-gray-500 hover:text-violet-600 hover:bg-violet-50"}`}>
            {expense.isPinned ? "Unpin" : "Pin"}
          </button>
        )}
        {onToggleFavorite && (
          <button onClick={() => onToggleFavorite(expense.id)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${expense.isFavorite ? "text-amber-600 bg-amber-50" : "text-gray-500 hover:text-amber-600 hover:bg-amber-50"}`}>
            {expense.isFavorite ? "Unfav" : "Fav"}
          </button>
        )}
        {onDelete && (
          confirmDelete ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Sure?</span>
              <button onClick={() => { onDelete(expense.id); setConfirmDelete(false); }} className="px-2 py-1 text-xs font-semibold text-white bg-rose-500 rounded-md">Yes</button>
              <button onClick={() => setConfirmDelete(false)} className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded-md">No</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="flex-1 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">Delete</button>
          )
        )}
      </div>
    </motion.div>
  );
}
