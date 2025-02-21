import { useEffect, useRef } from "react";
import io from "socket.io-client";

export default function SendMessage({ userId, message }) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!socketRef.current) {
      console.log("Connecting WebSocket...");
      socketRef.current = io("http://localhost:3001", { transports: ["websocket"] });

      socketRef.current.on("messageSent", ({ userId, message }) => {
        console.log("Message sent:", userId, "Message:", message);
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
  }, [userId, message]); 

  const sendMessage = (newMessage) => {
    if (socketRef.current?.connected) {
      console.log("Emitting 'sendMessage':", newMessage);
      socketRef.current.emit("sendMessage", { userId, message: newMessage });
    } else {
      console.error("Socket not connected! Cannot emit 'sendMessage'.");
    }
  };

  return { sendMessage };
}