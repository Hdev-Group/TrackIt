import { cn } from "@/lib/utils"
import Link from "next/link"

interface ChannelsProps {
    channels: Channel[]
    activeChannel: Channel
    setActiveChannel: (channel: Channel) => void
    newChannelName: string
    setNewChannelName: (name: string) => void
    handleCreateChannel: (e: React.FormEvent) => void
  }
  interface Channel {
    id: number
    name: string
  }  

export default function Channels({
    channels,
    activeChannel,
    setActiveChannel,
    newChannelName,
    setNewChannelName,
    handleCreateChannel,
  }: ChannelsProps) {
    return (
      <aside className="w-[20rem]">
        <div className="h-screen flex flex-col">
          <div className="h-16 flex items-center justify-between px-4">
            <h2 className="font-semibold">Channels</h2>
          </div>
          <div className="flex-grow overflow-y-auto gap-1 flex-col flex px-1 py-1">
            {channels.map((channel) => (
              <Link
                  href={`./messages/${channel.id}`}
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