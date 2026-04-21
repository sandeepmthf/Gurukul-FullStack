import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    mobile: { type: String, default: '', trim: true },
    batch: { type: String, default: '', trim: true },
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
    subjects: { type: [String], default: [] },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
