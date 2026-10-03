import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const userId = body.userId || 'current-user-1';

    const result = db.toggleLike(userId, id);

    return NextResponse.json({
      success: true,
      liked: result.liked,
      isMatch: result.isMatch,
      profile: result.profile
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
