"use client"

import { useState, useEffect, useCallback } from "react"
import { getAuth, type User } from "firebase/auth"
import { MoreHorizontal, Plus, Send, X } from "lucide-react"
import type React from "react"
import AuthChecks from "../../../authchecks"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { SpinnerLoader } from "@/components/loaders/mainloader"
import useSendMessage from "@/components/websockets/sendmessage/sendmessage"
import { getFirestore, doc, getDoc } from "firebase/firestore";
import useUserJoinedChannel from "@/components/websockets/userjoiningchannel/userjoiningchannel"
import { getSocket } from "../../../../../lib/socket"
interface Channel {
  id: number
  name: string
}

export default function Messages() {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [channels, setChannels] = useState<Channel[]>([
    { id: 1, name: "general" },
    { id: 2, name: "random" },
    { id: 3, name: "help" },
    { id: 4, name: "announcements" },
  ]);
  const [activeChannel, setActiveChannel] = useState<Channel>(channels[0]);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const checker = window.location.pathname.split("/").pop();
    const parsedChecker = parseInt(checker as string, 10);
    if (!isNaN(parsedChecker)) {
      const check = channels.find((channel) => channel.id === parsedChecker);
      if (check) {
        setActiveChannel(check);
      }
    }
  }, [channels]);

  const { sendMessage } = useSendMessage(user?.uid, activeChannel.id, (msg: any) =>
    console.log("Message received in Messages:", msg)
  );

  useUserJoinedChannel({
    userId: user?.uid,
    channel: activeChannel.id,
    onUserJoined: (userData: any) => console.log("User joined:", userData),
  });

  // Debounced typing handler
  const handleTyping = useCallback(() => {
    const socket = getSocket();
    if (socket.connected && user?.uid && activeChannel.id) {
      socket.emit("channelTyping", { userId: user.uid, channel: activeChannel.id });
    }
  }, [user?.uid, activeChannel.id]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (message.length > 0) {
      timeout = setTimeout(handleTyping, 500); 
    }
    return () => clearTimeout(timeout);
  }, [message, handleTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (message.length === 0) {
      console.error("Message cannot be empty");
      return;
    }
    if (message.length > 2000) {
      console.error("Message is too long");
      return;
    }

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
        sendMessage(message);
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [openChannel, setOpenChannel] = useState(false);

  function NewChannelCheck(name: string) {
    setLoading(true);
    if (name.length > 50) {
      setError("Channel name must be less than 50 characters");
      setLocked(true);
    } else if (name.length === 0) {
      setError("Channel name cannot be empty");
      setLocked(true);
    } else {
      setError(null);
      setLocked(false);
    }
    setLoading(false);
  }

  function handleCreateChannel({ newChannelName }: { newChannelName: string }) {
    if (newChannelName.length > 50) {
      setError("Channel name must be less than 50 characters");
      return;
    }
    if (newChannelName.length === 0) {
      setError("Channel name cannot be empty");
      return;
    }
    console.log("Creating channel:", newChannelName);
    setOpenChannel(false);
  }

  return (
    <AuthChecks>
      <main className="bg-[#16181c] text-white w-full min-h-screen overflow-hidden">
        {openChannel && (
          <div className="bg-black bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-[#111216] mx-auto md:w-1/3 container px-6 py-4 h-full md:h-[30%] rounded-md flex flex-col gap-4">
              <div className="w-full flex flex-row justify-between items-center">
                <h2 className="font-semibold text-xl">Create a channel</h2>
                <button
                  className="text-gray-400 hover:text-white"
                  onClick={() => setOpenChannel(!openChannel)}
                >
                  <div className="p-1 transition-all hover:bg-muted-foreground/20 rounded-md">
                    <X className="h-5 w-5" />
                  </div>
                </button>
              </div>
              <div className="flex flex-col h-full justify-between">
                <div>
                  <p className="text-sm font-semibold">Name</p>
                  <div className={`bg-muted-foreground/5 text-white flex items-center justify-start rounded px-3 mt-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:outline-none ${error ? "ring-2 ring-red-500 focus-within:ring-red-500" : ""}`}>
                    <i className="text-md text-muted-foreground before">#</i>
                    <input
                      type="text"
                      id="newChannelInput"
                      value={newChannelName}
                      onChange={(e) => {
                        setNewChannelName(e.target.value);
                        NewChannelCheck(e.target.value);
                      }}
                      placeholder="Channel name"
                      className="bg-transparent ml-2 focus:outline-none w-full py-2"
                    />
                    <p className={`text-md text-muted-foreground ${newChannelName.length <= 50 ? "" : "text-red-500"}`}>{newChannelName.length}</p>
                  </div>
                  {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                  <p className="text-xs text-gray-400 mt-2">
                    Channels are where conversations happen around a topic. Use a name that is easy to find and understand.
                  </p>
                </div>
                <div className="w-full flex gap-3 flex-row justify-end items-center">
                  {loading && <SpinnerLoader size={30} color="#3B82F6" />}
                  <button
                    className="bg-blue-500/20 text-white z-50 rounded px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 mt-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    disabled={locked}
                    onClick={() => {
                      console.log("Create Channel button clicked");
                      handleCreateChannel({ newChannelName });
                    }}
                  >
                    Create Channel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex w-full h-screen">
          <div className="w-64">
          <Channels
            channels={channels}
            activeChannel={activeChannel}
            setActiveChannel={setActiveChannel}
            newChannelName={newChannelName}
            setNewChannelName={setNewChannelName}
            handleCreateChannel={(e) => {
              e.preventDefault();
              setOpenChannel(!openChannel);
            }}
            AddNewChannel={() => setOpenChannel(!openChannel)}
          />
          </div>
          <div className="flex-grow overflow-hidden flex flex-col">
            <header className="h-16 flex items-center justify-between px-4">
              <h1 className="text-xl font-bold">#{activeChannel.name}</h1>
              <button className="text-gray-400 hover:text-white" aria-label="More options">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </header>
            <div className="flex-grow overflow-y-auto bg-muted/30 border-t border-l rounded-tl-xl">
              <MessageList user={user} channelDetails={activeChannel} />
            </div>
            <footer className="min-h-12 h-auto border-t flex border-l bg-muted/20 items-start px-4 py-1">
                <form onSubmit={handleSendMessage} className="flex items-center flex-row w-full h-full gap-2">
                    <div className="relative flex-grow">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={`Type a message in #${activeChannel.name}`}
                      className="overflow-hidden resize-none h-auto min-h-10 mt-1.5 max-h-40 text-wrap bg-muted-foreground/5 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      style={{ height: `${Math.min(40, message.split('\n').length * 20)}px` }}
                      rows={1}
                      onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${target.scrollHeight}px`;
                      }}
                    />
                    {
                      message.length > 1700 && (
                        <div className={`absolute bottom-1 right-1 text-sm font-semibold ${message.length >= 2000 ? "text-red-500" : "text-yellow-400"}`}>{message.length}</div>
                      )
                    }
                    </div>
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
  );
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

function Channels({
  channels,
  activeChannel,
  setActiveChannel,
  AddNewChannel,
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
            <div className="p-1 transition-all hover:bg-muted-foreground/20 rounded-md" onClick={() => AddNewChannel()}>
              <Plus className="h-5 w-5" />
            </div>
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

function MessageList({ channelDetails, user }: { channelDetails: any, user: User | null }) {
  const [messages, setMessages] = useState<any[]>([]);

  const handleMessageReceived = useCallback((newMessage: any) => {
    console.log("New message received:", newMessage);
    if (newMessage.channel === channelDetails.id) {
      const structuredMessage = {
        userid: newMessage.userId,
        message: newMessage.message,
      };
      console.log("New message structured:", structuredMessage);
      setMessages((prevMessages: any[]) => {
        if (!prevMessages.some(msg => msg.userid === structuredMessage.userid && msg.message === structuredMessage.message)) {
          return [structuredMessage, ...prevMessages];
        }
        return prevMessages;
      });
    }
  }, [channelDetails.id]);

  const { sendMessage } = useSendMessage(user?.uid, channelDetails.id, handleMessageReceived);

  useEffect(() => {
    const fetchMessages = async () => {
      const userToken = await user?.getIdToken();
      try {
        const response = await fetch(`/api/application/v1/messages/restricted/messageGet?channel=${channelDetails.id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${userToken}`,
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
  }, [channelDetails.id, user]);

  interface UserDetails {
    displayName?: string;
    photoURL?: string;
  }
  const getDateString = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  async function fetchUserDetails(userId: string): Promise<UserDetails | null> {
    const db = getFirestore();
    const userRef = doc(db, "users", userId);
    try {
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const userDetails: UserDetails = {
          displayName: data.displayName,
          photoURL: data.photoURL,
        };
        return userDetails;
      } else {
        console.error("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      return null;
    }
  }

  return (
    <div className="pt-2 pb-5 h-full flex-col overflow-y-auto w-full flex items-start justify-end">
      <div className="flex px-3 flex-col gap-1 border-b border-muted-foreground/20 w-full mb-5 pb-5">
        <div className="w-12 h-12 text-3xl bg-gray-500/20 rounded-full items-center justify-center flex">#</div>
        <h2 className="text-xl font-bold">Welcome to the start of #{channelDetails.name}</h2>
        <p className="text-sm text-gray-400">This is the very beginning of the #{channelDetails.name} channel.</p>
      </div>
      {messages?.length === 0 ? (
        null
      ) : (
        messages
          .slice()
          .reverse()
          .map((message: any, index: number, arr: any[]) => {
            const currentDate = getDateString(message.timestamp);
            const prevMessage = arr[index - 1];
            const prevDate = prevMessage ? getDateString(prevMessage.timestamp) : null;
            const showSeparator = index > 0 && currentDate !== prevDate;

            return (
              <div key={message._id || index} className=" w-full">
                {showSeparator && (
                  <div className="relative w-full my-4 flex items-center justify-center">
                    <hr className="w-full border-t  border-muted-foreground/30" />
                    <span className="absolute backdrop-blur-3xl px-2 text-xs text-gray-400">
                      {new Date(message.timestamp).toLocaleDateString("en-UK", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                <MessageItem message={message} fetchUserDetails={fetchUserDetails} />
              </div>
            );
          })
      )}
    </div>
  );
}
interface UserDetails {
  displayName?: string;
  photoURL?: string;
}

function MessageItem({
    message,
    fetchUserDetails,
  }: {
    message: any;
    fetchUserDetails: (userId: any) => Promise<any>;
  }) {
    console.log("MessageItem:", message);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  useEffect(() => {
    fetchUserDetails(message.userid)
      .then((details) => {
        setUserDetails(details);
      })
      .catch((err) => {
        console.error("Failed to fetch user details", err);
      });
  }, [message.userid]);

  return (
    <div key={message._id} className="flex gap-2 text-wrap w-full break-words whitespace-break-spaces hover:bg-muted/20 px-2 py-1 rounded-md">
      {userDetails?.photoURL ? (
        <img src={userDetails.photoURL} className="w-8 h-8 rounded-full" />
      ) : (
        <div className="w-8 h-8 bg-gray-500 rounded-full"></div>
      )}
      <div>
        <div className="flex flex-row gap-2">
          <p className="text-sm font-semibold">{userDetails?.displayName}</p>
            <p className="text-xs text-gray-400">
            {(() => {
              const messageDate = new Date(message.timestamp);
              const now = new Date();
              const isToday = messageDate.toDateString() === new Date().toDateString();
              const isYesterday = messageDate.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString();
                if (isToday) {
                return `Today at ${messageDate.toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit' })}`;
                } else if (isYesterday) {
                return `Yesterday at ${messageDate.toLocaleTimeString('en-UK', { hour: '2-digit', minute: '2-digit' })}`;
                } else {
                return messageDate.toLocaleTimeString('en-UK', { day: "2-digit", month: "2-digit", year: "2-digit", hour: '2-digit', minute: '2-digit' });
                }
            })()}
            </p>
        </div>
        <p className="text-sm break-all">{message.message}</p>
      </div>
    </div>
  );
}