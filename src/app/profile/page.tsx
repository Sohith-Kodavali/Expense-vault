"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

export default function ProfilePage() {
  const { displayName, setDisplayName, changePassword, logout } = useUser();
  const router = useRouter();
  const [name, setName] = useState(displayName);
  const [saved, setSaved] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [passError, setPassError] = useState("");
  const [passSuccess, setPassSuccess] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const handleSaveName = () => {
    if (!name.trim()) return;
    setDisplayName(name.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(""); setPassSuccess(false);
    if (!oldPass || !newPass || !confirmPass) { setPassError("All fields required"); return; }
    if (newPass.length < 4) { setPassError("Min 4 characters"); return; }
    if (newPass !== confirmPass) { setPassError("Passwords don't match"); return; }
    const ok = await changePassword(oldPass, newPass);
    if (!ok) { setPassError("Current password is wrong"); return; }
    setOldPass(""); setNewPass(""); setConfirmPass("");
    setPassSuccess(true);
    setTimeout(() => setPassSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="max-w-lg mx-auto w-full px-4 sm:px-6 space-y-5 pt-6 pb-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        </div>
        <div><h1 className="text-xl font-bold text-gray-900 dark:text-white">Account</h1><p className="text-sm text-gray-500 dark:text-gray-400">Profile & settings</p></div>
      </motion.div>

      {/* Profile Card */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Profile</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-violet-200">
            {displayName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div><p className="text-lg font-bold text-gray-900 dark:text-white">{displayName}</p><p className="text-sm text-gray-500">Personal Account</p></div>
        </div>
        <div className="space-y-3">
          <Input label="Display Name" value={name} onChange={(e) => setName(e.target.value)} />
          <Button onClick={handleSaveName} size="sm">{saved ? "Saved!" : "Update Name"}</Button>
        </div>
      </div>

      {/* Password Card */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Security</h3>
        <form onSubmit={handleChangePassword} className="space-y-3">
          <Input label="Current Password" type="password" placeholder="••••" value={oldPass} onChange={(e) => setOldPass(e.target.value)} />
          <Input label="New Password" type="password" placeholder="Min. 4 characters" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
          <Input label="Confirm Password" type="password" placeholder="Re-enter" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
          {passError && <p className="text-xs text-rose-500 font-medium bg-rose-50 dark:bg-rose-900/20 px-3 py-2 rounded-lg">{passError}</p>}
          {passSuccess && <p className="text-xs text-emerald-600 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg">Password changed!</p>}
          <Button type="submit" size="sm">Change Password</Button>
        </form>
      </div>

      {/* Logout Card */}
      <div className="glass-card rounded-2xl p-5 border-rose-200 dark:border-rose-800">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Session</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Sign out of your account on this device.</p>
        <Button variant="danger" onClick={() => setShowLogout(true)} className="w-full">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>
          Sign Out
        </Button>
      </div>

      <Modal isOpen={showLogout} onClose={() => setShowLogout(false)} title="Sign Out" size="sm">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Are you sure you want to sign out?</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowLogout(false)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleLogout} className="flex-1">Sign Out</Button>
        </div>
      </Modal>
    </div>
  );
}
