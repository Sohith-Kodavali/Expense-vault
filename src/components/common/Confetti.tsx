"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiProps {
  trigger: boolean;
  onDone?: () => void;
}

const COLORS = ["#7c3aed", "#a78bfa", "#06d6a0", "#f59e0b", "#ec4899", "#3b82f6"];
const EMOJIS = ["✨", "💰", "🎉", "💎", "🌟", "🔥"];

export default function Confetti({ trigger, onDone }: ConfettiProps) {
  const [pieces, setPieces] = useState<{ id: number; x: number; color: string; emoji: string; delay: number; rotate: number }[]>([]);

  useEffect(() => {
    if (!trigger) return;
    const arr = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      delay: Math.random() * 0.3,
      rotate: (Math.random() - 0.5) * 720,
    }));
    setPieces(arr);
    const t = setTimeout(() => { setPieces([]); onDone?.(); }, 2000);
    return () => clearTimeout(t);
  }, [trigger, onDone]);

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
          {pieces.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, y: -60, x: `${p.x}vw`, scale: 0 }}
              animate={{ opacity: [1, 1, 0], y: "110vh", x: `${p.x + (Math.random() - 0.5) * 30}vw`, scale: [0, 1.2, 0.8], rotate: p.rotate }}
              transition={{ duration: 1.5 + Math.random(), delay: p.delay, ease: "easeIn" }}
              className="absolute text-2xl"
              style={{ left: `${p.x}%` }}
            >
              {p.emoji}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
