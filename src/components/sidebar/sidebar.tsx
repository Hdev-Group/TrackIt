import React, { useEffect, useRef, useState } from "react";
import { Bell, Calendar, ChevronDown, Clock, Columns3, Command, Home, MessageCircle, OctagonAlert, Pen, PersonStanding, Settings, Ticket } from "lucide-react";
import useActive from "@/components/websockets/isActive/active";
import { User } from "firebase/auth";
import { useStatus } from "@/components/statusProvider/statusProvider";
import statusChange from "@/components/websockets/statusChange/statuschange";
import Link from "next/link";
import { doc, getDoc, getFirestore } from "@firebase/firestore";
import { usePathname } from "next/navigation";

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

function StatusPicker({ userid }: { userid: string }) {
    const { status, setStatus } = useStatus();
    const [statusPickerShown, setStatusPickerShown] = useState(false);
    const { changeStatus } = statusChange({ userId: userid, status: status });

    const handleChangeStatus = (status: "Online" | "Idle" | "Busy" | "Offline") => {
        setStatus(status);
        changeStatus(status);
        setStatusPickerShown(false);
    };

    return (
        <div className="flex flex-col relative">
            <div
                className="absolute flex flex-col gap-1 bottom-0 bg-black backdrop-blur-2xl px-2 py-2 h-40 rounded-t-lg z-50"
                style={{ display: statusPickerShown ? 'block' : 'none', right: '0' }}
            >
                {["Online", "Idle", "Busy", "Offline"].map((statusOption, index) => (
                    <div
                        key={index}
                        onClick={() => handleChangeStatus(statusOption as "Online" | "Idle" | "Busy" | "Offline")}
                        className={`w-full h-9 py-2 px-1.5 flex hover:bg-neutral-300/10 cursor-pointer rounded-md items-center ${status === statusOption ? 'bg-neutral-200/5' : ''}`}
                    >
                        <div className="w-7 h-7 rounded-md items-center justify-center flex text-xl relative text-muted-foreground font-semibold">
                            <Status
                                type="icon"
                                status={statusOption as "Online" | "Idle" | "Busy" | "Offline"}
                                position={{ left: "left-0", bottom: "bottom-[0px]" }}
                                profile={false}
                                size="md"
                            />
                        </div>
                        <p className={`text-sm font-normal ml-1 flex-nowrap text-nowrap ${status === statusOption ? "text-foreground" : "text-muted-foreground"}`}>
                            {statusOption}
                        </p>
                    </div>
                ))}
            </div>
            <div
                onClick={() => setStatusPickerShown(!statusPickerShown)}
                className={`${statusPickerShown ? "rounded-b-lg" : ""} border-y w-full justify-between hover:bg-muted-foreground/10 cursor-pointer transition-all text-center items-center px-3 py-2.5 flex flex-row`}
            >
                <div className="flex flex-row items-center gap-2">
                    {["Online", "Idle", "Busy", "Offline"].map((statusOption) => (
                        status === statusOption && (
                            <div key={statusOption} className="flex flex-row gap-2 items-center">
                                <Status type="icon" position={{ left: "left-0", bottom: "bottom-0" }} size="md" status={statusOption as any} />
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

export default function LockedSidebar({ user, hide, orgID }: { user: User, hide?: boolean, orgID: string }) {
    const activeStatus = useActive({ userId: user?.uid });
    const [users, setUsers] = useState<{ userId: string; displayName: string; pictureURL: string, hdevstaff: boolean }[]>([]);
    const fetchedUsersRef = useRef(new Set<string>());
    const db = getFirestore();
    const [showProfile, setShowProfile] = useState(false);
    const pathname = usePathname();

    const getUserProfile = async (uid: string): Promise<{ displayName: string; pictureURL: string, hdevstaff: boolean }> => {
        try {
            const userDocRef = doc(db, "users", uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data() as { displayName: string; photoURL: string; hdevstaff: boolean };
                return {
                    displayName: userData.displayName,
                    pictureURL: userData.photoURL,
                    hdevstaff: userData.hdevstaff,
                };
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
        return { displayName: "Unknown", pictureURL: "", hdevstaff: false };
    };

    useEffect(() => {
        if (user?.uid && !fetchedUsersRef.current.has(user.uid)) {
            getUserProfile(user.uid).then((data) => {
                fetchedUsersRef.current.add(user.uid);
                setUsers((prev) => [
                    ...prev,
                    {
                        userId: user.uid,
                        displayName: data.displayName,
                        pictureURL: data.pictureURL,
                        hdevstaff: data.hdevstaff,
                    },
                ]);
            });
        }
    }, [user?.uid]);

    useEffect(() => {
        document?.addEventListener("click", function (event) {
            const showmoreprofile = document.getElementById("showmoreprofile");
            const sidebarmain = document.getElementById("sidebarmain");
            const targetElement = event.target as HTMLElement;
            if (showmoreprofile && !showmoreprofile.contains(targetElement) && sidebarmain && !sidebarmain.contains(targetElement)) {
                setShowProfile(false);
            }
        });
    }, []);

    const navItems = [
        { path: `/${orgID}/dashboard`, icon: Home, text: "Dashboard" },
        { path: `/${orgID}/messages`, icon: MessageCircle, text: "Messages" },
        { path: `/${orgID}/tickets`, icon: Ticket, text: "Tickets" },
        { path: `/${orgID}/alerts`, icon: OctagonAlert, text: "Alerts" }, 
        { path: `/${orgID}/shifts`, icon: Clock, text: "Shifts" }, 
        { path: `/${orgID}/calendar`, icon: Calendar, text: "Calendar" },
        { path: `/${orgID}/status-page`, icon: Columns3, text: "Status Page" },
    ];

    return (
        <div id="sidebarmain" className="w-16 border-r border-[#fff]/15  flex flex-col items-center">
            <a className="w-full flex-shrink-0" href={`/${orgID}/dashboard`}>
                <div className="mx-4 w-8 h-8 mt-4 flex items-center justify-center">
                    <img src="/trackitlogo/light/logo.png" alt="Trackit Logo" className="w-8 h-8" />
                </div>
            </a>
            <div className="w-1/2 border-t my-4 border-[#fff]/10 flex-shrink-0" />
            <div className="w-full h-full flex flex-col items-center justify-between gap-10 overflow-visible">
                <div className="w-full flex flex-col mt-2 items-center justify-start gap-2">
                    {navItems.map(({ path, icon: Icon, text }) => (
                        <Tooltip key={text} text={text}>
                            <Link
                                href={path}
                                className={`hover:bg-white/10 cursor-pointer transition-all flex items-center justify-center rounded-lg relative ${
                                    pathname.startsWith(path) ? "bg-muted-foreground/10" : "hover:bg-muted-foreground/5"
                                }`}
                            >
                                {pathname.startsWith(path) && (
                                    <span className="absolute -left-2.5 rounded-r-lg h-1/2 bg-indigo-400 w-[2px]" />
                                )}
                                <Icon className="h-full w-5 mx-2 py-2" />
                            </Link>
                        </Tooltip>
                    ))}
                </div>
                <div className="w-full flex flex-col items-center justify-start gap-2">
                    <div className="flex flex-col gap-2 mt-4 items-center justify-center">
                        <Tooltip text="Notifications">
                            <div className="bg-white/5 hover:bg-white/10 cursor-pointer transition-all flex items-center justify-center rounded-lg relative">
                                <Bell className="h-full w-4 mx-2 py-2" />
                            </div>
                        </Tooltip>
                        <Tooltip text="Commands">
                            <div className="bg-white/5 hover:bg-white/10 cursor-pointer transition-all flex items-center justify-center rounded-lg relative">
                                <Command className="h-full w-4 mx-2 py-2" />
                            </div>
                        </Tooltip>
                    </div>
                    <div className="w-1/2 mt-2 border-t border-[#fff]/10" />
                    <div className="mt-2 flex relative flex-col gap-2 mb-4 items-center justify-center">
                        <div id="showmoreprofile" className={`${showProfile ? "innerset" : "deployer"} transition-all duration-500 bottom-0 bg-black border rounded-md pt-6 z-50 flex flex-col h-auto w-auto max-w-[20rem]`}>
                            <div className="flex px-4 flex-col items-start mb-4 justify-between w-full">
                                <div className="relative flex flex-row items-center justify-center mb-2 gap-2">
                                    <img src={user?.photoURL} className="w-12 h-12 rounded-full" />
                                    <Status type="icon" size="md" position={{ left: "right-0", bottom: "bottom-0" }} profile={true} />
                                </div>
                                <div className="flex flex-col items-start justify-start">
                                    <div className="flex flex-row items-center justify-center gap-2">
                                        <span className="text-lg font-semibold text-white/80">{user?.displayName}</span>
                                        {users.some(user => user.hdevstaff === true) && (
                                            <Tooltip text="HDev Staff">
                                                <div className="px-2 py-0.5 bg-muted-foreground/10 rounded-md">
                                                    <img src="/staffbadge/hdevstaff.png" className="h-6" />
                                                </div>
                                            </Tooltip>
                                        )}
                                    </div>
                                    <span className="text-sm font-light text-white/50">{user?.email}</span>
                                </div>
                                <div className="flex flex-col w-full">
                                        <p className="text-sm font-light text-white mt-2 break-words">Hi This is an about me thing aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
                                </div>
                                <div className="flex flex-col gap-4 w-full mt-2">
                                    <div className="rounded-sm flex-col gap-2 bg-white/5 text-white/70 py-2 px-3 transition-all flex items-center justify-start w-full relative">
                                        <div className="px-2 py-1.5 w-full flex flex-row items-center transition-all cursor-pointer justify-start gap-2 hover:bg-white/5 rounded-md">
                                            <Pen className="h-full w-3.5" />
                                            <span className="text-sm font-medium">Edit Profile</span>
                                        </div>
                                        <div className="w-full border-b border-white/5 rounded-md" />
                                        <div className="px-2 py-1.5 w-full flex flex-row items-center transition-all cursor-pointer justify-start gap-2 hover:bg-white/5 rounded-md">
                                            <Status type="icon" size="md" position={{ left: "left-0", bottom: "bottom-0" }} profile={false} />
                                            <span className="text-sm font-medium"><Status type="text" className="text-sm font-medium text-white/70"/></span>
                                        </div>
                                    </div>
                                    <div className="rounded-sm flex-col gap-2 bg-white/5 text-white/70 py-2 px-3 transition-all flex items-center justify-start w-full relative">
                                        <div className="px-2 py-1.5 w-full flex flex-row items-center transition-all cursor-pointer justify-start gap-2 hover:bg-white/5 rounded-md">
                                            <Settings className="h-full w-3.5" />
                                            <span className="text-sm font-medium">Settings</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Tooltip text="Team & Profile">
                            <div onClick={() => setShowProfile(!showProfile)} className="bg-yellow-100 cursor-pointer w-9 h-9 flex items-center relative justify-center rounded-lg">
                                <PersonStanding className="h-5 w-5 mx-2 py-2" />
                                <img src={user?.photoURL} className="absolute -bottom-1 -right-1 bg-red-500 w-4 border border-[#101218] h-4 rounded-full" />
                            </div>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const Tooltip = ({ children, text }: { children: React.ReactNode; text: string }) => (
    <div className="relative group z-50">
        {children}
        <span className="absolute z-50 left-12 top-1/2 -translate-y-1/2 bg-black/90 text-white text-sm w-auto rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            {text}
        </span>
    </div>
);