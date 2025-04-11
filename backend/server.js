const { Server } = require("socket.io");
const http = require("http");
const admin = require("firebase-admin");
require("dotenv").config({ path: ".env.local" });
const { MongoClient, ObjectId } = require("mongodb");
const axios = require("axios");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

// Configuration constants
const FREQ_REGEX = /^(\d+)([smh])$/;
const MULTIPLIERS = { s: 1000, m: 60000, h: 3600000 };
const DEFAULT_TIMEOUT = 10000;
const MAX_CONCURRENT_REQUESTS = 10;
const BATCH_SIZE = 1;
const MONITOR_REFRESH_INTERVAL = 300000; // 5 minutes
const CLEANUP_INTERVAL = 3600000; // 1 hour

// Semaphore for concurrent requests
class Semaphore {
  constructor(maxConcurrent) {
    this.maxConcurrent = maxConcurrent;
    this.current = 0;
    this.queue = [];
  }

  async acquire() {
    if (this.current < this.maxConcurrent) {
      this.current++;
      return Promise.resolve();
    }
    return new Promise((resolve) => this.queue.push(resolve));
  }

  release() {
    this.current--;
    if (this.queue.length > 0) {
      this.queue.shift()();
    }
  }
}

const semaphore = new Semaphore(MAX_CONCURRENT_REQUESTS);

// Initialize Firebase
const serviceAccount = require("../trackit-10c25-firebase-adminsdk-fbsvc-84b52f0849.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize MongoDB
const mongoClient = new MongoClient(process.env.MONGODB_URI_MONITORING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let monitorsCollection, infoCollection;

async function connectToMongo() {
  try {
    await mongoClient.connect();
    const db = mongoClient.db("monitoring");
    monitorsCollection = db.collection("monitors");
    infoCollection = db.collection("info");
    console.log("Connected to MongoDB");
    return true;
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    return false;
  }
}

// Initialize HTTP server and Socket.IO
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
const channelUsers = new Map();
const activeMonitors = new Map();

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

// Cleanup unverified Firebase users
async function cleanupUnverifiedUsers() {
  try {
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    const usersRef = admin.firestore().collection("users");

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
      await admin.auth().deleteUser(uid);
      console.log(`Deleted unverified user: ${uid}`);
    });

    await Promise.all(deletePromises);
    console.log("Cleanup of unverified users completed");
  } catch (error) {
    console.error("Error during cleanup of unverified users:", error);
  }
}

setInterval(cleanupUnverifiedUsers, CLEANUP_INTERVAL);

// Monitoring logic
async function checkWebsiteStatus(monitor) {
  const { _id, monitoring, alertConditions } = monitor;
  const { webURL } = monitoring;
  const monitorId = _id.toString();

  console.log(`Checking website status for ${webURL} (ID: ${monitorId})`);

  await semaphore.acquire();

  const result = {
    monitorId,
    url: webURL,
    status: "down",
    latency: null,
    ping: null,
    responseTime: null,
    statusCode: null,
    error: null,
    contentLength: null,
    timestamp: new Date(),
  };

  try {
    const start = Date.now();

    const [httpResponse, pingResult] = await Promise.allSettled([
      axios.get(webURL, {
        timeout: DEFAULT_TIMEOUT,
        headers: { "User-Agent": "Website-Monitor/1.0" },
        validateStatus: () => true,
      }),
      getPingTime(webURL),
    ]);

    result.responseTime = Date.now() - start;

    if (httpResponse.status === "fulfilled") {
      const { status, headers, data } = httpResponse.value;
      result.statusCode = status;
      result.latency = Date.now() - start;
      result.contentLength = headers["content-length"] || Buffer.byteLength(data);

      if (status >= 200 && status < 400) {
        result.status = "up";
      }
      console.log(`HTTP check for ${webURL}: status=${status}, latency=${result.latency}ms`);
    } else {
      console.log(`HTTP check failed for ${webURL}: ${httpResponse.reason}`);
    }

    if (pingResult.status === "fulfilled" && pingResult.value !== null) {
      result.ping = pingResult.value;
      console.log(`Ping for ${webURL}: ${result.ping}ms`);
    } else {
      console.log(`Ping failed for ${webURL}`);
    }
  } catch (err) {
    result.error = err.message;
    console.error(`Error checking ${webURL}: ${err.message}`);
  } finally {
    semaphore.release();
  }

  await batchInsertResult(result);

  io.emit("websiteStatus", result);
  console.log(`Emitted websiteStatus for ${webURL}: ${result.status}`);

  handleAlerts(monitor, result);

  return result;
}

async function getPingTime(url) {
  try {
    const hostname = new URL(url).hostname;
    const { stdout } = await execPromise(`ping -c 1 ${hostname}`);
    const timeMatch = stdout.match(/time=(\d+\.?\d*)/);
    if (timeMatch) {
      return parseFloat(timeMatch[1]);
    }
    return null;
  } catch {
    return null;
  }
}

let resultBatch = [];
async function batchInsertResult(result) {
  if (result && Object.keys(result).length > 0) {
    resultBatch.push(result);
  }

  if (resultBatch.length === 0) {
    return; 
  }

  if (resultBatch.length >= BATCH_SIZE || (!result || Object.keys(result).length === 0)) {
    const batchToInsert = [...resultBatch];
    resultBatch = []; 

    try {
      await infoCollection.insertMany(batchToInsert, { ordered: false });
      console.log(`Batch insert successful: ${batchToInsert.length} items`);
    } catch (err) {
      console.error(`Batch insert failed: ${err.message}`);
      resultBatch.push(...batchToInsert);
    }
  }
}

setInterval(async () => {
  if (resultBatch.length > 0) {
    await batchInsertResult(null); 
    console.log(`Flushed remaining batch items: ${resultBatch.length}`);
  }
}, 30000);

function parseFrequency(freqString) {
  if (!freqString) {
    console.warn("No frequency string provided, using default 3m");
    return 180000;
  }
  const match = freqString.match(FREQ_REGEX);
  if (!match) {
    console.warn(`Invalid frequency string: ${freqString}, using default 3m`);
    return 180000;
  }
  const value = parseInt(match[1]) * MULTIPLIERS[match[2]];
  console.log(`Parsed frequency: ${freqString} -> ${value}ms`);
  return value;
}

async function handleAlerts(monitor, result) {
  const { alertConditions, _id } = monitor;
  if (!alertConditions) {
    console.log(`No alert conditions for monitor ${_id}`);
    return;
  }

  const { status, latency } = result;
  const alerts = [];

  if (status === "down" && alertConditions.alertCondition === "down") {
    alerts.push({
      type: "downtime",
      level: alertConditions.severityLevel || "warning",
    });
  }

  if (latency && alertConditions.latencyThreshold && latency > alertConditions.latencyThreshold) {
    alerts.push({
      type: "latency",
      level: alertConditions.severityLevel || "warning",
      value: latency,
    });
  }

  alerts.forEach((alert) => {
    io.emit("alertTriggered", {
      monitorId: _id.toString(),
      ...alert,
      escalation: monitor.alerts?.escalationOption || "none",
      timestamp: new Date(),
    });
    console.log(`Alert triggered for ${monitor.monitoring.webURL}: ${alert.type}`);
  });
}

async function startMonitoring(monitor) {
  const monitorId = monitor._id.toString();

  if (activeMonitors.has(monitorId)) {
    console.log(`Monitor ${monitorId} already running, skipping restart`);
    return;
  }

  const freq = parseFrequency(monitor.advancedSettings?.checkFrequency);

  let isRunning = false;
  let stopped = false;

  const runCheck = async () => {
    if (stopped) {
      console.log(`Monitor ${monitorId} stopped`);
      return;
    }

    if (!isRunning) {
      isRunning = true;
      try {
        await checkWebsiteStatus(monitor);
      } catch (err) {
        console.error(`Monitor ${monitorId} error: ${err.message}`);
      } finally {
        isRunning = false;
      }
    } else {
      console.log(`Monitor ${monitorId} still running, skipping check`);
    }

    if (!stopped) {
      setTimeout(runCheck, freq);
    }
  };

  activeMonitors.set(monitorId, () => {
    stopped = true;
    console.log(`Cleanup called for monitor ${monitorId}`);
  });

  runCheck();
  console.log(`Started monitoring: ${monitor.monitoring.webURL} every ${freq / 1000}s`);
}

async function syncMonitors() {
  if (!monitorsCollection) {
    console.log("MongoDB not initialized, skipping monitor sync");
    return;
  }

  try {
    const monitors = await monitorsCollection.find({}).toArray();
    console.log("Syncing monitors:", monitors?.length || 0);

    const currentMonitorIds = new Set(monitors.map((m) => m._id.toString()));

    // Stop monitors that no longer exist
    for (const monitorId of activeMonitors.keys()) {
      if (!currentMonitorIds.has(monitorId)) {
        const cleanup = activeMonitors.get(monitorId);
        cleanup();
        activeMonitors.delete(monitorId);
        console.log(`Stopped monitoring: ${monitorId}`);
      }
    }

    // Start valid monitors
    for (const monitor of monitors) {
      if (monitor.monitoring?.isValidURL && monitor.monitoring?.monitorType === "http") {
        await startMonitoring(monitor);
      } else {
        console.log(`Skipping invalid monitor: ${monitor._id}`);
      }
    }
  } catch (err) {
    console.error("Error syncing monitors:", err.message);
  }
}

async function initializeMonitoring() {
  const connected = await connectToMongo();
  if (!connected) {
    console.error("Failed to connect to MongoDB, retrying in 10 seconds...");
    setTimeout(initializeMonitoring, 10000);
    return;
  }

  await syncMonitors();
  setInterval(syncMonitors, MONITOR_REFRESH_INTERVAL);
}

// Process cleanup
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  for (const cleanup of activeMonitors.values()) {
    cleanup();
  }

  if (resultBatch.length > 0) {
    await batchInsertResult({});
    console.log("Flushed final batch items");
  }

  await mongoClient.close();
  console.log("Closed MongoDB and stopped all monitors");
  process.exit(0);
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, async () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
  await initializeMonitoring();
});