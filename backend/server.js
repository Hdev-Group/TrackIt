const { Server } = require("socket.io");
const http = require("http");
const admin = require("firebase-admin");
require("dotenv").config({ path: ".env.local" });

// Initialize Firebase Admin SDK
const serviceAccount = require("../trackit-10c25-firebase-adminsdk-fbsvc-84b52f0849.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

// Create HTTP server for Socket.IO
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
  pingInterval: 25000,
  pingTimeout: 60000,
});

// Existing Socket.IO Logic (unchanged)
const onlineUsers = new Map();
const channelUsers = new Map();

io.on("connection", (socket) => {
  console.log("New client connected! Socket ID:", socket.id);

  socket.on("online", ({ userId, status }) => {
    console.log("User connected:", userId, "| Status:", status);
    const user = Array.from(onlineUsers.values()).find((user) => user.userId === userId);
    if (user) return;
    onlineUsers.set(socket.id, { userId, socketId: socket.id, status });
    io.emit("onlineUsers", Array.from(onlineUsers.values()));
  });

  socket.on("userJoinedChannel", ({ userId, channel }) => {
    console.log(`User ${userId} joined channel: ${channel}`);
    socket.join(channel);

    if (!channelUsers.has(channel)) {
      channelUsers.set(channel, new Set());
    }

    channelUsers.get(channel)?.forEach((user) => {
      if (user.userId === userId) {
        channelUsers.get(channel).delete(user);
      }
    });

    channelUsers.get(channel)?.add({ userId, socketId: socket.id });
    const usersInChannel = Array.from(channelUsers.get(channel)).map(({ userId, socketId }) => ({
      userId,
      socketId,
    }));
    io.to(channel).emit("channelParticipants", usersInChannel);
    console.log(`Emitted channelParticipants for channel ${channel}:`, usersInChannel);
  });

  socket.emit("onlineUsers", Array.from(onlineUsers.values()));

  socket.on("sendMessage", ({ userId, message, channel, timestamp }) => {
    const roomClients = io.sockets.adapter.rooms.get(channel);
    console.log(`Sending message from ${userId} to channel ${channel}`);
    console.log(`Channel ${channel} has ${roomClients?.size || 0} clients`);
    if (!roomClients || roomClients.size === 0) {
      console.warn(`No clients in channel ${channel}. Message not sent`);
      return;
    }
    console.log(`Broadcasting message to ${roomClients.size} clients in channel ${channel}`);
    io.to(channel).emit("messageReceiver", { userId, message, channel, timestamp });
  });

  socket.on("channelTyping", ({ userId, channel }) => {
    console.log(`User ${userId} is typing in channel: ${channel}`);
    socket.to(channel).emit("typing", { userId, channel });
  });

  socket.on("channelCreated", ({ userId, channelName }) => {
    console.log("Channel created received from:", userId, "Channel name:", channelName);
    io.emit("channelCreated", { userId, channelName });
  });

  socket.on("leaveChannel", ({ userId, channel }) => {
    console.log(`User ${userId} left channel: ${channel}`);
    socket.leave(channel);
    if (channelUsers.has(channel)) {
      channelUsers.get(channel).forEach((user) => {
        if (user.userId === userId) channelUsers.get(channel).delete(user);
      });
      const usersInChannel = Array.from(channelUsers.get(channel));
      io.to(channel).emit("channelParticipants", usersInChannel);
    }
    socket.to(channel).emit("userLeftChannel", { userId, channel });
  });

  socket.on("offer", ({ offer, channel, fromUserId, toUserId }) => {
    console.log(`Offer from ${fromUserId} to ${toUserId} in channel ${channel}:`, offer);
    const toSocketId = Array.from(channelUsers.get(channel) || []).find(
      (user) => user.userId === toUserId
    )?.socketId;
    if (toSocketId) {
      io.to(toSocketId).emit("offer", { offer, fromUserId, toUserId });
    } else {
      console.warn(`User ${toUserId} not found in channel ${channel}`);
    }
  });

  socket.on("answer", ({ answer, channel, fromUserId, toUserId }) => {
    console.log(`Answer from ${fromUserId} to ${toUserId} in channel ${channel}:`, answer);
    const toSocketId = Array.from(channelUsers.get(channel) || []).find(
      (user) => user.userId === toUserId
    )?.socketId;
    if (toSocketId) {
      io.to(toSocketId).emit("answer", { answer, fromUserId, toUserId });
    } else {
      console.warn(`User ${toUserId} not found in channel ${channel}`);
    }
  });

  socket.on("ice-candidate", ({ candidate, channel, fromUserId, toUserId }) => {
    console.log(`ICE candidate from ${fromUserId} to ${toUserId} in channel ${channel}:`, candidate);
    const toUser = Array.from(channelUsers.get(channel) || []).find((u) => u.userId === toUserId);
    if (toUser) {
      io.to(toUser.socketId).emit("ice-candidate", { candidate, fromUserId, toUserId });
    } else {
      console.warn(`User ${toUserId} not found in channel ${channel}`);
    }
  });

  socket.on("changeStatus", ({ userId, status }) => {
    console.log("Status change received from:", userId, "New status:", status);
    let user = Array.from(onlineUsers.values()).find((user) => user.userId === userId);
    if (user) {
      user.status = status;
      onlineUsers.set(user.socketId, user);
      io.emit("statusChanged", { userId, status });
      io.emit("onlineUsers", Array.from(onlineUsers.values()));
    }
  });

  socket.on("disconnect", () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      console.log("User disconnected:", user.userId);
      const rooms = Array.from(socket.rooms).filter((room) => room !== socket.id);
      rooms.forEach((room) => {
        socket.leave(room);
        if (channelUsers.has(room)) {
          channelUsers.get(room).forEach((u) => {
            if (u.userId === user.userId) channelUsers.get(room).delete(u);
          });
          const usersInChannel = Array.from(channelUsers.get(room));
          io.to(room).emit("channelParticipants", usersInChannel);
          socket.to(room).emit("userLeftChannel", { userId: user.userId, channel: room });
        }
      });
      onlineUsers.delete(socket.id);
      io.emit("userDisconnected", user.userId);
      io.emit("onlineUsers", Array.from(onlineUsers.values()));
    }
  });
});

async function cleanupUnverifiedUsers() {
  try {
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000; 
    const usersRef = db.collection("users");

    const snapshot = await usersRef
      .where("isVerified", "==", false)
      .where("createdAt", "<=", new Date(twoHoursAgo))
      .get();

    if (snapshot.empty) {
      console.log("No unverified users to delete");
      return;
    }

    const deletePromises = snapshot.docs.map(async (doc) => {
      const uid = doc.id;
      await usersRef.doc(uid).delete(); 
      await auth.deleteUser(uid); 
      console.log(`Deleted unverified user: ${uid}`);
    });

    await Promise.all(deletePromises);
    console.log("Cleanup of unverified users completed");
  } catch (error) {
    console.error("Error during cleanup of unverified users:", error);
  }
}

setInterval(cleanupUnverifiedUsers, 5 * 60 * 1000);

// Start the Server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});