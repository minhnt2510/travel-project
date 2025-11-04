import { Router } from "express";
import { z } from "zod";
import { requireAuth, requireAdmin, AuthRequest } from "../middleware/auth";
import { Review } from "../models/Review";
import { Tour } from "../models/Tour";
import { Booking } from "../models/Booking";

const router = Router();

const createReviewSchema = z.object({
  tourId: z.string(),
  bookingId: z.string().optional(), // Optional for now, will be required later
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
  images: z.array(z.string()).optional(),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
});

/**
 * @swagger
 * /tours/{tourId}/reviews:
 *   get:
 *     summary: Lấy reviews của tour
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: tourId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews
 */
// Get reviews for a tour
router.get("/tours/:tourId/reviews", async (req, res) => {
  const reviews = await Review.find({ tourId: req.params.tourId })
    .populate("userId", "name avatar")
    .sort({ createdAt: -1 });
  res.json(reviews);
});

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Tạo review
 *     tags: [Reviews]
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
 *               - rating
 *             properties:
 *               tourId:
 *                 type: string
 *               bookingId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Already reviewed or booking not completed
 */
// Create review
router.post("/reviews", requireAuth, async (req: AuthRequest, res) => {
  const parsed = createReviewSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { tourId, bookingId, rating, comment, images, pros, cons } = parsed.data;

  // Check if tour exists
  const tour = await Tour.findById(tourId);
  if (!tour) return res.status(404).json({ message: "Tour not found" });

  // If bookingId is provided, verify the booking is completed and belongs to user
  if (bookingId) {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (booking.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "Forbidden - Booking does not belong to you" });
    }
    if (booking.status !== "completed") {
      return res.status(400).json({ message: "Can only review completed bookings" });
    }
  }

  // Check if user already reviewed this tour (prevent duplicate)
  const existingReview = await Review.findOne({ 
    userId: req.userId, 
    tourId,
    ...(bookingId ? { bookingId } : {})
  });
  if (existingReview) {
    return res.status(400).json({ message: "You have already reviewed this tour" });
  }

  const review = await Review.create({
    tourId,
    bookingId: bookingId || undefined,
    userId: req.userId!,
    rating,
    comment,
    images,
    pros,
    cons,
  });

  // Update tour rating
  const reviews = await Review.find({ tourId });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  
  await Tour.findByIdAndUpdate(tourId, {
    rating: avgRating,
    reviewCount: reviews.length,
  });

  res.status(201).json(await review.populate("userId", "name avatar"));
});

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Cập nhật review
 *     tags: [Reviews]
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
 *         description: Review updated
 *       403:
 *         description: Forbidden - Not owner
 */
// Update review
router.put("/reviews/:id", requireAuth, async (req: AuthRequest, res) => {
  const review = await Review.findById(req.params.id);
  
  if (!review) return res.status(404).json({ message: "Review not found" });
  
  if (review.userId.toString() !== req.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  Object.assign(review, req.body);
  review.updatedAt = new Date();
  await review.save();

  // Update tour rating
  const reviews = await Review.find({ tourId: review.tourId });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  
  await Tour.findByIdAndUpdate(review.tourId, {
    rating: avgRating,
  });

  res.json(await review.populate("userId", "name avatar"));
});

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Xóa review
 *     tags: [Reviews]
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
 *         description: Review deleted
 *       403:
 *         description: Forbidden
 */
// Delete review
router.delete("/reviews/:id", requireAuth, async (req: AuthRequest, res) => {
  const review = await Review.findById(req.params.id);
  
  if (!review) return res.status(404).json({ message: "Review not found" });
  
  if (review.userId.toString() !== req.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await review.deleteOne();

  // Update tour rating
  const reviews = await Review.find({ tourId: review.tourId });
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;
  
  await Tour.findByIdAndUpdate(review.tourId, {
    rating: avgRating,
    reviewCount: reviews.length,
  });

  res.json({ success: true });
});

/**
 * @swagger
 * /admin/reviews:
 *   get:
 *     summary: Lấy tất cả reviews (Admin only)
 *     tags: [Admin - Reviews]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All reviews
 */
// Admin: Get all reviews
router.get("/admin/reviews", requireAdmin, async (req: AuthRequest, res) => {
  const reviews = await Review.find()
    .populate("userId", "name avatar email")
    .populate("tourId", "title imageUrl location")
    .populate("bookingId", "travelDate quantity")
    .sort({ createdAt: -1 })
    .lean();
  res.json(reviews);
});

/**
 * @swagger
 * /admin/reviews/tour/{tourId}:
 *   get:
 *     summary: Lấy reviews theo tour (Admin only)
 *     tags: [Admin - Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tourId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reviews for tour
 */
// Admin: Get reviews for a specific tour
router.get("/admin/reviews/tour/:tourId", requireAdmin, async (req: AuthRequest, res) => {
  const reviews = await Review.find({ tourId: req.params.tourId })
    .populate("userId", "name avatar email")
    .populate("bookingId", "travelDate quantity")
    .sort({ createdAt: -1 })
    .lean();
  res.json(reviews);
});

export default router;

