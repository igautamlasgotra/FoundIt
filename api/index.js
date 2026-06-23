// Vercel serverless entry point.
// Vercel turns each file under /api into a serverless function. We export the
// Express app as the default handler — Express apps are themselves
// (req, res) functions, which is exactly the signature Vercel expects.
// vercel.json rewrites /api/* to this single function so Express handles all
// API routing internally.
import app from '../server/app.js';

export default app;
