import mongoose, { Schema, Document, Model } from 'mongoose';
import { UserProfile } from '@/types';

export interface ProfileDocument extends Omit<UserProfile, 'id'>, Document {
  id: string;
}

const ProfileSchema = new Schema<ProfileDocument>(
  {
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    age: { type: Number, required: true },
    orientation: { type: String, required: true },
    distanceKm: { type: Number, default: 5 },
    bio: { type: String, default: '' },
    interests: [{ type: String }],
    lookingFor: [{ type: String }],
    avatar: { type: String, required: true },
    additionalPhotos: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    lastActive: { type: String, default: 'Active now' },
    whatsappNumber: { type: String },
    isBlocked: { type: Boolean, default: false },
    unlockPrice: { type: Number, default: 299 }
  },
  {
    timestamps: true
  }
);

export const ProfileModel: Model<ProfileDocument> =
  mongoose.models.Profile || mongoose.model<ProfileDocument>('Profile', ProfileSchema);
