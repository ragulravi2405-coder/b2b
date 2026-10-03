import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId: otherUserId } = await params;
    const { searchParams } = new URL(req.url);
    const currentUserId = searchParams.get('currentUserId') || 'current-user-1';

    const messages = db.getMessagesBetween(currentUserId, otherUserId);
    return NextResponse.json({
      success: true,
      messages
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId: receiverId } = await params;
    const body = await req.json();
    const senderId = body.senderId || 'current-user-1';
    const text = body.text?.trim();

    if (!text) {
      return NextResponse.json({ success: false, error: 'Message cannot be empty' }, { status: 400 });
    }

    const message = db.sendMessage(senderId, receiverId, text);

    return NextResponse.json({
      success: true,
      message
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
