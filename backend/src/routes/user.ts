import { Router } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { z } from "zod";
import { IUser, User } from "../models/User";

const router = Router();

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});

router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const user = await User.findById(req.userId)
    .select("-passwordHash")
    .lean<IUser>();

  if (!user) return res.status(401).json({ message: "Unauthorized" });
  return res.json(user);
});

router.put("/me", requireAuth, async (req: AuthRequest, res) => {
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const user = await User.findByIdAndUpdate(req.userId, parsed.data, {
    new: true,
    projection: "-passwordHash",
  }).lean<IUser>();

  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json(user);
});

export default router;
