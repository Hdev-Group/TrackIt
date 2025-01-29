const { Server } = require("socket.io");
const http = require("http");
const next = require("next");

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
});

const onlineUsers = new Map(); 

io.on("connection", (socket) => {
  console.log("User connected:", socket.id, "Total users:", onlineUsers.size + 1);

  socket.on("online", ({ userId }) => {
    onlineUsers.set(socket.id, { userId, socketId: socket.id });
    io.emit("onlineUsers", Array.from(onlineUsers.values()));
  });

  socket.on("checkOnlineStatus", ({ userId }, callback) => {
    let isOnline = false;
    for (let user of onlineUsers.values()) {
      if (user.userId === userId) {
        isOnline = true;
        break;
      }
    }
    callback(isOnline);
  });

  socket.on("disconnect", () => {
    const user = onlineUsers.get(socket.id);
    if (user) {
      onlineUsers.delete(socket.id);
      io.emit("userDisconnected", user.userId); 
      io.emit("onlineUsers", Array.from(onlineUsers.values())); 
    }
    console.log("User disconnected:", socket.id);
  });
});

app.prepare().then(() => {
  server.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
  });
});
