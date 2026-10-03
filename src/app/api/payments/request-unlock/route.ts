import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId = 'current-user-1', profileId, amount } = body;

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
    const targetAmount = typeof amount === 'number' ? amount : (profile?.unlockPrice ?? 299);

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
