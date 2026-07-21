"use client";

import { motion } from "framer-motion";

export default function FloatingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div
        animate={{ y: [-40, 40, -40], x: [-20, 20, -20], scale: [1, 1.05, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] left-[5%] w-72 h-72 rounded-full opacity-[0.03] dark:opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #7c3aed, transparent 70%)" }}
      />
      <motion.div
        animate={{ y: [30, -30, 30], x: [15, -15, 15], scale: [1, 0.97, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[60%] right-[8%] w-80 h-80 rounded-full opacity-[0.03] dark:opacity-[0.06]"
        style={{ background: "radial-gradient(circle, #06d6a0, transparent 70%)" }}
      />
      <motion.div
        animate={{ y: [20, -20, 20], x: [-10, 10, -10], scale: [0.98, 1.03, 0.98] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[30%] left-[60%] w-64 h-64 rounded-full opacity-[0.02] dark:opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #f59e0b, transparent 70%)" }}
      />
      <motion.div
        animate={{ y: [-25, 35, -25], x: [20, -10, 20], scale: [1, 1.04, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute bottom-[20%] left-[30%] w-56 h-56 rounded-full opacity-[0.02] dark:opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #ec4899, transparent 70%)" }}
      />
    </div>
  );
}
