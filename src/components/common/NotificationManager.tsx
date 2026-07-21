"use client";

import { useEffect, useRef } from "react";
import { useSettings } from "@/context/SettingsContext";
import { useExpenses } from "@/hooks/useExpenses";
import { isToday, formatCurrency } from "@/lib/utils";

export default function NotificationManager() {
  const { settings, currency } = useSettings();
  const { expenses } = useExpenses();
  const lastSent = useRef("");

  useEffect(() => {
    if (!settings?.notifyEnabled || !settings?.notifyTime) return;
    if (!("Notification" in window)) return;

    const fire = () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const today = now.toISOString().split("T")[0];

      if (currentTime === settings.notifyTime && lastSent.current !== today) {
        lastSent.current = today;
        const todayExpenses = expenses.filter((e) => isToday(e.date));
        const total = todayExpenses.reduce((s, e) => s + e.amount, 0);

        new Notification("ExpenseVault - Daily Summary", {
          body: `Today: ${todayExpenses.length} expense${todayExpenses.length !== 1 ? "s" : ""} · ${formatCurrency(total, currency)} spent`,
          icon: "/icon.svg",
          badge: "/icon-192.png",
          tag: "daily-summary",
          requireInteraction: true,
        });
      }
    };

    fire();
    const interval = setInterval(fire, 10000);
    return () => clearInterval(interval);
  }, [settings?.notifyEnabled, settings?.notifyTime, expenses, currency]);

  return null;
}
