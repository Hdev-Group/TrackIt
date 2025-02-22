import { useEffect, useRef } from "react";
import io from "socket.io-client";
import { getSocket } from "../../../lib/socket"

export default function useSendMessage(userId, channel, onMessageReceived) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId || !channel) return;
  
    console.log("Connecting WebSocket...");
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
  
    socket.on("disconnect", () => console.log("WebSocket disconnected."));
    socket.on("connect_error", (err) => console.error("WebSocket error:", err));
  
    socket.on("messageReceiver", (message) => {
      if (message.channel === channel && typeof onMessageReceived === "function") {
        onMessageReceived(message);
      } else {
        console.warn("Message rejected - Channel mismatch or invalid callback");
        console.warn("Expected channel:", channel, "Got:", message.channel);
        console.warn("onMessageReceived type:", typeof onMessageReceived);
      }
    });
  
    return () => {
      console.log("Disconnecting WebSocket before unmounting.");
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [userId, channel, onMessageReceived]);

  const sendMessage = (newMessage) => {
    if (socketRef.current?.connected) {
      console.log("Emitting 'sendMessage':", { userId, message: newMessage, channel });
      socketRef.current.emit("sendMessage", { userId, message: newMessage, channel });
    } else {
      console.error("Socket not connected! Cannot emit 'sendMessage'.");
    }
  };

  return { sendMessage };
}