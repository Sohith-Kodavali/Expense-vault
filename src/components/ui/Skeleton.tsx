"use client";

export function StatsCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-4 md:p-5 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-9 w-9 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
      <div className="h-7 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg" />
    </div>
  );
}

export function ExpenseCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
      <div className="flex gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex-1 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="flex-1 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="flex-1 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 animate-pulse">
      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2" />
      <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-6" />
      <div className="h-52 bg-gray-100 dark:bg-gray-800 rounded-xl" />
    </div>
  );
}

export function LendCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 bg-gray-200 dark:bg-gray-700 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
        </div>
        <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
      <div className="flex gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex-1 h-9 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="h-9 w-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>
  );
}
