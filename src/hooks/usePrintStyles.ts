"use client";

import { useEffect } from "react";

export function usePrintStyles() {
  useEffect(() => {
    const style = document.createElement("style");
    style.id = "print-styles";
    style.textContent = `
      @media print {
        body * { visibility: hidden; }
        .print-area, .print-area * { visibility: visible; }
        .print-area { position: absolute; left: 0; top: 0; width: 100%; }
        nav, button, .no-print { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById("print-styles");
      if (el) el.remove();
    };
  }, []);
}
