"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import QuickAddModal from "@/components/common/QuickAddModal";
import { playSound } from "@/lib/sounds";

interface QuickAddContextType {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const QuickAddContext = createContext<QuickAddContextType | null>(null);

export function QuickAddProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <QuickAddContext.Provider value={{ open: () => { setIsOpen(true); playSound("open"); }, close: () => { setIsOpen(false); playSound("close"); }, isOpen }}>
      {children}
      <QuickAddModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </QuickAddContext.Provider>
  );
}

export function useQuickAdd() {
  const ctx = useContext(QuickAddContext);
  if (!ctx) throw new Error("useQuickAdd must be used within QuickAddProvider");
  return ctx;
}
