import dotenv from 'dotenv';

// Load .env for local development. On Vercel the variables are injected
// by the platform, so dotenv simply finds nothing to load — that's fine.
dotenv.config();

const list = (value) =>
  (value || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,

  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',

  // SMVDU community gate.
  ALLOWED_EMAIL_DOMAINS: list(process.env.ALLOWED_EMAIL_DOMAINS).length
    ? list(process.env.ALLOWED_EMAIL_DOMAINS)
    : ['smvdu.ac.in'],
  ADMIN_EMAILS: list(process.env.ADMIN_EMAILS),

  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET || '',

  BREVO_API_KEY: process.env.BREVO_API_KEY || '',
  BREVO_SENDER_EMAIL: process.env.BREVO_SENDER_EMAIL || '',
  BREVO_SENDER_NAME: process.env.BREVO_SENDER_NAME || 'FoundIt SMVDU',

  CLIENT_URL: (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, ''),
};

export const isProd = env.NODE_ENV === 'production';
