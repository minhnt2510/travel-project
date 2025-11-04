import { Router } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { Notification } from "../models/Notification";

const router = Router();

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Lấy notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 */
// Get user's notifications
router.get("/notifications", requireAuth, async (req: AuthRequest, res) => {
  const notifications = await Notification.find({ userId: req.userId })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(notifications);
});

/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: Đánh dấu notification đã đọc
 *     tags: [Notifications]
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
 *         description: Notification marked as read
 */
// Mark notification as read
router.put(
  "/notifications/:id/read",
  requireAuth,
  async (req: AuthRequest, res) => {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { read: true },
      { new: true }
    );

    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    res.json(notification);
  }
);

/**
 * @swagger
 * /notifications/read-all:
 *   put:
 *     summary: Đánh dấu tất cả notifications đã đọc
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All marked as read
 */
// Mark all as read
router.put(
  "/notifications/read-all",
  requireAuth,
  async (req: AuthRequest, res) => {
    await Notification.updateMany(
      { userId: req.userId, read: false },
      { read: true }
    );

    res.json({ success: true });
  }
);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Xóa notification
 *     tags: [Notifications]
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
 *         description: Notification deleted
 */
// Delete notification
router.delete(
  "/notifications/:id",
  requireAuth,
  async (req: AuthRequest, res) => {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    res.json({ success: true });
  }
);

export default router;
