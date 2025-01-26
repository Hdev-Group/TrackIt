'use client'

import { useEffect, useState } from 'react'
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Button from '@/components/button/button'
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { User, Settings, HelpCircle, LogOut, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Switch } from "@/components/ui/switch"

export default function UserDropdown({headerOpen}: {headerOpen: boolean}) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const auth = getAuth()
    const user = auth.currentUser
    const { theme, setTheme } = useTheme()
    const [canshow, setCanshow] = useState(false)

    useEffect(() => {
        if (!headerOpen) {
            setCanshow(false)
        }
        else {
            setCanshow(true)
        }
    }, [headerOpen])

    const handleSignOut = async () => {
        setIsLoading(true)
        try {
            await signOut(auth)
            router.push('/sign-in')
        } catch (error) {
            console.error('Error signing out:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) {
        return null
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant='ghost' className="h-12 w-12 flex hover:bg-muted-foreground/30 items-center justify-center rounded-full p-0" aria-label="Open user menu">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User avatar'} />
                        <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                </Button>
            </PopoverTrigger>
            <PopoverContent className={`w-80 rounded-lg p-0 ${canshow === false ? ("hidden") : ("flex")}`} align="end">
                <Command>
                    <div className="flex items-center p-4 pb-0">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User avatar'} />
                            <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium">{user.displayName}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                    <CommandList>
                        <CommandGroup>
                            <CommandItem className="cursor-pointer" onSelect={() => router.push('/profile')}>
                                <User className="mr-2 h-4 w-4" />
                                Profile
                            </CommandItem>
                            <CommandItem className="cursor-pointer" onSelect={() => router.push('/settings')}>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                            </CommandItem>
                            <CommandItem className="cursor-pointer" onSelect={() => router.push('/help')}>
                                <HelpCircle className="mr-2 h-4 w-4" />
                                Help
                            </CommandItem>
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup>
                            <CommandItem>
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center">
                                        {theme === 'dark' ? (
                                            <Moon className="mr-2 h-4 w-4" />
                                        ) : (
                                            <Sun className="mr-2 h-4 w-4" />
                                        )}
                                        Dark Mode
                                    </div>
                                    <Switch
                                        checked={theme === 'dark'}
                                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                                    />
                                </div>
                            </CommandItem>
                            <CommandItem className="cursor-pointer" onSelect={handleSignOut} disabled={isLoading}>
                                <LogOut className="mr-2 h-4 w-4" />
                                {isLoading ? 'Signing out...' : 'Sign out'}
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

