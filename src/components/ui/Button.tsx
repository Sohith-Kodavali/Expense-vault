"use client";

import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  loading?: boolean;
  children: ReactNode;
}

const variants = {
  primary: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-900/30",
  secondary: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700",
  ghost: "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800",
  danger: "bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-lg shadow-rose-200 dark:shadow-rose-900/30",
  success: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30",
};

const sizes = { sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5", md: "px-4 py-2.5 text-sm rounded-xl gap-2", lg: "px-6 py-3 text-base rounded-2xl gap-2.5" };

export default function Button({ variant = "primary", size = "md", icon, loading, children, className = "", disabled, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.96, y: 0 }}
      className={`inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer
        ${variants[variant]} ${sizes[size]} ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      disabled={disabled || loading}
      {...(props as React.ComponentProps<typeof motion.button>)}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : icon ? <span className="shrink-0">{icon}</span> : null}
      {children}
    </motion.button>
  );
}
