"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useExpenses } from "@/hooks/useExpenses";
import { useToast } from "@/context/ToastContext";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import type { Expense } from "@/lib/types";
import { useState } from "react";

export default function AddExpensePage() {
  const { add } = useExpenses();
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt" | "isFavorite" | "isPinned">) => {
    setLoading(true);
    try {
      await add(data);
      showToast("Expense added successfully", "success");
      router.push("/expenses");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add";
      showToast(msg, "error");
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-lg mx-auto w-full px-4 sm:px-6 space-y-5 pt-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Back
        </button>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </div>
          <div><h1 className="text-xl font-bold text-gray-900 dark:text-white">Add Expense</h1><p className="text-sm text-gray-500 dark:text-gray-400">Record a new transaction</p></div>
        </div>
      </motion.div>
      <div className="glass-card rounded-2xl p-5 md:p-6">
        <ExpenseForm onSubmit={handleSubmit} onCancel={() => router.back()} loading={loading} />
      </div>
    </div>
  );
}
