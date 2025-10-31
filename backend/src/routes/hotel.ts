import { Router } from "express";
import { Hotel } from "../models/Hotel";

const router = Router();

// Get hotels with filters
router.get("/hotels", async (req, res) => {
  const {
    city,
    featured,
    minPrice,
    maxPrice,
    stars,
    minStars,
    search,
    limit = 50,
    offset = 0,
  } = req.query as any;

  const filter: any = {};
  if (city) {
    // support comma separated list
    const cities = String(city)
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    if (cities.length > 1) filter.city = { $in: cities };
    else filter.city = { $regex: cities[0], $options: "i" };
  }
  if (featured === "true") filter.featured = true;
  if (minPrice || maxPrice) {
    filter.pricePerNight = {};
    if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
    if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
  }
  if (stars) filter.stars = Number(stars);
  if (minStars) filter.stars = { $gte: Number(minStars) };
  if (search) {
    filter.$or = [
      { name: { $regex: String(search), $options: "i" } },
      { description: { $regex: String(search), $options: "i" } },
      { city: { $regex: String(search), $options: "i" } },
      { address: { $regex: String(search), $options: "i" } },
    ];
  }

  const hotels = await Hotel.find(filter)
    .limit(Number(limit))
    .skip(Number(offset))
    .sort({ createdAt: -1 });
  const total = await Hotel.countDocuments(filter);
  res.json({ hotels, total, limit: Number(limit), offset: Number(offset) });
});

// Get featured hotels
router.get("/hotels/featured", async (_req, res) => {
  const hotels = await Hotel.find({ featured: true })
    .limit(10)
    .sort({ rating: -1, createdAt: -1 });
  res.json(hotels);
});

// Get hotel by id
router.get("/hotels/:id", async (req, res) => {
  const { id } = req.params as any;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "Invalid hotel ID format" });
  }
  const hotel = await Hotel.findById(id);
  if (!hotel) return res.status(404).json({ message: "Hotel not found" });
  res.json(hotel);
});

// Create hotel
router.post("/hotels", async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json(hotel);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Update hotel
router.put("/hotels/:id", async (req, res) => {
  const { id } = req.params as any;
  const hotel = await Hotel.findByIdAndUpdate(id, req.body, { new: true });
  if (!hotel) return res.status(404).json({ message: "Not found" });
  res.json(hotel);
});

// Delete hotel
router.delete("/hotels/:id", async (req, res) => {
  const { id } = req.params as any;
  const hotel = await Hotel.findByIdAndDelete(id);
  if (!hotel) return res.status(404).json({ message: "Not found" });
  res.json({ success: true });
});

export default router;


