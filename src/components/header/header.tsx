'use client'

import { useEffect, useState } from 'react'
import { Menu, X, Columns3Icon, GraduationCap, Book, Boxes, Hand } from 'lucide-react'
import Button from '../button/button'
import { getAuth } from 'firebase/auth'
import UserDropdown from '../userdropdown/outer/dropdown'
import {auth} from '@/app/firebase/firebase'
import { onAuthStateChanged } from 'firebase/auth';

interface User {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mainlocation, setMainLocation] = useState({left: 0, width: 0})
  const [underlineStyle, setUnderlineStyle] = useState({ left: mainlocation.left, width: mainlocation.width })
  const [activeNav, setActiveNav] = useState<string | null>(null)
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []); 

  useEffect(() => {
    const path = window.location.pathname
    const navItems = [
      { label: "Use Cases", href: "/use-cases" },
      { label: "Blog", href: "/blog" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Support", href: "/support" },
      { label: "Pricing", href: "/plans" },
    ]

    const activeItem = navItems.find(item => path.includes(item.href))
    if (activeItem) {
      const element = document.querySelector(`a[href='${activeItem.href}']`) as HTMLElement
      if (element) {
        const { offsetLeft, offsetWidth } = element
        setUnderlineStyle({ left: offsetLeft, width: offsetWidth })
        setMainLocation({ left: offsetLeft, width: offsetWidth })
      }
    }
  }, [])

  const handleMouseEnter = (e: React.MouseEvent, href: string) => {
    setActiveNav(href)
    const target = e.currentTarget as HTMLElement
    const { offsetLeft, offsetWidth } = target
    setUnderlineStyle({
      left: offsetLeft,
      width: offsetWidth,
    })
    console.log(offsetLeft, offsetWidth)
  }

  const handleMouseLeave = () => {
    setUnderlineStyle({ width: mainlocation.width, left: mainlocation.left })
  }
  return (
    <header className={`w-full items-center justify-center px-4 top-0 z-50 rounded-b-lg bg-[#222831]/20 backdrop-blur-xl transition-transform duration-300 ${isHeaderVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="lg:container w-full lg:mx-auto">
        <div className="flex justify-between w-full items-center py-4 lg:justify-start md:space-x-10">
          <div className="flex justify-start items-center gap-5 lg:w-0 lg:flex-1">
            <a href="/" className="flex items-center">
              <img src="/trackitlogo/light/wordmark.png" alt="TrackIt Logo" className="h-8 w-full dark:flex hidden" />
              <img src="/trackitlogo/dark/wordmark.png" alt="TrackIt Logo" className="h-8 w-full dark:hidden flex" />
            </a>
          </div>

          <nav className="hidden lg:flex z-20 items-center space-x-8 relative">
            {[
              { label: "Use Cases", icon: <Boxes size={18} />, href: "/use-cases" },
              { label: "Blog", icon: <Book size={18} />, href: "/blog" },
              { label: "Tutorials", icon: <GraduationCap size={18} />, href: "/tutorials" },
              { label: "Support", icon: <Hand size={18} />, href: "/support" },
              { label: "Pricing", icon: <Columns3Icon size={18} />, href: "/plans" },
            ].map((item) => (
              <a
              key={item.href}
              href={item.href}
              className="relative z-10 text-sm font-medium flex items-center gap-1.5 transition-colors text-muted-foreground hover:text-primary"
              onMouseEnter={(e) => handleMouseEnter(e, item.href)}
              onMouseLeave={handleMouseLeave}
              >
              {item.icon}
              {item.label}
              </a>
            ))}
            <span
              className="absolute bottom-0 rounded-sm border-accent h-[30px] z-0 bg-white/20 transition-all duration-300"
              style={{
              left: `${underlineStyle.left}px`,
              width: `${underlineStyle.width > 1 ? underlineStyle.width + 20 : underlineStyle.width}px`,
              transform: `translate(-40px, 5px)`, 
              }}
            />
            </nav>

          <div className="hidden lg:flex items-center justify-end flex-1 lg:w-0 space-x-4">
            {
              user ? (
                <UserDropdown headerOpen={true}/>
              ) : (
                    <Button variant="ghost" href="/login">
                        Sign in
                    </Button>
                )
            }
            <Button variant="slide-fill" type="button">
                Get Started
            </Button>
          </div>

          <div className="flex lg:hidden">
            <Button
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className=""
              style={{}}
              disabled={false}
              type="button"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      <div
        className={`fixed w-full h-screen inset-0 z-50 bg-background/80 backdrop-blur-sm transform ${
          isMenuOpen ? 'translate-x-0 flex' : 'translate-x-full hidden'
        } transition-transform duration-300 ease-in-out `}
      >
        <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background shadow-xl p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <a href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
              <span className="ml-2 text-xl font-bold text-foreground">TrackIt</span>
            </a>
            <Button
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="space-y-6">
            <a href="/use-cases" className="block text-base font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Use Cases
            </a>
            <a href="/blog" className="block text-base font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Blog
            </a>
            <a href="/tutorials" className="block text-base font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Tutorials
            </a>
            <a href="/support" className="block text-base font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Support
            </a>
            <a href="/plans" className="block text-base font-medium text-foreground hover:text-primary transition-colors" onClick={() => setIsMenuOpen(false)}>
              Pricing
            </a>
          </nav>
          <div className="mt-8 space-y-4">
          <Button
              className="w-full"
              variant="slide-fill"
              href="/create"
              onClick={() => setIsMenuOpen(false)}
            >
              Learn More
          </Button>
          </div>
        </div>
      </div>
    </header>
  )
}