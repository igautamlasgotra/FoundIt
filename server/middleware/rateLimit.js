import rateLimit from 'express-rate-limit';

// Note: on Vercel serverless the limiter uses in-memory state that resets on
// cold starts, so it's a best-effort guard rather than a hard global limit.
// It still blunts rapid brute-force/spam bursts against a warm function.
// (A shared store like Redis would make it strict — noted as a roadmap item.)

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 30, // per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please try again in a few minutes.' },
});

export const writeLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 60, // posting/claims etc.
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'You are doing that too often. Please slow down.' },
});
