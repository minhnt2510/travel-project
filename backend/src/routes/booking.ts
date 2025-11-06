import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireAdmin, type AuthRequest } from "../middleware/auth";
import { Booking } from "../models/Booking";
import { Tour } from "../models/Tour";
import { Notification } from "../models/Notification";
import { emitNotification, emitToAdmins } from "../socket";

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

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Lấy danh sách bookings của user
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Unauthorized
 */
// Get user's bookings
router.get("/bookings", requireAuth, async (req: AuthRequest, res) => {
  const bookings = await Booking.find({ userId: req.userId })
    .populate("tourId")
    .sort({ createdAt: -1 });
  res.json(bookings);
});

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Tạo booking mới
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tourId
 *               - quantity
 *               - travelDate
 *               - travelers
 *               - contactInfo
 *             properties:
 *               tourId:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *               travelDate:
 *                 type: string
 *                 format: date
 *               travelers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     age:
 *                       type: number
 *                     idCard:
 *                       type: string
 *               contactInfo:
 *                 type: object
 *                 properties:
 *                   phone:
 *                     type: string
 *                   email:
 *                     type: string
 *                     format: email
 *               specialRequests:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Validation error or not enough seats
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tour not found
 */
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

  // Create notification in DB
  const notification = await Notification.create({
    userId: req.userId!,
    type: "booking",
    title: "Đặt tour thành công",
    message: `Bạn đã đặt tour "${tour.title}" thành công!`,
    link: `/bookings/${booking._id}`,
  });

  // Emit real-time notification via Socket.IO
  emitNotification(req.userId!, notification.toObject());

  // Notify admins about new booking
  emitToAdmins("new_booking", {
    bookingId: booking._id,
    userId: req.userId!,
    tourTitle: tour.title,
    quantity,
    totalPrice,
  });

  res.status(201).json(await booking.populate("tourId"));
});

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Lấy chi tiết booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking details
 *       403:
 *         description: Forbidden - Not owner
 *       404:
 *         description: Booking not found
 */
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

/**
 * @swagger
 * /bookings/{id}/cancel:
 *   put:
 *     summary: Hủy booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled
 *       400:
 *         description: Already cancelled
 *       403:
 *         description: Forbidden
 */
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

    // Create notification for cancellation
    const tour = await Tour.findById(booking.tourId);
    const notification = await Notification.create({
      userId: booking.userId,
      type: "booking",
      title: "Hủy đặt tour thành công",
      message: `Bạn đã hủy đặt tour "${tour?.title || "N/A"}" thành công.`,
      link: `/bookings/${booking._id}`,
    });

    // Emit real-time notification
    emitNotification(booking.userId.toString(), notification.toObject());

    res.json(booking);
  }
);

/**
 * @swagger
 * /admin/bookings:
 *   get:
 *     summary: Lấy tất cả bookings (Admin only)
 *     tags: [Admin - Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All bookings
 *       403:
 *         description: Forbidden - Admin only
 */
// Admin: Get all bookings
router.get("/admin/bookings", requireAdmin, async (req: AuthRequest, res) => {
  const bookings = await Booking.find()
    .populate("tourId")
    .populate("userId")
    .sort({ createdAt: -1 });
  res.json(bookings);
});

/**
 * @swagger
 * /admin/bookings/{id}/status:
 *   put:
 *     summary: Cập nhật status booking (Admin only)
 *     tags: [Admin - Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, in_progress, completed, cancelled]
 *     responses:
 *       200:
 *         description: Status updated
 *       400:
 *         description: Invalid status
 *       403:
 *         description: Forbidden - Admin only
 */
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
    const notification = await Notification.create({
      userId: booking.userId,
      type: "booking",
      title: `Trạng thái đơn hàng đã được cập nhật`,
      message: `Đơn hàng của bạn đã được chuyển từ "${oldStatus}" sang "${status}"`,
      link: `/bookings/${booking._id}`,
    });

    // Emit real-time notification
    emitNotification(booking.userId.toString(), notification.toObject());

    res.json(await booking.populate("tourId"));
  }
);

export default router;
