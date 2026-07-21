"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
import { useUser } from "@/context/UserContext";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import InteractiveParticleField from "@/components/common/InteractiveParticleField";
import FloatingOrbs from "@/components/common/FloatingOrbs";
import NotificationManager from "@/components/common/NotificationManager";
import Onboarding from "@/components/common/Onboarding";
import { motion } from "framer-motion";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!loading && isLoggedIn && !isAuthPage) {
      const done = localStorage.getItem("expensevault-onboarded");
      if (!done) setShowOnboarding(true);
    }
  }, [loading, isLoggedIn, isAuthPage]);

  const handleOnboardingDone = () => {
    localStorage.setItem("expensevault-onboarded", "1");
    setShowOnboarding(false);
  };

  // Swipe navigation between tabs
  const tabs = ["/", "/expenses", "/lends", "/calendar"];
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return;

    const idx = tabs.indexOf(pathname === "/" ? "/" : `/${pathname.split("/")[1]}`);
    if (idx === -1) return;
    if (dx < 0 && idx < tabs.length - 1) router.push(tabs[idx + 1]);
    else if (dx > 0 && idx > 0) router.push(tabs[idx - 1]);
  }, [pathname, router]);

  useEffect(() => {
    if (!loading && !isLoggedIn && !isAuthPage) router.push("/login");
  }, [isLoggedIn, loading, isAuthPage, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center animate-glow-pulse shadow-2xl shadow-violet-300/50">
            <span className="text-white text-2xl font-black">₹</span>
          </motion.div>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-2.5 h-2.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
    );
  }

  if (isAuthPage) {
    return (
      <>
      <InteractiveParticleField />
      <FloatingOrbs />
      {children}
      </>
    );
  }

  if (!isLoggedIn) return null;

  return (
    <>
      <InteractiveParticleField />
      <FloatingOrbs />
      <Navbar />
      <NotificationManager />
      <motion.main key={pathname} initial={{ opacity: 0, x: 0 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 flex flex-col pt-14 pb-24 md:pb-8 relative z-10"
        onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {children}
      </motion.main>
      {showOnboarding && <Onboarding onDone={handleOnboardingDone} />}
      <BottomNav />
    </>
  );
}
