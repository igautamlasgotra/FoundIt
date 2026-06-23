import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

// A suggested pairing between a lost report and a found report, produced by the
// AI matching engine. One document per (lostItem, foundItem) pair.
const matchSchema = new Schema(
  {
    lostItem: { type: Schema.Types.ObjectId, ref: 'Item', required: true, index: true },
    foundItem: { type: Schema.Types.ObjectId, ref: 'Item', required: true, index: true },
    score: { type: Number, min: 0, max: 100, required: true },
    reason: { type: String, default: '' },
    status: {
      type: String,
      enum: ['suggested', 'dismissed', 'confirmed'],
      default: 'suggested',
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate pairings.
matchSchema.index({ lostItem: 1, foundItem: 1 }, { unique: true });

export default models.Match || model('Match', matchSchema);
