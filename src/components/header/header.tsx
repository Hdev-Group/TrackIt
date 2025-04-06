"use client"

import { useEffect, useState } from "react"
import { Search, Download } from "lucide-react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/app/firebase/firebase"
import UserDropdown from "../userdropdown/outer/dropdown"
import Button from "../button/button"
import { Input } from "@/components/ui/input"

interface User {
  displayName: string | null
  email: string | null
  photoURL: string | null
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

  return (
    <header className="w-full bg-black/20 backdrop-blur-lg fixed text-white py-3 z-50 px-4 flex items-center justify-between">
      <div className="flex container mx-auto items-center justify-between">
      <div className="flex items-center gap-2">
        <a href="/" className="flex items-center ">
          <img src="/trackitlogo/light/wordmark.png" alt="TrackIt Logo" className="h-8 w-auto" />
        </a>
      </div>
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex items-center space-x-6">
          {[
            { label: "Blog", href: "/blog" },
            { label: "Features", href: "/use-cases" },
            { label: "Tutorials", href: "/tutorials" },
            { label: "Premium", href: "/premium" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium hover:text-cyan-300 text-gray-200  transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <UserDropdown headerOpen={true} />
          ) : (
            <Button variant="ghost-heavy" className="text-sm font-medium hover:text-cyan-300 hover:bg-cyan-400/20 text-gray-200 transition-colors">
              <a href="/auth/signin">Log In</a>
            </Button>
          )}
        </div>
      </div>
      </div>
    </header>
  )
}

