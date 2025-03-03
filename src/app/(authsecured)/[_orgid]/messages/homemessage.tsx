"use client"

import { useState, useEffect } from "react"
import { getAuth, type User } from "firebase/auth"
import { MoreHorizontal, Plus, Send } from "lucide-react"
import type React from "react"
import AuthChecks from "../../authchecks"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { Channels } from "./[channelID]/messages"

interface Channel {
  id: number
  name: string
  type: "text" | "voice"
}

export default function Messages() {
  const [message, setMessage] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [channels, setChannels] = useState<Channel[]>([
    { id: 1, name: "general", type: "text" },
    { id: 2, name: "random", type: "text" },
    { id: 3, name: "help", type: "text" },
    { id: 4, name: "announcements", type: "text" },
    { id: 5, name: "development", type: "voice" },
  ]);
  const [activeChannel, setActiveChannel] = useState<Channel>(channels[0])
  const [newChannelName, setNewChannelName] = useState("")
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
   const [openChannel, setOpenChannel] = useState(false);

  return (
    <AuthChecks>
      <main className="bg-[#16181c] text-white w-full min-h-screen overflow-hidden">
        <div className="flex h-screen w-full">
          <Channels
            channels={channels}
            activeChannel={activeChannel}
            setActiveChannel={setActiveChannel}
            newChannelName={newChannelName}
            setNewChannelName={setNewChannelName}
            handleCreateChannel={(e) => { e.preventDefault(); setOpenChannel(!openChannel); }}
          />
          <div className="flex-grow overflow-hidden flex flex-col">
            <header className="h-16 flex items-center justify-between px-4">
              <h1 className="text-xl font-bold">#{activeChannel.name}</h1>
              <button className="text-gray-400 hover:text-white" aria-label="More options">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </header>
            <div className="flex-grow overflow-y-auto flex bg-muted/30 border-t items-center justify-center border-l rounded-tl-xl">
                <h1 className="text-xl font-bold">Choose a text channel to begin chatting</h1>
            </div>
          </div>
        </div>
      </main>
    </AuthChecks>
  )
}

function MessageList() {
  return (
    <div className="p-4 space-y-4">
      <p>Message list placeholder</p>
    </div>
  )
}

