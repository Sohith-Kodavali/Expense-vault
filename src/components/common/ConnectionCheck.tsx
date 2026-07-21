"use client";

import { useEffect, useState } from "react";
import { doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ConnectionCheck() {
  const [status, setStatus] = useState<"checking" | "ok" | "error">("checking");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const testId = "_conn_test_" + Date.now();
    const run = async () => {
      try {
        const ref = doc(db, "expenses", testId);
        await setDoc(ref, { _test: true, createdAt: Date.now() });
        const snap = await getDoc(ref);
        if (!snap.exists()) throw new Error("Write succeeded but read failed");
        await deleteDoc(ref);
        setStatus("ok");
      } catch (err: unknown) {
        setStatus("error");
        const msg = err instanceof Error ? err.message : "Unknown error";
        if (msg.includes("permission")) setErrorMsg("Firestore permissions denied — set rules to test mode");
        else if (msg.includes("project")) setErrorMsg("Firestore database not created in Firebase Console");
        else setErrorMsg(msg);
      }
    };
    run();
  }, []);

  if (status === "ok") return null;

  return (
    <div className={`mx-4 sm:mx-6 rounded-2xl p-4 text-sm font-medium ${
      status === "checking" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400" :
      "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400"
    }`}>
      {status === "checking" ? "Checking Firestore connection..." : `Firestore Error: ${errorMsg}`}
    </div>
  );
}
