import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import tourRouter from "./routes/tour";
import bookingRouter from "./routes/booking";
import reviewRouter from "./routes/review";
import wishlistRouter from "./routes/wishlist";
import hotelRouter from "./routes/hotel";
import notificationRouter from "./routes/notification";

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (_req, res) => res.json({ ok: true, service: "travel-backend" }));
app.use("/auth", authRouter);
app.use("/", userRouter); // /me
app.use("/", tourRouter); // /tours
app.use("/", bookingRouter); // /bookings
app.use("/", reviewRouter); // /reviews, /tours/:id/reviews
app.use("/", wishlistRouter); // /wishlist
app.use("/", notificationRouter); // /notifications
app.use("/", hotelRouter); // /hotels

const port = Number(process.env.PORT || 4000);

connectDB()
  .then(() => {
    app.listen(port, () =>
      console.log(`API listening on http://192.168.1.15:${port}`)
    );
  })
  .catch((e) => {
    console.error("Failed to connect to DB", e);
    process.exit(1);
  });
