
import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, ChevronLeft, Home, Search, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "firebase/auth";

export default function LockedSidebar({user}: {user: User | null}) {
    console.log(user?.photoURL ?? undefined);
    const [sidebarWidth, setSidebarWidth] = useState(256); 
    const [hoveredSidebar, setHoveredSidebar] = useState(localStorage.getItem('hoveredSidebar') ? parseInt(localStorage.getItem('hoveredSidebar')!) : 1);
    const [hidden, setHidden] = useState(localStorage.getItem('hidden') === 'true' || false);
    const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);


    const handleMouseEnter = () => {
        if (timeoutIdRef.current) {
            clearTimeout(timeoutIdRef.current);
            timeoutIdRef.current = null;
        }
        setHoveredSidebar(sidebarWidth);
    };



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

        function onMouseMove(e: MouseEvent) {
            const newWidth = startWidth + (e.clientX - startX);
            if (newWidth >= 256 && newWidth <= window.innerWidth * 0.25) {  
                setSidebarWidth(newWidth);
            } 
        }
        function onMouseUp() {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }

    return (
        <div
        className={`${hidden ? "absolute" : "relative"} h-full flex items-center justify-start`}
        style={hidden ? { width: 80 } : { width: sidebarWidth }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
        <div className={`${!hidden ? "h-full relative bg-white/5" : "h-[70vh] overflow-y-auto absolute rounded-r-xl overflow-hidden bg-muted z-50"} flex-row flex  justify-between transition-all duration-300`} style={!hidden ? { width: sidebarWidth } : { width: hoveredSidebar }}>
                <div className="flex flex-col items-start mx-2 w-full h-full mr-4">
                    <div className="flex flex-col justify-between h-full w-full">
                        <div className="flex flex-col w-full select-none ">
                            <div className="w-full h-9 mx-1.5 mt-2 py-0.5 px-1.5 cursor-pointer flex hover:bg-neutral-300/10 rounded-md items-center justify-between">
                                <div className="flex flex-row gap-0.5 justify-between w-full items-center">
                                    <div className="flex flex-row justify-between w-full items-center">
                                        <div className="flex flex-row gap-0.5 justify-center items-center">
                                            <div className="w-7 h-7 bg-muted rounded-md items-center justify-center flex text-xl text-muted-foreground font-semibold">
                                                <p>H</p>
                                            </div>
                                            <p className="text-foreground/80 text-md font-semibold ml-2">Hdev Group</p>
                                            <ChevronDown className="w-5 h-4 text-muted-foreground ml-1" />
                                        </div>
                                        <div className="w-8 h-8 p-0.5 hover:bg-muted/50 cursor-pointer rounded-md items-center flex justify-center z-50" onClick={() => setHidden(!hidden)}>
                                            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex flex-col mt-2">
                                <div className="w-full h-7 mx-1.5 py-0.5 px-1.5 flex hover:bg-neutral-300/10 cursor-pointer rounded-md items-center">
                                    <Search className="w-[17px] h-[17px] text-muted-foreground" />
                                    <p className="text-foreground/40 text-[14px] font-semibold ml-2">Search</p>
                                </div>
                                <div className="w-full h-7 mx-1.5 py-0.5 px-1.5 flex hover:bg-neutral-300/10 cursor-pointer rounded-md items-center">
                                    <Home className="w-[17px] h-[17px] text-muted-foreground" />
                                    <p className="text-foreground/40 text-[14px] font-semibold ml-2">Home</p>
                                </div>
                                <div className="w-full h-7 mx-1.5 py-0.5 px-1.5 flex hover:bg-neutral-300/10 cursor-pointer rounded-md items-center just">
                                    <Bell className="w-[17px] h-[17px] text-muted-foreground" />
                                    <p className="text-foreground/40 text-[14px] font-semibold ml-2">Notifications</p>
                                </div>
                            </div>

                            <div className="w-full flex flex-col mt-4">
                                <p className="text-foreground/40 text-[14px] font-semibold ml-2 mx-1.5">Departments</p>
                                <div className="flex flex-col gap-1 mt-2 items-start">
                                    <div className="bg-cyan-300/30 group hover:bg-cyan-400/60 transition-colors flex flex-row items-center w-full h-7 mx-1.5 py-0.5 px-1.5 cursor-pointer rounded-md justify-between">
                                        <div className="gap-0.5 flex flex-row items-center">
                                            <div className="rounded-md flex items-center justify-center w-5 h-5 bg-muted font-semibold">
                                                <p className="text-xs">HR</p>
                                            </div>
                                            <p className="text-white/80 group-hover:text-white text-[14px] font-semibold ml-2">Human Resorces</p>
                                        </div>
                                    </div>
                                    <div className="bg-green-300/30 group hover:bg-green-400/60 transition-colors flex flex-row items-center w-full h-7 mx-1.5 py-0.5 px-1.5 cursor-pointer rounded-md justify-between">
                                        <div className="gap-0.5 flex flex-row items-center">
                                            <div className="rounded-md flex items-center justify-center w-5 h-5 bg-muted font-semibold">
                                                <p className="text-xs">IT</p>
                                            </div>
                                            <p className="text-white/80 group-hover:text-white text-[14px] font-semibold ml-2">Information Technology</p>
                                        </div>
                                    </div>
                                    <div className="bg-yellow-300/30 group hover:bg-yellow-400/60 transition-colors flex flex-row items-center w-full h-7 mx-1.5 py-0.5 px-1.5 cursor-pointer rounded-md justify-between">
                                        <div className="gap-0.5 flex flex-row items-center">
                                            <div className="rounded-md flex items-center justify-center w-5 h-5 bg-muted font-semibold">
                                                <p className="text-xs">SA</p>
                                            </div>
                                            <p className="text-white/80 group-hover:text-white text-[14px] font-semibold ml-2">Sales</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="border-t select-none border-foreground/10 w-full mt-2 py-2 px-1.5 flex flex-col items-start">
                            <div className="flex flex-row w-full justify-between group items-center mt-2">
                            <div className="flex flex-row relative items-center">
                                <Avatar className="w-6 h-6">
                                    <AvatarImage src={`${user?.photoURL}`}alt="Your Profile" />
                                    <AvatarFallback className="w-6 h-6  text-xl font-semibold">{user?.displayName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <Status type="icon" status="Online" />
                                <div className="flex flex-col">
                                    <p className="text-foreground/40 text-[14px] -mb-2 mt-1 font-semibold ml-2">{user?.displayName}</p>
                                    <div className="overflow-hidden h-[20px]">
                                        <p className="text-foreground/30 text-[10px] group-hover:-translate-y-5 transition-all ml-2 mt-1">Online</p>
                                        <p className="text-foreground/30 text-[10px] group-hover:-translate-y-5 transition-all ml-2 mt-1">Lead Software Engineer</p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-6 h-6 p-0.5 hover:bg-muted/50 cursor-pointer rounded-md items-center flex justify-center ml-2">
                                <Settings className="w-4 h-4 text-muted-foreground" />
                            </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className="absolute bg-black rounded-lg mx-3 bottom-12 h-[30rem] w-full p-4  flex flex-col items-start">
                    <div className="flex relative">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={`${user?.photoURL}`}alt="Your Profile" />
                        <AvatarFallback className="w-6 h-6  text-xl font-semibold">{user?.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>    
                    <Status type="icon"  status="Online" />
                    </div>   
                    <h1 className="text-white text-xl font-semibold mt-2">{user?.displayName}</h1>

                </div>
                <div
                    className={`w-1 h-full bg-muted hover:bg-neutral-300/30 transition-all cursor-col-resize`}
                    onMouseDown={resizeSidebar}
                ></div>
            </div>
        </div>
    );
}

function Status({ type, status, size = "sm" }: { type: string, status: "Online" | "Away" | "Busy" | "Offline", size?: "sm" | "md" | "lg" }) {
    const activityTypes = {
        Online: "bg-green-400",
        Away: "bg-yellow-400",
        Busy: "bg-red-400",
        Offline: "bg-gray-400",
    };

    const sizes = {
        sm: "h-2 w-2",
        md: "h-3 w-3",
        lg: "h-4 w-4",
    };

    const statusColor = activityTypes[status] || "bg-gray-400";
    const sizeClass = sizes[size] || sizes.sm;

    if (type === "text") {
        return (
            <div className="flex flex-row items-center">
                <p className="text-foreground/40 text-[14px] font-semibold ml-2">{status}</p>
            </div>
        );
    } else if (type === "icon") {
        return (
            <div className="flex flex-row items-center absolute left-4 bottom-1.5 border-black border rounded-full">
                <div className={`${sizeClass} ${statusColor} rounded-full`}></div>
            </div>
        );
    }
    return null;
}