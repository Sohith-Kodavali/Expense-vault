import type { Expense, CategoryItem } from "./types";
import { DEFAULT_CATEGORIES } from "./types";

export function formatCurrency(amount: number, currency = "₹"): string {
  return `${currency}${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatCompactCurrency(amount: number, currency = "₹"): string {
  if (amount >= 10000000) return `${currency}${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `${currency}${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `${currency}${(amount / 1000).toFixed(1)}K`;
  return `${currency}${amount.toFixed(0)}`;
}

export function getDateRange(
  range: "today" | "yesterday" | "thisWeek" | "thisMonth" | "custom",
  customStart?: string,
  customEnd?: string
): { start: string; end: string } {
  const now = new Date();
  const toDateStr = (d: Date) => d.toISOString().split("T")[0];
  switch (range) {
    case "today": { const s = toDateStr(now); return { start: s, end: s }; }
    case "yesterday": { const y = new Date(now); y.setDate(y.getDate() - 1); return { start: toDateStr(y), end: toDateStr(y) }; }
    case "thisWeek": { const start = new Date(now); start.setDate(now.getDate() - now.getDay()); return { start: toDateStr(start), end: toDateStr(now) }; }
    case "thisMonth": { const start = new Date(now.getFullYear(), now.getMonth(), 1); return { start: toDateStr(start), end: toDateStr(now) }; }
    case "custom": return { start: customStart || toDateStr(now), end: customEnd || toDateStr(now) };
    default: return { start: toDateStr(now), end: toDateStr(now) };
  }
}

export function getMonthKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function groupByMonth(expenses: { date: string; amount: number }[]): { month: string; total: number }[] {
  const map: Record<string, number> = {};
  expenses.forEach((e) => { const m = e.date.substring(0, 7); map[m] = (map[m] || 0) + e.amount; });
  return Object.entries(map).map(([month, total]) => ({ month, total })).sort((a, b) => a.month.localeCompare(b.month));
}

export function groupByCategory(expenses: { category: string; amount: number }[]): { category: string; total: number }[] {
  const map: Record<string, number> = {};
  expenses.forEach((e) => { map[e.category] = (map[e.category] || 0) + e.amount; });
  return Object.entries(map).map(([category, total]) => ({ category, total })).sort((a, b) => b.total - a.total);
}

export function getCategoryInfo(category: string): { label: string; icon: string; color: string } {
  const found = DEFAULT_CATEGORIES.find((c) => c.value === category);
  if (found) return found;
  return { label: category.charAt(0).toUpperCase() + category.slice(1), icon: "📌", color: "#6b7280" };
}

export function filterExpenses(
  expenses: Expense[],
  search: string,
  filter: "all" | "today" | "yesterday" | "thisWeek" | "thisMonth" | "custom",
  customStart?: string,
  customEnd?: string,
  categoryFilter?: string,
  sortBy: "date" | "amount" = "date",
  sortDir: "asc" | "desc" = "desc"
): Expense[] {
  let filtered = [...expenses];
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(e => e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q) || e.amount.toString().includes(q) || e.date.includes(q));
  }
  if (filter !== "all" && filter !== "custom") {
    const { start, end } = getDateRange(filter);
    filtered = filtered.filter(e => e.date >= start && e.date <= end);
  } else if (filter === "custom" && customStart && customEnd) {
    filtered = filtered.filter(e => e.date >= customStart && e.date <= customEnd);
  }
  if (categoryFilter) filtered = filtered.filter(e => e.category === categoryFilter);
  filtered.sort((a, b) => {
    if (sortBy === "date") {
      const aTime = new Date(`${a.date}T${a.time || "00:00"}`).getTime();
      const bTime = new Date(`${b.date}T${b.time || "00:00"}`).getTime();
      return sortDir === "desc" ? bTime - aTime : aTime - bTime;
    }
    return sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount;
  });
  return filtered;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatTime(timeStr: string): string {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

export function isToday(dateStr: string): boolean { return new Date(dateStr).toDateString() === new Date().toDateString(); }

export function isThisWeek(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay()); weekStart.setHours(0, 0, 0, 0);
  return d >= weekStart;
}

export function isThisMonth(dateStr: string): boolean {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

export function isThisYear(dateStr: string): boolean { return new Date(dateStr).getFullYear() === new Date().getFullYear(); }
