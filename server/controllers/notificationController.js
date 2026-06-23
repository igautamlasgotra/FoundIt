import Notification from '../models/Notification.js';
import { asyncHandler } from '../middleware/error.js';

// GET /api/notifications — recent notifications + unread count.
export const listNotifications = asyncHandler(async (req, res) => {
  const [notifications, unread] = await Promise.all([
    Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50),
    Notification.countDocuments({ user: req.user._id, read: false }),
  ]);
  res.json({ notifications: notifications.map((n) => n.toPublic()), unread });
});

// POST /api/notifications/read — mark all as read.
export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { $set: { read: true } });
  res.json({ ok: true });
});
