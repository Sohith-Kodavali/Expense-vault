"use client";

import { useEffect, useState, useRef } from "react";

export default function AnimatedCounter({ value, prefix = "", duration = 800 }: { value: number; prefix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    const diff = end - start;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + diff * eased);
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    prevValue.current = end;
  }, [value, duration]);

  const formatted = prefix + display.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return <span className="tabular-nums">{formatted}</span>;
}
