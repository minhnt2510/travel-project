import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { createServer } from "http";
import { connectDB } from "./db";
import { swaggerSpec } from "./config/swagger";
import { initializeSocket } from "./socket";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import tourRouter from "./routes/tour";
import bookingRouter from "./routes/booking";
import reviewRouter from "./routes/review";
import wishlistRouter from "./routes/wishlist";
import hotelRouter from "./routes/hotel";
import notificationRouter from "./routes/notification";
import chatRouter from "./routes/chat";

const app = express();
const httpServer = createServer(app);

app.use(cors({ origin: "*" }));
// Increase body parser limit to handle base64 images (up to 50MB)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/", (_req, res) => res.json({ ok: true, service: "travel-backend" }));

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Travel App API Documentation",
  })
);

app.use("/auth", authRouter);
app.use("/", userRouter);
app.use("/", tourRouter);
app.use("/", bookingRouter);
app.use("/", reviewRouter);
app.use("/", wishlistRouter);
app.use("/", notificationRouter);
app.use("/", hotelRouter);
app.use("/", chatRouter);

const port = Number(process.env.PORT || 4000);

connectDB()
  .then(() => {
    // Initialize Socket.IO
    initializeSocket(httpServer);

    httpServer.listen(port, () => {
      console.log(`🚀 API listening on http://192.168.1.5:${port}`);
      console.log(`📡 Socket.IO server initialized`);
    });
  })
  .catch((e) => {
    console.error("Failed to connect to DB", e);
    process.exit(1);
  });
