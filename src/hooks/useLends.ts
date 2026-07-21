"use client";

import { useState, useEffect, useCallback } from "react";
import type { Lend } from "@/lib/types";
import { useUser } from "@/context/UserContext";

function key(userId: string) { return `expensevault-lends-${userId}`; }
function load<T>(k: string): T | null {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch { return null; }
}
function save(k: string, d: unknown) { try { localStorage.setItem(k, JSON.stringify(d)); } catch { /* */ } }

export function useLends() {
  const { userId } = useUser();
  const [lends, setLends] = useState<Lend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLends(load<Lend[]>(key(userId)) || []);
    setLoading(false);
  }, [userId]);

  const add = async (data: Omit<Lend, "id" | "userId" | "createdAt" | "updatedAt">) => {
    const now = Date.now();
    const id = now.toString(36) + Math.random().toString(36).slice(2, 7);
    const l: Lend = { ...data, id, userId, createdAt: now, updatedAt: now };
    const updated = [l, ...lends];
    setLends(updated);
    save(key(userId), updated);
    return l;
  };

  const update = async (id: string, data: Partial<Lend>) => {
    setLends((prev) => {
      const updated = prev.map((l) => (l.id === id ? { ...l, ...data, updatedAt: Date.now() } : l));
      save(key(userId), updated);
      return updated;
    });
  };

  const remove = async (id: string) => {
    setLends((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      save(key(userId), updated);
      return updated;
    });
  };

  const markReceived = async (id: string, amountReceived: number, totalAmount: number) => {
    const status: Lend["status"] = amountReceived >= totalAmount ? "received" : amountReceived > 0 ? "partial" : "pending";
    await update(id, { amountReceived, status });
  };

  return { lends, loading, add, update, remove, markReceived, refresh: () => {} };
}
