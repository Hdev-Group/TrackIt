import { useEffect, useRef } from "react";
import io from "socket.io-client";

export default function NewChannelCreated({ userId, channelName }) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      console.log("Connecting WebSocket...");
      socketRef.current = io("http://localhost:3001", { transports: ["websocket"] });

      socketRef.current.on("channelCreated", ({ userId, channelName }) => {
        console.log("Channel created:", userId, "Channel name:", channelName);
      });

      socketRef.current.on("disconnect", () => {
        console.log("WebSocket disconnected.");
      });

      socketRef.current.on("connect_error", (err) => {
        console.error("WebSocket connection error:", err);
      });
    }

    return () => {
      if (socketRef.current) {
        console.log("Disconnecting WebSocket before unmounting.");
        socketRef.current.disconnect();
        socketRef.current = null; 
      }
    };
  }, [userId, channelName]); 

  const channelCreated = (newChannelName) => {
    if (socketRef.current?.connected) {
      console.log("Emitting 'channelCreated':", newChannelName);
      socketRef.current.emit("channelCreated", { userId, channelName: newChannelName });
    } else {
      console.error("Socket not connected! Cannot emit 'channelCreated'.");
    }
  };

  return { channelCreated };
}