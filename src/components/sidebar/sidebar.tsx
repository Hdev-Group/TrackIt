import React, { useEffect, useRef, useState, useMemo, JSX } from "react";
import { AlertOctagonIcon, BarChart2, Bell, Calendar, ChevronDown, Clock, Columns3, Command, Home, Maximize2, MessageCircle, MessageSquare, Minimize2Icon, OctagonAlert, PersonStanding, Settings, Square, Text, Ticket, TicketCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useActive from "@/components/websockets/isActive/active";
import { User } from "firebase/auth";
import { useStatus } from "@/components/statusProvider/statusProvider";
import statusChange from "@/components/websockets/statusChange/statuschange";
import Link from "next/link";

const activityTypes = {
    Online: "bg-green-400",
    Idle: "bg-yellow-400",
    Busy: "bg-red-400",
    Offline: "bg-gray-400",
};

function Status({ type, size = "sm", className, status, profile, position = { left: "left-4", bottom: "bottom-1.5" } }: { type: string, status?: "Online" | "Idle" | "Busy" | "Offline", size?: "sm" | "md" | "lg", position?: { left: string, bottom: string }, profile?: boolean, className?: string }) {
    const { status: currentActivity } = useStatus();
  
    const sizes = {
      sm: "h-2 w-2",
      md: "h-3 w-3",
      lg: "h-4 w-4",
    };
  
    const statusColor = activityTypes[currentActivity as keyof typeof activityTypes] || "bg-gray-400";
    const sizeClass = sizes[size] || sizes.sm;
  
    if (type === "text") {
      return (
        <div className="flex flex-row items-center">
          <div className={`text-foreground/40 text-[11px] font-normal ${className}`}>{currentActivity}</div>
        </div>
      );
    } else if (type === "icon") {
      return (
        <div className={`flex flex-row items-center ${profile ? "absolute" : "relative"} ${position.left} ${position.bottom} rounded-full`}>
          <div className={`${sizeClass} ${status ? activityTypes[status] : statusColor} rounded-full`}></div>
        </div>
      );
    }
    return null;
  }

function StatusPicker({userid}: {userid: string}) {
    const { status, setStatus } = useStatus();
    const [statusPickerShown, setStatusPickerShown] = useState(false);
    const { changeStatus } = statusChange({userId: userid, status: status});

    const handleChangeStatus = (status: "Online" | "Idle" | "Busy" | "Offline") => {
        setStatus(status);
        changeStatus(status); 
    };
  
    return (
      <div className="flex flex-col relative">
        <div className="absolute flex flex-col gap-1 bottom-8 bg-muted backdrop-blur-2xl px-2 border border-b-0 border-muted-foreground/50 py-2 w-full h-40 left-0 rounded-t-lg z-50" style={{display: statusPickerShown ? 'block' : 'none'}}>
          {["Online", "Idle", "Busy", "Offline"].map((statusOption, index) => (
            <div
              key={index}
              onClick={() => { handleChangeStatus(statusOption as "Online" | "Idle" | "Busy" | "Offline"); setStatusPickerShown(false); }}
              className={`w-full h-9 py-2 px-1.5 flex hover:bg-neutral-300/10 cursor-pointer rounded-md items-center ${status === statusOption ? 'bg-neutral-200/5' : ''}`}
            >
              <div className="w-7 h-7 rounded-md items-center justify-center flex text-xl relative text-muted-foreground font-semibold">
                <Status type="icon" status={statusOption as "Online" | "Idle" | "Busy" | "Offline"} position={{ left: "left-0", bottom: "bottom-[0px]" }} profile={false} size="md" />
              </div>
              <p className={`text-sm font-normal ml-1 flex-nowrap text-nowrap ${status === statusOption ? "text-foreground" : "text-muted-foreground"}`}>{statusOption}</p>
            </div>
          ))}
        </div>
        <div onClick={() => setStatusPickerShown(!statusPickerShown)} className={`${statusPickerShown ? "rounded-b-lg" : "rounded-lg"} bg-muted-foreground/20 w-full justify-between hover:bg-muted-foreground/30 cursor-pointer transition-all text-center items-center px-3 py-1.5 flex flex-row`}>
          <div className="flex flex-row items-center gap-2">
            {["Online", "Idle", "Busy", "Offline"].map((statusOption) => (
              status === statusOption && (
                <div key={statusOption} className="flex flex-row gap-2 items-center">
                  <Status type="icon" position={{left: "left-0", bottom: "bottom-0"}} size="md" status={statusOption as any} />
                  <Status type="text" status={statusOption as any} className="!text-[14px]" />
                </div>
              )
            ))}
          </div>
          <ChevronDown className={`${statusPickerShown ? "rotate-180" : ""} transition-all w-4 h-4 text-muted-foreground ml-2`} />
        </div>
      </div>
    );
  }

export default function LockedSidebar({user, hide, orgID}: {user: User, hide?: boolean, orgID: string}) {
    const activeStatus = useActive({ userId: user?.uid });
    return(
        <div className="w-16 border-r border-[#fff]/15 h-full flex  flex-col items-center justify-start">
            <div className="w-full h-full flex flex-col items-center justify-center">
                <div className=" mx-4 w-full mt-4 flex items-center justify-center">
                    <img src="/trackitlogo/light/logo.png" alt="Trackit Logo" className="w-8 h-8 " />
                </div>
                <div className="w-1/2 border-t my-4 border-[#fff]/10" /> 
                <div className="justify-between w-full h-full flex flex-col items-center gap-4">
                    <div className="w-full h-full flex flex-col mt-2 items-center justify-start gap-2">
                        <Link href={`/${orgID}/dashboard`} className="bg-green-500/50 hover:bg-white/10 cursor-pointer transition-all flex items-center justify-center rounded-lg relative">
                            <span className="absolute -left-2.5 rounded-r-lg h-1/2 bg-indigo-400 w-[2px]" />
                            <Home className="h-full w-5 mx-2 py-2" />
                        </Link>
                        <Link href={`/${orgID}/messages`} className="bg-green-500/50 hover:bg-white/10 cursor-pointer transition-all flex items-center justify-center rounded-lg relative">
                            <span className="absolute -left-2.5 rounded-r-lg h-1/2 bg-indigo-400 w-[2px]" />
                            <MessageCircle className="h-full w-5 mx-2 py-2"  />
                        </Link>
                        <div className="bg-red-500/50 hover:bg-green-500 cursor-pointer transition-all flex items-center justify-center rounded-lg relative">
                            <span className="absolute -left-2.5 rounded-r-lg h-1/2 bg-indigo-400 w-[2px]" />
                            <Ticket className="h-full w-5 mx-2 py-2"  />
                        </div>
                        <div className="bg-red-500/50 hover:bg-white/10 cursor-pointer transition-all flex items-center justify-center rounded-lg relative">
                            <span className="absolute -left-2.5 rounded-r-lg h-1/2 bg-indigo-400 w-[2px]" />
                            <OctagonAlert className="h-full w-5 mx-2 py-2"  />
                        </div>
                        <div className="bg-red-500/50 hover:bg-white/10 cursor-pointer transition-all flex items-center justify-center rounded-lg relative">
                            <span className="absolute -left-2.5 rounded-r-lg h-1/2 bg-indigo-400 w-[2px]" />
                            <Clock className="h-full w-5 mx-2 py-2"  />
                        </div>
                        <div className="bg-red-500/50 hover:bg-white/10 cursor-pointer transition-all flex items-center justify-center rounded-lg relative">
                            <span className="absolute -left-2.5 rounded-r-lg h-1/2 bg-indigo-400 w-[2px]" />
                            <Calendar className="h-full w-5 mx-2 py-2"  />
                        </div>
                        <div className="bg-red-500/50 hover:bg-white/10 cursor-pointer transition-all flex items-center justify-center rounded-lg relative">
                            <span className="absolute -left-2.5 rounded-r-lg h-1/2 bg-indigo-400 w-[2px]" />
                            <Columns3 className="h-full w-5 mx-2 py-2"  />
                        </div>
                    </div>
                    <div className="w-full h-auto flex flex-col items-center justify-start gap-2">
                        <div className="flex flex-col gap-2 mt-4 items-center justify-center">
                            <div className="bg-white/5 hover:bg-white/10 cursor-pointer transition-all flex items-center justify-center rounded-lg relative">
                                <Bell className="h-full w-4 mx-2 py-2" />
                            </div>
                            <div className="bg-white/5 hover:bg-white/10 cursor-pointer transition-all flex items-center justify-center rounded-lg relative">
                                <Command className="h-full w-4 mx-2 py-2" />
                            </div>
                        </div>
                        <div className="w-1/2 mt-2 border-t border-[#fff]/10" /> 
                        <div className="mt-2 flex flex-col gap-2 mb-4 items-center justify-center">
                            <div className="bg-yellow-100 w-9 h-9 flex items-center relative justify-center rounded-lg">
                                <PersonStanding className="h-5 w-5 mx-2 py-2" />
                                <img src={user?.photoURL} className="absolute -bottom-1 -right-1 bg-red-500 w-4 border border-[#101218] h-4 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}