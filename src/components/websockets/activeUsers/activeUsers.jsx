import { useEffect, useRef } from "react";
import io from "socket.io-client";

export default function CurrentActiveUsers({ setOnlineUsers }) {
    const socketRef = useRef(null);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io("http://localhost:3001", { transports: ["websocket"] });
        }

        const handleOnlineUsers = (users) => {
            setOnlineUsers(users); 
        };

        socketRef.current.on("onlineUsers", handleOnlineUsers); 

        return () => {
            socketRef.current.off("onlineUsers", handleOnlineUsers); 
        };
    }, [setOnlineUsers]);

    return null;
}
