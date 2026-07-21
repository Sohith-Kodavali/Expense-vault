"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Expense, Budget } from "@/lib/types";
import { getMonthKey } from "@/lib/utils";

interface BudgetAlertProps {
  expenses: Expense[];
  budget: Budget | null;
  currency?: string;
}

export default function BudgetAlert({ expenses, budget, currency = "₹" }: BudgetAlertProps) {
  const monthKey = getMonthKey();
  const spent = expenses.filter((e) => e.date.startsWith(monthKey)).reduce((s, e) => s + e.amount, 0);
  const limit = budget?.amount || 0;
  if (limit <= 0) return null;

  const pct = (spent / limit) * 100;
  const over = spent > limit;
  const near = pct >= 80 && !over;

  if (!over && !near) return null;

  const monthName = new Date().toLocaleDateString("en-US", { month: "long" });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="mx-4 sm:mx-6"
      >
        <div className={`rounded-2xl p-4 flex items-center gap-3 text-sm font-medium ${
          over
            ? "bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-rose-200"
            : "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-200"
        }`}>
          <span className="text-xl">{over ? "🚨" : "⚠️"}</span>
          <div className="flex-1">
            <p className="font-bold">
              {over
                ? `Over budget by ${currency}${(spent - limit).toLocaleString("en-IN")}`
                : `${Math.round(pct)}% of ${monthName} budget used`}
            </p>
            <p className="text-xs opacity-90 mt-0.5">
              Spent {currency}{spent.toLocaleString("en-IN")} of {currency}{limit.toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
