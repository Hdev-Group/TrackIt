const { Server } = require("socket.io");
const http = require("http");
require("dotenv").config({ path: ".env.local" });
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGODB_URI;

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
  pingInterval: 25000,
  pingTimeout: 60000,
});

const onlineUsers = new Map();
const channelUsers = new Map(); // Track users per channel

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

  // Targeted signaling to specific users
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

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    await client.connect()
    await client.db("admin").command({ ping: 1 })
    console.log("Pinged deployment. You successfully connected to MongoDB!")
  } finally {
    await client.close()
  }
}

server.listen(3001, () => {
  console.log("Socket.IO server running on http://localhost:3001")
  run().catch(console.dir)
})