"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useSettings } from "@/context/SettingsContext";
import type { Expense, ExpenseCategory } from "@/lib/types";
import { DEFAULT_CATEGORIES, PAYMENT_APPS } from "@/lib/types";

interface ExpenseFormProps {
  initialData?: Partial<Expense>;
  onSubmit: (data: Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt" | "isFavorite" | "isPinned">) => void;
  onCancel: () => void;
  loading: boolean;
}

interface FormErrors {
  name?: string;
  amount?: string;
}

export default function ExpenseForm({ initialData, onSubmit, onCancel, loading }: ExpenseFormProps) {
  const { categories } = useSettings();

  const [name, setName] = useState(initialData?.name || "");
  const [amount, setAmount] = useState(initialData?.amount ? String(initialData.amount) : "");
  const [category, setCategory] = useState(initialData?.category || DEFAULT_CATEGORIES[0].value);
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(initialData?.time || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [paymentMode, setPaymentMode] = useState<"online" | "offline">(initialData?.paymentMode || "online");
  const [paymentApp, setPaymentApp] = useState(initialData?.paymentApp || "supermoney");
  const [errors, setErrors] = useState<FormErrors>({});

  const allCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES.map((c) => ({
    value: c.value, label: c.label, icon: c.icon,
  }));

  const categoryOptions = [
    { value: "", label: "Select Category" },
    ...allCategories.map((c) => ({ value: c.value, label: c.label, icon: c.icon || "📌" })),
  ];

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = "Expense name is required";
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) newErrors.amount = "Valid amount greater than 0 is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, amount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      amount: parseFloat(amount),
      category: category as ExpenseCategory,
      date,
      time: time || "",
      notes: notes.trim(),
      paymentMode,
      paymentApp: paymentMode === "online" ? paymentApp : undefined,
      receiptUrl: initialData?.receiptUrl,
    });
  };

  return (
    <motion.form onSubmit={handleSubmit} className="space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Input label="Expense Name" placeholder="e.g. Grocery shopping"
        value={name} onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: undefined })); }}
        error={errors.name} />

      <Input label="Amount" type="number" placeholder="0.00"
        value={amount} onChange={(e) => { setAmount(e.target.value); if (errors.amount) setErrors((p) => ({ ...p, amount: undefined })); }}
        error={errors.amount}
        icon={<span className="text-sm font-bold text-violet-500">₹</span>} min="0" step="0.01" />

      <Select label="Category" value={category} onChange={setCategory} options={categoryOptions} />

      <div className="grid grid-cols-2 gap-3">
        <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Input label="Time (optional)" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </div>

      {/* Payment Mode Toggle */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Payment Mode</label>
        <div className="flex gap-2">
          <button type="button" onClick={() => setPaymentMode("online")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              paymentMode === "online"
                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200"
                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200"
            }`}>
            💳 Online
          </button>
          <button type="button" onClick={() => setPaymentMode("offline")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              paymentMode === "offline"
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-200"
                : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200"
            }`}>
            💵 Offline
          </button>
        </div>
      </div>

      {/* Payment App (only when online) */}
      {paymentMode === "online" && (
        <Select label="Payment App" value={paymentApp} onChange={setPaymentApp}
          options={PAYMENT_APPS.map((a) => ({ value: a.value, label: a.label, icon: a.icon }))} />
      )}

      <div className="w-full">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
          placeholder="Any additional details..."
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 dark:focus:ring-violet-900/20 resize-none" />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" loading={loading} className="flex-1">
          {initialData?.id ? "Update Expense" : "Save Expense"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
      </div>
    </motion.form>
  );
}
