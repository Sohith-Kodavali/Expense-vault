"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    title: "Welcome to ExpenseVault",
    description: "Your premium personal expense tracker. Private, fast, and beautiful.",
    icon: (
      <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3 }} className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-400/30">
        <span className="text-white text-3xl font-black">₹</span>
      </motion.div>
    ),
    bg: "from-violet-600 to-indigo-600",
  },
  {
    title: "Track Every Rupee",
    description: "Add expenses in seconds. Tap to favorite or delete. Quick-add from + button anywhere.",
    icon: (
      <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-400/30">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </motion.div>
    ),
    bg: "from-emerald-500 to-teal-600",
  },
  {
    title: "Lend & Track",
    description: "Lent money to a friend? Track it. Record returns. Never lose track of who owes what.",
    icon: (
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-2xl shadow-amber-400/30">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
      </motion.div>
    ),
    bg: "from-amber-400 to-orange-500",
  },
  {
    title: "You're All Set",
    description: "Your data stays private on this device. Login on any phone to sync.",
    icon: (
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2, repeatDelay: 0.5 }} className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-2xl shadow-rose-400/30">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
      </motion.div>
    ),
    bg: "from-rose-400 to-pink-500",
  },
];

export default function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = () => {
    setDirection(1);
    if (step < steps.length - 1) setStep(step + 1);
    else onDone();
  };

  const prev = () => {
    setDirection(-1);
    if (step > 0) setStep(step - 1);
  };

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-md p-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: direction * 60, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -direction * 60, scale: 0.92 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className={`bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-white/10`}
        >
          <div className="flex justify-center mb-8">
            {steps[step].icon}
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{steps[step].title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 leading-relaxed px-2">{steps[step].description}</p>

          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((_, i) => (
              <motion.div
                key={i}
                animate={{ width: i === step ? 24 : 8, backgroundColor: i === step ? "#7c3aed" : "#d1d5db" }}
                className="h-2 rounded-full transition-all"
              />
            ))}
          </div>

          <div className="flex gap-3">
            {step > 0 && (
              <button onClick={prev} className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-semibold text-sm active:scale-[0.97] transition-all">
                Back
              </button>
            )}
            <button onClick={next} className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${steps[step].bg} text-white font-semibold text-sm shadow-lg active:scale-[0.97] transition-all`}>
              {step < steps.length - 1 ? "Next" : "Get Started"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
