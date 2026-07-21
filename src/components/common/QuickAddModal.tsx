"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import { useExpenses } from "@/hooks/useExpenses";
import { useToast } from "@/context/ToastContext";
import type { Expense } from "@/lib/types";
import Confetti from "@/components/common/Confetti";
import SuccessRipple from "@/components/common/SuccessRipple";
import { playSound } from "@/lib/sounds";
import { vibrate } from "@/lib/haptics";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickAddModal({ isOpen, onClose }: QuickAddModalProps) {
  const { add } = useExpenses();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [showConfetti, setShowConfetti] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  const handleSubmit = async (
    data: Omit<Expense, "id" | "userId" | "createdAt" | "updatedAt" | "isFavorite" | "isPinned">
  ) => {
    setLoading(true);
    try {
      await add(data);
      playSound("success");
      vibrate([15, 30, 15]);
      showToast("Expense added!", "success");
      setShowConfetti(true);
      setShowRipple(true);
      setTimeout(() => onClose(), 600);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Confetti trigger={showConfetti} onDone={() => setShowConfetti(false)} />
      <SuccessRipple trigger={showRipple} onDone={() => setShowRipple(false)} />
      <Modal isOpen={isOpen} onClose={onClose} title="Quick Add Expense" size="lg">
        <ExpenseForm onSubmit={handleSubmit} onCancel={onClose} loading={loading} />
      </Modal>
    </>
  );
}
