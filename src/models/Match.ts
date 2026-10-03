import mongoose, { Schema, Document, Model } from 'mongoose';
import { MatchRecord } from '@/types';

export interface MatchDocument extends Omit<MatchRecord, 'id' | 'profile'>, Document {
  id: string;
  profileId: string;
  profile: any;
}

const MatchSchema = new Schema<MatchDocument>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    profileId: { type: String, required: true },
    matchedAt: { type: String, default: () => new Date().toISOString() },
    profile: { type: Schema.Types.Mixed, required: true }
  },
  {
    timestamps: true
  }
);

MatchSchema.index({ userId: 1, profileId: 1 }, { unique: true });

export const MatchModel: Model<MatchDocument> =
  mongoose.models.Match || mongoose.model<MatchDocument>('Match', MatchSchema);
