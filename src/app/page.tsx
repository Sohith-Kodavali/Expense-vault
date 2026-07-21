"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useExpenses } from "@/hooks/useExpenses";
import { useSettings } from "@/context/SettingsContext";
import StatsCard from "@/components/dashboard/StatsCard";
import BalanceCard from "@/components/dashboard/BalanceCard";
import RecentExpenses from "@/components/dashboard/RecentExpenses";
import BudgetProgress from "@/components/dashboard/BudgetProgress";
import { CategoryPieChart, MonthlyBarChart } from "@/components/charts/ExpenseCharts";
import FloatingButton from "@/components/common/FloatingButton";
import BudgetAlert from "@/components/dashboard/BudgetAlert";
import DashboardHero from "@/components/dashboard/DashboardHero";
import AchievementToast from "@/components/common/AchievementToast";
import { useUser } from "@/context/UserContext";
import { StatsCardSkeleton, ChartSkeleton } from "@/components/ui/Skeleton";
import { formatCurrency, getMonthKey, isToday, isThisWeek, isThisMonth, isThisYear } from "@/lib/utils";
import { DEFAULT_CATEGORIES } from "@/lib/types";

export default function DashboardPage() {
  const { expenses, loading, budget, balance, updateBalance, toggleFavorite, togglePin, loadBudget, updateBudget } = useExpenses();
  const { currency, categories } = useSettings();
  const { displayName } = useUser();
  const monthKey = getMonthKey();

  useEffect(() => { loadBudget(monthKey); }, [monthKey, loadBudget]);

  const todayExpenses = useMemo(() => expenses.filter(e => isToday(e.date)), [expenses]);
  const weekExpenses = useMemo(() => expenses.filter(e => isThisWeek(e.date)), [expenses]);
  const monthExpenses = useMemo(() => expenses.filter(e => isThisMonth(e.date)), [expenses]);
  const yearExpenses = useMemo(() => expenses.filter(e => isThisYear(e.date)), [expenses]);

  const todayTotal = todayExpenses.reduce((s, e) => s + e.amount, 0);
  const weekTotal = weekExpenses.reduce((s, e) => s + e.amount, 0);
  const monthTotal = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const yearTotal = yearExpenses.reduce((s, e) => s + e.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);

  const sortedByAmount = [...expenses].sort((a, b) => b.amount - a.amount);
  const highestExpense = sortedByAmount[0];
  const lowestExpense = sortedByAmount[sortedByAmount.length - 1];
  const allCats = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 space-y-5 pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {[1,2,3,4].map(i => <StatsCardSkeleton key={i} />)}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <StatsCardSkeleton key={i+10} />)}
        </div>
        <ChartSkeleton /><ChartSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 space-y-5 pt-6">
      <DashboardHero name={displayName} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatsCard label="Today" value={formatCurrency(todayTotal, currency)} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>} color="" bg="bg-amber-50 dark:bg-amber-900/20" delay={0} />
        <StatsCard label="This Week" value={formatCurrency(weekTotal, currency)} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>} color="" bg="bg-blue-50 dark:bg-blue-900/20" delay={0.05} />
        <StatsCard label="This Month" value={formatCurrency(monthTotal, currency)} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>} color="" bg="bg-violet-50 dark:bg-violet-900/20" delay={0.1} />
        <StatsCard label="This Year" value={formatCurrency(yearTotal, currency)} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>} color="" bg="bg-teal-50 dark:bg-teal-900/20" delay={0.15} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <StatsCard label="Total Expenses" value={formatCurrency(totalExpenses, currency)} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>} color="" bg="bg-rose-50 dark:bg-rose-900/20" delay={0.2} />
        <StatsCard label="Highest Expense" value={highestExpense ? formatCurrency(highestExpense.amount, currency) : formatCurrency(0, currency)} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>} color="" bg="bg-yellow-50 dark:bg-yellow-900/20" delay={0.25} />
        <StatsCard label="Lowest Expense" value={lowestExpense ? formatCurrency(lowestExpense.amount, currency) : formatCurrency(0, currency)} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>} color="" bg="bg-cyan-50 dark:bg-cyan-900/20" delay={0.3} />
        <BalanceCard balance={balance?.amount ?? 0} currency={currency} onSetBalance={(amt) => updateBalance(amt)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BudgetProgress expenses={monthExpenses} budget={budget} currency={currency} onSetBudget={(amount) => updateBudget(monthKey, amount)} />
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">Quick Add Expense</h3>
          <Link href="/expenses/add" className="flex items-center justify-center gap-2 w-full py-8 rounded-xl border-2 border-dashed border-violet-200 dark:border-violet-800 hover:border-violet-400 hover:bg-violet-50/50 dark:hover:bg-violet-900/20 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-violet-200">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
            <span className="text-sm font-semibold text-violet-600 dark:text-violet-400">Add New Expense</span>
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">Category Breakdown</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Where your money goes</p>
          <CategoryPieChart expenses={expenses} categories={allCats} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">Monthly Trend</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Expense pattern over months</p>
          <MonthlyBarChart expenses={expenses} />
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div><h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">Recent Expenses</h3><p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Latest 8 transactions</p></div>
          <Link href="/expenses" className="text-xs font-semibold text-violet-600 hover:text-violet-700">View All →</Link>
        </div>
        <RecentExpenses expenses={expenses} currency={currency} onToggleFavorite={toggleFavorite} onTogglePin={togglePin} />
      </motion.div>

      <FloatingButton />
      <AchievementToast />
      <BudgetAlert expenses={monthExpenses} budget={budget} currency={currency} />
    </div>
  );
}
