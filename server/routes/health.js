import { Router } from 'express';
import { connectDB, dbState } from '../config/db.js';
import { asyncHandler } from '../middleware/error.js';
import { isProd } from '../config/env.js';

const router = Router();

const STATES = ['disconnected', 'connected', 'connecting', 'disconnecting'];

// GET /api/health — liveness + DB connectivity check.
// Returns ok even if the DB is unreachable, but reports the db status so we
// can see at a glance whether the Atlas connection is working.
router.get(
  '/',
  asyncHandler(async (req, res) => {
    let db = 'disconnected';
    try {
      await connectDB();
      db = STATES[dbState()] || 'unknown';
    } catch (err) {
      db = isProd ? 'error' : `error: ${err.message}`;
    }

    res.json({
      status: 'ok',
      service: 'FoundIt API',
      db,
      env: process.env.NODE_ENV || 'development',
    });
  })
);

export default router;
