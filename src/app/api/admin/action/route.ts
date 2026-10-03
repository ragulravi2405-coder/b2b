import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, profileId, blocked } = body;

    if (action === 'toggle-block') {
      const isBlocked = db.toggleBlockProfile(profileId, blocked);
      return NextResponse.json({ success: true, profileId, isBlocked });
    }

    if (action === 'delete-profile') {
      const deleted = db.deleteProfile(profileId);
      return NextResponse.json({ success: deleted });
    }

    if (action === 'approve-payment') {
      const { transactionId } = body;
      const approved = db.approvePayment(transactionId);
      return NextResponse.json({ success: true, payment: approved });
    }

    if (action === 'reject-payment') {
      const { transactionId } = body;
      const rejected = db.rejectPayment(transactionId);
      return NextResponse.json({ success: true, payment: rejected });
    }

    return NextResponse.json({ success: false, error: 'Unknown admin action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
