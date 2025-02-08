"use client"
import type  { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import { AuthProvider } from "../../firebase/AuthContext";
import { StatusProvider } from "@/components/statusProvider/statusProvider";
import ActiveUsers from "@/components/activeUsers/activeUsers";
import LockedSidebar from "@/components/sidebar/sidebar";
import { useAuth } from "../../firebase/AuthContext";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
    const { user } = useAuth()
  return (
    <html lang="en" className="dark">
      <AuthProvider>
      <StatusProvider>
      <head >
      <link href="https://fonts.googleapis.com/css2?family=Funnel+Sans:ital,wght@0,300;1,300&family=Noto+Sans+JP:wght@100..900&family=Rubik:ital,wght@0,300..900;1,300..900&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet"></link>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex flex-row antialiased overflow-x-hidden`}
      >
        <main className="bg-[#101218] text-foreground w-full min-h-screen overflow-hidden">
            <div className="flex h-screen">
                <LockedSidebar hide={false} user={user as any} />
                    {children}
                    <div className="w-64 h-full border-l">
                        <ActiveUsers />
                    </div>
                </div>
            </main>
      </body>
      </StatusProvider>
      </AuthProvider>
    </html>
  );
}
