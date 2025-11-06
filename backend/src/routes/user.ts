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

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Lấy thông tin user hiện tại
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/me", requireAuth, async (req: AuthRequest, res) => {
  const user = await User.findById(req.userId)
    .select("-passwordHash")
    .lean<IUser>();

  if (!user) return res.status(401).json({ message: "Unauthorized" });
  return res.json(user);
});

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Cập nhật profile user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user
 *       401:
 *         description: Unauthorized
 */
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

/**
 * @swagger
 * /users/me/password:
 *   put:
 *     summary: Đổi mật khẩu
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid password
 */
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

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Lấy tất cả users (Admin only)
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
// Admin: Get all users
router.get("/admin/users", requireAdmin, async (req: AuthRequest, res) => {
  const users = await User.find()
    .select("-passwordHash")
    .sort({ createdAt: -1 })
    .lean<IUser[]>();
  res.json(users);
});

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Lấy user theo ID (Admin only)
 *     tags: [Admin - Users]
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
 *         description: User details
 *       404:
 *         description: User not found
 */
// Admin: Get user by id
router.get("/admin/users/:id", requireAdmin, async (req: AuthRequest, res) => {
  const user = await User.findById(req.params.id)
    .select("-passwordHash")
    .lean<IUser>();
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Xóa user (Admin only)
 *     tags: [Admin - Users]
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
 *         description: User deleted
 *       400:
 *         description: Cannot delete own account
 */
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

/**
 * @swagger
 * /admin/users/{id}/role:
 *   put:
 *     summary: Đổi role user (Admin only)
 *     tags: [Admin - Users]
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
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Role updated
 *       400:
 *         description: Cannot change own role
 */
// Admin: Update user role
router.put(
  "/admin/users/:id/role",
  requireAdmin,
  async (req: AuthRequest, res) => {
    const { role } = req.body;
    if (!["client", "staff", "admin"].includes(role)) {
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
