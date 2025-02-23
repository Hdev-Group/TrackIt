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

  return (
    <AuthProvider>
      <StatusProvider>
        <div
          className={`${geistSans.variable} ${geistMono.variable} flex flex-row antialiased overflow-x-hidden`}
        >
          <main className="bg-[#101218] text-foreground w-full min-h-screen overflow-hidden">
            <div className="flex h-screen">
              <LockedSidebar
                hide={false}
                user={user as any}
                orgID={resolvedParams._orgid}
              />
              {children}
              <div className="w-auto h-full border-l">
                <ActiveUsers />
              </div>
            </div>
          </main>
        </div>
      </StatusProvider>
    </AuthProvider>
  );
}