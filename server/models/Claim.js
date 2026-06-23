import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

// A claim that a user is the rightful owner of an item. The claimant answers
// the item's private verifying question; the finder (item reporter) or an admin
// reviews and approves/rejects.
const claimSchema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: 'Item', required: true, index: true },
    claimant: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    answer: { type: String, trim: true, maxlength: 300, default: '' },
    message: { type: String, trim: true, maxlength: 500, default: '' },
    // Whether the submitted answer matched the item's stored verifying answer —
    // a hint for the reviewer (null when the item has no verifying question).
    autoMatch: { type: Boolean, default: null },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
      index: true,
    },
    reviewer: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

// The claimant's own view of their claim.
claimSchema.methods.toClaimant = function toClaimant() {
  return {
    id: this._id,
    status: this.status,
    message: this.message,
    createdAt: this.createdAt,
    resolvedAt: this.resolvedAt,
  };
};

// The reviewer's (owner/admin) view — includes the answer + claimant contact.
claimSchema.methods.toReviewer = function toReviewer() {
  const c = this.claimant;
  return {
    id: this._id,
    status: this.status,
    answer: this.answer,
    message: this.message,
    autoMatch: this.autoMatch,
    createdAt: this.createdAt,
    claimant:
      c && c.name ? { id: c._id, name: c.name, phone: c.phone || '' } : { id: c },
  };
};

export default models.Claim || model('Claim', claimSchema);
