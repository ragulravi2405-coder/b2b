import mongoose, { Schema, Document, Model } from 'mongoose';
import { UserReport } from '@/types';

export interface ReportDocument extends Omit<UserReport, 'id'>, Document {
  id: string;
}

const ReportSchema = new Schema<ReportDocument>(
  {
    id: { type: String, required: true, unique: true },
    reporterUserId: { type: String, required: true },
    reportedProfileId: { type: String, required: true },
    reportedProfileName: { type: String, required: true },
    reason: { type: String, required: true },
    details: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'reviewed', 'dismissed'], default: 'pending' },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  {
    timestamps: true
  }
);

export const ReportModel: Model<ReportDocument> =
  mongoose.models.Report || mongoose.model<ReportDocument>('Report', ReportSchema);
