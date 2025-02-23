import { useEffect, useRef } from "react";
import io from "socket.io-client";

export default function IsTyping(userId, channel){
    const socketRef = useRef(null);
    
    useEffect(() => {
        if (!userId || !channel) return; 
    
        console.log("Connecting WebSocket...");
        socketRef.current = io("http://localhost:3001", {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        });
    
        const socket = socketRef.current;
    
        socket.on("connect", () => console.log("WebSocket connected."));
        socket.on("disconnect", () => console.log("WebSocket disconnected."));
        socket.on("connect_error", (err) => console.error("WebSocket error:", err));
    
        socket.on("channelTyping", (typing) => {
        console.log("Typing received:", typing);
        });
    
        return () => {
        console.log("Disconnecting WebSocket before unmounting.");
        socket.disconnect();
        socketRef.current = null;
        };
    }, [userId, channel]);
    
    const isTyping = () => {
        if (socketRef.current?.connected) {
        console.log("Emitting 'channelTyping':", channel);
        socketRef.current.emit("channelTyping", { userId, channel });
        } else {
        console.error("Socket not connected! Cannot emit 'channelTyping'.");
        }
    };
    
    return { isTyping };
}