import { useState, useEffect, useRef } from "react";
import CurrentActiveUsers from "../websockets/activeUsers/activeUsers";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { SidebarClose, SidebarOpen } from "lucide-react";

interface User {
    userId: string;
    status: "Online" | "Idle" | "Busy" | "Offline";
    displayName?: string;
    pictureURL?: string;
}

const activityTypes = {
    Online: "bg-green-400",
    Idle: "bg-yellow-400",
    Busy: "bg-red-400",
    Offline: "bg-gray-400",
};

function Status({ status }: { status: keyof typeof activityTypes }) {
    return (
        <span
            className={`absolute bottom-0 right-0 w-2 h-2 rounded-full  ${
                activityTypes[status] || activityTypes.Offline
            }`}
        />
    );
}

export default function ActiveUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const db = getFirestore();
    const fetchedUsersRef = useRef(new Set<string>());

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
        const missingUsers = users.filter(user => !user.displayName && !fetchedUsersRef.current.has(user.userId));

        if (missingUsers.length === 0) return;

        (async () => {
            const updatedUsers = await Promise.all(
                missingUsers.map(async (user) => {
                    fetchedUsersRef.current.add(user.userId);
                    const userProfile = await getUserProfile(user.userId);
                    return { ...user, ...userProfile };
                })
            );

            setUsers(prevUsers =>
                prevUsers.map(user => updatedUsers.find(u => u.userId === user.userId) || user)
            );
        })();
    }, [users]);

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={`w-[4rem] lg:w-[${isSidebarOpen ? "15" : "4"}rem] h-full flex flex-col z-10 transition-all duration-300`}>
            <div className="flex flex-col items-start w-full h-full">
                <div className="flex flex-col justify-between h-full w-full">
                    <div className="flex flex-col w-full select-none">
                        <CurrentActiveUsers
                            setOnlineUsers={(newUsers: User[]) => {
                                console.log("New WebSocket Users:", newUsers);
                                setUsers((prevUsers) => {
                                    const userMap = new Map(prevUsers.map((u) => [u.userId, u]));

                                    userMap.forEach((user, userId) => {
                                        userMap.set(userId, { ...user, status: "Offline" });
                                    });

                                    newUsers.forEach((newUser) => {
                                        if (userMap.has(newUser.userId)) {
                                            userMap.set(newUser.userId, { ...userMap.get(newUser.userId), ...newUser });
                                        } else {
                                            userMap.set(newUser.userId, newUser);
                                        }
                                    });

                                    const updatedUsers = Array.from(userMap.values());
                                    console.log("Updated User List:", updatedUsers);
                                    return updatedUsers;
                                });
                            }}
                        />
                        <div className="flex flex-col w-full h-full">
                            <div className={`${isSidebarOpen ? "" : "items-center justify-center"} py-4 px-2 flex border-b`}>
                                {
                                    isSidebarOpen ? (
                                        <SidebarOpen 
                                        onClick={() => toggleSidebar()}
                                        className="w-8 hover:bg-muted rounded-md transition-all cursor-pointer h-8 p-1 text-white/80" />
                                    ) : (
                                        <SidebarClose
                                        onClick={() => toggleSidebar()}
                                        className="w-8 hover:bg-muted rounded-md transition-all cursor-pointer h-8 p-1 text-white/80" />
                                    )
                                }
                            </div>
                            <div className="flex flex-col w-full h-full">
                                <ul className="space-y-2 mt-3">
                                    {users.filter(user => user.status != "Offline").length > 0 && (
                                        <>
                                            {users.filter(user => user.status != "Offline").map((user) => (
                                                <li
                                                    key={user.userId}
                                                    className={`flex hover:bg-muted-foreground/10 rounded-md ${isSidebarOpen ? "mx-2 px-2  space-x-2": "px-2 mr-4 justify-center w-full"} cursor-pointer py-1 flex-row gap-1 items-center`}
                                                >
                                                    <div className="flex relative items-center justify-center w-8 h-8">
                                                        <img
                                                            src={user.pictureURL}
                                                            alt="User Profile"
                                                            className="w-8 h-8 rounded-full"
                                                            referrerPolicy="no-referrer"
                                                        />
                                                        <Status status={user.status} />
                                                    </div>
                                                    <div className={`${isSidebarOpen ? "flex" : "hidden"} hidden flex-col lg:flex`}>
                                                        <span className={`${isSidebarOpen ? "flex" : "hidden"} text-sm font-medium`}>{user.displayName}</span>
                                                        <span className={`${isSidebarOpen ? "flex" : "hidden"} text-xs font-light -mt-[0.3rem] text-gray-400`}>
                                                            {user.status}
                                                        </span>
                                                    </div>
                                                </li>
                                            ))}
                                        </>
                                    )}
                                    {users.filter(user => user.status === "Offline").length > 0 && (
                                        <>
                                            <h3 className="text-gray-500 text-sm mt-4">Offline</h3>
                                            {users.filter(user => user.status === "Offline").map((user) => (
                                                <li
                                                    key={user.userId}
                                                    className="flex hover:bg-muted-foreground/10 rounded-md px-2 py-1 flex-row gap-1 items-center space-x-2"
                                                >
                                                    <div className="flex relative items-center justify-center w-8 h-8">
                                                        <img
                                                            src={user.pictureURL}
                                                            alt="User Profile"
                                                            className="w-8 h-8 rounded-full"
                                                            referrerPolicy="no-referrer"
                                                        />
                                                        <Status status={user.status} />
                                                    </div>
                                                    <div className="flex flex-col items-start justify-start h-full">
                                                        <span className="text-sm font-medium text-white/20">{user.displayName}</span>
                                                    </div>
                                                </li>
                                            ))}
                                        </>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
