import { Router } from 'express';
import { env } from '../config/env.js';
import { CATEGORIES, LOCATIONS, LOCATION_GROUPS, ITEM_TYPES } from '../config/constants.js';

const router = Router();

// GET /api/config — public, non-secret client configuration.
// Keeping these values server-side (in .env / Vercel) means the React app needs
// no build-time env vars and no rebuild if the Cloudinary preset ever changes.
// The Cloudinary cloud name + unsigned preset are public by design (they appear
// in the browser during upload anyway).
router.get('/', (req, res) => {
  res.json({
    cloudinary: {
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      uploadPreset: env.CLOUDINARY_UPLOAD_PRESET,
      enabled: Boolean(env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_UPLOAD_PRESET),
    },
    categories: CATEGORIES,
    locations: LOCATIONS,
    locationGroups: LOCATION_GROUPS,
    types: ITEM_TYPES,
    allowedDomains: env.ALLOWED_EMAIL_DOMAINS,
  });
});

export default router;
