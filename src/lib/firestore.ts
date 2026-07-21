import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Expense, Budget, UserSettings, CategoryItem, Lend } from "./types";
import { DEFAULT_CATEGORIES } from "./types";

const EXPENSES_COL = "expenses";
const BUDGETS_COL = "budgets";
const SETTINGS_COL = "settings";
const CATEGORIES_COL = "categories";
const LENDS_COL = "lends";

export async function getExpenses(userId: string): Promise<Expense[]> {
  const q = query(
    collection(db, EXPENSES_COL),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Expense));
}

export async function addExpense(
  id: string,
  data: Omit<Expense, "id" | "createdAt" | "updatedAt">
): Promise<void> {
  const now = Date.now();
  await setDoc(doc(db, EXPENSES_COL, id), {
    ...data,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateExpense(id: string, data: Partial<Expense>): Promise<void> {
  await updateDoc(doc(db, EXPENSES_COL, id), { ...data, updatedAt: Date.now() });
}

export async function deleteExpense(id: string): Promise<void> {
  await deleteDoc(doc(db, EXPENSES_COL, id));
}

export async function getBudget(userId: string, month: string): Promise<Budget | null> {
  const q = query(
    collection(db, BUDGETS_COL),
    where("userId", "==", userId),
    where("month", "==", month)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Budget;
}

export async function setBudget(
  userId: string,
  month: string,
  amount: number
): Promise<void> {
  const existing = await getBudget(userId, month);
  const now = Date.now();
  if (existing) {
    await updateDoc(doc(db, BUDGETS_COL, existing.id), { amount, updatedAt: now });
  } else {
    await setDoc(doc(db, BUDGETS_COL, `budget_${userId}_${month}`), {
      userId,
      month,
      amount,
      createdAt: now,
      updatedAt: now,
    });
  }
}

export async function getSettings(userId: string): Promise<UserSettings | null> {
  const q = query(collection(db, SETTINGS_COL), where("userId", "==", userId));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as UserSettings;
}

export async function saveSettings(
  userId: string,
  data: Partial<Omit<UserSettings, "id" | "userId" | "createdAt" | "updatedAt">>
): Promise<void> {
  const existing = await getSettings(userId);
  const now = Date.now();
  if (existing) {
    await updateDoc(doc(db, SETTINGS_COL, existing.id), { ...data, updatedAt: now });
  } else {
    await setDoc(doc(db, SETTINGS_COL, `settings_${userId}`), {
      userId,
      theme: "light",
      currency: "₹",
      ...data,
      createdAt: now,
      updatedAt: now,
    });
  }
}

export async function getCategories(userId: string): Promise<CategoryItem[]> {
  const q = query(collection(db, CATEGORIES_COL), where("userId", "==", userId));
  const snap = await getDocs(q);
  if (snap.empty) return DEFAULT_CATEGORIES;
  return snap.docs.map((d) => d.data() as CategoryItem);
}

// ─── Lends ──────────────────────────────────────────

export async function getLends(userId: string): Promise<Lend[]> {
  const q = query(
    collection(db, LENDS_COL),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Lend));
}

export async function addLend(id: string, data: Omit<Lend, "id" | "createdAt" | "updatedAt">): Promise<void> {
  const now = Date.now();
  await setDoc(doc(db, LENDS_COL, id), { ...data, createdAt: now, updatedAt: now });
}

export async function updateLend(id: string, data: Partial<Lend>): Promise<void> {
  await updateDoc(doc(db, LENDS_COL, id), { ...data, updatedAt: Date.now() });
}

export async function deleteLend(id: string): Promise<void> {
  await deleteDoc(doc(db, LENDS_COL, id));
}
