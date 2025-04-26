import { app } from "./app.js";
import express from "express";
import { Server } from "socket.io";
import http from "http";
import ENV from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

ENV.config();

const expressApp = express();
const httpServer = http.createServer(expressApp);

const io = new Server(httpServer, {
  cors: {
    origin: ['http://192.168.31.199:5173','http://localhost:5173'], 
    credentials: true,
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  console.log("User ID:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    if (userId && userSocketMap[userId]) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap)); 
    }
  });
});

expressApp.use(
  cors({
    origin: ['http://192.168.31.199:5173','http://localhost:5173'],
    credentials: true,
  })
);
expressApp.use(morgan("dev"));
expressApp.use(cookieParser());
expressApp.use(express.urlencoded({ extended: true, limit: "100mb" }));
expressApp.use(express.json());

expressApp.get("/", (req, res) => {
  return res.status(200).json({
    message: "OK server working good as well as database also working good performance",
  });
});

expressApp.use("/api/v1", app);

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export { io, httpServer };
