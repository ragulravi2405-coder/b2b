import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = getAuthUserFromRequest(req);
    const body = await req.json();
    const userId = session?.userId || body.userId;

    if (!userId || userId === 'guest') {
      return NextResponse.json({ success: false, error: 'Authentication required to unlock contact' }, { status: 401 });
    }

    const { profileId, amount } = body;

    if (!profileId) {
      return NextResponse.json({ success: false, error: 'profileId is required' }, { status: 400 });
    }

    // Check if already unlocked
    const isUnlocked = db.isContactUnlocked(userId, profileId);
    if (isUnlocked) {
      const details = db.getUnlockedContactDetails(userId, profileId);
      return NextResponse.json({
        success: true,
        alreadyUnlocked: true,
        ...details
      });
    }

    const profile = db.getProfileById(profileId);
    const targetAmount = typeof amount === 'number' ? amount : (profile?.unlockPrice ?? 499);

    // Create a pending unlock request for verification
    const pendingTx = db.createPendingUnlockRequest(userId, profileId, targetAmount);

    return NextResponse.json({
      success: true,
      pending: true,
      transaction: pendingTx,
      message: 'Payment verification request received. Your WhatsApp link will unlock once confirmed.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
