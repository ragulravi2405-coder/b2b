import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = getAuthUserFromRequest(req);
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get('userId');

    const userId = session?.userId || requestedUserId;
    if (!userId || userId === 'guest') {
      return NextResponse.json({
        success: true,
        unlocked: {}
      });
    }

    const unlocked = db.getUserUnlockedContacts(userId);
    return NextResponse.json({
      success: true,
      unlocked
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
