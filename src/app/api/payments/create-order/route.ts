import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId = 'current-user-1', profileId } = body;

    if (!profileId) {
      return NextResponse.json({ success: false, error: 'profileId is required' }, { status: 400 });
    }

    // Check if already unlocked
    const alreadyUnlocked = db.isContactUnlocked(userId, profileId);
    if (alreadyUnlocked) {
      const details = db.getUnlockedContactDetails(userId, profileId);
      return NextResponse.json({
        success: true,
        alreadyUnlocked: true,
        ...details
      });
    }

    const orderData = db.createPaymentOrder(userId, profileId, 299);

    // If Razorpay API credentials are configured, create order via Razorpay API
    const razorpayKey = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    if (razorpayKey && razorpaySecret) {
      try {
        const basicAuth = Buffer.from(`${razorpayKey}:${razorpaySecret}`).toString('base64');
        const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${basicAuth}`
          },
          body: JSON.stringify({
            amount: 299 * 100, // in paise
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`
          })
        });

        if (rzpRes.ok) {
          const rzpOrder = await rzpRes.json();
          orderData.orderId = rzpOrder.id;
        }
      } catch (err) {
        console.error('Failed to create Razorpay official order:', err);
      }
    }

    return NextResponse.json({
      success: true,
      alreadyUnlocked: false,
      order: orderData
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
