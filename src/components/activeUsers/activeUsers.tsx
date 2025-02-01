import { useState, useEffect, useRef } from "react"
import CurrentActiveUsers from "../websockets/activeUsers/activeUsers"
import { getFirestore, doc, getDoc } from "firebase/firestore"

export default function ActiveUsers() {
    const [users, setUsers] = useState<{ userId: string; status: string, firstName?: string, lastName?: string, pictureURL?: string }[]>([])
    const db = getFirestore()
    const fetchedUsersRef = useRef(new Set())

    const getUserProfile = async (uid: string) => {
        console.log("Fetching user data for UID:", uid);
    
        try {
            const userDocRef = doc(db, "users", uid);
            const userDocSnap = await getDoc(userDocRef);
    
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                const displayName = userData.displayName || "Unknown User";
                const nameParts = displayName.split(" ");
                const firstName = nameParts[0] || "Unknown";
                const lastName = nameParts.slice(1).join(" ") || ""; 
    
                return {
                    firstName,
                    lastName,
                    pictureURL: userData.photoURL || "",
                };
            } else {
                return { firstName: "Unknown", lastName: "", pictureURL: "" };
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            return { firstName: "Unknown", lastName: "", pictureURL: "" };
        }
    };

    useEffect(() => {
        console.log("Users before fetching profiles:", users)

        if (users.length > 0) {
            const fetchUserProfiles = async () => {
                const updatedUsers = await Promise.all(
                    users.map(async (user) => {
                        if (!user.firstName && !fetchedUsersRef.current.has(user.userId)) { 
                            fetchedUsersRef.current.add(user.userId) 
                            const userProfile = await getUserProfile(user.userId)
                            return { ...user, ...userProfile }
                        }
                        return user
                    })
                )

                setUsers(prevUsers => {
                    if (JSON.stringify(prevUsers) !== JSON.stringify(updatedUsers)) {
                        return updatedUsers 
                    }
                    return prevUsers
                })
            }

            fetchUserProfiles()
        }
    }, [users]) 

    const activityTypes = {
        Online: "bg-green-400",
        Idle: "bg-yellow-400",
        Busy: "bg-red-400",
        Offline: "bg-gray-400",
    };

    function Status({ status }: { status: keyof typeof activityTypes }) {
        return <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${activityTypes[status]}`}></div>;
    }

    return (
        <div className="w-[15rem] h-full flex-row flex z-50 justify-between transition-all duration-300">
            <div className="flex flex-col items-start w-full h-full mx-2">
                <div className="flex flex-col justify-between h-full w-full">
                    <div className="flex flex-col w-full select-none">
                        <CurrentActiveUsers setOnlineUsers={(newUsers: any) => {
                            console.log("Received Active Users:", newUsers)
                            setUsers(newUsers)
                        }} />
                        <div className="flex flex-col w-full h-full">
                            <div className="flex flex-col w-full mt-5 h-full">
                            <ul className="space-y-2">
                                {users.map((user) => (
                                    <li key={user.userId} className="flex hover:bg-muted-foreground/10 rounded-md px-2 flex-row gap-2 items-center space-x-2">
                                        <div className="flex relative items-center justify-center w-8 h-8">
                                            <img src={user.pictureURL} alt="User Profile" className="w-8 h-8 rounded-full" />
                                            <Status status={user.status as keyof typeof activityTypes} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span>{user.firstName} {user.lastName}</span>
                                            <span className="text-xs text-gray-400">{user.status}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
