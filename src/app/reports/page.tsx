"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useExpenses } from "@/hooks/useExpenses";
import { useSettings } from "@/context/SettingsContext";
import { CategoryPieChart, MonthlyBarChart, MonthlyTrendLine } from "@/components/charts/ExpenseCharts";
import { ChartSkeleton } from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";
import { formatCurrency, groupByCategory, getMonthKey, formatDate } from "@/lib/utils";
import { DEFAULT_CATEGORIES } from "@/lib/types";

export default function ReportsPage() {
  const { expenses, loading } = useExpenses();
  const { currency, categories } = useSettings();
  const [selectedMonth, setSelectedMonth] = useState(getMonthKey());
  const allCats = categories.length > 0 ? categories : DEFAULT_CATEGORIES;

  const monthExpenses = useMemo(() => expenses.filter((e) => e.date.startsWith(selectedMonth)), [expenses, selectedMonth]);
  const categoryData = useMemo(() => groupByCategory(monthExpenses), [monthExpenses]);
  const totalSpent = monthExpenses.reduce((s, e) => s + e.amount, 0);
  const mostExpensive = categoryData[0];
  const cheapest = categoryData[categoryData.length - 1];
  const top10 = [...monthExpenses].sort((a, b) => b.amount - a.amount).slice(0, 10);

  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    expenses.forEach((e) => set.add(e.date.substring(0, 7)));
    return Array.from(set).sort().reverse();
  }, [expenses]);

  const formatMonthLabel = (m: string) => {
    const [y, mo] = m.split("-");
    const mn = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${mn[parseInt(mo)-1]} ${y}`;
  };

  const exportCSV = () => {
    const h = ["Name","Amount","Category","Date","Time","Notes"];
    const rows = expenses.map(e => [`"${e.name}"`,e.amount,`"${e.category}"`,e.date,e.time,`"${e.notes||""}"`].join(","));
    const blob = new Blob([[h.join(","),...rows].join("\n")], {type:"text/csv"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download=`expenses-${new Date().toISOString().split("T")[0]}.csv`; a.click();
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({exportedAt:new Date().toISOString(),expenses},null,2)],{type:"application/json"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download=`backup-${new Date().toISOString().split("T")[0]}.json`; a.click();
  };

  const exportPDF = () => {
    const catRows = categoryData.map((c) => {
      const cat = allCats.find((x) => x.value === c.category);
      const pct = totalSpent > 0 ? ((c.total / totalSpent) * 100).toFixed(1) : "0";
      return `<tr><td style="padding:8px;border-bottom:1px solid #eee">${cat?.icon||""} ${cat?.label||c.category}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatCurrency(c.total, currency)}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${pct}%</td></tr>`;
    }).join("");

    const topRows = top10.map((e, i) => {
      const cat = allCats.find((x) => x.value === e.category);
      return `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i+1}. ${e.name}</td><td style="padding:8px;border-bottom:1px solid #eee">${cat?.label||e.category}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatDate(e.date)}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${formatCurrency(e.amount, currency)}</td></tr>`;
    }).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>ExpenseVault Report - ${formatMonthLabel(selectedMonth)}</title>
<style>body{font-family:system-ui,sans-serif;max-width:800px;margin:40px auto;color:#1a1a2e;padding:20px}
h1{font-size:24px;margin:0}h2{font-size:16px;color:#7c3aed;margin:24px 0 12px}
.header{border-bottom:3px solid #7c3aed;padding-bottom:16px;margin-bottom:24px}
.header p{color:#666;margin:4px 0}
.stats{display:flex;gap:16px;margin-bottom:24px}
.stat{flex:1;background:#f8f7fc;border-radius:12px;padding:16px;text-align:center}
.stat .v{font-size:22px;font-weight:800;color:#1a1a2e}.stat .l{font-size:11px;text-transform:uppercase;color:#888;margin-top:4px}
table{width:100%;border-collapse:collapse;font-size:14px}
th{text-align:left;padding:8px;border-bottom:2px solid #ddd;font-size:11px;text-transform:uppercase;color:#888}
.footer{margin-top:32px;padding-top:16px;border-top:1px solid #eee;font-size:11px;color:#999;text-align:center}
@media print{body{margin:0;padding:20px}}</style></head><body>
<div class="header"><h1>ExpenseVault</h1><p>Monthly Report · ${formatMonthLabel(selectedMonth)}</p><p>Generated ${new Date().toLocaleDateString("en-IN")}</p></div>
<div class="stats">
<div class="stat"><div class="v">${formatCurrency(totalSpent, currency)}</div><div class="l">Total Spent</div></div>
<div class="stat"><div class="v">${monthExpenses.length}</div><div class="l">Transactions</div></div>
<div class="stat"><div class="v">${categoryData.length}</div><div class="l">Categories</div></div>
</div>
<h2>Category Breakdown</h2><table><tr><th>Category</th><th style="text-align:right">Amount</th><th style="text-align:right">Share</th></tr>${catRows}</table>
<h2>Top Expenses</h2><table><tr><th>Name</th><th>Category</th><th style="text-align:right">Date</th><th style="text-align:right">Amount</th></tr>${topRows}</table>
<div class="footer">Made by Sohith · ExpenseVault</div>
</body></html>`;

    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 500); }
  };

  if (loading) return <div className="max-w-5xl mx-auto px-4 pt-6 space-y-5"><ChartSkeleton/><ChartSkeleton/></div>;
  if (expenses.length === 0) return <div className="max-w-5xl mx-auto px-4 pt-6"><EmptyState type="reports" title="No reports yet" /></div>;

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 space-y-5 pt-6 pb-8">
      <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          </div>
          <div><h1 className="text-xl font-bold text-gray-900 dark:text-white">Reports</h1><p className="text-sm text-gray-500 dark:text-gray-400">Monthly spending insights</p></div>
        </div>
        <div className="flex gap-2">
          <button onClick={exportPDF} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 hover:bg-rose-100">PDF</button>
          <button onClick={exportCSV} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100">CSV</button>
          <button onClick={exportJSON} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 hover:bg-violet-100">JSON</button>
        </div>
      </motion.div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {availableMonths.map(m => (
          <button key={m} onClick={()=>setSelectedMonth(m)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedMonth===m?"bg-violet-600 text-white shadow-md":"bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-violet-300"}`}>
            {formatMonthLabel(m)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{l:"Total Spent",v:formatCurrency(totalSpent,currency)},{l:"Most Expensive",v:mostExpensive?allCats.find(c=>c.value===mostExpensive.category)?.label||mostExpensive.category:"N/A",s:mostExpensive?formatCurrency(mostExpensive.total,currency):""},{l:"Cheapest",v:cheapest?allCats.find(c=>c.value===cheapest.category)?.label||cheapest.category:"N/A",s:cheapest?formatCurrency(cheapest.total,currency):""},{l:"Transactions",v:monthExpenses.length.toString()}].map((d,i)=>(
          <div key={i} className="glass-card rounded-2xl p-4">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{d.l}</span>
            <div className="text-xl font-extrabold text-gray-900 dark:text-white mt-1.5">{d.v}</div>
            {d.s && <span className="text-xs text-gray-400">{d.s}</span>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5"><h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">Category Breakdown</h3><p className="text-xs text-gray-400 mb-4">{formatMonthLabel(selectedMonth)}</p><CategoryPieChart expenses={monthExpenses} categories={allCats}/></div>
        <div className="glass-card rounded-2xl p-5"><h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">Monthly Trend</h3><p className="text-xs text-gray-400 mb-4">Spending over time</p><MonthlyTrendLine expenses={expenses}/></div>
      </div>

      <div className="glass-card rounded-2xl p-5"><h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">Monthly Comparison</h3><p className="text-xs text-gray-400 mb-4">Month-over-month</p><MonthlyBarChart expenses={expenses}/></div>

      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">Top 10 Expenses</h3><p className="text-xs text-gray-400 mb-4">{formatMonthLabel(selectedMonth)}</p>
        {top10.length>0?<div className="divide-y divide-gray-100 dark:divide-gray-800">{top10.map((e,i)=>(<div key={e.id} className="flex items-center justify-between py-3"><div className="flex items-center gap-3 min-w-0"><span className="text-xs font-bold text-gray-400 w-5 text-right">{i+1}</span><div className="min-w-0"><span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate block">{e.name}</span><span className="text-xs text-gray-400">{allCats.find(c=>c.value===e.category)?.label||e.category} · {e.date}</span></div></div><span className="text-sm font-bold text-gray-900 dark:text-white ml-3">{formatCurrency(e.amount,currency)}</span></div>))}</div>:<p className="text-center text-sm text-gray-400 py-6">No expenses this month</p>}
      </div>
    </div>
  );
}
