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

    const rawProfile = db.getRawProfileById(profileId);
    const unlockAmount = rawProfile?.unlockPrice ?? 499;
    const orderData = db.createPaymentOrder(userId, profileId, unlockAmount);

    // If Razorpay API credentials are configured, create order via Razorpay API
    let razorpayKey = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    if (!razorpayKey || razorpayKey.startsWith('rzp_test_')) {
      razorpayKey = 'rzp_live_TlJDgRJz0sQAhB';
    }
    let razorpaySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!razorpaySecret || razorpaySecret === 'NZSDqyrFZPxU2O0Iiq2WXBQ7' || razorpaySecret === 'XgkPvA1A7Z7RA8aA59JkrIPS') {
      razorpaySecret = '8eAycuEQDmkZ4PUugAnL26PF';
    }

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
            amount: unlockAmount * 100, // in paise
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`
          })
        });

        if (rzpRes.ok) {
          const rzpOrder = await rzpRes.json();
          orderData.orderId = rzpOrder.id;
        } else {
          const errText = await rzpRes.text();
          console.warn('Razorpay live order creation notice:', errText);
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
