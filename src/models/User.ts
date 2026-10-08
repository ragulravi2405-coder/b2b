import mongoose, { Schema, Document, Model } from 'mongoose';
import { AuthUser } from '@/types';

export interface UserDocument extends Omit<AuthUser, 'id'>, Document {
  id: string;
  passwordHash?: string;
}

const UserSchema = new Schema<UserDocument>(
  {
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String },
    passwordHash: { type: String },
    age: { type: Number, required: true },
    orientation: { type: String, default: 'Member' },
    bio: { type: String },
    avatar: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  {
    timestamps: true
  }
);

export const UserModel: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
