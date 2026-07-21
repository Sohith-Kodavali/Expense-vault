"use client";

import { useEffect, useRef } from "react";
import { useSettings } from "@/context/SettingsContext";
import { useExpenses } from "@/hooks/useExpenses";
import { isToday, formatCurrency } from "@/lib/utils";

export default function NotificationManager() {
  const { settings, currency } = useSettings();
  const { expenses } = useExpenses();
  const lastSent = useRef("");
  const expensesRef = useRef(expenses);
  const currencyRef = useRef(currency);

  expensesRef.current = expenses;
  currencyRef.current = currency;

  useEffect(() => {
    if (!settings?.notifyEnabled || !settings?.notifyTime) return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;

    const fire = async () => {
      try {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        const today = now.toISOString().split("T")[0];

        if (currentTime === settings.notifyTime && lastSent.current !== today) {
          lastSent.current = today;
          const todayExpenses = expensesRef.current.filter((e) => isToday(e.date));
          const total = todayExpenses.reduce((s, e) => s + e.amount, 0);

          const reg = await navigator.serviceWorker.ready;
          await reg.showNotification("ExpenseVault - Daily Summary", {
            body: `Today: ${todayExpenses.length} expense${todayExpenses.length !== 1 ? "s" : ""} · ${formatCurrency(total, currencyRef.current)} spent`,
            icon: "/icon-192.png",
            badge: "/icon-192.png",
            tag: "daily-summary",
            vibrate: [200, 100, 200],
          });
        }
      } catch {
        // silently ignore
      }
    };

    fire();
    const interval = setInterval(fire, 10000);
    return () => clearInterval(interval);
  }, [settings?.notifyEnabled, settings?.notifyTime]);

  return null;
}
