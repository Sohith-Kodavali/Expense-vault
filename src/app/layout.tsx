import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { ToastProvider } from "@/context/ToastContext";
import { QuickAddProvider } from "@/context/QuickAddContext";
import EasterEgg from "@/components/common/EasterEgg";
import AppLayout from "@/components/layout/AppLayout";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExpenseVault — Premium Expense Tracker",
  description: "Track daily expenses with elegance.",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.svg", apple: "/icon-192.png" },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "ExpenseVault" },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, maximumScale: 1, themeColor: "#7c3aed",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem("expensevault-theme");if(t==="dark")document.documentElement.classList.add("dark")}catch(e){}})()` }} />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--background)] transition-colors relative">
        <UserProvider>
          <SettingsProvider>
            <ToastProvider>
              <QuickAddProvider>
                <AppLayout>{children}</AppLayout>
              </QuickAddProvider>
            </ToastProvider>
          </SettingsProvider>
        </UserProvider>
        <EasterEgg />
      </body>
    </html>
  );
}
