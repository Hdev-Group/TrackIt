const { Server } = require("socket.io");
const http = require("http");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const server = http.createServer((req, res) => {
  handle(req, res);
});

// Initialize Socket.io
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

  socket.emit("onlineUsers", Array.from(onlineUsers.values()));

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
      onlineUsers.delete(socket.id); 
      io.emit("userDisconnected", user.userId); 
      io.emit("onlineUsers", Array.from(onlineUsers.values()));
    }
  });
});

app.prepare().then(() => {
  server.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
  });
});
