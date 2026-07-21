"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSettings } from "@/context/SettingsContext";
import { useExpenses } from "@/hooks/useExpenses";
import { isToday, formatCurrency } from "@/lib/utils";

function getLastSentKey() {
  return "expensevault-last-notification-date";
}

/** Parse "HH:MM" to total minutes. Returns -1 if invalid. */
function timeToMinutes(t: string): number {
  const parts = t.split(":");
  if (parts.length !== 2) return -1;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return -1;
  return h * 60 + m;
}

export default function NotificationManager() {
  const { settings, currency } = useSettings();
  const { expenses } = useExpenses();
  const expensesRef = useRef(expenses);
  const currencyRef = useRef(currency);

  expensesRef.current = expenses;
  currencyRef.current = currency;

  const tryFire = useCallback(async () => {
    try {
      if (!settings?.notifyEnabled || !settings?.notifyTime) return;
      if (typeof window === "undefined") return;
      if (!("Notification" in window) || Notification.permission !== "granted") return;
      if (!("serviceWorker" in navigator)) return;

      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const targetMinutes = timeToMinutes(settings.notifyTime);
      if (targetMinutes < 0) return;

      const today = now.toISOString().split("T")[0];
      const lastSentDate = localStorage.getItem(getLastSentKey());
      if (lastSentDate === today) return;

      // Fire if the target time has passed (even if we missed the exact minute)
      if (currentMinutes < targetMinutes) return;

      const todayExpenses = expensesRef.current.filter((e) => isToday(e.date));
      const total = todayExpenses.reduce((s, e) => s + e.amount, 0);

      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification("ExpenseVault - Daily Summary", {
        body: `Today: ${todayExpenses.length} expense${todayExpenses.length !== 1 ? "s" : ""} · ${formatCurrency(total, currencyRef.current)} spent`,
        icon: "/icon-192.png",
        badge: "/icon-192.png",
        tag: "daily-summary",
        vibrate: [200, 100, 200],
      } as any);

      localStorage.setItem(getLastSentKey(), today);
    } catch {
      // silently ignore
    }
  }, [settings?.notifyEnabled, settings?.notifyTime]);

  useEffect(() => {
    tryFire();

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        tryFire();
      }
    };

    document.addEventListener("visibilitychange", onVisible);

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") tryFire();
    }, 30000);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      clearInterval(interval);
    };
  }, [tryFire]);

  return null;
}
