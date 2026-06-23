// One-off script: promote every email listed in ADMIN_EMAILS to the admin role.
// New signups whose email is in ADMIN_EMAILS already become admins automatically
// (see authController). Run this to promote users who registered BEFORE you
// added them to ADMIN_EMAILS:
//
//   npm run seed:admin
//
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';

async function run() {
  if (!env.ADMIN_EMAILS.length) {
    console.log('[seed:admin] ADMIN_EMAILS is empty — nothing to do.');
    return;
  }

  await connectDB();
  const result = await User.updateMany(
    { email: { $in: env.ADMIN_EMAILS }, role: { $ne: 'admin' } },
    { $set: { role: 'admin' } }
  );

  console.log(`[seed:admin] Targeted: ${env.ADMIN_EMAILS.join(', ')}`);
  console.log(`[seed:admin] Promoted ${result.modifiedCount} user(s) to admin.`);

  const admins = await User.find({ role: 'admin' }).select('email');
  console.log(`[seed:admin] Current admins: ${admins.map((a) => a.email).join(', ') || '(none)'}`);
}

run()
  .catch((err) => {
    console.error('[seed:admin] Failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
