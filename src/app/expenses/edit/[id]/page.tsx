"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useExpenses } from "@/hooks/useExpenses";
import { useToast } from "@/context/ToastContext";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import type { Expense } from "@/lib/types";

export default function EditExpensePage() {
  const { id } = useParams<{ id: string }>();
  const { expenses, update } = useExpenses();
  const { showToast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const expense = expenses.find((e) => e.id === id) || null;

  useEffect(() => {
    if (!fetching) return;
    const timer = setTimeout(() => setFetching(false), 300);
    return () => clearTimeout(timer);
  }, [fetching]);

  useEffect(() => {
    if (!fetching && !expense && expenses.length > 0) {
      showToast("Expense not found", "error");
      router.push("/expenses");
    }
  }, [fetching, expense, expenses, router, showToast]);

  const handleSubmit = async (data: Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt" | "isFavorite" | "isPinned">) => {
    setLoading(true);
    try { await update(id, data); showToast("Expense updated", "success"); router.push("/expenses"); }
    catch { showToast("Failed to update", "error"); }
    finally { setLoading(false); }
  };

  if (fetching || !expense) {
    return <div className="max-w-lg mx-auto px-4 pt-20 flex justify-center"><div className="w-10 h-10 rounded-2xl bg-violet-100 dark:bg-violet-900/30 animate-pulse" /></div>;
  }

  return (
    <div className="max-w-lg mx-auto w-full px-4 sm:px-6 space-y-5 pt-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Back
        </button>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </div>
          <div><h1 className="text-xl font-bold text-gray-900 dark:text-white">Edit Expense</h1><p className="text-sm text-gray-500 dark:text-gray-400">Modify your transaction</p></div>
        </div>
      </motion.div>
      <div className="glass-card rounded-2xl p-5 md:p-6">
        <ExpenseForm initialData={expense} onSubmit={handleSubmit} onCancel={() => router.back()} loading={loading} />
      </div>
    </div>
  );
}
