"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";

const features = [
  { icon: "💰", title: "Expense Tracking", desc: "Add, edit, delete expenses with swipe gestures. Quick-add modal from anywhere.", color: "from-violet-500 to-indigo-500" },
  { icon: "📊", title: "Reports & Charts", desc: "Monthly breakdowns, category pie charts, bar graphs, line trends.", color: "from-blue-500 to-cyan-500" },
  { icon: "👥", title: "Lends Manager", desc: "Track money lent to friends. Record returns. Never lose track.", color: "from-emerald-500 to-teal-500" },
  { icon: "📅", title: "Expense Calendar", desc: "Visual calendar showing daily spending. Tap any day for details.", color: "from-rose-500 to-pink-500" },
  { icon: "🎯", title: "Budget Alerts", desc: "Set monthly budget. Get warnings when close, alerts when over.", color: "from-amber-500 to-orange-500" },
  { icon: "🔍", title: "Smart Search", desc: "Search by name, category, amount, or date. Advanced filters.", color: "from-purple-500 to-violet-500" },
  { icon: "🌙", title: "Dark Mode", desc: "Beautiful dark theme with consistent styling across all pages.", color: "from-gray-600 to-gray-800" },
  { icon: "🔔", title: "Daily Notifications", desc: "Set a time. Get a browser notification with today's spending summary.", color: "from-pink-500 to-rose-500" },
  { icon: "💳", title: "Payment Modes", desc: "Online/offline tracking. Choose from 7 payment apps including SuperMoney.", color: "from-orange-500 to-red-500" },
  { icon: "📄", title: "PDF Export", desc: "Generate beautiful monthly PDF reports. Also export CSV and JSON.", color: "from-teal-500 to-green-500" },
  { icon: "🎵", title: "Sound & Haptics", desc: "14 sound effects. Phone vibration on key actions. Premium feedback.", color: "from-indigo-500 to-blue-500" },
  { icon: "🔄", title: "Swipe Navigation", desc: "Swipe left/right to move between tabs. Swipe expense cards to favorite/delete.", color: "from-yellow-500 to-amber-500" },
];

export default function DashboardHero({ name }: { name: string }) {
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <>
      <div onClick={() => setShowFeatures(true)} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 p-6 md:p-8 text-white shadow-2xl shadow-violet-300/30 dark:shadow-violet-900/30 cursor-pointer active:scale-[0.98] transition-transform">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <svg viewBox="0 0 200 200"><circle cx="160" cy="40" r="60" fill="white"/><circle cx="100" cy="100" r="80" fill="white"/><circle cx="40" cy="160" r="50" fill="white"/></svg>
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-violet-200 font-medium mb-1">Good {getGreeting()},</p>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">{name}</h1>
              <p className="text-violet-200/80 text-sm">Tap to explore all features</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["💳","💰","📊","🏠"].map((e,i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-sm border-2 border-white/30">{e}</div>
              ))}
            </div>
            <span className="text-xs text-violet-200">← Swipe to navigate tabs →</span>
          </div>
        </div>
      </div>

      <Modal isOpen={showFeatures} onClose={() => setShowFeatures(false)} title="All Features" size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {features.map((f) => (
            <div key={f.title} className={`p-4 rounded-2xl bg-gradient-to-br ${f.color} text-white`}>
              <p className="text-2xl mb-2">{f.icon}</p>
              <h3 className="text-sm font-bold mb-1">{f.title}</h3>
              <p className="text-xs opacity-80 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Morning";
  if (h < 17) return "Afternoon";
  return "Evening";
}
