"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { UserSettings, CategoryItem, PredefinedExpense } from "@/lib/types";
import { DEFAULT_CATEGORIES } from "@/lib/types";
import { useUser } from "./UserContext";

interface SettingsContextType {
  settings: UserSettings | null;
  categories: CategoryItem[];
  loading: boolean;
  updateSettings: (data: Partial<UserSettings>) => void;
  updateCategories: (cats: CategoryItem[]) => void;
  predefinedExpenses: PredefinedExpense[];
  updatePredefinedExpenses: (pes: PredefinedExpense[]) => void;
  currency: string;
  theme: "light" | "dark";
}

const SettingsContext = createContext<SettingsContextType | null>(null);

function sk(userId: string) { return `expensevault-settings-${userId}`; }
function ck(userId: string) { return `expensevault-categories-${userId}`; }
function pek(userId: string) { return `expensevault-predefined-${userId}`; }

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { userId } = useUser();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES);
  const [predefinedExpenses, setPredefinedExpenses] = useState<PredefinedExpense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const s = localStorage.getItem(sk(userId));
      if (s) setSettings(JSON.parse(s));
      const c = localStorage.getItem(ck(userId));
      if (c) setCategories(JSON.parse(c));
      const p = localStorage.getItem(pek(userId));
      if (p) setPredefinedExpenses(JSON.parse(p));
    } catch { /* */ }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    const saved = localStorage.getItem("expensevault-theme");
    if (saved === "dark") document.documentElement.classList.add("dark");
  }, []);

  const updateSettings = useCallback((data: Partial<UserSettings>) => {
    setSettings((prev) => {
      const updated: UserSettings = prev
        ? { ...prev, ...data }
        : { id: "", userId, theme: (data.theme || "light") as "light" | "dark", currency: data.currency || "₹", notifyEnabled: data.notifyEnabled || false, notifyTime: data.notifyTime || "21:00", createdAt: Date.now(), updatedAt: Date.now(), ...data };
      localStorage.setItem(sk(userId), JSON.stringify(updated));
      if (data.theme) {
        localStorage.setItem("expensevault-theme", data.theme);
        document.documentElement.classList.toggle("dark", data.theme === "dark");
      }
      return updated;
    });
  }, [userId]);

  const updateCategories = useCallback((cats: CategoryItem[]) => {
    setCategories(cats);
    localStorage.setItem(ck(userId), JSON.stringify(cats));
  }, [userId]);

  const updatePredefinedExpenses = useCallback((pes: PredefinedExpense[]) => {
    setPredefinedExpenses(pes);
    localStorage.setItem(pek(userId), JSON.stringify(pes));
  }, [userId]);

  const currency = settings?.currency || "₹";
  const theme = settings?.theme || "light";

  return (
    <SettingsContext.Provider value={{ settings, categories, loading, updateSettings, updateCategories, predefinedExpenses, updatePredefinedExpenses, currency, theme }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
