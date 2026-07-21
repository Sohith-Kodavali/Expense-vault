export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  createdAt: number;
  updatedAt: number;
}

export type ExpenseCategory = string;

export interface Expense {
  id: string;
  userId: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  time: string;
  notes: string;
  receiptUrl?: string;
  paymentMode: "online" | "offline";
  paymentApp?: string;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
}

export type LendStatus = "pending" | "partial" | "received";

export interface Lend {
  id: string;
  userId: string;
  friendName: string;
  amount: number;
  amountReceived: number;
  date: string;
  expectedDate?: string;
  status: LendStatus;
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface Budget {
  id: string;
  userId: string;
  month: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

export interface Balance {
  id: string;
  userId: string;
  amount: number;
  createdAt: number;
  updatedAt: number;
}

export interface PredefinedExpense {
  id: string;
  name: string;
  amount: number;
  category: ExpenseCategory;
  paymentMode: "online" | "offline";
  paymentApp?: string;
  notes?: string;
}

export interface UserSettings {
  id: string;
  userId: string;
  theme: "light" | "dark";
  currency: string;
  notifyEnabled: boolean;
  notifyTime: string;
  createdAt: number;
  updatedAt: number;
}

export interface CategoryItem {
  value: ExpenseCategory;
  label: string;
  icon: string;
  color: string;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { value: "food", label: "Food", icon: "🍔", color: "#f97316" },
  { value: "travel", label: "Travel", icon: "✈️", color: "#3b82f6" },
  { value: "fuel", label: "Fuel", icon: "⛽", color: "#ef4444" },
  { value: "shopping", label: "Shopping", icon: "🛍️", color: "#ec4899" },
  { value: "medical", label: "Medical", icon: "💊", color: "#14b8a6" },
  { value: "bills", label: "Bills", icon: "🧾", color: "#6b7280" },
  { value: "entertainment", label: "Entertainment", icon: "🎬", color: "#a855f7" },
  { value: "education", label: "Education", icon: "📚", color: "#6366f1" },
  { value: "hostel", label: "Hostel", icon: "🏨", color: "#0ea5e9" },
  { value: "rent", label: "Rent", icon: "🏠", color: "#84cc16" },
  { value: "recharge", label: "Recharge", icon: "📱", color: "#06b6d4" },
  { value: "other", label: "Other", icon: "📦", color: "#78716c" },
];

export const PAYMENT_APPS = [
  { value: "supermoney", label: "SuperMoney", icon: "💳" },
  { value: "gpay", label: "Google Pay", icon: "🔵" },
  { value: "phonepe", label: "PhonePe", icon: "🟣" },
  { value: "paytm", label: "Paytm", icon: "🔷" },
  { value: "amazonpay", label: "Amazon Pay", icon: "🟠" },
  { value: "cred", label: "CRED", icon: "⚫" },
  { value: "other", label: "Other", icon: "📱" },
];

export const CURRENCIES = [
  { value: "₹", label: "INR (₹)" },
  { value: "$", label: "USD ($)" },
  { value: "€", label: "EUR (€)" },
  { value: "£", label: "GBP (£)" },
  { value: "¥", label: "JPY (¥)" },
  { value: "₩", label: "KRW (₩)" },
  { value: "A$", label: "AUD (A$)" },
  { value: "C$", label: "CAD (C$)" },
];
