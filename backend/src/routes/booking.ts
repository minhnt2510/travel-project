import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireAdmin, type AuthRequest } from "../middleware/auth";
import { Booking } from "../models/Booking";
import { Tour } from "../models/Tour";
import { Notification } from "../models/Notification";

const router = Router();

const createBookingSchema = z.object({
  tourId: z.string(),
  quantity: z.number().min(1),
  travelDate: z.string(),
  travelers: z.array(
    z.object({
      name: z.string(),
      age: z.number(),
      idCard: z.string().optional(),
    })
  ),
  contactInfo: z.object({
    phone: z.string(),
    email: z.string().email(),
  }),
  specialRequests: z.string().optional(),
});

// Get user's bookings
router.get("/bookings", requireAuth, async (req: AuthRequest, res) => {
  const bookings = await Booking.find({ userId: req.userId })
    .populate("tourId")
    .sort({ createdAt: -1 });
  res.json(bookings);
});

// Create booking
router.post("/bookings", requireAuth, async (req: AuthRequest, res) => {
  const parsed = createBookingSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const {
    tourId,
    quantity,
    travelDate,
    travelers,
    contactInfo,
    specialRequests,
  } = parsed.data;

  const tour = await Tour.findById(tourId);
  if (!tour) return res.status(404).json({ message: "Tour not found" });

  if (tour.availableSeats < quantity) {
    return res.status(400).json({ message: "Not enough seats available" });
  }

  const totalPrice = tour.price * quantity;

  const booking = await Booking.create({
    tourId,
    userId: req.userId!,
    quantity,
    totalPrice,
    travelDate,
    travelers,
    contactInfo,
    specialRequests,
  });

  // Create notification
  await Notification.create({
    userId: req.userId!,
    type: "booking",
    title: "Đặt tour thành công",
    message: `Bạn đã đặt tour "${tour.title}" thành công!`,
    link: `/bookings/${booking._id}`,
  });

  res.status(201).json(await booking.populate("tourId"));
});

// Get booking by id
router.get("/bookings/:id", requireAuth, async (req: AuthRequest, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("tourId")
    .populate("userId");

  if (!booking) return res.status(404).json({ message: "Booking not found" });

  if (booking.userId.toString() !== req.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.json(booking);
});

// Cancel booking
router.put(
  "/bookings/:id/cancel",
  requireAuth,
  async (req: AuthRequest, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    booking.status = "cancelled";
    booking.paymentStatus = "refunded";
    await booking.save();

    // Update tour available seats
    await Tour.findByIdAndUpdate(booking.tourId, {
      $inc: { availableSeats: booking.quantity },
    });

    res.json(booking);
  }
);

// Admin: Get all bookings
router.get("/admin/bookings", requireAdmin, async (req: AuthRequest, res) => {
  const bookings = await Booking.find()
    .populate("tourId")
    .populate("userId")
    .sort({ createdAt: -1 });
  res.json(bookings);
});

// Admin: Update booking status
router.put(
  "/admin/bookings/:id/status",
  requireAdmin,
  async (req: AuthRequest, res) => {
    const { status } = req.body;
    
    if (!["pending", "confirmed", "in_progress", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const oldStatus = booking.status;
    booking.status = status;
    
    // Update payment status if needed
    if (status === "confirmed" && booking.paymentStatus === "pending") {
      booking.paymentStatus = "paid";
    }
    
    await booking.save();

    // Create notification for user
    await Notification.create({
      userId: booking.userId,
      type: "booking",
      title: `Trạng thái đơn hàng đã được cập nhật`,
      message: `Đơn hàng của bạn đã được chuyển từ "${oldStatus}" sang "${status}"`,
      link: `/bookings/${booking._id}`,
    });

    res.json(await booking.populate("tourId"));
  }
);

export default router;
