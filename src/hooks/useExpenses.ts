"use client";

import { useState, useEffect, useCallback } from "react";
import type { Expense, Budget, Balance } from "@/lib/types";
import { useUser } from "@/context/UserContext";

function storageKey(userId: string) { return `expensevault-expenses-${userId}`; }
function budgetKey(userId: string) { return `expensevault-budget-${userId}`; }
function balanceKey(userId: string) { return `expensevault-balance-${userId}`; }

function load<T>(key: string): T | null {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : null; }
  catch { return null; }
}
function save(key: string, data: unknown) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch { /* */ }
}

export function useExpenses() {
  const { userId } = useUser();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [deletedExpense, setDeletedExpense] = useState<Expense | null>(null);
  const [undoTimeout, setUndoTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setExpenses(load<Expense[]>(storageKey(userId)) || []);
    setBudget(load<Budget>(budgetKey(userId)));
    setBalance(load<Balance>(balanceKey(userId)));
    setLoading(false);
  }, [userId]);

  const loadBudget = useCallback((month: string) => {
    const b = load<Budget>(budgetKey(userId));
    setBudget(b);
  }, [userId]);

  const add = async (data: Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt" | "isFavorite" | "isPinned">) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const now = Date.now();
    const exp: Expense = { ...data, id, userId, isFavorite: false, isPinned: false, createdAt: now, updatedAt: now };
    const updated = [exp, ...expenses];
    setExpenses(updated);
    save(storageKey(userId), updated);
    return exp;
  };

  const update = async (id: string, data: Partial<Expense>) => {
    setExpenses((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, ...data, updatedAt: Date.now() } : e));
      save(storageKey(userId), updated);
      return updated;
    });
  };

  const remove = async (id: string) => {
    const expense = expenses.find((e) => e.id === id);
    if (!expense) return;
    setDeletedExpense(expense);
    setExpenses((prev) => {
      const filtered = prev.filter((e) => e.id !== id);
      save(storageKey(userId), filtered);
      return filtered;
    });
    const timeout = setTimeout(() => setDeletedExpense(null), 5000);
    setUndoTimeout(timeout);
  };

  const undoDelete = useCallback(() => {
    if (undoTimeout) { clearTimeout(undoTimeout); setUndoTimeout(null); }
    if (deletedExpense) {
      setExpenses((prev) => {
        const restored = [...prev, deletedExpense].sort((a, b) => b.createdAt - a.createdAt);
        save(storageKey(userId), restored);
        return restored;
      });
      setDeletedExpense(null);
    }
  }, [undoTimeout, deletedExpense, userId]);

  const toggleFavorite = (id: string) => {
    setExpenses((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, isFavorite: !e.isFavorite } : e));
      save(storageKey(userId), updated);
      return updated;
    });
  };

  const togglePin = (id: string) => {
    setExpenses((prev) => {
      const updated = prev.map((e) => (e.id === id ? { ...e, isPinned: !e.isPinned } : e));
      save(storageKey(userId), updated);
      return updated;
    });
  };

  const updateBudget = async (month: string, amount: number) => {
    const b: Budget = { id: month, userId, month, amount, createdAt: Date.now(), updatedAt: Date.now() };
    setBudget(b);
    save(budgetKey(userId), b);
  };

  const updateBalance = async (amount: number) => {
    const b: Balance = { id: userId, userId, amount, createdAt: Date.now(), updatedAt: Date.now() };
    setBalance(b);
    save(balanceKey(userId), b);
  };

  return { expenses, loading, budget, balance, deletedExpense, add, update, remove, undoDelete, toggleFavorite, togglePin, loadBudget, updateBudget, updateBalance, refresh: () => {} };
}
