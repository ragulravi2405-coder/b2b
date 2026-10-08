import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId: otherUserId } = await params;
    const session = getAuthUserFromRequest(req);
    const { searchParams } = new URL(req.url);
    const currentUserId = session?.userId || searchParams.get('currentUserId');

    if (!currentUserId || currentUserId === 'guest') {
      return NextResponse.json({ success: true, messages: [] });
    }

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
    const session = getAuthUserFromRequest(req);
    const body = await req.json();
    const senderId = session?.userId || body.senderId;
    const text = body.text?.trim();

    if (!senderId || senderId === 'guest') {
      return NextResponse.json({ success: false, error: 'Authentication required to send messages.' }, { status: 401 });
    }

    if (!text) {
      return NextResponse.json({ success: false, error: 'Message cannot be empty.' }, { status: 400 });
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
