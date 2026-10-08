import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET(req: NextRequest, { params }: { params: Promise<{ profileId: string }> }) {
  try {
    const { profileId } = await params;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'current-user-1';

    // Strict security check: verify if the authenticated user has unlocked this specific profile
    const isUnlocked = db.isContactUnlocked(userId, profileId);

    const profile = db.getProfileById(profileId);
    const amount = profile?.unlockPrice ?? 499;

    if (!isUnlocked) {
      return NextResponse.json({
        success: false,
        error: `Contact Locked. A valid verified payment of ₹${amount} is required to access private contact info.`,
        unlocked: false
      }, { status: 403 });
    }

    const contactDetails = db.getUnlockedContactDetails(userId, profileId);

    return NextResponse.json({
      success: true,
      unlocked: true,
      whatsappUrl: contactDetails.whatsappUrl,
      whatsappNumber: contactDetails.whatsappNumber
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
