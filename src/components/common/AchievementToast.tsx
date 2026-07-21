"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useExpenses } from "@/hooks/useExpenses";
import { formatCurrency, getMonthKey } from "@/lib/utils";
import { useSettings } from "@/context/SettingsContext";

export default function AchievementToast() {
  const { expenses } = useExpenses();
  const { currency } = useSettings();
  const [achievement, setAchievement] = useState<{ title: string; msg: string } | null>(null);
  const [streak, setStreak] = useState(0);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const dates = [...new Set(expenses.map(e => e.date))].sort().reverse();
    let s = 0;
    const today = new Date();
    for (let i = 0; i < dates.length; i++) {
      const check = new Date(today);
      check.setDate(check.getDate() - i);
      const checkStr = check.toISOString().split("T")[0];
      if (dates.includes(checkStr)) s++;
      else break;
    }
    setStreak(s);

    const lastMonth = getMonthKey(new Date(today.getFullYear(), today.getMonth() - 1));
    const thisMonth = getMonthKey();

    const lastMonthTotal = expenses.filter(e => e.date.startsWith(lastMonth)).reduce((a, e) => a + e.amount, 0);
    const thisMonthTotal = expenses.filter(e => e.date.startsWith(thisMonth)).reduce((a, e) => a + e.amount, 0);

    if (!shown && expenses.length >= 5) {
      setShown(true);
      const savings = lastMonthTotal - thisMonthTotal;
      if (lastMonthTotal > 0 && savings > 0) {
        setTimeout(() => setAchievement({
          title: "🎉 Spending Down!",
          msg: `Saved ${formatCurrency(savings, currency)} vs last month. Great job!`
        }), 3000);
        setTimeout(() => setAchievement(null), 7000);
      } else if (streak >= 3) {
        setTimeout(() => setAchievement({
          title: "🔥 ${streak} Day Streak!",
          msg: `You've tracked expenses ${streak} days in a row. Keep going!`
        }), 3000);
        setTimeout(() => setAchievement(null), 7000);
      }
    }
  }, [expenses.length]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -60, scale: 0.9 }}
          animate={{ opacity: 1, y: 16, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.9 }}
          className="fixed top-0 left-1/2 -translate-x-1/2 z-[250] pointer-events-none"
        >
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-violet-400/30 text-center">
            <p className="text-sm font-bold">{achievement.title}</p>
            <p className="text-xs opacity-90 mt-0.5">{achievement.msg}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
