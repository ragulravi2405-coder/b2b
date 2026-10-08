import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const session = getAuthUserFromRequest(req);
    const userId = session?.userId || body.userId;

    if (!userId || userId === 'guest') {
      return NextResponse.json(
        { success: false, error: 'Authentication required to like profiles.' },
        { status: 401 }
      );
    }

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
