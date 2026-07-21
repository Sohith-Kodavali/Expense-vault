"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "undo";
  action?: { label: string; onClick: () => void };
}

interface ToastContextType {
  showToast: (message: string, type?: Toast["type"], action?: Toast["action"]) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: Toast["type"] = "info", action?: Toast["action"]) => {
      const id = String(++nextId);
      const newToast: Toast = { id, message, type, action };
      setToasts((prev) => [...prev, newToast]);
      if (type !== "undo") {
        setTimeout(() => removeToast(id), 4000);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className={toastClass(toast.type)}
          >
            <span>{toast.message}</span>
            {toast.action && (
              <button
                onClick={toast.action.onClick}
                className="ml-3 font-medium underline shrink-0"
              >
                {toast.action.label}
              </button>
            )}
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 shrink-0 opacity-60 hover:opacity-100 text-lg leading-none"
              aria-label="Close"
            >
              &times;
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function toastClass(type: Toast["type"]): string {
  const base =
    "flex items-center px-4 py-3 rounded-2xl shadow-xl backdrop-blur-xl border text-sm font-medium max-w-sm w-auto pointer-events-auto";

  switch (type) {
    case "success":
      return base + " bg-emerald-50/90 border-emerald-200 text-emerald-800";
    case "error":
      return base + " bg-rose-50/90 border-rose-200 text-rose-800";
    case "info":
      return base + " bg-white/90 border-gray-200 text-gray-800";
    case "undo":
      return base + " bg-gray-900/95 border-gray-700 text-white";
    default:
      return base + " bg-white/90 border-gray-200 text-gray-800";
  }
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
