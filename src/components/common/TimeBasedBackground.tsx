"use client";

import { useEffect } from "react";

export default function TimeBasedBackground() {
  useEffect(() => {
    const update = () => {
      const hour = new Date().getHours();
      let grad: string;
      if (hour >= 5 && hour < 8) grad = "linear-gradient(180deg, #fef3c7 0%, #fdf2f8 50%, #faf9fe 100%)";
      else if (hour >= 8 && hour < 12) grad = "linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 40%, #faf9fe 100%)";
      else if (hour >= 12 && hour < 17) grad = "linear-gradient(180deg, #dbeafe 0%, #faf9fe 50%, #fefce8 100%)";
      else if (hour >= 17 && hour < 20) grad = "linear-gradient(180deg, #fce7f3 0%, #fdf2f8 40%, #1a1a2e 100%)";
      else grad = "linear-gradient(180deg, #1e1b4b 0%, #0f0f2a 50%, #07071a 100%)";

      const isDark = document.documentElement.classList.contains("dark");
      if (!isDark && hour < 20) {
        document.body.style.background = grad;
        document.body.style.backgroundAttachment = "fixed";
      } else {
        document.body.style.background = "";
        document.body.style.backgroundAttachment = "";
      }
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
