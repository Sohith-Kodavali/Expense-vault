"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { getMonthKey } from "@/lib/utils";
import { playSound } from "@/lib/sounds";
import type { Budget, Expense } from "@/lib/types";

interface BudgetProgressProps {
  expenses: Expense[];
  budget: Budget | null;
  currency?: string;
  onSetBudget: (amount: number) => void;
}

export default function BudgetProgress({ expenses, budget, currency = "₹", onSetBudget }: BudgetProgressProps) {
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState(budget?.amount?.toString() || "");

  const monthKey = getMonthKey();
  const monthExpenses = expenses.filter((e) => e.date.startsWith(monthKey));
  const totalSpent = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const budgetAmount = budget?.amount || 0;
  const percentage = budgetAmount > 0 ? Math.min((totalSpent / budgetAmount) * 100, 100) : 0;
  const isOverBudget = budgetAmount > 0 && totalSpent > budgetAmount;

  const handleSave = () => {
    const val = parseFloat(amount);
    if (val > 0) {
      onSetBudget(val);
      playSound("budget");
      setEditing(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Monthly Budget</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
        {!editing ? (
          <button onClick={() => { setAmount(budgetAmount > 0 ? budgetAmount.toString() : ""); setEditing(true); }}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors">
            {budgetAmount > 0 ? "Edit Budget" : "Set Budget"}
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount"
              className="w-24 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:border-violet-400"
              autoFocus onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false); }} />
            <button onClick={handleSave} className="text-xs font-semibold text-violet-600 dark:text-violet-400">Save</button>
            <button onClick={() => setEditing(false)} className="text-xs text-gray-400">Cancel</button>
          </div>
        )}
      </div>

      {budgetAmount > 0 ? (
        <>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Spent {currency}{totalSpent.toLocaleString("en-IN")}</span>
            <span className={`text-xs font-semibold ${isOverBudget ? "text-rose-600 dark:text-rose-400" : "text-gray-500 dark:text-gray-400"}`}>
              of {currency}{budgetAmount.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full ${
                isOverBudget ? "bg-gradient-to-r from-rose-500 to-red-500" : percentage > 80 ? "bg-gradient-to-r from-amber-400 to-orange-500" : "bg-gradient-to-r from-violet-500 to-indigo-500"
              }`}
            />
          </div>
          {isOverBudget && <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-2">Over budget by {currency}{(totalSpent - budgetAmount).toLocaleString("en-IN")}</p>}
          {!isOverBudget && percentage > 80 && <p className="text-xs text-amber-600 font-semibold mt-2">Almost at budget limit</p>}
        </>
      ) : (
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 flex items-center justify-center mx-auto mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          </div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">No budget set</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Track your monthly spending limit</p>
          <button
            onClick={() => { setAmount(""); setEditing(true); }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 active:scale-95 transition-all"
          >
            Set Budget
          </button>
        </div>
      )}
    </div>
  );
}
