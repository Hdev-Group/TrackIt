import React, { useEffect, useRef, useState, useMemo } from "react";
import { AlertOctagonIcon, Bell, Calendar, ChevronDown, Clock, Home, Maximize2, MessageSquare, Minimize2Icon, Settings, Ticket, TicketCheck } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useActive from "@/components/websockets/isActive/active";
import { User } from "firebase/auth";
import { useStatus } from "@/components/statusProvider/statusProvider";
import statusChange from "@/components/websockets/statusChange/statuschange";

export default function LockedSidebar({user, hide}: {user: User, hide?: boolean}) {

    hide 

    const userPhoto = user?.photoURL;
    const [mainlocation, setMainLocation] = useState({top: 0, width: 0})
    if (!user) {
        return null;
    }
    const [mainhiddenlocation, setMainHiddenLocation] = useState({top: 0, width: 0})
    const [underlineStyle, setUnderlineStyle] = useState({ top: 0, width: 0 });
    const [sidebarWidth, setSidebarWidth] = useState(256); 
    const [hoveredSidebar, setHoveredSidebar] = useState(localStorage.getItem('hoveredSidebar') ? parseInt(localStorage.getItem('hoveredSidebar')!) : 1);
    const [hidden, setHidden] = useState(localStorage.getItem('hidden') === 'true' || false);
    const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [openedProfile, setOpenedProfile] = useState(false);

    const handleMouseEnter = () => {
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
        }
        setHoveredSidebar(sidebarWidth);
    };
    const currentURL = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';

    const handleMouseLeave = () => {
        timeoutIdRef.current = setTimeout(() => {
            setHoveredSidebar(1);
        }, 2000);
    };

    useEffect(() => {
        const storedSidebarWidth = localStorage.getItem('sidebarWidth')
        const storedHoveredSidebar = localStorage.getItem('hoveredSidebar')
        const storedHidden = localStorage.getItem('hidden')

        if (storedSidebarWidth) {
            setSidebarWidth(parseInt(storedSidebarWidth))
        }
        if (storedHoveredSidebar) {
            setHoveredSidebar(parseInt(storedHoveredSidebar))
        }
        if (storedHidden) {
            setHidden(storedHidden === 'true')
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('sidebarWidth', sidebarWidth.toString())
        localStorage.setItem('hoveredSidebar', hoveredSidebar.toString())
        localStorage.setItem('hidden', hidden.toString())
    }, [sidebarWidth, hoveredSidebar, hidden])
    function resizeSidebar(e: React.MouseEvent) {
        const startX = e.clientX;
        const startWidth = sidebarWidth;
        console.log(startWidth);

        document.body.style.userSelect = 'none';

        function onMouseMove(e: MouseEvent) {
            const newWidth = startWidth + (e.clientX - startX);
            if (newWidth >= 256 && newWidth <= window.innerWidth * 0.25) {  
                setSidebarWidth(newWidth);
            } 
        }
        function onMouseUp() {
            document.body.style.userSelect = 'auto';
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }

    const activeStatus = useActive({userId: user.uid});

    useEffect(() => {
        if (typeof document !== 'undefined') {
            function mouseClickOutSideProfile(e: MouseEvent) {
                const profilePopup = document.querySelector('#profilepopup');
                if (profilePopup && !profilePopup.contains(e.target as Node)) {
                    setOpenedProfile(false);
                }
            }

            document.addEventListener('mousedown', mouseClickOutSideProfile);
            return () => {
                document.removeEventListener('mousedown', mouseClickOutSideProfile);
            };
        }
    }, []);
    useEffect(() => {
        if (!hidden) {
            setUnderlineStyle({ top: mainlocation.top, width: mainlocation.width });
        } else {
            setUnderlineStyle({ top: mainhiddenlocation.top, width: mainhiddenlocation.width });
        }
    }, [hidden, mainlocation, mainhiddenlocation]);
    useEffect(() => {
        const navItems = [
            { label: "Dashboard", href: "./dashboard" },
            { label: "Tickets", href: "./tickets" },
            { label: "Messages", href: "./messages" },
            { label: "Shifts", href: "./shifts" },
            { label: "Incidents", href: "./incidents" },
            { label: "Notifications", href: "./notifications" },
        ];
    
        const activeItem = navItems.find(item => currentURL?.replace('./', '') === item.href.replace('./', ''));
    
        if (activeItem) {
            requestAnimationFrame(() => {
                const element = document.querySelector(`a[href='${activeItem.href}']`) as HTMLElement;
                if (element) {
                    const rect = element.getBoundingClientRect();
                    console.log("Element position:", rect.top, rect.width);
                    setUnderlineStyle({ top: rect.top + window.scrollY, width: rect.width });  
                    setMainLocation({ top: rect.top + window.scrollY, width: rect.width });
                    setMainHiddenLocation({ top: rect.top + window.scrollY, width: rect.width });
                }
            });
            
        }
    }, [currentURL]);
    const handleMouseEntering = (e: React.MouseEvent, href: string) => {
        const target = e.currentTarget as HTMLElement;
        const { top, width } = target.getBoundingClientRect(); 
        setUnderlineStyle({
            top: top + window.scrollY, 
            width: width,
        });
    }

    const handleMouseLeaving = () => {
        setUnderlineStyle({ top: mainlocation.top, width: mainlocation.width });
    }

    return (
        <div
            className={`${hidden ? "absolute" : "relative"} h-full flex items-center top-0 justify-start`}
            style={!hidden ? hide ? { width: "70px" } : { width: sidebarWidth } : { width: hoveredSidebar }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className={`${!hidden ? "h-full relative bg-white/5" : "h-[70vh] overflow-y-auto absolute rounded-r-xl overflow-hidden bg-muted/50 border-4 border-x-0 z-50"}  flex-row flex  justify-between transition-all duration-300`} style={!hidden ? hide ? { width: "70px" } : { width: sidebarWidth } : { width: hoveredSidebar }}>
                <div className={`${hide ? "" : "mx-2 mr-4"}flex flex-col items-start w-full h-full `}>
                    <div className="flex flex-col justify-between h-full w-full">
                        <div className="flex flex-col w-full select-none ">
                            <OrgPicker hidden={hide ?? false} ishidden={hidden} sethidden={setHidden} />
                            <div className="w-full justify-center flex flex-col items-center mt-2 relative">
                                {
                                    [
                                        { label: "Dashboard", icon: <Home size={18} />, href: "./dashboard" },
                                        { label: "Tickets", icon: <Ticket size={18} />, href: "./tickets" },
                                        { label: "Messages", icon: <MessageSquare size={18} />, href: "./messages" },
                                        { label: "Shifts", icon: <Clock size={18} />, href: "./shifts" },
                                        { label: "Incidents", icon: <AlertOctagonIcon size={18} />, href: "./incidents" },
                                        { label: "Notifications", icon: <Bell size={18} />, href: "./notifications" }
                                    ].map((item, index) => (
                                        <a key={index} onMouseLeave={handleMouseLeaving} href={item.href} onMouseEnter={(e) => handleMouseEntering(e, item.href)} className={`${hide ? "justify-center"  : "mx-1.5 px-4"} w-full h-7 z-40 py-0.5  flex cursor-pointer  rounded-md items-center`}>
                                            {item.icon}
                                            <p className={`${hide ? "hidden" : " ml-2"} text-foreground/40 text-[14px] font-semibold`}>{item.label}</p>
                                        </a>
                                    ))
                                }
                                <span
                                    className="absolute bottom-0 rounded-sm border-accent h-[30px] z-0 bg-muted-foreground/10 transition-all duration-300"
                                    style={{
                                        top: `${underlineStyle.top}px`,
                                        width: `100%`,
                                        transform: `${hidden ? 'translate(6px, -194px)' : hide ? 'translateX(0px) translateY(-52px)' : 'translateX(6px) translateY(-52px)'}`,
                                    }}
                                />
                            </div>
                            <div className="w-full flex flex-col mt-4">
                                <p className={`${hide ? "hidden" : ""} text-foreground/40 text-[14px] font-semibold ml-2 mx-1.5`}>Departments</p>
                                <div className="flex flex-col gap-1 mt-2 items-start">
                                    <div className={`${hide ? " items-center justify-center" : "mx-1.5 justify-between"} bg-cyan-300/30 group hover:bg-cyan-400/60 transition-colors flex flex-row items-center w-full h-7  py-0.5 px-1.5 cursor-pointer rounded-md`}>
                                        <div className="gap-0.5 flex flex-row items-center">
                                            <div className="rounded-md flex items-center justify-center w-5 h-5 bg-muted font-semibold">
                                                <p className="text-xs">HR</p>
                                            </div>
                                            <p className={`${hide ? "hidden" : ""} text-white/80 group-hover:text-white text-[14px] font-semibold ml-2`}>Human Resources</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <ShiftIndicator hidden={hide} />
                            <div className="border-t select-none border-foreground/10 w-full mt-2 py-2 px-1.5 flex flex-col items-start">
                                <div className={`flex  w-full justify-between group mt-2 ${hide ? "flex-col items-start" : "flex-row items-center"}`} onClick={() => setOpenedProfile(true)}>
                                    <div className="flex flex-row relative items-center">
                                        <Avatar className="w-6 h-6">
                                            <img src={`${userPhoto}`} alt="Your Profile" referrerPolicy="no-referrer" />
                                        </Avatar>
                                        <Status type="icon" profile={true} />
                                        {
                                            !hide && (
                                                <div className="flex flex-col">
                                                    <p className="text-foreground text-[14px] -mb-2 mt-1 font-semibold ml-2 flex-nowrap text-nowrap ">{user?.displayName}</p>
                                                    <div className="overflow-hidden h-[20px]">
                                                        <p className="text-foreground/50 text-[10px] group-hover:-translate-y-5 transition-all ml-2 mt-1"><Status type="text" /></p>
                                                        <p className="text-foreground/50 text-[10px] group-hover:-translate-y-5 transition-all ml-2 mt-1">Lead Software Engineer</p>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className={`w-6 h-6 p-0.5 hover:bg-muted/50 cursor-pointer rounded-md items-center flex justify-center ${hide ? "mt-1" : "ml-2"}`}>
                                        <Settings className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="profilepopup" className={`${openedProfile ? "absolute" : "hidden"} transition-all bg-[#000000cc] backdrop-blur-lg border rounded-lg ${hidden ? " bottom-0 mx-0 rounded-b-none h-auto" : "bottom-12 h-[30rem] mx-3"}  w-full p-4 flex flex-col items-start`}>
                    <div className="flex flex-col items-start gap-2">
                        <div className="flex flex-row relative">
                            <Avatar className="w-12 h-12">
                                <img src={user.photoURL ?? undefined} alt="Your Profile" referrerPolicy="no-referrer" />
                                <AvatarFallback className="w-6 h-6 text-xl font-semibold">
                                    {user?.displayName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <Status
                                type="icon"
                                size="md"
                                profile={true}
                                position={{ left: "left-9", bottom: "bottom-0" }}
                            />
                        </div>
                        <div>
                            <h1 className="text-white text-xl font-semibold flex-nowrap text-nowrap">{user?.displayName}</h1>
                            <p className="text-muted-foreground text-xs font-normal flex-nowrap text-nowrap ">Lead Software Engineer</p>
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-4 mt-3 border-t pt-3 h-full">
                        <div className="flex flex-col w-full gap-4 h-full justify-between">
                            <div className="flex flex-col gap-4">
                                <div className="bg-muted-foreground/20 w-full rounded-lg px-3 py-3 flex flex-col gap-2">
                                    <p className="text-xs font-semibold text-muted-foreground">On Shift</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center h-10 w-10 bg-green-500 rounded-md">
                                            <TicketCheck className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-white text-sm font-semibold">Ticket #1234</p>
                                            <p className="text-white text-xs font-normal">Working</p>
                                            <p className="text-xs text-muted-foreground">Until 19:00</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-muted-foreground/20 w-full rounded-lg px-3 py-3 flex flex-col gap-2">
                                    <p className="text-xs font-semibold text-muted-foreground">Work Hours</p>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-white text-sm font-semibold">Monday - Friday</p>
                                        <p className="text-white text-xs font-normal">09:00 - 18:00</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col relative gap-2">
                                <div className="bg-muted-foreground/20 w-full rounded-lg justify-between hover:bg-muted-foreground/30 cursor-pointer transition-all text-center items-center px-3 py-2 flex flex-row ">
                                    <p className="text-xs font-semibold text-muted-foreground">Settings</p>
                                    <Settings className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <StatusPicker userid={user?.uid as string} />
                            </div>
                        </div>
                    </div>
                </div>
                {
                    hide ? null : (
                        <div
                        className={`w-1 h-full bg-muted hover:bg-neutral-300/30 transition-all cursor-col-resize`}
                        onMouseDown={resizeSidebar}
                    ></div>
                    )
                }
            </div>
        </div>
    );
}
const activityTypes = {
    Online: "bg-green-400",
    Idle: "bg-yellow-400",
    Busy: "bg-red-400",
    Offline: "bg-gray-400",
};
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

function OrgPicker({ishidden, sethidden, hidden}: {ishidden: boolean, sethidden: React.Dispatch<React.SetStateAction<boolean>>, hidden: boolean}) {
    const [orgPicker, SetOrgPicker] = useState(false);
    console.log(hidden);

    function OrgSelector({name}: {name: string}) {
        return(
            <div className="w-full h-9 py-2 px-1.5 flex hover:bg-neutral-300/10 cursor-pointer justify-start rounded-md items-center">
            <div className="w-7 h-7 bg-muted rounded-md items-center justify-center flex text-sm text-muted-foreground font-semibold">
                <p>{name.split(' ').map(word => word.charAt(0)).join('')}</p>
            </div>
            <p className={`text-foreground/70 text-sm font-semibold ml-2 flex-nowrap text-nowrap`}>{name}</p>
        </div>
        )
    }

    const OrgList = [
        {
            name: "Hdev Group"
        }, 
        {
            name: "Hdev Technologies"
        },
        {
            name: "Hdev Solutions"
        },
        {
            name: "Hdev Innovations"
        }, 
        {
            name: "Hdev Labs"
        },
        {
            name: "Hdev Systems"
        },
        {
            name: "ABCorp"
        }
    ]

    return(
        <div className={`${hidden ? "justify-center" : "py-0.5 px-1.5 mx-1.5 justify-between"} w-full h-9  mt-2 cursor-pointer flex hover:bg-neutral-300/10 rounded-md items-center `}>
            <div className="flex flex-row gap-0.5 relative justify-between w-full items-center">
                <div className={`${hidden ? "flex-col " : "flex-row"} flex relative w-full gap-0.5 justify-center items-center`} onClick={() => SetOrgPicker(!orgPicker)}>
                    <div className="w-7 h-7 bg-muted rounded-md items-center justify-center flex text-xl text-muted-foreground font-semibold">
                        <p>H</p>
                    </div>
                    <p className={`${hidden ? "hidden" : ""} text-foreground/80 text-md font-semibold ml-2 flex-nowrap text-nowrap`}>Hdev Group</p>
                    <ChevronDown className={`${hidden ? "hidden" : ""} w-5 h-4 text-muted-foreground ml-1 transition-all ${orgPicker ? "rotate-180" : "rotate-0"}`} />
                    </div>
                    <div className={`w-8 h-8 p-0.5 hover:bg-muted/50 cursor-pointer rounded-md items-center flex justify-center z-50 ${hidden ? "hidden" : ""}`} onClick={() => sethidden(!ishidden)}>
                    {
                        ishidden  ? <Maximize2 className="w-5 h-5 text-muted-foreground" /> : <Minimize2Icon className="w-5 h-5 text-muted-foreground transform rotate-180" />
                    }
                    </div>
                <div className={`${orgPicker ? "absolute" : "hidden"} bg-muted/50 backdrop-blur-lg w-full h-auto top-10 left-0 rounded-lg px-2 py-2 w z-50`}>
                        <div className="flex w-full items-start justify-start flex-col gap-0.5">
                            {
                                orgPicker && OrgList.map((org, index) => (
                                    <OrgSelector key={index} name={org.name} />
                                ))
                            }
                        </div>
                    </div>
            </div>
        </div>
    )
}

function ShiftIndicator({hidden}: {hidden?: boolean}) {
    const [progress, setProgress] = useState(40)
    console.log(hidden);
  
    useEffect(() => {
      const updateProgress = () => {
        const now = new Date()
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0) // 9:00 AM
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0) // 6:00 PM
        const total = end.getTime() - start.getTime()
        const elapsed = now.getTime() - start.getTime()
        setProgress(Math.min(Math.max((elapsed / total) * 100, 0), 100))
      }
  
      updateProgress()
      const interval = setInterval(updateProgress, 60000) 
  
      return () => clearInterval(interval)
    }, [])
  
    return (
      <div className={`${hidden ? "" : "ml-1"} bg-muted cursor-pointer flex-nowrap text-nowrap hover:bg-muted-foreground/20 transition-all rounded-md flex-col shadow-sm px-2 py-2 max-w-sm w-full h-20`}>
        <div className={`${hidden ? "items-center justify-center w-full" : "items-end"} flex flex-row h-full gap-2`}>
            <div className="bg-muted-foreground/15 h-full justify-end items-end flex w-2 rounded-lg">
                <div
                    className="bg-blue-600 w-2 rounded-full transition-all duration-1000 ease-in-out"
                    style={{ height: `${progress}%` }}
                />
            </div>
          <div className="flex flex-col items-start w-full justify-center">
            <h1 className={`${hidden ? "hidden" : "visible"} text-white text-sm font-semibold mt-3`}>Your on shift</h1>
            <p className={`text-white text-xs font-normal flex flex-row gap-1 items-center ${hidden ? "hidden" : "visible"}`}><Clock className="w-4" /> Until 18:00</p>
            <p className={`text-white text-xs font-normal flex flex-row gap-1 items-center ${hidden ? "hidden" : "visible"}`}><Calendar className="w-4" /> {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    )
}

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
          <p className={`text-foreground/40 text-[11px] font-normal ${className}`}>{currentActivity}</p>
        </div>
      );
    } else if (type === "icon") {
      return (
        <div className={`flex flex-row items-center ${profile ? "absolute" : "relative"} ${position.left} ${position.bottom} border-black border rounded-full`}>
          <div className={`${sizeClass} ${status ? activityTypes[status] : statusColor} rounded-full`}></div>
        </div>
      );
    }
    return null;
  }