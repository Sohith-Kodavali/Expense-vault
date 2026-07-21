"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UserData {
  userId: string;
  displayName: string;
  passwordHash: string;
}

interface UserContextType {
  userId: string;
  displayName: string;
  isLoggedIn: boolean;
  loading: boolean;
  login: (name: string, password: string) => Promise<boolean>;
  register: (name: string, password: string) => Promise<boolean>;
  logout: () => void;
  setDisplayName: (name: string) => void;
  changePassword: (oldPass: string, newPass: string) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | null>(null);

function hashId(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0;
  }
  return "user_" + Math.abs(hash).toString(36);
}

function encode(str: string): string {
  try { return btoa(str); } catch { return str; }
}

async function saveAuthToFirestore(data: UserData) {
  try {
    await setDoc(doc(db, "users", data.userId), {
      userId: data.userId,
      displayName: data.displayName,
      passwordHash: data.passwordHash,
      updatedAt: Date.now(),
    }, { merge: true });
  } catch { /* firestore down, localStorage is fallback */ }
}

async function getAuthFromFirestore(userId: string): Promise<UserData | null> {
  try {
    const snap = await getDoc(doc(db, "users", userId));
    if (snap.exists()) {
      const d = snap.data();
      return { userId: d.userId, displayName: d.displayName, passwordHash: d.passwordHash };
    }
  } catch { /* */ }
  return null;
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("expensevault-user");
    if (stored) {
      try { setUserData(JSON.parse(stored)); } catch { /* */ }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (name: string, password: string): Promise<boolean> => {
    const uid = hashId(name);
    const passHash = encode(password);

    // Try localStorage first
    const stored = localStorage.getItem("expensevault-user");
    if (stored) {
      try {
        const data: UserData = JSON.parse(stored);
        if (data.userId === uid && data.passwordHash === passHash) {
          setUserData(data);
          return true;
        }
      } catch { /* */ }
    }

    // Try Firestore (cross-device login)
    const remote = await getAuthFromFirestore(uid);
    if (remote && remote.passwordHash === passHash) {
      localStorage.setItem("expensevault-user", JSON.stringify(remote));
      setUserData(remote);
      return true;
    }

    return false;
  }, []);

  const register = useCallback(async (name: string, password: string): Promise<boolean> => {
    const uid = hashId(name);

    // Check Firestore first (name already taken on any device)
    const existing = await getAuthFromFirestore(uid);
    if (existing) return false;

    // Also check localStorage
    const stored = localStorage.getItem("expensevault-user");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        if (data.userId === uid) return false;
      } catch { /* */ }
    }

    const data: UserData = { userId: uid, displayName: name, passwordHash: encode(password) };
    localStorage.setItem("expensevault-user", JSON.stringify(data));
    await saveAuthToFirestore(data);
    setUserData(data);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUserData(null);
  }, []);

  const updateName = useCallback((name: string) => {
    if (!userData) return;
    const updated = { ...userData, displayName: name };
    localStorage.setItem("expensevault-user", JSON.stringify(updated));
    saveAuthToFirestore(updated);
    setUserData(updated);
  }, [userData]);

  const changePassword = useCallback(async (oldPass: string, newPass: string): Promise<boolean> => {
    if (!userData) return false;
    if (userData.passwordHash !== encode(oldPass)) return false;
    const updated = { ...userData, passwordHash: encode(newPass) };
    localStorage.setItem("expensevault-user", JSON.stringify(updated));
    await saveAuthToFirestore(updated);
    setUserData(updated);
    return true;
  }, [userData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-violet-600 animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{
        userId: userData?.userId || "",
        displayName: userData?.displayName || "",
        isLoggedIn: !!userData,
        loading,
        login,
        register,
        logout,
        setDisplayName: updateName,
        changePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
