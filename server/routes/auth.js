import { Router } from 'express';
import { ensureDb, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimit.js';
import {
  register,
  login,
  me,
  updateProfile,
  changePassword,
  requestPasswordReset,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  resetRequestSchema,
} from '../controllers/authController.js';

const router = Router();

router.use(ensureDb);

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', requireAuth, me);
router.patch('/me', requireAuth, validate(updateProfileSchema), updateProfile);
router.post('/change-password', requireAuth, validate(changePasswordSchema), changePassword);
router.post('/reset-request', authLimiter, validate(resetRequestSchema), requestPasswordReset);

export default router;
