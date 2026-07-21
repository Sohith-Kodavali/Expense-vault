"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLends } from "@/hooks/useLends";
import { useSettings } from "@/context/SettingsContext";
import { useToast } from "@/context/ToastContext";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import EmptyState from "@/components/ui/EmptyState";
import type { Lend, LendStatus } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { playSound } from "@/lib/sounds";

const statusColors: Record<LendStatus, string> = {
  pending: "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400",
  partial: "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
  received: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
};

export default function LendsPage() {
  const { lends, loading, add, update, remove, markReceived } = useLends();
  const { currency } = useSettings();
  const { showToast } = useToast();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Lend | null>(null);
  const [statusFilter, setStatusFilter] = useState<LendStatus | "all">("all");
  const [showReceive, setShowReceive] = useState<Lend | null>(null);
  const [receiveAmount, setReceiveAmount] = useState("");

  const [form, setForm] = useState({ friendName: "", amount: "", date: new Date().toISOString().split("T")[0], expectedDate: "", notes: "" });

  const filtered = useMemo(() => {
    if (statusFilter === "all") return lends;
    return lends.filter((l) => l.status === statusFilter);
  }, [lends, statusFilter]);

  const totalLent = lends.reduce((s, l) => s + l.amount, 0);
  const totalReceived = lends.reduce((s, l) => s + l.amountReceived, 0);
  const totalPending = totalLent - totalReceived;

  const resetForm = () => setForm({ friendName: "", amount: "", date: new Date().toISOString().split("T")[0], expectedDate: "", notes: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.friendName.trim() || !form.amount) return;
    if (editing) {
      await update(editing.id, {
        friendName: form.friendName.trim(),
        amount: parseFloat(form.amount),
        date: form.date,
        expectedDate: form.expectedDate || undefined,
        notes: form.notes.trim(),
      });
      showToast("Lend updated", "success");
    } else {
      await add({
        friendName: form.friendName.trim(),
        amount: parseFloat(form.amount),
        amountReceived: 0,
        date: form.date,
        expectedDate: form.expectedDate || undefined,
        status: "pending",
        notes: form.notes.trim(),
      });
      showToast("Lend added", "success");
    }
    setShowForm(false); setEditing(null); resetForm();
  };

  const openEdit = (lend: Lend) => {
    setEditing(lend);
    setForm({ friendName: lend.friendName, amount: String(lend.amount), date: lend.date, expectedDate: lend.expectedDate || "", notes: lend.notes });
    setShowForm(true);
  };

  const handleReceive = async () => {
    if (!showReceive || !receiveAmount) return;
    const amt = parseFloat(receiveAmount);
    if (isNaN(amt) || amt < 0) return;
    const newTotal = showReceive.amountReceived + amt;
    await markReceived(showReceive.id, newTotal, showReceive.amount);
    playSound("receive");
    showToast(newTotal >= showReceive.amount ? "Fully received!" : "Payment recorded", "success");
    setShowReceive(null); setReceiveAmount("");
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 space-y-5 pt-6 pb-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Money Lent</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{lends.length} friend{lends.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        <Button onClick={() => { resetForm(); setEditing(null); setShowForm(true); }} size="sm">
          + Lend Money
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { l: "Total Lent", v: formatCurrency(totalLent, currency), c: "from-violet-500 to-indigo-600", b: "bg-violet-50 dark:bg-violet-900/20" },
          { l: "Received", v: formatCurrency(totalReceived, currency), c: "from-emerald-500 to-teal-600", b: "bg-emerald-50 dark:bg-emerald-900/20" },
          { l: "Pending", v: formatCurrency(totalPending, currency), c: "from-rose-500 to-red-600", b: "bg-rose-50 dark:bg-rose-900/20" },
        ].map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass-card rounded-2xl p-4 text-center">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{s.l}</p>
            <p className="text-lg font-extrabold text-gray-900 dark:text-white mt-1">{s.v}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(["all", "pending", "partial", "received"] as const).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
              statusFilter === s ? "bg-violet-600 text-white shadow-md" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            }`}>
            {s}
          </button>
        ))}
      </div>

      {/* Lends List */}
      {filtered.length === 0 ? (
        <EmptyState type="lends" />
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((lend, i) => (
              <motion.div key={lend.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ delay: i * 0.03 }}
                className="glass-card rounded-2xl p-4 group relative overflow-hidden">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(124,58,237,0.06), transparent 70%)` }} />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-lg font-bold shadow-sm shrink-0">
                      {lend.friendName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{lend.friendName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize ${statusColors[lend.status]}`}>{lend.status}</span>
                        <span className="text-xs text-gray-400">{formatDate(lend.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(lend.amount, currency)}</p>
                    {lend.amountReceived > 0 && (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">+{formatCurrency(lend.amountReceived, currency)} recd</p>
                    )}
                  </div>
                </div>

                {lend.amountReceived > 0 && lend.status !== "received" && (
                  <div className="mt-3 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((lend.amountReceived / lend.amount) * 100, 100)}%` }} transition={{ duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full" />
                  </div>
                )}

                {/* ALWAYS VISIBLE action buttons */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  {lend.status !== "received" && (
                    <button onClick={() => { setShowReceive(lend); setReceiveAmount(String(lend.amount - lend.amountReceived)); }}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300 active:scale-[0.97] transition-all">
                      💰 Record Return
                    </button>
                  )}
                  <button onClick={() => openEdit(lend)} className="px-3 py-2 rounded-xl text-xs font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => { remove(lend.id); showToast("Deleted", "info"); }}
                    className="px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                    Del
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? "Edit Lend" : "Lend Money to Friend"} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Friend Name" placeholder="Friend's name" value={form.friendName} onChange={(e) => setForm({ ...form, friendName: e.target.value })} />
          <Input label="Amount" type="number" placeholder="0.00" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
            icon={<span className="text-sm font-bold text-violet-500">₹</span>} />
          <Input label="Date Lent" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <Input label="Expected Return Date (optional)" type="date" value={form.expectedDate} onChange={(e) => setForm({ ...form, expectedDate: e.target.value })} />
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Optional..."
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 dark:focus:ring-violet-900/20 resize-none" />
          </div>
          <Button type="submit" className="w-full">{editing ? "Update" : "Save"}</Button>
        </form>
      </Modal>

      {/* Receive Payment Modal */}
      <Modal isOpen={!!showReceive} onClose={() => setShowReceive(null)} title="Record Payment Received" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            From <strong>{showReceive?.friendName}</strong> — Total: {formatCurrency(showReceive?.amount || 0, currency)} | Received: {formatCurrency(showReceive?.amountReceived || 0, currency)}
          </p>
          <Input label="Amount Received" type="number" placeholder="0.00" value={receiveAmount}
            onChange={(e) => setReceiveAmount(e.target.value)}
            icon={<span className="text-sm font-bold text-emerald-500">₹</span>} />
          <Button onClick={handleReceive} className="w-full">Record Payment</Button>
        </div>
      </Modal>
    </div>
  );
}
