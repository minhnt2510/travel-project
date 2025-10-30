import { Router } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { Notification } from "../models/Notification";

const router = Router();

// Get user's notifications
router.get("/notifications", requireAuth, async (req: AuthRequest, res) => {
  const notifications = await Notification.find({ userId: req.userId })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(notifications);
});

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
