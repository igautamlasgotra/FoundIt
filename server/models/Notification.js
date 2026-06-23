import mongoose from 'mongoose';

const { Schema, model, models } = mongoose;

const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, default: 'match' }, // match | claim | system
    message: { type: String, required: true },
    link: { type: String, default: '' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, createdAt: -1 });

notificationSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id,
    type: this.type,
    message: this.message,
    link: this.link,
    read: this.read,
    createdAt: this.createdAt,
  };
};

export default models.Notification || model('Notification', notificationSchema);
