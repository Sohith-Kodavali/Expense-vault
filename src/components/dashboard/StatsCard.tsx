"use client";

import { motion } from "framer-motion";

interface StatsCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  delay?: number;
  onClick?: () => void;
}

export default function StatsCard({ label, value, icon, color, bg, delay = 0, onClick }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      onClick={onClick}
      className={`glass-card rounded-2xl p-4 md:p-5 transition-all duration-200 ${onClick ? "cursor-pointer active:scale-[0.98]" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
        <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight tabular-nums">
        {value}
      </div>
    </motion.div>
  );
}
