"use client"

import { useState, useEffect } from "react"
import { getAuth, type User } from "firebase/auth"
import { MoreHorizontal, Plus, Send } from "lucide-react"
import type React from "react"
import AuthChecks from "../../../authchecks"
import { cn } from "@/lib/utils"
import Link from "next/link"

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

  useEffect(() => {
    const checker = window.location.pathname.split("/").pop();
    const parsedChecker = parseInt(checker as string, 10);
    
    if (!isNaN(parsedChecker)) {
      const check = channels.find((channel) => channel.id === parsedChecker);
      if (check) {
        setActiveChannel(check);
      }
    }    
  }, [channels])

  const [activeChannel, setActiveChannel] = useState<Channel>(channels[0])
  const [newChannelName, setNewChannelName] = useState("")
  const auth = getAuth()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
    })

    return () => unsubscribe()
  }, [auth])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Sending message:", message);
  
    const userToken = await user?.getIdToken();
  
    const messageData = {
      message: message,
      channel: activeChannel.id,
      userid: user?.uid,
    };
  
    try {
      const res = await fetch("/api/application/v1/messages/restricted/messageSend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userToken}`,
        },
        body: JSON.stringify(messageData),
      });
  
      if (res.ok) {
        console.log("Message sent successfully");
        setMessage("");
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  

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
              <MessageList user={user} channelID={activeChannel.id} />
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
            <Link
                href={`./${channel.id}`}
                key={channel.id}
                onClick={() => setActiveChannel(channel)}
                className={cn(
                "w-full text-left text-sm px-4 py-1 hover:bg-muted-foreground/5 rounded-md",
                channel.id === activeChannel.id && "bg-muted-foreground/10",
            )}
            >
              # {channel.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}

function MessageList({channelID, user}: {channelID: number, user: User | null}) {

  const [messages, setMessages] = useState<any[]>([]);

  
  useEffect(() => {
    const fetchMessages = async () => {
      const userToken = await user?.getIdToken();
      try {
        const response = await fetch(`/api/application/v1/messages/restricted/messageGet?channel=${channelID}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        setMessages(data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [channelID]);


  return (
    <div className="px-1 pt-2">
      {
      messages.length === 0 ? (
        <p>No messages yet...</p>
      ) : (
        messages?.map((message: any) => (
        <div key={message._id} className="flex gap-2 hover:bg-muted-foreground/5 px-2 py-1 rounded-md">
          <div className="w-8 h-8 bg-gray-500 rounded-full"></div>
          <div>
          <p className="text-sm font-semibold">{message.userid}</p>
          <p className="text-sm">{message.message}</p>
          </div>
        </div>
        ))
      )
      }
    </div>
  )
}

