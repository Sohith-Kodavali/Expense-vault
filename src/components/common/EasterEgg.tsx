"use client";

import { useRef, useState } from "react";
import Confetti from "@/components/common/Confetti";
import { playSound } from "@/lib/sounds";

export default function EasterEgg() {
  const taps = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showEgg, setShowEgg] = useState(false);

  const handleTap = () => {
    taps.current++;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { taps.current = 0; }, 1500);

    if (taps.current >= 5) {
      taps.current = 0;
      setShowEgg(true);
      playSound("achievement");
      setTimeout(() => setShowEgg(false), 3000);
    }
  };

  return (
    <>
      <Confetti trigger={showEgg} />
      <button
        onClick={handleTap}
        className="fixed bottom-[4.5rem] md:bottom-4 left-1/2 -translate-x-1/2 md:right-6 md:left-auto md:translate-x-0 z-10 text-[9px] font-semibold text-gray-300 dark:text-gray-600 tracking-[0.2em] uppercase cursor-default select-none"
      >
        Made by Sohith
      </button>
      {showEgg && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center pointer-events-none">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-5 rounded-3xl shadow-2xl text-center animate-bounce-in">
            <p className="text-3xl mb-2">🎉</p>
            <p className="text-lg font-bold">You found the secret!</p>
            <p className="text-sm opacity-80 mt-1">Built with ❤️ by Sohith</p>
          </div>
        </div>
      )}
    </>
  );
}
