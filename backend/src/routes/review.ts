import { Router } from "express";
import { z } from "zod";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { Review } from "../models/Review";
import { Tour } from "../models/Tour";

const router = Router();

const createReviewSchema = z.object({
  tourId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
  images: z.array(z.string()).optional(),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
});

// Get reviews for a tour
router.get("/tours/:tourId/reviews", async (req, res) => {
  const reviews = await Review.find({ tourId: req.params.tourId })
    .populate("userId", "name avatar")
    .sort({ createdAt: -1 });
  res.json(reviews);
});

// Create review
router.post("/reviews", requireAuth, async (req: AuthRequest, res) => {
  const parsed = createReviewSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { tourId, rating, comment, images, pros, cons } = parsed.data;

  // Check if tour exists
  const tour = await Tour.findById(tourId);
  if (!tour) return res.status(404).json({ message: "Tour not found" });

  // Check if user already reviewed
  const existingReview = await Review.findOne({ userId: req.userId, tourId });
  if (existingReview) {
    return res.status(400).json({ message: "You have already reviewed this tour" });
  }

  const review = await Review.create({
    tourId,
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

export default router;

