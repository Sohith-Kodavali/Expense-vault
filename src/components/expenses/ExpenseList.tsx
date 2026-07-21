"use client";

import { AnimatePresence } from "framer-motion";
import ExpenseCard from "./ExpenseCard";
import EmptyState from "@/components/ui/EmptyState";
import type { Expense } from "@/lib/types";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onTogglePin: (id: string) => void;
  emptyMessage: string;
  emptyType?: "expenses" | "search";
}

export default function ExpenseList({ expenses, onEdit, onDelete, onToggleFavorite, onTogglePin, emptyMessage, emptyType = "expenses" }: ExpenseListProps) {
  if (expenses.length === 0) {
    return <EmptyState type={emptyType} title={emptyMessage} />;
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {expenses.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} onEdit={onEdit} onDelete={onDelete} onToggleFavorite={onToggleFavorite} onTogglePin={onTogglePin} />
        ))}
      </AnimatePresence>
    </div>
  );
}
