"use client"

import { useState } from "react"
import { Badge, BadgeCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Button from "../button/button"
import { Input } from "@/components/ui/input"

export interface ProfilePopupProps {
  userid: string
  username?: string
  avatarUrl?: string
  statusMessage?: string
  lastActive?: string
  mutualServers?: number
  roles?: string[]
  verified?: boolean
}

export default function ProfilePopup({
  userid,
  username = "kettufokettu2",
  avatarUrl = "/placeholder.svg?height=80&width=80",
  statusMessage = "Ping me for BMT, Patrol or CT (Helsgwon).",
  lastActive = "21:00 - 07:00",
  mutualServers = 3,
  roles = ["Labourer"],
  verified = true,
}: ProfilePopupProps) {
  const [message, setMessage] = useState("")

  return (
    <div className="absolute z-50 w-72 bg-zinc-900 text-white shadow-xl rounded-md overflow-hidden">
      {/* Banner */}
      <div className="h-16 bg-zinc-800 relative"></div>

      {/* Avatar */}
      <div className="relative px-4">
        <div className="absolute -top-10 left-4 border-4 border-zinc-900 rounded-full">
          <Avatar className="h-20 w-20 rounded-full bg-zinc-700">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback className="text-2xl">{username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 h-6 w-6 bg-red-600 rounded-full flex items-center justify-center border-2 border-zinc-900">
            <span className="sr-only">Do Not Disturb</span>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="mt-12 px-4 pb-4">
        <div className="flex items-center gap-1 mb-1">
          <h2 className="text-xl font-semibold">{username}</h2>
          {verified && <BadgeCheck className="h-5 w-5 text-primary fill-primary" />}
        </div>

        {/* Status Message */}
        <div className="bg-zinc-800 rounded-md p-2 mb-3 text-sm">{statusMessage}</div>

        {/* Mutual Servers */}
        <div className="flex items-center gap-1 text-sm mb-2">
          <span className="flex items-center gap-1">
            <Badge className="h-4 w-4" />
            <Badge className="h-4 w-4" />
          </span>
          <span>{mutualServers} Mutual Servers</span>
        </div>

        {/* Last Active */}
        <div className="text-sm text-zinc-400 mb-3">Least active from {lastActive}</div>

        {/* Roles */}
        <div className="flex flex-wrap gap-2 mb-4">
          {roles.map((role, index) => (
            <div key={index} className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-teal-500"></div>
              <span className="text-sm">{role}</span>
            </div>
          ))}
          {verified && (
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded-full bg-zinc-500"></div>
              <span className="text-sm">Verified</span>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={`Message @${username}`}
            className="bg-zinc-950 border-none text-sm py-2 pl-4 pr-10 rounded-md w-full"
          />
          <Button
            variant="ghost"
            onClick={() => alert(`Message sent to ${username}: ${message}`)}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <span className="text-xl">😊</span>
            <span className="sr-only">Add Emoji</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

