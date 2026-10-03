import mongoose, { Schema, Document, Model } from 'mongoose';
import { ChatMessage } from '@/types';

export interface MessageDocument extends Omit<ChatMessage, 'id'>, Document {
  id: string;
}

const MessageSchema = new Schema<MessageDocument>(
  {
    id: { type: String, required: true, unique: true },
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: String, required: true },
    read: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

export const MessageModel: Model<MessageDocument> =
  mongoose.models.Message || mongoose.model<MessageDocument>('Message', MessageSchema);
