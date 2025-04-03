"use client"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import { AuthProvider } from "../../firebase/AuthContext";
import { StatusProvider } from "@/components/statusProvider/statusProvider";
import ActiveUsers from "@/components/activeUsers/activeUsers";
import LockedSidebar from "@/components/sidebar/sidebar";
import { useAuth } from "../../firebase/AuthContext";
import React from "react"; // Import React for React.use
import WarningBanner from "@/components/OverHeadBanner/WarningBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ _orgid: string }>;
}>) {
  const { user } = useAuth();
  const resolvedParams = React.use(params);

  const [warnings, setWarnings] = React.useState<"no-internet" | "error" | "maintenance">(null);

  React.useEffect(() => {
    const handleOffline = () => setWarnings("no-internet");
    const handleOnline = () => setWarnings(null);

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <AuthProvider>
      <StatusProvider>
        <div
          className={`${geistSans.variable} ${geistMono.variable} flex flex-col antialiased overflow-hidden`}
        >
          <main className="bg-[#101218] text-foreground w-full overflow-hidden">
          <div className="flex flex-col h-screen overflow-hidden">
            <WarningBanner type={warnings} /> 
            <div className="flex flex-row flex-1 overflow-hidden">
            <LockedSidebar
                hide={false}
                user={user as any}
                orgID={resolvedParams._orgid}
              />
              <div className="flex flex-col w-full overflow-hidden">
                {children}
              </div>
              <div className="w-auto h-full border-l">
                <ActiveUsers />
              </div>
            </div>
            </div>
          </main>
        </div>
      </StatusProvider>
    </AuthProvider>
  );
}