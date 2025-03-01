"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { getAuth, type User } from "firebase/auth"
import { Megaphone, MoreHorizontal, Plus, Send, X,  Video, VideoOff, Mic, MicOff, Monitor  } from "lucide-react"
import type React from "react"
import AuthChecks from "../../../authchecks"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { SpinnerLoader } from "@/components/loaders/mainloader"
import useSendMessage from "@/components/websockets/sendmessage/sendmessage"
import { getFirestore, doc, getDoc } from "firebase/firestore";
import useUserJoinedChannel from "@/components/websockets/userjoiningchannel/userjoiningchannel"
import { getSocket } from "../../../../../lib/socket"
import Peer from "simple-peer";
import { Vibrant } from "node-vibrant/browser";

interface Channel {
  id: number
  name: string
  type: string
}


export function VoiceChat({ activeChannel, user }: { activeChannel: Channel; user: User | null }) {
  const [peers, setPeers] = useState<Map<string, MediaStream>>(new Map())
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [speakingUsers, setSpeakingUsers] = useState<string[]>([])
  const [peerProfiles, setPeerProfiles] = useState<Map<string, string>>(new Map())
  const [dominantColors, setDominantColors] = useState<Map<string, string>>(new Map())
  const [hasAudio, setHasAudio] = useState(true)
  const [hasVideo, setHasVideo] = useState(true)
  const userVideoRef = useRef<HTMLVideoElement>(null)
  const peersRef = useRef<Map<string, { peer: Peer.Instance; userId: string }>>(new Map())
  const socket = getSocket()

  // Fetch user profile picture from Firestore
  const fetchUserProfilePic = async (userId: string): Promise<string> => {
    const db = getFirestore()
    const userRef = doc(db, "users", userId)
    const docSnap = await getDoc(userRef)
    return docSnap.exists() ? docSnap.data().photoURL || "/default-profile.png" : "/default-profile.png"
  }

  // Extract dominant color from profile picture
  const getDominantColor = async (imageUrl: string): Promise<string> => {
    try {
      const palette = await Vibrant.from(imageUrl).getPalette()
      return palette.Vibrant ? palette.Vibrant.hex : "#000000"
    } catch (error) {
      console.error("Error extracting dominant color:", error)
      return "#000000"
    }
  }

  // Initialize local media stream
  useEffect(() => {
    const initStream = async () => {
      try {
        let mediaStream;
        let audioAvailable = false;
        let videoAvailable = false;

        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          audioAvailable = true;
          videoAvailable = true;
          console.log("Initialized stream with audio and video");
        } catch (err) {
          try {
            mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioAvailable = true;
            console.log("Video not available, using audio only");
          } catch (audioErr) {
            try {
              mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
              videoAvailable = true;
              console.log("Audio not available, using video only");
            } catch (videoErr) {
              console.error("Neither video nor audio is available:", videoErr);
              setStream(null);
              setHasAudio(false);
              setHasVideo(false);
              return;
            }
          }
        }

        setStream(mediaStream);
        setHasAudio(audioAvailable);
        setHasVideo(videoAvailable);
        if (userVideoRef.current && mediaStream) {
          userVideoRef.current.srcObject = mediaStream;
          console.log("Set local video stream to userVideoRef");
        }
      } catch (err) {
        console.error("Failed to initialize media stream:", err);
      }
    };
    initStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        console.log("Stopped local media stream tracks");
      }
    };
  }, [activeChannel.id, user?.uid]);

  useEffect(() => {
    if (!stream || !user?.uid) return;

    socket.emit("userJoinedChannel", { userId: user.uid, channel: activeChannel.id });
    console.log(`Emitted userJoinedChannel: User ${user.uid} joined channel ${activeChannel.id}`);

    return () => {
      socket.emit("leaveChannel", { userId: user.uid, channel: activeChannel.id });
      console.log(`Emitted leaveChannel: User ${user.uid} left channel ${activeChannel.id}`);
    };
  }, [stream, activeChannel.id, user?.uid]);

  // Set dominant color for local user
  useEffect(() => {
    if (user?.uid && user?.photoURL) {
      getDominantColor(user.photoURL).then(color => {
        setDominantColors(prev => new Map(prev).set(user.uid, color))
        console.log(`Set dominant color for user ${user.uid}: ${color}`)
      })
    }
  }, [user?.uid, user?.photoURL])

  // Peer connection setup
  useEffect(() => {
    if (!stream || !user?.uid) {
      console.log("Skipping peer connection setup: Stream or user ID missing");
      return;
    }

    const createPeer = (toUserId, initiator) => {
      console.log(`Creating peer for ${toUserId}, initiator: ${initiator}`);
      const peer = new Peer({
        initiator,
        trickle: false,
        stream,
      });

      peer.on("signal", (data) => {
        if (initiator) {
          console.log(`Sending offer from ${user.uid} to ${toUserId}`);
          socket.emit("offer", { offer: data, channel: activeChannel.id, fromUserId: user.uid, toUserId });
        } else {
          console.log(`Sending answer from ${user.uid} to ${toUserId}`);
          socket.emit("answer", { answer: data, channel: activeChannel.id, fromUserId: user.uid, toUserId });
        }
      });

      peer.on("stream", (peerStream) => {
        console.log(`Received stream from peer ${toUserId}`);
        setPeers(prev => new Map(prev).set(toUserId, peerStream));
        fetchUserProfilePic(toUserId).then(photoURL => {
          setPeerProfiles(prev => new Map(prev).set(toUserId, photoURL));
          getDominantColor(photoURL).then(color => {
            setDominantColors(prev => new Map(prev).set(toUserId, color));
          });
        });
      });

      peer.on("error", (err) => console.error(`Peer error with ${toUserId}:`, err));
      peer.on("close", () => {
        console.log(`Peer ${toUserId} closed`);
        peersRef.current.delete(toUserId);
        setPeers(prev => {
          const newPeers = new Map(prev);
          newPeers.delete(toUserId);
          return newPeers;
        });
        setPeerProfiles(prev => {
          const newProfiles = new Map(prev);
          newProfiles.delete(toUserId);
          return newProfiles;
        });
        setDominantColors(prev => {
          const newColors = new Map(prev);
          newColors.delete(toUserId);
          return newColors;
        });
      });

      return peer;
    };

    socket.on("channelParticipants", (usersInChannel) => {
      console.log(`Received channelParticipants for channel ${activeChannel.id}:`, usersInChannel);
      usersInChannel.forEach(({ userId }) => {
        if (userId === user.uid || peersRef.current.has(userId)) return;
        const peer = createPeer(userId, true);
        peersRef.current.set(userId, { peer, userId });
      });
    });

    socket.on("offer", ({ offer, fromUserId, toUserId }) => {
      if (toUserId !== user.uid) return;
      console.log(`Received offer from ${fromUserId}`);
      const peer = createPeer(fromUserId, false);
      peer.signal(offer);
      peersRef.current.set(fromUserId, { peer, userId: fromUserId });
    });

    socket.on("answer", ({ answer, fromUserId, toUserId }) => {
      if (toUserId !== user.uid) return;
      console.log(`Received answer from ${fromUserId}`);
      const peerData = peersRef.current.get(fromUserId);
      if (!peerData) {
        console.warn(`No peer found for ${fromUserId}, possibly already cleaned up`);
        return;
      }
      if (peerData.peer.destroyed) {
        console.warn(`Peer for ${fromUserId} is destroyed, skipping signal`);
        return;
      }
      try {
        peerData.peer.signal(answer);
        console.log(`Signaled answer for peer ${fromUserId}`);
      } catch (err) {
        console.error(`Failed to signal answer for ${fromUserId}:`, err);
      }
    });

    socket.on("ice-candidate", ({ candidate, fromUserId, toUserId }) => {
      if (toUserId !== user.uid) return;
      console.log(`Received ICE candidate from ${fromUserId}`);
      const peerData = peersRef.current.get(fromUserId);
      if (!peerData) {
        console.warn(`No peer found for ${fromUserId} for ICE candidate`);
        return;
      }
      if (peerData.peer.destroyed) {
        console.warn(`Peer for ${fromUserId} is destroyed, skipping ICE candidate`);
        return;
      }
      try {
        peerData.peer.signal(candidate);
        console.log(`Signaled ICE candidate for peer ${fromUserId}`);
      } catch (err) {
        console.error(`Failed to signal ICE candidate for ${fromUserId}:`, err);
      }
    });

    socket.on("userLeftChannel", ({ userId, channel }) => {
      if (channel !== activeChannel.id) return;
      console.log(`User ${userId} left channel ${channel}`);
      const peerData = peersRef.current.get(userId);
      if (peerData && !peerData.peer.destroyed) {
        peerData.peer.destroy();
        console.log(`Initiated destruction of peer ${userId}`);
      }
    });

    return () => {
      console.log("Cleaning up socket listeners and peers");
      socket.off("channelParticipants");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("userLeftChannel");
      peersRef.current.forEach(({ peer }, userId) => {
        if (!peer.destroyed) {
          console.log(`Destroying peer for ${userId} during cleanup`);
          peer.destroy();
        }
      });
    };
  }, [stream, activeChannel.id, user?.uid]);

  // Toggle microphone
  const toggleMic = () => {
    if (stream && hasAudio) {
      stream.getAudioTracks().forEach(track => (track.enabled = !track.enabled))
      setIsMicOn(prev => !prev)
      console.log(`Toggled mic: ${!isMicOn ? "ON" : "OFF"}`)
    }
  }

  // Toggle video
  const toggleVideo = async () => {
    if (!stream || !hasVideo) {
      console.log("Cannot toggle video: No stream or video unavailable")
      return
    }

    if (isVideoOn) {
      stream.getVideoTracks().forEach(track => track.stop())
      const audioOnlyStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setStream(audioOnlyStream)
      if (userVideoRef.current) userVideoRef.current.srcObject = audioOnlyStream
      peersRef.current.forEach(({ peer }) => peer.removeStream(stream))
      peersRef.current.forEach(({ peer }) => peer.addStream(audioOnlyStream))
      console.log("Turned video OFF, switched to audio-only stream")
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        stream.getAudioTracks().forEach(track => track.stop())
        setStream(newStream)
        if (userVideoRef.current) userVideoRef.current.srcObject = newStream
        peersRef.current.forEach(({ peer }) => peer.removeStream(stream))
        peersRef.current.forEach(({ peer }) => peer.addStream(newStream))
        console.log("Turned video ON, switched to video+audio stream")
      } catch (err) {
        console.error("Failed to get video stream:", err)
      }
    }
    setIsVideoOn(prev => !prev)
  }

  // Toggle screen sharing
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      stream?.getVideoTracks().forEach(track => track.stop())
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setStream(newStream)
      if (userVideoRef.current) userVideoRef.current.srcObject = newStream
      peersRef.current.forEach(({ peer }) =>
        peer.replaceTrack(stream!.getVideoTracks()[0], newStream.getVideoTracks()[0], stream!)
      )
      setIsScreenSharing(false)
      console.log("Stopped screen sharing, reverted to camera stream")
    } else {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true })
      setStream(screenStream)
      if (userVideoRef.current) userVideoRef.current.srcObject = screenStream
      peersRef.current.forEach(({ peer }) =>
        peer.replaceTrack(stream!.getVideoTracks()[0], screenStream.getVideoTracks()[0], stream!)
      )
      screenStream.getVideoTracks()[0].onended = () => toggleScreenShare()
      setIsScreenSharing(true)
      console.log("Started screen sharing")
    }
  }

  // Speaking detection
  useEffect(() => {
    if (!stream || !user?.uid) {
      console.log("Skipping speaking detection: Stream or user ID missing")
      return
    }

    const audioContext = new AudioContext()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)

    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const detectSpeaking = () => {
      analyser.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength
      if (average > 20) {
        if (!speakingUsers.includes(user.uid)) {
          setSpeakingUsers(prev => [...prev, user.uid])
          socket.emit("speaking", { userId: user.uid, channel: activeChannel.id, isSpeaking: true })
          console.log(`User ${user.uid} is speaking`)
        }
      } else {
        setSpeakingUsers(prev => prev.filter(uid => uid !== user.uid))
        socket.emit("speaking", { userId: user.uid, channel: activeChannel.id, isSpeaking: false })
        console.log(`User ${user.uid} stopped speaking`)
      }
      requestAnimationFrame(detectSpeaking)
    }

    detectSpeaking()

    socket.on("speaking", ({ userId, isSpeaking }) => {
      console.log(`Received speaking update: ${userId} is ${isSpeaking ? "speaking" : "not speaking"}`)
      setSpeakingUsers(prev => {
        if (isSpeaking && !prev.includes(userId)) return [...prev, userId]
        if (!isSpeaking) return prev.filter(uid => uid !== userId)
        return prev
      })
    })

    return () => {
      console.log("Cleaning up speaking detection")
      socket.off("speaking")
      audioContext.close()
    }
  }, [stream, user?.uid, activeChannel.id])

  useEffect(() => {
    console.log("Peers state updated:", Array.from(peers.entries()))
  }, [peers])

  return (
    <div className="flex-grow overflow-hidden flex flex-col">
      <header className="h-16 flex items-center justify-between px-4">
        <h1 className="text-xl font-bold flex items-center gap-1">
          <Megaphone /> {activeChannel.name}
        </h1>
        <button className="text-gray-400 hover:text-white" aria-label="More options">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </header>
      <div className="flex-grow overflow-y-auto bg-black h-full relative border-t border-l rounded-tl-xl p-4">
        <div className="grid grid-cols-2 h-full gap-4">
          {/* Current User's Video */}
          <div
            className={`relative w-full h-1/2 rounded-lg ${
              speakingUsers.includes(user?.uid || "") ? "border-2 border-green-500" : ""
            }`}
            style={{
              backgroundColor: dominantColors.get(user?.uid || "") || "#000000",
            }}
          >
            {stream && stream.getVideoTracks().length > 0 && isVideoOn ? (
              <video
                ref={userVideoRef}
                autoPlay
                muted
                className="w-full h-full rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <img
                  src={user?.photoURL || "/default-profile.png"}
                  alt="User Profile"
                  className="w-24 h-24 rounded-full border-2 border-muted/20"
                />
              </div>
            )}
          </div>

          {/* Peer Videos */}
          {Array.from(peers.entries()).map(([peerId, peerStream]) => (
            <div
              key={peerId}
              className={`relative w-full h-1/2 rounded-lg ${
                speakingUsers.includes(peerId) ? "ring-2 ring-green-500" : ""
              }`}
              style={{
                backgroundColor: dominantColors.get(peerId) || "#000000",
              }}
            >
              {peerStream.getVideoTracks().length > 0 && peerStream.getVideoTracks()[0].enabled ? (
                <video
                  ref={ref => {
                    if (ref && !ref.srcObject) ref.srcObject = peerStream
                  }}
                  autoPlay
                  className="w-full h-full rounded-lg"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <img
                    src={peerProfiles.get(peerId) || "/default-profile.png"}
                    alt="Peer Profile"
                    className="w-24 h-24 rounded-full"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex absolute bottom-10 left-1/2 transform -translate-x-1/2 gap-4 mt-4 justify-center">
          <button
            onClick={toggleMic}
            className="p-2 bg-gray-700 rounded-full"
            disabled={!hasAudio}
            title={!hasAudio ? "Microphone not available" : ""}
          >
            {isMicOn ? <Mic /> : <MicOff />}
          </button>
          <button
            onClick={toggleVideo}
            className="p-2 bg-gray-700 rounded-full"
            disabled={!hasVideo}
            title={!hasVideo ? "Camera not available" : ""}
          >
            {isVideoOn ? <Video /> : <VideoOff />}
          </button>
          <button onClick={toggleScreenShare} className="p-2 bg-gray-700 rounded-full">
            <Monitor />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Messages() {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [channels, setChannels] = useState<Channel[]>([
    { id: 1, name: "general", type: "text" },
    { id: 2, name: "random", type: "text" },
    { id: 3, name: "help", type: "text" },
    { id: 4, name: "announcements", type: "text" },
    { id: 5, name: "development", type: "voice" },
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
          {
            activeChannel.type === "text" && (
              <div className="flex-grow overflow-hidden flex flex-col">
              <header className="h-16 flex items-center justify-between px-4">
                <h1 className="text-xl font-bold">#{activeChannel.name}</h1>
                <button className="text-gray-400 hover:text-white" aria-label="More options">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </header>
              <div className="flex-grow overflow-y-auto bg-muted/30 h-full border-t border-l rounded-tl-xl">
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
            )
          }
          {
            activeChannel.type === "voice" && (
              <VoiceChat activeChannel={activeChannel} user={user} />
            )
          }
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
              <div className="flex gap-1 items-center flex-row">
          {channel.type === "voice" ? <Megaphone size={16} /> : "#"} {channel.name}
              </div>
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
        timestamp: new Date().toISOString(),
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

  const timestamp = new Date().toISOString();
  console.log("Timestamp:", timestamp);

  const { sendMessage } = useSendMessage(user?.uid, channelDetails.id, handleMessageReceived, timestamp);

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
    <div className="pt-2 pb-5 min-h-full flex-col overflow-y-auto w-full flex items-start justify-end">
      <div className="flex px-3  flex-col gap-1 border-b overflow-y-auto border-muted-foreground/20 w-full mb-5 pb-5">
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
        <div className="flex flex-row gap-2 items-center">
          <p className="text-sm font-semibold">{userDetails?.displayName}</p>
            <p className="text-xs text-gray-400/60">
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
                return messageDate.toLocaleTimeString('en-UK', { day: "2-digit", month: "2-digit", year: "numeric", hour: '2-digit', minute: '2-digit' });
                }
            })()}
            </p>
        </div>
        <p className="text-sm break-all">{message.message}</p>
      </div>
    </div>
  );
}