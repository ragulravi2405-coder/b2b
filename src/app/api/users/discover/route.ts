import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = getAuthUserFromRequest(req);
    const { searchParams } = new URL(req.url);
    const orientation = searchParams.get('orientation') || 'All';
    const maxDistance = searchParams.get('maxDistance') ? parseInt(searchParams.get('maxDistance')!) : undefined;
    const query = searchParams.get('query') || '';

    // Prioritize authenticated session userId; if not logged in, userLikes is empty
    const userId = session?.userId || searchParams.get('userId');

    const profiles = db.getProfiles({
      orientation,
      maxDistance,
      query,
      currentUserId: userId || undefined
    });

    const userLikes = (userId && userId !== 'guest') ? db.getUserLikes(userId) : [];

    return NextResponse.json({
      success: true,
      profiles,
      userLikes
    });
  } catch (error: any) {
    console.error('Discover error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
