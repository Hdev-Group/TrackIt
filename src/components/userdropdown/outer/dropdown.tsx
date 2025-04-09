"use client"

import { useEffect, useState } from "react"
import { getAuth, signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Button from "@/components/button/button"
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { User, Settings, HelpCircle, LogOut, Moon, Sun, Crown, ChevronRight, Bell, Clock, Bookmark } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export default function UserDropdown({ headerOpen }: { headerOpen: boolean }) {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const auth = getAuth()
  const user = auth.currentUser
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Mock data - replace with actual data in your application
  const isPremium = true
  const recentItems = [
    { title: "Project tracking dashboard", path: "/dashboard" },
    { title: "Time reports", path: "/reports" },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!headerOpen) {
      setOpen(false)
    }
  }, [headerOpen])

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut(auth)
      router.push("/auth/signin")
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNavigation = (path: string) => {
    setOpen(false)
    router.push(path)
  }

  if (!user) {
    return null
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 flex hover:bg-white/10 items-center justify-center rounded-full p-0 transition-all duration-200"
          aria-label="Open user menu"
        >
          <Avatar className="h-9 w-9 border-2 border-transparent hover:border-cyan-400 transition-all duration-200">
            <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User avatar"} />
            <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-600 text-white">
              {user.displayName?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          {isPremium && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-[10px] text-white">
              <Crown className="h-3 w-3" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 rounded-xl shadow-lg changedscrollbar border border-muted/30 bg-popover/95 backdrop-blur-sm"
        align="end"
        sideOffset={8}
      >
        <Command className="rounded-xl changedscrollbar">
          <div className="flex flex-col p-4 changedscrollbar">
            <div className="flex items-start gap-4 changedscrollbar">
              <Avatar className="h-16 w-16 border-2 border-cyan-500/20">
                <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User avatar"} />
                <AvatarFallback className="bg-gradient-to-br from-cyan-400 to-blue-600 text-white">
                  {user.displayName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{user.displayName}</p>

                </div>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <Button
                  variant="ghost"
                  className="mt-1 h-8 !justify-start px-2 text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => handleNavigation("/profile")}
                >
                    <div className="flex items-center justify-start gap-1">
                        View full profile
                        <ChevronRight className="ml-1 h-3 w-3" />
                    </div>
                </Button>
              </div>
            </div>
          </div>

          <CommandList className="changedscrollbar">
            <CommandGroup heading="Account">
              <CommandItem
                className="flex cursor-pointer items-center px-4 py-2 hover:bg-muted/50"
                onSelect={() => handleNavigation("/profile")}
              >
                <User className="mr-2 h-4 w-4 text-cyan-500" />
                Profile
              </CommandItem>
              <CommandItem
                className="flex cursor-pointer items-center px-4 py-2 hover:bg-muted/50"
                onSelect={() => handleNavigation("/settings")}
              >
                <Settings className="mr-2 h-4 w-4 text-cyan-500" />
                Settings
              </CommandItem>
              <CommandItem
                className="flex cursor-pointer items-center px-4 py-2 hover:bg-muted/50"
                onSelect={() => handleNavigation("/notifications")}
              >
                <Bell className="mr-2 h-4 w-4 text-cyan-500" />
                Notifications
              </CommandItem>
            </CommandGroup>

            <CommandSeparator className="my-1" />

            <CommandGroup heading="Recent">
              {recentItems.map((item, index) => (
                <CommandItem
                  key={index}
                  className="flex cursor-pointer items-center px-4 py-2 hover:bg-muted/50"
                  onSelect={() => handleNavigation(item.path)}
                >
                  {index % 2 === 0 ? (
                    <Clock className="mr-2 h-4 w-4 text-cyan-500" />
                  ) : (
                    <Bookmark className="mr-2 h-4 w-4 text-cyan-500" />
                  )}
                  <span className="truncate">{item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator className="my-1" />

            <CommandGroup>
              <CommandItem className="px-4 py-2 hover:bg-muted/50">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    {mounted && theme === "dark" ? (
                      <Moon className="mr-2 h-4 w-4 text-cyan-500" />
                    ) : (
                      <Sun className="mr-2 h-4 w-4 text-cyan-500" />
                    )}
                    Dark Mode
                  </div>
                  <Switch
                    checked={mounted && theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    className={cn("data-[state=checked]:bg-cyan-500", "data-[state=unchecked]:bg-muted")}
                  />
                </div>
              </CommandItem>
              <CommandItem
                className="flex cursor-pointer items-center px-4 py-2 hover:bg-muted/50"
                onSelect={() => handleNavigation("/help")}
              >
                <HelpCircle className="mr-2 h-4 w-4 text-cyan-500" />
                Help & Support
              </CommandItem>
              <CommandItem
                className="flex cursor-pointer items-center px-4 py-2 text-red-500 hover:bg-red-500/10"
                onSelect={handleSignOut}
                disabled={isLoading}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoading ? "Signing out..." : "Sign out"}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
