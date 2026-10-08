import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { getAuthUserFromRequest } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = getAuthUserFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const userId = session?.userId || body.userId;

    if (!userId || userId === 'guest') {
      return NextResponse.json(
        { success: false, error: 'Authentication required to unlock contact details. Please log in.' },
        { status: 401 }
      );
    }

    const { profileId } = body;
    if (!profileId) {
      return NextResponse.json({ success: false, error: 'profileId is required' }, { status: 400 });
    }

    const rawProfile = db.getRawProfileById(profileId);
    if (!rawProfile) {
      return NextResponse.json({ success: false, error: 'Companion profile not found' }, { status: 404 });
    }

    const unlockPrice = rawProfile.unlockPrice ?? 499;
    const amountInPaise = Math.round(unlockPrice * 100);

    // Check if already unlocked for this specific user
    const alreadyUnlocked = db.isContactUnlocked(userId, profileId);
    if (alreadyUnlocked) {
      const details = db.getUnlockedContactDetails(userId, profileId);
      return NextResponse.json({
        success: true,
        alreadyUnlocked: true,
        locked: false,
        price: unlockPrice,
        ...details
      });
    }

    const razorpayKey = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TlJDgRJz0sQAhB';
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET || '8eAycuEQDmkZ4PUugAnL26PF';

    let razorpayOrderId = '';

    // Create official order with Razorpay Orders API
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
            amount: amountInPaise,
            currency: 'INR',
            receipt: `b2b_rcpt_${Date.now()}`,
            notes: {
              userId,
              profileId,
              profileName: rawProfile.username,
              service: 'B2B Contact Unlock'
            }
          })
        });

        if (rzpRes.ok) {
          const rzpOrder = await rzpRes.json();
          razorpayOrderId = rzpOrder.id;
        } else {
          const errText = await rzpRes.text();
          console.error('Razorpay order creation failed:', errText);
          return NextResponse.json(
            { success: false, error: 'Unable to initialize Razorpay checkout. Please check payment gateway credentials.' },
            { status: 502 }
          );
        }
      } catch (err: any) {
        console.error('Network error during Razorpay order creation:', err);
        return NextResponse.json(
          { success: false, error: 'Network error connecting to Razorpay. Please try again.' },
          { status: 503 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Razorpay payment gateway is not properly configured.' },
        { status: 500 }
      );
    }

    // Save pending/created payment record in database
    const orderData = db.createPaymentOrder(userId, profileId, razorpayOrderId);

    return NextResponse.json({
      success: true,
      alreadyUnlocked: false,
      locked: true,
      price: unlockPrice,
      order: {
        orderId: razorpayOrderId,
        amount: amountInPaise,
        currency: 'INR',
        keyId: razorpayKey,
        profileName: rawProfile.username
      }
    });
  } catch (error: any) {
    console.error('create-order error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
