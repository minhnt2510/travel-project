import { Router } from "express";
import { Tour } from "../models/Tour";
import { User } from "../models/User";
import {
  requireStaff,
  requireAdmin,
  requireAuth,
  type AuthRequest,
} from "../middleware/auth";

const router = Router();

/**
 * @swagger
 * /tours:
 *   get:
 *     summary: Lấy danh sách tours
 *     tags: [Tours]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Lọc theo category
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Lọc theo location
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Lấy tours nổi bật
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Giá tối thiểu
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Giá tối đa
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Tìm kiếm
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 50
 *         description: Số lượng kết quả
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *           default: 0
 *         description: Phân trang
 *     responses:
 *       200:
 *         description: Danh sách tours
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tours:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tour'
 *                 total:
 *                   type: number
 *                 limit:
 *                   type: number
 *                 offset:
 *                   type: number
 */
// Get all tours with filters
router.get("/tours", async (req, res) => {
  const {
    category,
    location,
    featured,
    minPrice,
    maxPrice,
    durationMin,
    durationMax,
    ratingMin,
    categories,
    locations,
    search,
    limit = 50,
    offset = 0,
    status, // For staff/admin to filter by status
  } = req.query as any;

  // Check if user is authenticated and get role
  let userRole: string | null = null;
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await User.findById(decoded.sub);
      if (user) {
        userRole = user.role;
      }
    }
  } catch (error) {
    // Not authenticated or invalid token - treat as client
  }

  const filter: any = {};

  // Clients only see approved tours, Staff/Admin can see all (unless filtered)
  if (userRole !== "staff" && userRole !== "admin") {
    filter.status = "approved";
  } else if (status) {
    // Staff/Admin can filter by status if provided
    filter.status = status;
  }

  if (categories) {
    const list = String(categories)
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (list.length) filter.category = { $in: list };
  } else if (category) {
    filter.category = category;
  }
  if (locations) {
    const list = String(locations)
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (list.length) filter.location = { $in: list };
  } else if (location) {
    filter.location = { $regex: location, $options: "i" };
  }
  if (featured === "true") filter.featured = true;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (durationMin || durationMax) {
    filter.duration = {};
    if (durationMin) filter.duration.$gte = Number(durationMin);
    if (durationMax) filter.duration.$lte = Number(durationMax);
  }
  if (ratingMin) {
    filter.rating = { $gte: Number(ratingMin) };
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  const tours = await Tour.find(filter)
    .limit(Number(limit))
    .skip(Number(offset))
    .sort({ createdAt: -1 });

  const total = await Tour.countDocuments(filter);

  res.json({ tours, total, limit: Number(limit), offset: Number(offset) });
});

/**
 * @swagger
 * /tours/featured:
 *   get:
 *     summary: Lấy tours nổi bật
 *     tags: [Tours]
 *     responses:
 *       200:
 *         description: Featured tours
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tour'
 */
// Get featured tours (only approved for clients)
router.get("/tours/featured", async (req, res) => {
  // Check if user is authenticated and get role
  let userRole: string | null = null;
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      const user = await User.findById(decoded.sub);
      if (user) {
        userRole = user.role;
      }
    }
  } catch (error) {
    // Not authenticated or invalid token - treat as client
  }

  const filter: any = { featured: true };

  // Clients only see approved tours
  if (userRole !== "staff" && userRole !== "admin") {
    filter.status = "approved";
  }

  const tours = await Tour.find(filter)
    .limit(10)
    .sort({ rating: -1, createdAt: -1 });
  res.json(tours);
});

// Get pending tours (Admin only) - MUST be before /tours/:id route
router.get("/tours/pending", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const tours = await Tour.find({ status: "pending" })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json(tours);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /tours/{id}:
 *   get:
 *     summary: Lấy chi tiết tour
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tour ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Chi tiết tour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Tour'
 *       400:
 *         description: Invalid tour ID format
 *       404:
 *         description: Tour not found
 */
// Get tour by id
router.get("/tours/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid tour ID format" });
    }

    const tour = await Tour.findById(id);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    res.json(tour);
  } catch (error: any) {
    console.error("Error fetching tour:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create tour (Staff + Admin only)
router.post("/tours", requireStaff, async (req: AuthRequest, res) => {
  try {
    // Get user role from request (set by requireStaff middleware)
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Staff tours start as pending, Admin tours are auto-approved
    const tourData = {
      ...req.body,
      status: user.role === "admin" ? "approved" : "pending",
      createdBy: req.userId,
    };

    const tour = await Tour.create(tourData);
    res.status(201).json(tour);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /tours/{id}:
 *   put:
 *     summary: Cập nhật tour
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tour updated
 *       404:
 *         description: Tour not found
 */
// Update tour (Staff + Admin only)
router.put("/tours/:id", requireStaff, async (req: AuthRequest, res) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndUpdate(id, req.body, { new: true });
  if (!tour) return res.status(404).json({ message: "Not found" });
  res.json(tour);
});

/**
 * @swagger
 * /tours/{id}:
 *   delete:
 *     summary: Xóa tour
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tour deleted
 *       403:
 *         description: Không có quyền xóa tour này
 *       404:
 *         description: Tour not found
 */
// Delete tour (Staff can only delete their own, Admin can delete all)
router.delete("/tours/:id", requireStaff, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    // Get user info
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Find tour
    const tour = await Tour.findById(id);
    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    // Check permission: Admin can delete all, Staff can only delete their own
    if (user.role !== "admin" && tour.createdBy?.toString() !== req.userId) {
      return res.status(403).json({
        message:
          "Bạn không có quyền xóa tour này. Chỉ có thể xóa tour do bạn tạo.",
      });
    }

    // Delete tour
    await Tour.findByIdAndDelete(id);
    res.json({ success: true, message: "Xóa tour thành công" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// Approve/Reject tour (Admin only)
router.put("/tours/:id/status", requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const tour = await Tour.findByIdAndUpdate(id, { status }, { new: true });

    if (!tour) {
      return res.status(404).json({ message: "Tour not found" });
    }

    res.json(tour);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
