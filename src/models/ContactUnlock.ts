import mongoose, { Schema, Document, Model } from 'mongoose';
import { ContactUnlock } from '@/types';

export interface ContactUnlockDocument extends Omit<ContactUnlock, 'id'>, Document {
  id: string;
}

const ContactUnlockSchema = new Schema<ContactUnlockDocument>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    profileId: { type: String, required: true },
    paymentId: { type: String, required: true },
    unlockedAt: { type: String, default: () => new Date().toISOString() }
  },
  {
    timestamps: true
  }
);

// Compound index so a user cannot unlock the same profile twice redundantly
ContactUnlockSchema.index({ userId: 1, profileId: 1 }, { unique: true });

export const ContactUnlockModel: Model<ContactUnlockDocument> =
  mongoose.models.ContactUnlock || mongoose.model<ContactUnlockDocument>('ContactUnlock', ContactUnlockSchema);
