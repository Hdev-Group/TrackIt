"use client"

import { useState, useEffect } from 'react'
import { getAuth, User } from 'firebase/auth'
import { MoreHorizontal, Send } from 'lucide-react'
import React from 'react';
import AuthChecks from '../../authchecks';
import ActiveUsers from '@/components/activeUsers/activeUsers'
import LockedSidebar from '@/components/sidebar/sidebar'
import { Input } from '@/components/ui/input'
import Button from '@/components/button/button';
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


export default function Messages() {
  const [message, setMessage] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [auth])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement send message functionality
    console.log("Sending message:", message)
    setMessage("")
  }

  return (
    <AuthChecks>
      <main className="bg-[#101218] text-foreground w-full min-h-screen overflow-hidden">
        <div className="flex h-screen">
          <Channels />
          <div className="flex-grow overflow-hidden flex flex-col">
            <header className="h-16 flex items-center justify-between border-b px-4">
              <h1 className="text-xl font-bold">#help</h1>
              <Button variant="ghost" aria-label="More options">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </header>
            <div className="flex-grow">
              <MessageList />
            </div>
            <footer className="h-16 border-t pt-3 items-center  w-full justify-between px-4">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <Input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message"
                  className="flex-grow bg-white/5"
                />
                <Button type="submit" variant='secondary'>
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </footer>
          </div>
        </div>
      </main>
    </AuthChecks>
  )
}


const channels = [
  { id: 1, name: "general", unread: 2 },
  { id: 2, name: "random", unread: 0 },
  { id: 3, name: "help", unread: 5, active: true },
  { id: 4, name: "announcements", unread: 1 },
]

export function Channels() {
  return (
    <aside className="w-64 bg-background/30 border-r">
      <div className="h-screen">
        <div className="space-y-2">
          <div className='h-16 flex w-full px-4 justify-center items-center border-b'>
          </div>
          <div className='px-2 flex flex-col relative space-y-1'>
            {channels.map((channel) => (
                <button
                key={channel.id}
                className={cn(
                    "w-full flex items-center space-x-2 hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1 transition-colors",
                    channel.active && "bg-accent text-accent-foreground",
                )}
                >
                {
                    channel.unread === 0 ? (
                        <span className="absolute left-0  text-xs font-medium pr-1 py-1.5 rounded-r-full">
                    </span>
                    ) : (
                        <span className="bg-primary absolute left-0 text-primary-foreground text-xs font-medium pr-1 py-1.5 rounded-r-full">
                        </span>
                    )
                }
                {
                    channel.unread || channel.active ? (
                        <div className='flex flex-row items-center text-white justify-center gap-2'>
                            <span>#</span>
                            <span className="flex-grow text-left text-sm">{channel.name}</span>
                        </div>
                    ) : (
                        <div className='flex flex-row items-center text-muted-foreground justify-center gap-2'>
                            <span>#</span>
                            <span className="flex-grow text-left text-sm">{channel.name}</span>
                        </div>
                    )
                }
                </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}

const messages = [
  { id: 1, user: "Alice", content: "Hey everyone! How's it going?", timestamp: "10:30 AM" },
  { id: 2, user: "Bob", content: "Hi Alice! All good here. How about you?", timestamp: "10:32 AM" },
  { id: 3, user: "Charlie", content: "Hello! I'm new here. Nice to meet you all!", timestamp: "10:35 AM" },
]

export function MessageList() {
  return (
    <div className="p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="flex items-start space-x-4">
          <Avatar>
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${message.user}`} />
            <AvatarFallback>{message.user[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{message.user}</span>
              <span className="text-xs text-muted-foreground">{message.timestamp}</span>
            </div>
            <p className="text-sm">{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

