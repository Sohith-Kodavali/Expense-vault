"use client";

import { motion } from "framer-motion";
import { useQuickAdd } from "@/context/QuickAddContext";

export default function FloatingButton() {
  const { open } = useQuickAdd();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={open}
      className="hidden md:flex fixed bottom-8 right-8 z-30 w-14 h-14 rounded-2xl
        bg-gradient-to-br from-violet-600 to-indigo-600 text-white
        shadow-xl shadow-violet-300/50 hover:shadow-2xl hover:shadow-violet-400/50
        items-center justify-center transition-all duration-300 cursor-pointer animate-glow-pulse"
      title="Quick Add Expense (Ctrl+N)"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </motion.button>
  );
}
