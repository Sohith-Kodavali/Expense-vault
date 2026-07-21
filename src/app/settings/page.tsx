"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useSettings } from "@/context/SettingsContext";
import { useToast } from "@/context/ToastContext";
import { CURRENCIES, DEFAULT_CATEGORIES, PAYMENT_APPS } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, currency, updateSettings, categories, updateCategories, settings, predefinedExpenses, updatePredefinedExpenses } = useSettings();
  const { showToast } = useToast();
  const [newCategory, setNewCategory] = useState("");
  const [newIcon, setNewIcon] = useState("📌");
  const [preName, setPreName] = useState("");
  const [preAmount, setPreAmount] = useState("");
  const [preCategory, setPreCategory] = useState(DEFAULT_CATEGORIES[0].value);
  const [prePaymentMode, setPrePaymentMode] = useState<"online" | "offline">("online");
  const [prePaymentApp, setPrePaymentApp] = useState("supermoney");
  const [preNotes, setPreNotes] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const addCategory = () => {
    if (!newCategory.trim()) return;
    const slug = newCategory.trim().toLowerCase().replace(/\s+/g, "-");
    if (categories.some((c) => c.value === slug)) { showToast("Category already exists", "error"); return; }
    updateCategories([...categories, { value: slug, label: newCategory.trim(), icon: newIcon, color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}` }]);
    setNewCategory(""); setNewIcon("📌"); showToast("Category added", "success");
  };

  const removeCategory = (val: string) => { updateCategories(categories.filter((c) => c.value !== val)); showToast("Category removed", "info"); };

  const addPredefined = () => {
    if (!preName.trim() || !preAmount || parseFloat(preAmount) <= 0) { showToast("Name and valid amount required", "error"); return; }
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    updatePredefinedExpenses([...predefinedExpenses, { id, name: preName.trim(), amount: parseFloat(preAmount), category: preCategory, paymentMode: prePaymentMode, paymentApp: prePaymentMode === "online" ? prePaymentApp : undefined, notes: preNotes.trim() }]);
    setPreName(""); setPreAmount(""); setPreNotes(""); showToast("Predefined expense added", "success");
  };
  const removePredefined = (id: string) => { updatePredefinedExpenses(predefinedExpenses.filter(p => p.id !== id)); showToast("Template removed", "info"); };

  const exportBackup = () => {
    const blob = new Blob([JSON.stringify({ version: "1.0", exportedAt: new Date().toISOString(), categories }, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `settings-backup-${new Date().toISOString().split("T")[0]}.json`; a.click(); showToast("Backup exported", "success");
  };
  const importBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader();
    r.onload = (ev) => { try { const data = JSON.parse(ev.target?.result as string); if (data.categories) updateCategories(data.categories); showToast("Data restored", "success"); } catch { showToast("Invalid file", "error"); } };
    r.readAsText(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 space-y-5 pt-6 pb-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </div>
        <div><h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1><p className="text-sm text-gray-500 dark:text-gray-400">Customize your experience</p></div>
      </motion.div>

      {/* Appearance */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">Appearance</h3>
        <div className="flex items-center justify-between mb-5">
          <div><p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Dark Mode</p><p className="text-xs text-gray-400">Toggle theme</p></div>
          <button onClick={() => updateSettings({ theme: theme === "dark" ? "light" : "dark" })} className={`w-14 h-8 rounded-full transition-colors relative ${theme === "dark" ? "bg-violet-600" : "bg-gray-300"}`}>
            <motion.div animate={{ x: theme === "dark" ? 24 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="w-6 h-6 rounded-full bg-white shadow-md absolute top-1" />
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">Notifications</h3>
        <div className="flex items-center justify-between mb-4">
          <div><p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Daily Spending Alert</p><p className="text-xs text-gray-400">Browser notification at set time</p></div>
          <button onClick={() => { updateSettings({ notifyEnabled: !settings?.notifyEnabled }); if (!settings?.notifyEnabled && "Notification" in window && Notification.permission === "default") { Notification.requestPermission(); } }} className={`w-14 h-8 rounded-full transition-colors relative ${settings?.notifyEnabled ? "bg-violet-600" : "bg-gray-300"}`}>
            <motion.div animate={{ x: settings?.notifyEnabled ? 24 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="w-6 h-6 rounded-full bg-white shadow-md absolute top-1" />
          </button>
        </div>
        {settings?.notifyEnabled && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Reminder Time</label>
            <input type="time" value={settings?.notifyTime || "21:00"} onChange={(e) => updateSettings({ notifyTime: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:border-violet-400" />
          </div>
        )}
      </div>

      {/* Currency */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">Currency</h3>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {CURRENCIES.map((c) => (
            <button key={c.value} onClick={() => { updateSettings({ currency: c.value }); showToast(`Currency: ${c.value}`, "success"); }}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${currency === c.value ? "bg-violet-600 text-white shadow-md" : "bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100"}`}>{c.value}</button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">Custom Categories</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((cat) => (<span key={cat.value} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">{cat.icon} {cat.label}<button onClick={() => removeCategory(cat.value)} className="w-4 h-4 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 ml-0.5">✕</button></span>))}
        </div>
        <div className="flex items-center gap-2">
          <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Category name" className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:border-violet-400" onKeyDown={(e) => { if (e.key === "Enter") addCategory(); }} />
          <input value={newIcon} onChange={(e) => setNewIcon(e.target.value)} placeholder="Icon" className="w-16 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none text-center focus:border-violet-400" maxLength={2} />
          <button onClick={addCategory} className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700">Add</button>
        </div>
      </div>

      {/* Predefined Expenses */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">Predefined Expenses</h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">Quick-add templates for frequent expenses</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {predefinedExpenses.map((pe) => (
            <span key={pe.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              {formatCurrency(pe.amount, currency)} · {pe.name}
              <button onClick={() => removePredefined(pe.id)} className="w-4 h-4 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 ml-0.5">✕</button>
            </span>
          ))}
          {predefinedExpenses.length === 0 && <span className="text-xs text-gray-400 italic">No templates yet</span>}
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input value={preName} onChange={(e) => setPreName(e.target.value)} placeholder="Name"
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:border-violet-400" />
            <input value={preAmount} onChange={(e) => setPreAmount(e.target.value)} placeholder="Amount" type="number" min="0" step="0.01"
              className="w-28 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:border-violet-400" />
          </div>
          <div className="flex gap-2">
            <select value={preCategory} onChange={(e) => setPreCategory(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:border-violet-400">
              {(categories.length > 0 ? categories : DEFAULT_CATEGORIES).map(c => (
                <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
              ))}
            </select>
            <select value={prePaymentMode} onChange={(e) => setPrePaymentMode(e.target.value as "online" | "offline")}
              className="w-28 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:border-violet-400">
              <option value="online">💳 Online</option>
              <option value="offline">💵 Cash</option>
            </select>
          </div>
          {prePaymentMode === "online" && (
            <select value={prePaymentApp} onChange={(e) => setPrePaymentApp(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:border-violet-400">
              {PAYMENT_APPS.map(a => <option key={a.value} value={a.value}>{a.icon} {a.label}</option>)}
            </select>
          )}
          <input value={preNotes} onChange={(e) => setPreNotes(e.target.value)} placeholder="Notes (optional)"
            className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm outline-none focus:border-violet-400" />
          <button onClick={addPredefined}
            className="px-4 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700">Add Template</button>
        </div>
      </div>

      {/* Backup */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4">Backup &amp; Restore</h3>
        <div className="flex items-center gap-3">
          <button onClick={exportBackup} className="flex-1 px-4 py-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 text-sm font-semibold hover:bg-violet-100">Export Backup</button>
          <button onClick={() => fileRef.current?.click()} className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-100">Import Backup</button>
          <input ref={fileRef} type="file" accept=".json" onChange={importBackup} className="hidden" />
        </div>
      </div>
    </div>
  );
}
