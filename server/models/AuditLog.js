import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

// An append-only trail of sensitive actions (claim approvals, removals, resets)
// so admins can see who did what. Brief §2: "an audit trail".
const auditSchema = new Schema(
  {
    actor: { type: Schema.Types.ObjectId, ref: 'User' },
    actorName: { type: String, default: '' }, // denormalised for easy display
    action: { type: String, required: true, index: true },
    target: { type: String, default: '' }, // free-text description of the target
    meta: { type: Object, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

auditSchema.index({ createdAt: -1 });

export default models.AuditLog || model('AuditLog', auditSchema);
