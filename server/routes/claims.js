import { Router } from 'express';
import { ensureDb, requireAuth } from '../middleware/auth.js';
import {
  myClaims,
  approveClaim,
  rejectClaim,
  cancelClaim,
} from '../controllers/claimController.js';

const router = Router();

router.use(ensureDb, requireAuth);

router.get('/mine', myClaims);
router.post('/:id/approve', approveClaim);
router.post('/:id/reject', rejectClaim);
router.post('/:id/cancel', cancelClaim);

export default router;
