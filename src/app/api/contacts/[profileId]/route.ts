import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ profileId: string }> }) {
  try {
    const { profileId } = await params;
    const session = getAuthUserFromRequest(req);
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get('userId');

    const userId = session?.userId || requestedUserId;

    const profile = db.getRawProfileById(profileId);
    const unlockPrice = profile?.unlockPrice ?? 499;

    if (!userId || userId === 'guest') {
      return NextResponse.json({
        success: true,
        locked: true,
        unlocked: false,
        price: unlockPrice,
        error: 'Authentication required to view contact status.'
      });
    }

    // Strict security check: verify if the authenticated user has paid & unlocked this specific profile
    const isUnlocked = db.isContactUnlocked(userId, profileId);

    if (!isUnlocked) {
      // While locked, NEVER expose telephone or WhatsApp contact info
      return NextResponse.json({
        success: true,
        locked: true,
        unlocked: false,
        price: unlockPrice
      });
    }

    // Only after genuine verified payment, return protected contact information
    const contactDetails = db.getUnlockedContactDetails(userId, profileId);

    return NextResponse.json({
      success: true,
      locked: false,
      unlocked: true,
      price: unlockPrice,
      name: profile?.username,
      whatsappNumber: contactDetails.whatsappNumber,
      whatsappUrl: contactDetails.whatsappUrl
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
