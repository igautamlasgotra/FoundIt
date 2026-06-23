import AuditLog from '../models/AuditLog.js';

// Record a sensitive action. Best-effort: never throws into the request path.
export async function logAudit(actor, action, target, meta = {}) {
  try {
    await AuditLog.create({
      actor: actor?._id,
      actorName: actor?.name || '',
      action,
      target,
      meta,
    });
  } catch (err) {
    console.error('[audit] failed to log:', err.message);
  }
}
