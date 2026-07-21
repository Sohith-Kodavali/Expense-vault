"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function SuccessRipple({ trigger, onDone }: { trigger: boolean; onDone?: () => void }) {
  return (
    <AnimatePresence>
      {trigger && (
        <motion.div
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 6, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          onAnimationComplete={onDone}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full pointer-events-none z-[300]"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.3), transparent 70%)" }}
        />
      )}
    </AnimatePresence>
  );
}
