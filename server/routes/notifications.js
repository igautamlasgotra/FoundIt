import { Router } from 'express';
import { ensureDb, requireAuth } from '../middleware/auth.js';
import { listNotifications, markAllRead } from '../controllers/notificationController.js';

const router = Router();

router.use(ensureDb, requireAuth);

router.get('/', listNotifications);
router.post('/read', markAllRead);

export default router;
