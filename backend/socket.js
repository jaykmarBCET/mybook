// server.js or index.js

import express from "express";
import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { app } from "./app.js"; // Your API routes

dotenv.config();

const expressApp = express();
const httpServer = http.createServer(expressApp);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === "production" ? process.env.FRONTEND_URL : "http://localhost:4000",
    credentials: true,
  },
});

const userSocketMap = {}; // userId -> socketId

// Helper to get socketId by userId
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId && typeof userId === "string" && userId.trim() !== "") {
    console.log("✅ User connected:", userId, "Socket ID:", socket.id);
    userSocketMap[userId] = socket.id;

    // Notify all clients of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // Join
  socket.on("join", ({ id }) => {
    const socketId = userSocketMap[id];
    if (socketId && id !== userId) {
      io.to(socketId).emit("joined", { id: userId });
    }
  });

  // Call offer
  socket.on("user:call", ({ to, offer }) => {
    console.log(to)

    const socketId = userSocketMap[to.id];
    if (socketId) {
      io.to(socketId).emit("incoming:call", {
        from: { id: userId },
        offer,
      });
    }
  });

  // Call accepted (answer)
  socket.on("call:accepted", ({ to, ans }) => {
    const socketId = userSocketMap[to.id];
    if (socketId) {
      io.to(socketId).emit("call:accepted", {
        from: { id: userId },
        ans,
      });
    }
  });

  // ICE candidate relay
  socket.on("ice-candidate", ({ to, candidate }) => {
    const socketId = userSocketMap[to.id];
    if (socketId) {
      io.to(socketId).emit("ice-candidate", {
        from: { id: userId },
        candidate,
      });
    }
  });

  // Peer negotiation needed (new offer)
  socket.on("peer:nego:needed", ({ to, offer }) => {
    const socketId = userSocketMap[to.id];
    if (socketId) {
      io.to(socketId).emit("peer:nego:needed", {
        from: { id: userId },
        offer,
      });
    }
  });

  // Peer negotiation answer
  socket.on("peer:nego:done", ({ to, ans }) => {
    const socketId = userSocketMap[to.id];
    if (socketId) {
      io.to(socketId).emit("peer:nego:final", {
        from: { id: userId },
        ans,
      });
    }
  });

  // Disconnection handling
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);

    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

// Express middleware
expressApp.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

expressApp.use(morgan("dev"));
expressApp.use(cookieParser());
expressApp.use(express.urlencoded({ extended: true, limit: "100mb" }));
expressApp.use(express.json());

// Health check
expressApp.get("/", (req, res) => {
  return res.status(200).json({
    message: "✅ Server is running.",
  });
});

// API routes
expressApp.use("/api/v1", app);

// Optional: Online users API
expressApp.get("/api/online-users", (req, res) => {
  res.json({ onlineUsers: Object.keys(userSocketMap) });
});

// Exports
export { io, httpServer };
