import { io, Socket } from "socket.io-client";
import { API_URL } from "./api/config";
import { getToken } from "./api/client";

let socket: Socket | null = null;

// Initialize Socket.IO connection
export const connectSocket = async (): Promise<Socket | null> => {
  // If already connected, return existing socket
  if (socket?.connected) {
    return socket;
  }

  // Get auth token
  const token = await getToken();
  if (!token) {
    console.warn("⚠️ No token found, cannot connect to Socket.IO");
    return null;
  }

  // Disconnect existing socket if any
  if (socket) {
    socket.disconnect();
  }

  // Create new connection
  socket = io(API_URL, {
    auth: {
      token: token,
    },
    transports: ["websocket", "polling"], // Fallback to polling if websocket fails
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on("connect", () => {
    if (__DEV__) {
      console.log("✅ Socket.IO connected");
    }
  });

  socket.on("disconnect", (reason) => {
    if (__DEV__) {
      console.log("❌ Socket.IO disconnected:", reason);
    }
  });

  socket.on("connect_error", (error) => {
    if (__DEV__) {
      console.error("⚠️ Socket.IO connection error:", error.message);
    }
  });

  return socket;
};

// Disconnect Socket.IO
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Get current socket instance
export const getSocket = (): Socket | null => {
  return socket;
};

// Check if socket is connected
export const isSocketConnected = (): boolean => {
  return socket?.connected || false;
};

