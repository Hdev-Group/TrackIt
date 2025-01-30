import { useEffect, useState, useMemo, useRef } from "react";
import io from "socket.io-client";

export default function useActive({ userId }) {
    const [onlineUsers, setOnlineUsers] = useState([]);
    const socketRef = useRef(null);
    const userOnlineRef = useRef(false); 


    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io("http://localhost:3001", { transports: ["websocket"] });
        }

        const handleOnlineUsers = (users) => {
            setOnlineUsers(users);
        };

        socketRef.current.on("onlineUsers", handleOnlineUsers);

        if (userId) {
            const userAlreadyOnline = onlineUsers.some(user => user.userId === userId);
            if (!userAlreadyOnline) {
            if (!userOnlineRef.current) {
                const currentStatus = localStorage.getItem("status") || "online";
                console.log("Current status:", currentStatus);
                socketRef.current.emit("online", { userId, status: currentStatus });
                userOnlineRef.current = true;
            }

            socketRef.current.emit("checkOnlineStatus", { userId }, (isOnline) => {
                console.log(`User ${userId} is online:`, isOnline);
            });
            
            } else {
            console.log(`User ${userId} is already online.`);
            }
        }

        return () => {
            socketRef.current.off("onlineUsers", handleOnlineUsers);
        };
    }, [userId]); 

    console.log("Online users:", onlineUsers);

    const isActive = useMemo(() => {
        const uniqueOnlineUsers = Array.from(new Set(onlineUsers.map(user => user.userId)))
            .map(id => onlineUsers.find(user => user.userId === id));
        return uniqueOnlineUsers.some((user) => user.userId === userId);
    }, [onlineUsers, userId]);

    return isActive;
}
