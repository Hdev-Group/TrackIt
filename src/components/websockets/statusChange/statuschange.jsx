import { useEffect, useRef } from "react";
import io from "socket.io-client";

export default function StatusChanger({ userId, status }) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      console.log("Connecting WebSocket...");
      socketRef.current = io("http://localhost:3001", { transports: ["websocket"] });

      socketRef.current.on("statusChanged", ({ userId, status }) => {
        console.log("Status updated:", userId, "New status:", status);
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
  }, [userId, status]); 

  const changeStatus = (newStatus) => {
    if (socketRef.current?.connected) {
      console.log("Emitting 'changeStatus':", newStatus);
      socketRef.current.emit("changeStatus", { userId, status: newStatus });
    } else {
      console.error("Socket not connected! Cannot emit 'changeStatus'.");
    }
  };

  return { changeStatus };
}
