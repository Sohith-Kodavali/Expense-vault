"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useExpenses } from "@/hooks/useExpenses";
import { useToast } from "@/context/ToastContext";
import SearchFilter from "@/components/expenses/SearchFilter";
import ExpenseList from "@/components/expenses/ExpenseList";
import FloatingButton from "@/components/common/FloatingButton";
import { ExpenseCardSkeleton } from "@/components/ui/Skeleton";
import type { Expense } from "@/lib/types";
import { filterExpenses } from "@/lib/utils";
import { playSound } from "@/lib/sounds";
import { vibrate } from "@/lib/haptics";

export default function ExpensesPage() {
  const { expenses, loading, remove, undoDelete, toggleFavorite, togglePin } = useExpenses();
  const { showToast } = useToast();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const [sortField, sortDir] = sortBy.split("-") as ["date" | "amount", "asc" | "desc"];

  const filteredExpenses = useMemo(
    () => filterExpenses(expenses, search, filter as "all" | "today" | "yesterday" | "thisWeek" | "thisMonth" | "custom", customStart, customEnd, categoryFilter, sortField, sortDir),
    [expenses, search, filter, categoryFilter, sortField, sortDir, customStart, customEnd]
  );

  const handleDelete = (id: string) => { remove(id); vibrate(20); playSound("delete"); showToast("Expense deleted", "undo", { label: "Undo", onClick: undoDelete }); };
  const handleTogglePin = (id: string) => { togglePin(id); playSound("pin"); };
  const handleToggleFav = (id: string) => { toggleFavorite(id); playSound("fav"); };
  const handleEdit = (expense: Expense) => { router.push(`/expenses/edit/${expense.id}`); };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 space-y-5 pt-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"/></svg>
          </div>
          <div><h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Expenses</h1><p className="text-sm text-gray-500 dark:text-gray-400">{filteredExpenses.length} expense{filteredExpenses.length !== 1 ? "s" : ""} found</p></div>
        </div>
      </motion.div>

      <SearchFilter search={search} onSearchChange={setSearch} filter={filter} onFilterChange={setFilter} categoryFilter={categoryFilter} onCategoryFilterChange={setCategoryFilter} sortBy={sortBy} onSortByChange={setSortBy} customStart={customStart} onCustomStartChange={setCustomStart} customEnd={customEnd} onCustomEndChange={setCustomEnd} />

      {loading ? <div className="space-y-3">{[1,2,3,4,5].map(i => <ExpenseCardSkeleton key={i} />)}</div> : (
        <ExpenseList expenses={filteredExpenses} onEdit={handleEdit} onDelete={handleDelete} onToggleFavorite={handleToggleFav} onTogglePin={handleTogglePin} emptyMessage={search || filter !== "all" ? "No matching expenses" : "No expenses yet"} emptyType={search || filter !== "all" ? "search" : "expenses"} />
      )}

      <FloatingButton />
    </div>
  );
}
