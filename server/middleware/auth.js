import { ApiError, asyncHandler } from './error.js';
import { connectDB } from '../config/db.js';
import { verifyToken } from '../utils/auth.js';
import User from '../models/User.js';

// Ensures the DB is connected before a route runs. On Vercel each cold start
// needs to (re)establish the connection; this guarantees it lazily.
export const ensureDb = asyncHandler(async (req, res, next) => {
  await connectDB();
  next();
});

// Verifies the Bearer token and loads the current user onto req.user.
// Rejects with 401 if the token is missing, invalid, or the user no longer exists.
export const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new ApiError(401, 'Authentication required');

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw new ApiError(401, 'Invalid or expired session');
  }

  const user = await User.findById(payload.id);
  if (!user) throw new ApiError(401, 'Account no longer exists');

  req.user = user;
  next();
});

// Role guard — must run after requireAuth.
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return next(new ApiError(403, 'Admin access required'));
  }
  next();
};
