import io from "socket.io-client";

let socket = null;

export const getSocket = () => {
  if (!socket || socket.disconnected) {
    socket = io("http://localhost:3001", {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
    console.log("New socket instance created:", socket.id);
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
    socket = null;
    console.log("Socket disconnected manually.");
  }
};