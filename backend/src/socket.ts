import { Server as HTTPServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";

// Store connected users: userId -> socketId
const connectedUsers = new Map<string, string>();

// Store socketId -> userId for quick lookup
const socketToUser = new Map<string, string>();

export let io: SocketServer | null = null;

export const initializeSocket = (httpServer: HTTPServer) => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Authentication middleware for Socket.IO
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
        sub: string;
        email: string;
        role?: string;
      };

      // Attach user info to socket
      (socket as any).userId = payload.sub;
      (socket as any).userEmail = payload.email;
      (socket as any).userRole = payload.role;

      next();
    } catch (error) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  // Handle connection
  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).userId as string;
    const userEmail = (socket as any).userEmail as string;

    if (!userId) {
      socket.disconnect();
      return;
    }

    // Store connection
    connectedUsers.set(userId, socket.id);
    socketToUser.set(socket.id, userId);

    // Join user's personal room for notifications
    socket.join(`user:${userId}`);

    // If staff or admin, join staff room (for operational notifications)
    if ((socket as any).userRole === "staff" || (socket as any).userRole === "admin") {
      socket.join("staff");
    }

    // If admin, also join admin room (for system-level notifications)
    if ((socket as any).userRole === "admin") {
      socket.join("admin");
    }

    console.log(`✅ User connected: ${userEmail} (${userId})`);

    // Handle disconnect
    socket.on("disconnect", () => {
      connectedUsers.delete(userId);
      socketToUser.delete(socket.id);
      console.log(`❌ User disconnected: ${userEmail} (${userId})`);
    });
  });

  return io;
};

// Helper function to emit notification to a specific user
export const emitNotification = (userId: string, notification: any) => {
  if (!io) {
    console.warn("⚠️ Socket.IO not initialized");
    return;
  }

  // Emit to user's personal room
  io.to(`user:${userId}`).emit("notification", notification);
};

// Helper function to emit to all admins
export const emitToAdmins = (event: string, data: any) => {
  if (!io) {
    console.warn("⚠️ Socket.IO not initialized");
    return;
  }

  io.to("admin").emit(event, data);
};

