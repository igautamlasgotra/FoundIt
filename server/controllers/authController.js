import { z } from 'zod';
import User from '../models/User.js';
import PasswordResetRequest from '../models/PasswordResetRequest.js';
import { ApiError, asyncHandler } from '../middleware/error.js';
import { signToken, isAllowedDomain, isAdminEmail } from '../utils/auth.js';
import { env } from '../config/env.js';

// Phone is a 10-digit Indian mobile number. We strip any spaces / +91 the user
// types and store just the 10 digits; +91 is applied as the standard country
// code at display/contact time.
const phoneField = z
  .string()
  .trim()
  .transform((v) => {
    const d = v.replace(/\D/g, '');
    return d.length === 12 && d.startsWith('91') ? d.slice(2) : d;
  })
  .refine((v) => /^\d{10}$/.test(v), { message: 'Enter a valid 10-digit mobile number' });

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  phone: phoneField,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100),
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  phone: phoneField,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Enter your current password'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters').max(100),
});

export const resetRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  // SMVDU community gate.
  if (!isAllowedDomain(email)) {
    throw new ApiError(
      403,
      `Registration is restricted to the SMVDU community. Use an email ending in @${env.ALLOWED_EMAIL_DOMAINS.join(' or @')}.`
    );
  }

  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'An account with this email already exists');

  const user = new User({
    name,
    email,
    phone,
    role: isAdminEmail(email) ? 'admin' : 'user',
  });
  await user.setPassword(password);
  await user.save();

  const token = signToken(user);
  res.status(201).json({ token, user: user.toPublic() });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Must explicitly select the hash since it's `select: false` on the schema.
  const user = await User.findOne({ email }).select('+passwordHash');
  // Same generic message whether the email or password is wrong, so we don't
  // reveal which emails are registered.
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = signToken(user);
  res.json({ token, user: user.toPublic() });
});

// GET /api/auth/me  (requireAuth)
export const me = asyncHandler(async (req, res) => {
  res.json({ user: req.user.toPublic() });
});

// PATCH /api/auth/me  (requireAuth) — update own name + phone.
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  req.user.name = name;
  req.user.phone = phone;
  await req.user.save();
  res.json({ user: req.user.toPublic() });
});

// POST /api/auth/change-password  (requireAuth)
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  // Need the hash, which is select:false by default.
  const user = await User.findById(req.user._id).select('+passwordHash');
  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(400, 'Your current password is incorrect');
  }
  await user.setPassword(newPassword);
  await user.save();
  res.json({ ok: true });
});

// POST /api/auth/reset-request  (public) — queue an admin-reviewed reset.
// Always returns the same message so we don't reveal which emails are registered.
export const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const generic = {
    ok: true,
    message: 'If that email is registered, your request has been sent to the admins.',
  };

  const user = await User.findOne({ email });
  if (!user) return res.json(generic);

  // Reuse an existing pending request instead of stacking duplicates.
  const existing = await PasswordResetRequest.findOne({ user: user._id, status: 'pending' });
  if (existing) {
    existing.set({ updatedAt: new Date() });
    await existing.save();
  } else {
    await PasswordResetRequest.create({ email: user.email, user: user._id });
  }
  res.json(generic);
});
