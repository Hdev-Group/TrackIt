"use client"

import { useState, useEffect } from "react"
import { getAuth, type User } from "firebase/auth"
import { MoreHorizontal, Plus, Send } from "lucide-react"
import type React from "react"
import AuthChecks from "../../../authchecks"
import { cn } from "@/lib/utils"

interface Channel {
  id: number
  name: string
}

export default function Messages() {
  const [message, setMessage] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [channels, setChannels] = useState<Channel[]>([
    { id: 1, name: "general" },
    { id: 2, name: "random" },
    { id: 3, name: "help" },
    { id: 4, name: "announcements" },
  ])
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

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault()
    if (newChannelName.trim()) {
      const newChannel = {
        id: channels.length + 1,
        name: newChannelName.trim(),
      }
      setChannels([...channels, newChannel])
      setNewChannelName("")
    }
  }

  return (
    <AuthChecks>
      <main className="bg-[#16181c] text-white w-full min-h-screen overflow-hidden">
        <div className="flex h-screen">
          <Channels
            channels={channels}
            activeChannel={activeChannel}
            setActiveChannel={setActiveChannel}
            newChannelName={newChannelName}
            setNewChannelName={setNewChannelName}
            handleCreateChannel={handleCreateChannel}
          />
          <div className="flex-grow overflow-hidden flex flex-col">
            <header className="h-16 flex items-center justify-between px-4">
              <h1 className="text-xl font-bold">#{activeChannel.name}</h1>
              <button className="text-gray-400 hover:text-white" aria-label="More options">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </header>
            <div className="flex-grow overflow-y-auto  bg-muted/30 border-t border-l rounded-tl-xl">
              <MessageList />
            </div>
            <footer className="h-16 border-t border-l bg-muted/20 px-4 py-3">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Type a message in #${activeChannel.name}`}
                  className="flex-grow bg-muted-foreground/5 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500/20 text-white rounded px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </footer>
          </div>
        </div>
      </main>
    </AuthChecks>
  )
}

interface ChannelsProps {
  channels: Channel[]
  activeChannel: Channel
  setActiveChannel: (channel: Channel) => void
  newChannelName: string
  setNewChannelName: (name: string) => void
  handleCreateChannel: (e: React.FormEvent) => void
}

function Channels({
  channels,
  activeChannel,
  setActiveChannel,
  newChannelName,
  setNewChannelName,
  handleCreateChannel,
}: ChannelsProps) {
  return (
    <aside className="w-64">
      <div className="h-screen flex flex-col">
        <div className="h-16 flex items-center justify-between px-4">
          <h2 className="font-semibold">Channels</h2>
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => document.getElementById("newChannelInput")?.focus()}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto gap-1 flex-col flex px-1 py-1">
          {channels.map((channel) => (
            <button
              key={channel.id}
              onClick={() => setActiveChannel(channel)}
              className={cn(
                "w-full text-left text-sm px-4 py-1 hover:bg-muted-foreground/5 rounded-md",
                channel.id === activeChannel.id && "bg-muted-foreground/10",
              )}
            >
              # {channel.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

function MessageList() {
  // TODO: Implement actual message list
  return (
    <div className="p-4 space-y-4">
      <p>Message list placeholder</p>
    </div>
  )
}

