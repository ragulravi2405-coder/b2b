import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orientation = searchParams.get('orientation') || 'All';
    const maxDistance = searchParams.get('maxDistance') ? parseInt(searchParams.get('maxDistance')!) : undefined;
    const query = searchParams.get('query') || '';
    const userId = searchParams.get('userId') || 'current-user-1';

    const profiles = db.getProfiles({
      orientation,
      maxDistance,
      query,
      currentUserId: userId
    });

    const userLikes = db.getUserLikes(userId);

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
