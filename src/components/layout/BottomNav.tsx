"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuickAdd } from "@/context/QuickAddContext";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const tabs = [
  { href: "/", label: "Home", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" },
  { href: "/expenses", label: "Expenses", icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" },
  { href: "/lends", label: "Lends", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" },
  { href: "/calendar", label: "Calendar", icon: "M8 2v4M16 2v4M3 10h18M21 12V6a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h7" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { open } = useQuickAdd();
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState(28);
  const navRef = useRef<HTMLDivElement>(null);

  const activeIndex = tabs.findIndex(t => t.href === pathname || (t.href !== "/" && pathname.startsWith(t.href)));

  useEffect(() => {
    if (activeIndex < 0) return;
    const el = navRef.current;
    if (!el) return;
    const tabEls = el.querySelectorAll("[data-tab]");
    const activeEl = tabEls[activeIndex] as HTMLElement;
    if (!activeEl) return;
    const tabRect = activeEl.getBoundingClientRect();
    const navRect = el.getBoundingClientRect();
    setIndicatorLeft(tabRect.left - navRect.left + tabRect.width / 2);
    setIndicatorWidth(28);
  }, [activeIndex, pathname]);

  return (
    <nav ref={navRef} className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass border-t border-black/5 dark:border-white/5 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2 relative">
        {/* Liquid indicator */}
        {activeIndex >= 0 && (
          <motion.div
            className="absolute top-1.5 h-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full z-0"
            animate={{ left: indicatorLeft - indicatorWidth / 2, width: indicatorWidth }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          />
        )}

        {tabs.map((tab) => {
          const active = tab.href === pathname || (tab.href !== "/" && pathname.startsWith(tab.href));
          return (
            <Link key={tab.href} href={tab.href} data-tab
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition-colors min-w-0 relative z-10
                ${active ? "text-violet-600 dark:text-violet-400" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? "2.2" : "1.75"} strokeLinecap="round" strokeLinejoin="round">
                <path d={tab.icon} />
              </svg>
              <span className="text-[10px] font-semibold">{tab.label}</span>
            </Link>
          );
        })}

        <button onClick={open} className="flex flex-col items-center justify-center -mt-5 cursor-pointer relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-300 active:scale-95 transition-transform">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span className="text-[10px] text-violet-600 dark:text-violet-400 font-semibold mt-0.5">Add</span>
        </button>
      </div>
    </nav>
  );
}
