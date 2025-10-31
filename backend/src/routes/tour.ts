import { Router } from "express";
import { Tour } from "../models/Tour";

const router = Router();

// Get all tours with filters
router.get("/tours", async (req, res) => {
  const { category, location, featured, minPrice, maxPrice, search, limit = 50, offset = 0 } = req.query;
  
  const filter: any = {};
  
  if (category) filter.category = category;
  if (location) filter.location = { $regex: location, $options: "i" };
  if (featured === "true") filter.featured = true;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
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

// Get featured tours
router.get("/tours/featured", async (req, res) => {
  const tours = await Tour.find({ featured: true })
    .limit(10)
    .sort({ rating: -1, createdAt: -1 });
  res.json(tours);
});

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

// Create tour
router.post("/tours", async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json(tour);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Update tour
router.put("/tours/:id", async (req, res) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndUpdate(id, req.body, { new: true });
  if (!tour) return res.status(404).json({ message: "Not found" });
  res.json(tour);
});

// Delete tour
router.delete("/tours/:id", async (req, res) => {
  const { id } = req.params;
  const tour = await Tour.findByIdAndDelete(id);
  if (!tour) return res.status(404).json({ message: "Not found" });
  res.json({ success: true });
});

export default router;
