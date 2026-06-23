// Local development entry point.
// On Vercel the API runs as a serverless function (see api/index.js) and there
// is NO long-lived server. Locally we start a normal Express server so we can
// develop without the Vercel CLI; the Vite dev server proxies /api here.
import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

const port = env.PORT;

app.listen(port, async () => {
  // eslint-disable-next-line no-console
  console.log(`[FoundIt] API listening on http://localhost:${port}`);
  try {
    await connectDB();
    // eslint-disable-next-line no-console
    console.log('[FoundIt] MongoDB connected.');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[FoundIt] MongoDB not connected yet: ${err.message}`);
  }
});
