import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// Sign a JWT carrying the user id and role. The role is embedded so role
// checks don't need a DB lookup on every request (we re-verify against the DB
// only where it matters).
export function signToken(user) {
  return jwt.sign({ id: user._id.toString(), role: user.role }, env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

// Normalise an email and return its domain (lowercased).
export function emailDomain(email) {
  return String(email).trim().toLowerCase().split('@')[1] || '';
}

// Is this email allowed to register? (SMVDU community gate.)
export function isAllowedDomain(email) {
  return env.ALLOWED_EMAIL_DOMAINS.includes(emailDomain(email));
}

// Should this email be an admin? (Seeded via ADMIN_EMAILS env var.)
export function isAdminEmail(email) {
  return env.ADMIN_EMAILS.includes(String(email).trim().toLowerCase());
}
