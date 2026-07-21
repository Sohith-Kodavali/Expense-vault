import type { ReactNode } from "react";

interface EmptyStateProps {
  type?: "expenses" | "lends" | "reports" | "calendar" | "search" | "generic";
  title?: string;
  description?: string;
  action?: ReactNode;
}

const illustrations = {
  expenses: (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <rect x="20" y="10" width="80" height="55" rx="12" fill="rgba(124,58,237,0.08)" stroke="rgba(124,58,237,0.2)" strokeWidth="1.5" />
      <rect x="30" y="20" width="60" height="3" rx="1.5" fill="rgba(124,58,237,0.3)" />
      <rect x="30" y="28" width="40" height="3" rx="1.5" fill="rgba(124,58,237,0.15)" />
      <rect x="30" y="36" width="55" height="3" rx="1.5" fill="rgba(124,58,237,0.15)" />
      <rect x="30" y="44" width="35" height="3" rx="1.5" fill="rgba(124,58,237,0.15)" />
      <rect x="30" y="52" width="50" height="3" rx="1.5" fill="rgba(124,58,237,0.15)" />
      <circle cx="95" cy="20" r="10" fill="rgba(124,58,237,0.12)" />
      <path d="M92 17l3 3 5-5" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="30" y="75" width="60" height="12" rx="6" fill="url(#grad1)" />
      <defs>
        <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#7c3aed"/><stop offset="1" stopColor="#6366f1"/></linearGradient>
      </defs>
    </svg>
  ),
  lends: (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <circle cx="45" cy="30" r="16" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.25)" strokeWidth="1.5" />
      <circle cx="45" cy="23" r="5" fill="rgba(16,185,129,0.3)" />
      <path d="M33 50c0 0 2-8 12-8s12 8 12 8" stroke="rgba(16,185,129,0.3)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="75" cy="30" r="16" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.25)" strokeWidth="1.5" />
      <circle cx="75" cy="23" r="5" fill="rgba(16,185,129,0.3)" />
      <path d="M63 50c0 0 2-8 12-8s12 8 12 8" stroke="rgba(16,185,129,0.3)" strokeWidth="2" strokeLinecap="round" />
      <rect x="25" y="65" width="70" height="20" rx="10" fill="rgba(16,185,129,0.08)" stroke="rgba(16,185,129,0.2)" strokeWidth="1.5" />
      <path d="M40 73l8 5 15-10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="60" y="76" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="700">₹0</text>
    </svg>
  ),
  reports: (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <rect x="15" y="40" width="12" height="40" rx="3" fill="rgba(124,58,237,0.15)" />
      <rect x="32" y="25" width="12" height="55" rx="3" fill="rgba(124,58,237,0.2)" />
      <rect x="49" y="35" width="12" height="45" rx="3" fill="rgba(124,58,237,0.25)" />
      <rect x="66" y="15" width="12" height="65" rx="3" fill="rgba(124,58,237,0.3)" />
      <rect x="83" y="30" width="12" height="50" rx="3" fill="rgba(124,58,237,0.22)" />
      <rect x="10" y="80" width="100" height="2" rx="1" fill="rgba(124,58,237,0.1)" />
      <circle cx="60" cy="12" r="6" fill="rgba(124,58,237,0.12)" stroke="#7c3aed" strokeWidth="1.5" />
      <path d="M57 12l2 2 4-4" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  calendar: (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <rect x="15" y="10" width="90" height="75" rx="12" fill="rgba(244,63,94,0.06)" stroke="rgba(244,63,94,0.2)" strokeWidth="1.5" />
      <rect x="25" y="25" width="70" height="3" rx="1.5" fill="rgba(244,63,94,0.15)" />
      <rect x="25" y="34" width="70" height="3" rx="1.5" fill="rgba(244,63,94,0.15)" />
      <circle cx="40" cy="53" r="8" fill="rgba(244,63,94,0.12)" stroke="rgba(244,63,94,0.3)" strokeWidth="1.5" />
      <circle cx="80" cy="53" r="8" fill="rgba(244,63,94,0.12)" stroke="rgba(244,63,94,0.3)" strokeWidth="1.5" />
      <circle cx="60" cy="73" r="8" fill="rgba(244,63,94,0.12)" stroke="rgba(244,63,94,0.3)" strokeWidth="1.5" />
      <path d="M35 53l3 3 5-5" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M75 53l3 3 5-5" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  search: (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
      <circle cx="42" cy="42" r="18" stroke="rgba(124,58,237,0.2)" strokeWidth="2" />
      <path d="M55 55l18 18" stroke="rgba(124,58,237,0.2)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="34" cy="42" r="2" fill="rgba(124,58,237,0.3)" />
      <circle cx="42" cy="38" r="2" fill="rgba(124,58,237,0.2)" />
      <circle cx="46" cy="46" r="2" fill="rgba(124,58,237,0.2)" />
    </svg>
  ),
  generic: (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
      <rect x="20" y="15" width="60" height="70" rx="14" fill="rgba(124,58,237,0.06)" stroke="rgba(124,58,237,0.15)" strokeWidth="1.5" />
      <rect x="32" y="30" width="36" height="4" rx="2" fill="rgba(124,58,237,0.2)" />
      <rect x="32" y="40" width="28" height="4" rx="2" fill="rgba(124,58,237,0.12)" />
      <rect x="32" y="50" width="32" height="4" rx="2" fill="rgba(124,58,237,0.12)" />
      <rect x="32" y="60" width="20" height="4" rx="2" fill="rgba(124,58,237,0.12)" />
      <circle cx="50" cy="80" r="3" fill="rgba(124,58,237,0.3)" />
    </svg>
  ),
};

const defaultTitles = {
  expenses: "No expenses yet",
  lends: "No lends recorded",
  reports: "No data to report",
  calendar: "Nothing scheduled",
  search: "No results found",
  generic: "Nothing here yet",
};

const defaultDescriptions = {
  expenses: "Tap + to add your first expense",
  lends: "Track money you've lent to friends",
  reports: "Add some expenses to see insights",
  calendar: "Expenses will appear on the calendar",
  search: "Try a different search or filter",
  generic: "Start by adding some data",
};

export default function EmptyState({ type = "generic", title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
      <div className="mb-6">
        {illustrations[type]}
      </div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
        {title || defaultTitles[type]}
      </h3>
      <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs mb-6 leading-relaxed">
        {description || defaultDescriptions[type]}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
