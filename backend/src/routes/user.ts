import { Router } from "express";
import bcrypt from "bcryptjs";
import { requireAuth, requireAdmin, type AuthRequest } from "../middleware/auth";
import { z } from "zod";
import { IUser, User } from "../models/User";

const router = Router();

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
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

  // Log avatar update for debugging
  if (parsed.data.avatar) {
    console.log("Updating user avatar, length:", parsed.data.avatar.length);
  }

  const user = await User.findByIdAndUpdate(req.userId, parsed.data, {
    new: true,
    projection: "-passwordHash",
  }).lean<IUser>();

  if (!user) return res.status(404).json({ message: "User not found" });
  
  // Log result
  if (user.avatar) {
    console.log("User avatar updated successfully, length:", user.avatar.length);
  }
  
  return res.json(user);
});

// Change password
router.put("/me/password", requireAuth, async (req: AuthRequest, res) => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  const { currentPassword, newPassword } = parsed.data;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Verify current password
  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
  }

  // Update password
  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(req.userId, { passwordHash: newPasswordHash });

  res.json({ message: "Đổi mật khẩu thành công" });
});

// Admin: Get all users
router.get("/admin/users", requireAdmin, async (req: AuthRequest, res) => {
  const users = await User.find()
    .select("-passwordHash")
    .sort({ createdAt: -1 })
    .lean<IUser[]>();
  res.json(users);
});

// Admin: Get user by id
router.get("/admin/users/:id", requireAdmin, async (req: AuthRequest, res) => {
  const user = await User.findById(req.params.id)
    .select("-passwordHash")
    .lean<IUser>();
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Admin: Delete user
router.delete("/admin/users/:id", requireAdmin, async (req: AuthRequest, res) => {
  // Prevent deleting self
  if (req.params.id === req.userId) {
    return res.status(400).json({ message: "Cannot delete your own account" });
  }
  
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted successfully" });
});

// Admin: Update user role
router.put(
  "/admin/users/:id/role",
  requireAdmin,
  async (req: AuthRequest, res) => {
    const { role } = req.body;
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    
    // Prevent changing own role
    if (req.params.id === req.userId) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    )
      .select("-passwordHash")
      .lean<IUser>();
    
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  }
);

export default router;
