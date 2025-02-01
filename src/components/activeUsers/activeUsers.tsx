import { useState, useEffect } from "react";
import CurrentActiveUsers from "../websockets/activeUsers/activeUsers";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function ActiveUsers() {
    const [hidden, setHidden] = useState(false);
    const [users, setUsers] = useState<{ userId: string; status: string, firstName: string, lastName: string, pictureURL: string }[]>([]); 
    const [active, setActive] = useState(false);
    const db = getFirestore();
    const auth = getAuth();


    const getUserProfile = async (uid: string) => {
        try {
          const userDocRef = doc(db, "users", uid); 
          const userDocSnap = await getDoc(userDocRef);
      
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const { firstName, lastName, profilePicture } = userData;
      
            console.log("User Info:", firstName, lastName, profilePicture);
            return { firstName, lastName, profilePicture };
          } else {
            console.log("No such user!");
            return {};
          }
        } catch (error) {
          console.error("Error getting user data:", error);
          return {};
        }
      };

    useEffect(() => {
        if (active) {
            // get that users full name and profile picture
            const fetchUserProfiles = async () => {
                const updatedUsers = await Promise.all(users.map(async (user) => {
                    const userProfile = await getUserProfile(user.userId);
                    return { ...user, ...userProfile };
                }));
                setUsers(updatedUsers);
            };

            fetchUserProfiles();
        }
    }, [active, users]);

    console.log(users, "bt"); 

    return (
        <div className={`mt-[1rem] w-[20rem] flex-row flex z-50 justify-between transition-all duration-300`}>
            <div className="flex flex-col items-start mx-2 w-full h-full mr-4">
                <div className="flex flex-col justify-between h-full w-full">
                    <div className="flex flex-col w-full select-none">
                        <h2>Active Users</h2>
                        <CurrentActiveUsers setOnlineUsers={setUsers} />
                        <ul>
                            {users.map((user) => (
                                <li key={user.userId}>{user.userId} - {user.status} - {user.firstName}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
