"use client"

import { useState, useEffect } from "react"
import { getAuth, type User } from "firebase/auth"
import { Megaphone, MoreHorizontal, Plus, Send } from "lucide-react"
import type React from "react"
import AuthChecks from "../../authchecks"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { getSocket } from "@/lib/socket"
import { doc, getDoc, getFirestore } from "@firebase/firestore"

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
            AddNewChannel={() => setOpenChannel(!openChannel)}
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


interface ChannelsProps {
  channels: Channel[]
  activeChannel: Channel
  setActiveChannel: (channel: Channel) => void
  newChannelName: string
  setNewChannelName: (name: string) => void
  handleCreateChannel: (e: React.FormEvent) => void
  AddNewChannel: () => void
}

export function Channels({
  channels,
  activeChannel,
  setActiveChannel,
  AddNewChannel,
}: ChannelsProps) {

  const socket = getSocket();

  const [usersInChannel, setUsersInChannel] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  socket.on("channelParticipants", (usersInChannel) => {
    const uniqueUsers = usersInChannel.filter((user, index, self) => 
      index === self.findIndex((u) => u.userId === user.userId)
    );
    setUsersInChannel(uniqueUsers);
  });

  const db = getFirestore();

  const getUserProfile = async (uid: string): Promise<{ displayName: string; pictureURL: string }> => {
      try {
          const userDocRef = doc(db, "users", uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
              const userData = userDocSnap.data() as { displayName: string; photoURL: string };
              return {
                  displayName: userData.displayName || "Unknown",
                  pictureURL: userData.photoURL || "",
              };
          }
      } catch (error) {
          console.error("Error fetching user data:", error);
      }
      return { displayName: "Unknown", pictureURL: "" };
  };

      useEffect(() => {
        const fetchUserProfiles = async () => {
          const userProfiles = await Promise.all(
            usersInChannel.map(async (user) => {
              const profile = await getUserProfile(user.userId);
              return { ...user, ...profile };
            })
          );
          setUsers(userProfiles);
        };

        fetchUserProfiles();
      }, [usersInChannel]);

  console.log("Users in channel:", users);


  return (
    <aside className="w-64">
      <div className="h-screen flex flex-col">
        <div className="h-16 flex items-center justify-between px-4">
          <h2 className="font-semibold">Channels</h2>
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => document.getElementById("newChannelInput")?.focus()}
          >
            <div className="p-1 transition-all hover:bg-muted-foreground/20 rounded-md" onClick={() => AddNewChannel()}>
              <Plus className="h-5 w-5" />
            </div>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto gap-1 flex-col flex px-1 py-1">
        {channels.map((channel) => (
            <Link
          href={`./messages/${channel.id}`}
          key={channel.id}
          onClick={() => {
              setActiveChannel(channel);
              if (channel.type === "voice") {
            console.log(`Joining voice chat for channel: ${channel.name}`);
              }
          }}
          className={cn(
          "w-full text-left text-sm px-4 py-1 hover:bg-muted-foreground/5 rounded-md",
          channel.id === activeChannel.id && "bg-muted-foreground/10",
            )}
            >
              <div className="flex flex-col gap-1 ">
                <div className="flex flex-row gap-1">
                  {channel.type === "voice" ? <Megaphone size={16} /> : "#"} {channel.name}
                </div>
                {
                  channel.type === "voice" && (
                    <div className="flex flex-col gap-2 border-t border-muted-foreground/20 pt-1 w-full">
                      {users?.map((user) => (
                      <div key={user.userId} className="text-sm text-white flex items-center flex-row gap-1">
                        <img
                          src={user.pictureURL || "/default-profile.png"}
                          alt="User Profile"
                          className="w-5 h-5 rounded-full"
                        />
                        {user.displayName}
                      </div>
                      ))}
                    </div>
                  )
                }
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
