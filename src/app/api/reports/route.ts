import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { reporterUserId = 'current-user-1', reportedProfileId, reason, details } = body;

    if (!reportedProfileId || !reason) {
      return NextResponse.json({ success: false, error: 'Missing reportedProfileId or reason' }, { status: 400 });
    }

    const report = db.createReport(reporterUserId, reportedProfileId, reason, details);
    return NextResponse.json({
      success: true,
      message: 'Report submitted successfully. Our safety moderation team will review it.',
      report
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
