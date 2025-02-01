import { Server } from "socket.io";

const onlineUsers = new Map(); 

export default function handler(_, res) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.io server...");
    const io = new Server(res.socket.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on("online", (userId, userStatus) => {
        onlineUsers.set(userId, { socketId: socket.id, status: userStatus });
        io.emit("onlineUsers", Array.from(onlineUsers.entries())); 
      });

      socket.on("checkOnlineStatus", (userId, callback) => {
        callback(onlineUsers.has(userId));
      });

      socket.on("disconnect", () => {
        let disconnectedUserId = null;

        for (const [userId, userData] of onlineUsers) {
          if (userData.socketId === socket.id) {
            disconnectedUserId = userId;
            onlineUsers.delete(userId);
            break;
          }
        }

        if (disconnectedUserId) {
          io.emit("userDisconnected", disconnectedUserId);
        }

        console.log(`User disconnected: ${socket.id}`);
      });
    });
  }

  res.end();
}
