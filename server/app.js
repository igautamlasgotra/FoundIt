import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { env, isProd } from './config/env.js';
import { notFound, errorHandler } from './middleware/error.js';
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import configRouter from './routes/config.js';
import itemsRouter from './routes/items.js';
import adminRouter from './routes/admin.js';
import notificationsRouter from './routes/notifications.js';
import claimsRouter from './routes/claims.js';

// App factory: build and return the configured Express app.
// This same app is used two ways:
//   • Locally  → server/dev-server.js calls app.listen(...)
//   • Vercel   → api/index.js exports it as the serverless function handler
export function createApp() {
  const app = express();

  // Vercel terminates TLS and forwards via a proxy, so trust the first hop.
  // This lets express-rate-limit read the real client IP from X-Forwarded-For.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  // Security headers. The API only returns JSON, so we don't need a CSP here
  // (the SPA's CSP is set in vercel.json); disable it to avoid noise.
  app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));

  // In production, only allow the configured client origin to call the API.
  // In dev, reflect the request origin so the Vite proxy / localhost works.
  app.use(
    cors({
      origin: isProd ? [env.CLIENT_URL] : true,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Routes are mounted under /api so paths line up in both local and
  // serverless modes (Vercel rewrites /api/* to this single function).
  app.use('/api/health', healthRouter);
  app.use('/api/config', configRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/items', itemsRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/notifications', notificationsRouter);
  app.use('/api/claims', claimsRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

const app = createApp();

// Guard against shipping with the default dev JWT secret.
if (isProd && (!env.JWT_SECRET || env.JWT_SECRET === 'dev-secret-change-me')) {
  // eslint-disable-next-line no-console
  console.error('[FoundIt] FATAL: JWT_SECRET is not set in production.');
}
if (!isProd) {
  // eslint-disable-next-line no-console
  console.log('[FoundIt] Express app created.');
}

export default app;
