"use client"

import { useState, useEffect } from "react"
import OverHeadBanner from "@/components/OverHeadBanner/overhead"
import WarningBanner from "@/components/OverHeadBanner/WarningBanner"
import { Bell, Cog, CreditCard, Eye, FlaskConical, Gamepad, Globe, Keyboard, Lock, MessageCircle, Paintbrush, Plug, PoundSterling, Share2, Smartphone, Sparkle, User, Users, Video } from "lucide-react"

export default function Settings() {
  const [warnings, setWarnings] = useState<"no-internet" | "error" | "maintenance" | null>(null)
  const [activeSection, setActiveSection] = useState<string>("my-account")

  useEffect(() => {
    const handleOffline = () => setWarnings("no-internet")
    const handleOnline = () => setWarnings(null)

    window.addEventListener("offline", handleOffline)
    window.addEventListener("online", handleOnline)

    return () => {
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("online", handleOnline)
    }
  }, [])

  const userSettings = [
    { id: "my-account", label: "My Account", icon: <User className="h-4 w-4" /> },
    { id: "profiles", label: "Profiles", icon: <Users className="h-4 w-4" />  },
    { id: "content-social", label: "Content & Social", icon: <Share2 className="h-4 w-4" /> },
    { id: "data-privacy", label: "Data & Privacy", icon: <Lock className="h-4 w-4" /> },
    { id: "authorised-apps", label: "Authorised Apps", icon: <Plug className="h-4 w-4" /> },
    { id: "devices", label: "Devices", icon: <Smartphone className="h-4 w-4" /> },
  ]

  const paymentSettings = [
    { id: "premium", label: "Premium", icon: <Sparkle className="h-4 w-4" /> },
    { id: "subscriptions", label: "Subscriptions", icon: <CreditCard className="h-4 w-4" /> },
    { id: "billing", label: "Billing", icon: <PoundSterling className="h-4 w-4" /> },
  ]

  const appSettings = [
    { id: "appearance", label: "Appearance", icon: <Paintbrush className="h-4 w-4" /> },
    { id: "accessibility", label: "Accessibility", icon: <Eye className="h-4 w-4" /> },
    { id: "voice-video", label: "Voice & Video", icon: <Video className="h-4 w-4" /> },
    { id: "chat", label: "Chat", icon: <MessageCircle className="h-4 w-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { id: "keybinds", label: "Keybinds", icon: <Keyboard className="h-4 w-4" /> },
    { id: "language", label: "Language", icon: <Globe className="h-4 w-4" /> },
    { id: "streamer-mode", label: "Streamer Mode", icon: <Gamepad className="h-4 w-4" /> },
  ]

  return (
    <main className="bg-[#111216] text-white w-screen h-screen flex flex-col overflow-hidden">
      <div className="flex flex-1 w-full h-full">
        <aside className="w-1/3 bg-[#2a2d31] flex justify-end p-4 overflow-y-auto changedscrollbar ">
          <div className="mt-10">
            <img src="/trackitlogo/light/logo.png" alt="Logo" className="w-10 h-auto mb-4" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-[#2a2d31] text-white p-2 rounded-md mb-4 border border-[#35383c]"
            />
            <ul className="w-full items-start justify-start flex flex-col gap-1">
              <div className="text-sm font-bold text-foreground my-2">User Settings</div>
              {userSettings.map((setting) => (
                <li
                  key={setting.id}
                  className={`flex items-center gap-2 p-2 text-sm w-full cursor-pointer transition-all ${
                    activeSection === setting.id
                      ? "border-l-4 border-cyan-500 pl-3 text-foreground"
                      : "text-muted-foreground hover:text-cyan-500 rounded-md hover:bg-cyan-500/10"
                  }`}
                  onClick={() => setActiveSection(setting.id)}
                >
                  {setting.icon}
                  <span>{setting.label}</span>
                </li>
              ))}
              <div className="h-[1px] bg-[#2f3136] w-full my-2" />
              <div className="text-sm font-bold text-foreground my-2">Payment Settings</div>
              {paymentSettings.map((setting) => (
                <li
                  key={setting.id}
                  className={`flex items-center gap-2 p-2  text-sm w-full cursor-pointer transition-all ${
                    activeSection === setting.id
                      ? "border-l-4 border-cyan-500 pl-3 text-foreground"
                      : "text-muted-foreground hover:text-cyan-500 rounded-md hover:bg-cyan-500/10"
                  }`}
                  onClick={() => setActiveSection(setting.id)}
                >
                  {setting.icon}
                  <span>{setting.label}</span>
                </li>
              ))}
              <div className="h-[1px] bg-[#2f3136] w-full my-2" />
              <div className="text-sm font-bold text-foreground my-2">App Settings</div>
              {appSettings.map((setting) => (
                <li
                  key={setting.id}
                  className={`flex items-center gap-2 p-2  text-sm w-full cursor-pointer transition-all ${
                    activeSection === setting.id
                      ? "border-l-4 border-cyan-500 pl-3 text-foreground"
                      : "text-muted-foreground hover:text-cyan-500 rounded-md hover:bg-cyan-500/10"
                  }`}
                  onClick={() => setActiveSection(setting.id)}
                >
                  {setting.icon}
                  <span>{setting.label}</span>
                </li>
              ))}
              <div className="h-[1px] bg-[#2f3136] w-full my-2" />
              <div className="text-sm font-bold text-foreground my-2">Advanced Settings</div>
              <li
                className="flex items-center gap-2 p-2 rounded-md text-sm w-full cursor-pointer transition-all text-muted-foreground hover:text-green-500 hover:bg-green-500/10"
              >
                <Cog className="w-4 h-4" />
                <span>Advanced</span>
              </li>
              <li
                className="flex items-center gap-2 p-2 rounded-md text-sm w-full cursor-pointer transition-all text-muted-foreground hover:text-green-500 hover:bg-green-500/10"
              >
                <FlaskConical className="w-4 h-4" />
                <span>Beta Features</span>
              </li>
            </ul>
          </div>
        </aside>

        <div className="flex-1 bg-[#1e1f25] p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4 capitalize">{activeSection.replace('-', ' ')}</h1>
          {(() => {
            switch (activeSection) {
              case "my-account":
                return <div>My Account Settings</div>
              case "profiles":
                return <div>Profiles</div>
              case "content-social":
                return <div>Content & Social</div>
              case "data-privacy":
                return <div>Data & Privacy</div>
              case "authorised-apps":
                return <div>Authorised Apps</div>
              case "devices":
                return <div>Devices</div>
              case "premium":
                return <div>Premium</div>
              case "subscriptions":
                return <div>Subscriptions</div>
              case "billing":
                return <div>Billing</div>
              case "appearance":
                return <div>Appearance</div>
              case "accessibility":
                return <div>Accessibility</div>
              case "voice-video":
                return <div>Voice & Video</div>
              case "chat":
                return <div>Chat</div>
              case "notifications":
                return <div>Notifications</div>
              case "keybinds":
                return <div>Keybinds</div>
              case "language":
                return <div>Language</div>
              case "streamer-mode":
                return <div>Streamer Mode</div>
              default:
                return <div>Select a section</div>
            }
          })()}
        </div>
      </div>
    </main>
  )
}