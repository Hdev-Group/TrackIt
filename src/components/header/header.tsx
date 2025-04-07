"use client"

import { useEffect, useState } from "react"
import { Search, Menu, X } from "lucide-react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/app/firebase/firebase"
import UserDropdown from "../userdropdown/outer/dropdown"
import Button from "../button/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface User {
  displayName: string | null
  email: string | null
  photoURL: string | null
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen)

  const navItems = [
    { label: "Blog", href: "/blog" },
    { label: "Features", href: "/use-cases" },
    { label: "Tutorials", href: "/tutorials" },
    { label: "Premium", href: "/premium" },
  ]

  return (
    <header className="w-full bg-black/20 backdrop-blur-lg fixed text-white py-3 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center">
              <img src="/trackitlogo/light/wordmark.png" alt="TrackIt Logo" className="h-8 w-auto" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium hover:text-cyan-300 text-gray-200 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleSearch}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-200" />
            </button>

            {user ? (
              <UserDropdown headerOpen={true} />
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost-heavy"
                  className="text-sm font-medium hover:text-cyan-300 hover:bg-cyan-400/20 text-gray-200 transition-colors"
                >
                  <a href="/auth/signin">Log In</a>
                </Button>
                <Button
                  variant="primary"
                  className="text-sm font-medium bg-cyan-500 hover:bg-cyan-600 text-black transition-colors"
                >
                  <a href="/auth/signup">Get Started</a>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={toggleSearch}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-200" />
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X className="h-5 w-5 text-gray-200" /> : <Menu className="h-5 w-5 text-gray-200" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isSearchOpen ? "max-h-20 opacity-100 mt-4" : "max-h-0 opacity-0",
          )}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for tutorials, features, and more..."
              className="w-full bg-white/10 border-white/20 text-white pl-10 focus-visible:ring-cyan-500"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMenuOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0",
          )}
        >
          <nav className="flex flex-col space-y-4 py-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium hover:text-cyan-300 text-gray-200 transition-colors px-2 py-1"
              >
                {item.label}
              </a>
            ))}
            {!user && (
              <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                <Button
                  variant="ghost-heavy"
                  className="text-sm font-medium hover:text-cyan-300 hover:bg-cyan-400/20 text-gray-200 transition-colors w-full justify-center"
                >
                  <a href="/auth/signin" className="w-full text-center">
                    Log In
                  </a>
                </Button>
                <Button
                  variant="neutral"
                  className="text-sm font-medium bg-cyan-500 hover:bg-cyan-600 text-white transition-colors w-full justify-center"
                >
                  <a href="/auth/signup" className="w-full text-center">
                    Get Started
                  </a>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
