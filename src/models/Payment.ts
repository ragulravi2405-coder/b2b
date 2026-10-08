import mongoose, { Schema, Document, Model } from 'mongoose';
import { PaymentTransaction } from '@/types';

export interface PaymentDocument extends Omit<PaymentTransaction, 'id'>, Document {
  id: string;
}

const PaymentSchema = new Schema<PaymentDocument>(
  {
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    profileId: { type: String, required: true },
    profileName: { type: String, required: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String, default: '' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['created', 'pending', 'verified', 'paid', 'failed'], default: 'created' },
    verified: { type: Boolean, default: false },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  {
    timestamps: true
  }
);

export const PaymentModel: Model<PaymentDocument> =
  mongoose.models.Payment || mongoose.model<PaymentDocument>('Payment', PaymentSchema);
