"use client";

import {
  PieChart, Pie, Cell, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { Expense, CategoryItem } from "@/lib/types";
import { groupByMonth, groupByCategory } from "@/lib/utils";

function getCategoryColor(catValue: string, categories: CategoryItem[]): string {
  const found = categories.find((c) => c.value === catValue);
  return found?.color || "#6b7280";
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center h-[280px] text-sm text-gray-400 dark:text-gray-500">
      {message}
    </div>
  );
}

export function CategoryPieChart({ expenses, categories }: { expenses: Expense[]; categories: CategoryItem[] }) {
  const data = groupByCategory(expenses).map((item) => ({
    name: categories.find((c) => c.value === item.category)?.label || item.category,
    value: item.total,
    color: getCategoryColor(item.category, categories),
  }));

  if (data.length === 0) return <EmptyChart message="No data to display" />;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={100} paddingAngle={3} dataKey="value">
          {data.map((entry, idx) => (
            <Cell key={idx} fill={entry.color} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ background: "#fff", border: "1px solid #eee", borderRadius: "12px", fontSize: "13px", color: "#333", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, ""]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MonthlyBarChart({ expenses }: { expenses: Expense[] }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const data = groupByMonth(expenses).map((item) => {
    const [y, m] = item.month.split("-");
    return { month: `${months[parseInt(m) - 1]} ${y.slice(2)}`, total: item.total };
  });

  if (data.length === 0) return <EmptyChart message="No monthly data yet" />;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} barGap={2}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#888", fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: "#fff", border: "1px solid #eee", borderRadius: "12px", fontSize: "13px", color: "#333", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, ""]} />
        <Bar dataKey="total" fill="url(#barGradient)" radius={[6, 6, 0, 0]} maxBarSize={36} name="Total Spent" />
        <defs>
          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MonthlyTrendLine({ expenses }: { expenses: Expense[] }) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const data = groupByMonth(expenses).map((item) => {
    const [y, m] = item.month.split("-");
    return { month: `${months[parseInt(m) - 1]} ${y.slice(2)}`, total: item.total };
  });

  if (data.length === 0) return <EmptyChart message="No trend data yet" />;

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#888", fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ background: "#fff", border: "1px solid #eee", borderRadius: "12px", fontSize: "13px", color: "#333", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, ""]} />
        <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={2.5}
          dot={{ fill: "#8b5cf6", strokeWidth: 0, r: 4 }}
          activeDot={{ fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff", r: 6 }} name="Monthly Trend" />
      </LineChart>
    </ResponsiveContainer>
  );
}
