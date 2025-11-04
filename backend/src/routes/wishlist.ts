import { Router } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { Wishlist } from "../models/Wishlist";
import { Tour } from "../models/Tour";

const router = Router();

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Lấy danh sách yêu thích
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist items
 */
// Get user's wishlist
router.get("/wishlist", requireAuth, async (req: AuthRequest, res) => {
  const wishlist = await Wishlist.find({ userId: req.userId })
    .populate("tourId")
    .sort({ createdAt: -1 });
  res.json(wishlist);
});

/**
 * @swagger
 * /wishlist/{tourId}:
 *   post:
 *     summary: Thêm vào wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tourId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Added to wishlist
 *       400:
 *         description: Already in wishlist
 */
// Add to wishlist
router.post("/wishlist/:tourId", requireAuth, async (req: AuthRequest, res) => {
  const { tourId } = req.params;

  const tour = await Tour.findById(tourId);
  if (!tour) return res.status(404).json({ message: "Tour not found" });

  const existing = await Wishlist.findOne({ userId: req.userId, tourId });
  if (existing) {
    return res.status(400).json({ message: "Tour already in wishlist" });
  }

  const wishlist = await Wishlist.create({
    userId: req.userId!,
    tourId,
  });

  res.status(201).json(await wishlist.populate("tourId"));
});

/**
 * @swagger
 * /wishlist/{tourId}:
 *   delete:
 *     summary: Xóa khỏi wishlist
 *     tags: [Wishlist]
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
 *         description: Removed from wishlist
 *       404:
 *         description: Not found
 */
// Remove from wishlist
router.delete("/wishlist/:tourId", requireAuth, async (req: AuthRequest, res) => {
  const wishlist = await Wishlist.findOneAndDelete({ 
    userId: req.userId, 
    tourId: req.params.tourId 
  });
  
  if (!wishlist) return res.status(404).json({ message: "Not found in wishlist" });
  
  res.json({ success: true });
});

export default router;

