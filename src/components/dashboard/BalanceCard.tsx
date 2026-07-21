"use client";

import { useState } from "react";
import StatsCard from "./StatsCard";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";

interface BalanceCardProps {
  balance: number;
  currency: string;
  onSetBalance: (amount: number) => void;
}

export default function BalanceCard({ balance, currency, onSetBalance }: BalanceCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const handleSave = () => {
    const val = parseFloat(amount);
    if (!isNaN(val) && val >= 0) {
      onSetBalance(val);
      setIsOpen(false);
      setAmount("");
    }
  };

  return (
    <>
      <StatsCard
        label="Current Balance"
        value={formatCurrency(balance, currency)}
        icon={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
            <path d="M21 12V7H5a2 2 0 010-4h14v4" />
            <path d="M3 5v14a2 2 0 002 2h16v-5" />
            <path d="M18 12a2 2 0 000 4h4v-4h-4z" />
          </svg>
        }
        color=""
        bg="bg-emerald-50 dark:bg-emerald-900/20"
        delay={0.05}
        onClick={() => { setAmount(""); setIsOpen(true); }}
      />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Set Balance" size="sm">
        <div className="space-y-4">
          <Input
            label="Balance Amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
            icon={<span className="text-sm font-bold text-emerald-500">{currency}</span>}
            autoFocus
          />
          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1">Save</Button>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
