import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

// A user-initiated request for an admin to reset their password. Admins review
// these in the dashboard; on approval a temporary password is emailed.
const resetRequestSchema = new Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

resetRequestSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id,
    email: this.email,
    user: this.user && this.user.name ? { id: this.user._id, name: this.user.name } : { id: this.user },
    status: this.status,
    createdAt: this.createdAt,
    resolvedAt: this.resolvedAt,
  };
};

export default models.PasswordResetRequest || model('PasswordResetRequest', resetRequestSchema);
