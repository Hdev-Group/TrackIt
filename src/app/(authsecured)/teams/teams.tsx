"use client"

import Button from "@/components/button/button"
import AppFooter from "@/components/footer/appfooter"
import OverHeadBanner from "@/components/OverHeadBanner/overhead"
import WarningBanner from "@/components/OverHeadBanner/WarningBanner"
import { FileText, MoreHorizontal, PenSquare, PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"

export default function Teams() {
  const [warnings, setWarnings] = useState<"no-internet" | "error" | "maintenance" | null>(null)

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

  const spaces = [
    {
      id: 1,
      name: "Marketing Team",
      description: "Collaboration space for marketing campaigns and assets",
    },
    {
      id: 2,
      name: "Product Development",
      description: "Planning and tracking product features and roadmap",
    },
    {
      id: 3,
      name: "Design System",
      description: "Central repository for design guidelines and components",
    },
  ]

  return (
    <main className="bg-[#111216] text-white w-full h-screen flex flex-col overflow-hidden">
      <WarningBanner type={warnings} />
      <OverHeadBanner />

      {/* Header */}
      <div className="w-full h-16 bg-[#111216] flex items-center justify-between px-4 md:px-6 border-b border-white/10 shadow-md shadow-black/20">
        <div className="mx-auto container flex flex-row justify-between items-center">
          <h1 className="text-white font-semibold text-lg md:text-xl">Spaces</h1>
          <Button
            variant="secondary"
            className="bg-[#1f1f1f]/20 border !font-normal border-white/40 text-white/70 hover:bg-[#1f1f1f] rounded-md transition-colors"
          >
            <div className="!flex !flex-row items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Join or create space</span>
              <span className="sm:hidden">New</span>
            </div>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden justify-between items-center mx-auto container flex flex-col">
        <div className="h-full py-4 md:py-6 overflow-y-auto">
          {spaces.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
              <div className="p-4 rounded-full bg-[#1f1f1f]/30">
                <FileText className="h-8 w-8 text-gray-500" />
              </div>
              <p className="text-lg">No spaces available.</p>
              <Button
                variant="secondary"
                className="bg-[#1f1f1f]/20 border !font-normal border-white/40 text-white/70 hover:bg-[#1f1f1f] rounded-md"
              >
                <div className="!flex !flex-row items-center gap-2">
                  <PlusCircle className="h-4 w-4 mr-2" /> Create or join your first space
                </div>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {spaces.map((space) => (
                <SpaceCard key={space.id} name={space.name} description={space.description} />
              ))}
            </div>
          )}
        </div>
      </div>
      <AppFooter />
    </main>

  )
}

interface SpaceCardProps {
  name: string
  description?: string
}

function SpaceCard({ name, description }: SpaceCardProps) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  const colors = ["#e91e63", "#4caf50", "#2196f3", "#ff9800", "#9c27b0"]
  const colorIndex = name.charCodeAt(0) % colors.length
  const avatarColor = colors[colorIndex]

  return (
    <div className="bg-[#1f1f1f] hover:bg-[#2a2a2a] cursor-pointer transition-all rounded-lg shadow-md hover:shadow-lg duration-300 overflow-hidden flex flex-col h-full group border border-transparent hover:border-white/10">
      <div className="p-4 flex-1">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-md flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
              style={{ backgroundColor: avatarColor }}
            >
              <span className="text-lg sm:text-xl font-semibold text-white">{initials}</span>
            </div>
            <div className="flex flex-col">
              <h2 className="text-white font-medium text-base line-clamp-2">{name}</h2>
              {description && <p className="text-gray-400 text-sm mt-1 line-clamp-2">{description}</p>}
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-gray-400 hover:text-white rounded-full h-8 w-8 p-0 flex items-center justify-center"
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="sr-only">More options</span>
          </Button>
        </div>
      </div>

      <div className="flex border-t border-white/5 mt-2">
        <Button
          variant="ghost"
          className="!flex-1 items-center justify-center rounded-none h-10 text-gray-400 hover:text-white hover:bg-[#353535] transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 mr-2" />
            <span className="text-sm">Documents</span>
          </div>
        </Button>
        <div className="w-px h-10 bg-white/5" />
        <Button
          variant="ghost"
          className="flex-1 rounded-none h-10 text-gray-400 hover:text-white hover:bg-[#353535] transition-colors"
        >
          <div className="flex items-center gap-2">
            <PenSquare className="h-4 w-4 mr-2" />
            <span className="text-sm">Edit</span>
          </div>
        </Button>
      </div>
    </div>
  )
}

