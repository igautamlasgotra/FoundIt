import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // Mobile number so a finder/owner can contact the reporter directly
    // (shown only to logged-in SMVDU members on an item's detail page).
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
      default: '',
    },
    // `select: false` means the hash is never returned by default queries —
    // you must explicitly ask for it (used only when verifying a login).
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  { timestamps: true }
);

// Hash a plaintext password and store it. bcrypt salts automatically.
userSchema.methods.setPassword = async function setPassword(plain) {
  this.passwordHash = await bcrypt.hash(plain, 12);
};

// Compare a login attempt against the stored hash.
userSchema.methods.comparePassword = function comparePassword(plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// Shape returned to clients — never leak the hash or internal __v.
userSchema.methods.toPublic = function toPublic() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    phone: this.phone,
    role: this.role,
    createdAt: this.createdAt,
  };
};

// `models.User ||` guard prevents "OverwriteModelError" when the serverless
// function is re-imported on a warm invocation.
export default models.User || model('User', userSchema);
