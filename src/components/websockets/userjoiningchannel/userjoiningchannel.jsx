import { useEffect, useRef } from "react";
import io from "socket.io-client";
import { getSocket } from "../../../lib/socket"

export default function useUserJoinedChannel({ userId, channel, onUserJoined }) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId || !channel) return;

    console.log("Connecting WebSocket for channel join...");
    socketRef.current = getSocket();
    socketRef.current = io("http://localhost:3001", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    const socket = socketRef.current;

    const handleConnect = () => {
      socket.emit("userJoinedChannel", { userId, channel });
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.on("connect", handleConnect);
    }

    socket.on("userJoinedChannel", (data) => {
      if (typeof onUserJoined === "function") {
        onUserJoined(data);
      }
    });

    socket.on("disconnect", () => console.log("WebSocket disconnected."));
    socket.on("connect_error", (err) => console.error("WebSocket error:", err));

    return () => {
      console.log("Disconnecting WebSocket before unmounting.");
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, channel, onUserJoined]);

  return null; 
}