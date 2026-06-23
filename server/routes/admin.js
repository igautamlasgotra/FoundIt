import { Router } from 'express';
import { ensureDb, requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  listResetRequests,
  approveResetRequest,
  rejectResetRequest,
  getStats,
  listPendingClaims,
  listItemsAdmin,
  listDeskItems,
  removeItem,
  restoreItem,
  listAuditLog,
} from '../controllers/adminController.js';

const router = Router();

// Every admin route requires DB + a logged-in admin.
router.use(ensureDb, requireAuth, requireAdmin);

router.get('/stats', getStats);
router.get('/reset-requests', listResetRequests);
router.post('/reset-requests/:id/approve', approveResetRequest);
router.post('/reset-requests/:id/reject', rejectResetRequest);
router.get('/claims', listPendingClaims);
router.get('/items', listItemsAdmin);
router.get('/desk-items', listDeskItems);
router.post('/items/:id/remove', removeItem);
router.post('/items/:id/restore', restoreItem);
router.get('/audit', listAuditLog);

export default router;
