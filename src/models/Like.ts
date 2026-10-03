import mongoose, { Schema, Document, Model } from 'mongoose';
import { LikeRecord } from '@/types';

export interface LikeDocument extends Omit<LikeRecord, 'id'>, Document {
  id: string;
}

const LikeSchema = new Schema<LikeDocument>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    profileId: { type: String, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  {
    timestamps: true
  }
);

LikeSchema.index({ userId: 1, profileId: 1 }, { unique: true });

export const LikeModel: Model<LikeDocument> =
  mongoose.models.Like || mongoose.model<LikeDocument>('Like', LikeSchema);
