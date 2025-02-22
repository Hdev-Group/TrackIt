const { Server } = require("socket.io");
const http = require("http");
const next = require("next");
require('dotenv').config({ path: '.env.local' });
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();


const server = http.createServer((req, res) => {
  handle(req, res);
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingInterval: 25000,
  pingTimeout: 60000,
});

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("New client connected! Socket ID:", socket.id);

  socket.on("online", ({ userId, status }) => {
    console.log("User connected:", userId, "| Status:", status);
    const user = Array.from(onlineUsers.values()).find(user => user.userId === userId);

    if (user) {
      return;
    }
    onlineUsers.set(socket.id, { userId, socketId: socket.id, status });
    io.emit("onlineUsers", Array.from(onlineUsers.values()));
  });

  socket.on("userJoinedChannel", ({ userId, channel }) => {
    console.log(`User ${userId} joined channel: ${channel}`);
    socket.join(channel); 
  
    socket.to(channel).emit("userJoinedChannel", { userId, channel });
  });
  

  socket.emit("onlineUsers", Array.from(onlineUsers.values()));

  socket.on("sendMessage", ({ userId, message, channel }) => {
    const roomClients = io.sockets.adapter.rooms.get(channel);
    
    console.log(`Sending message from ${userId} to channel ${channel}`);
    console.log(`Channel ${channel} has ${roomClients?.size || 0} clients`);
    
    if (!roomClients || roomClients.size === 0) {
      console.warn(`No clients in channel ${channel}. Message not sent`);
      return;
    }
    
    console.log(`Broadcasting message to ${roomClients.size} clients in channel ${channel}`);
    io.to(channel).emit("messageReceiver", { userId, message, channel });
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
    socket.to(channel).emit("userLeftChannel", { userId, channel });
  });
  

  socket.on("changeStatus", ({ userId, status }) => {
    console.log("Status change received from:", userId, "New status:", status);

    let user = Array.from(onlineUsers.values()).find(user => user.userId === userId);

    if (user) {
      user.status = status;
      onlineUsers.set(user.socketId, user); 

      console.log("Status updated:", { userId, status });

      io.emit("statusChanged", { userId, status });
      io.emit("onlineUsers", Array.from(onlineUsers.values()));
    } else {
      console.log("User not found:", userId);
    }
  });

  socket.on("disconnect", () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      console.log("User disconnected:", user.userId);
      const rooms = Array.from(socket.rooms).filter((room) => room !== socket.id);
      rooms.forEach((room) => {
        socket.leave(room);
        socket.to(room).emit("userLeftChannel", { userId: user.userId, channel: room });
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
  }
});
async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

app.prepare().then(() => {
  server.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
  });
});
