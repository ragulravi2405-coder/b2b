import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { getAuthUserFromRequest } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const session = getAuthUserFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const {
      profileId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    } = body;

    const userId = session?.userId || body.userId;
    if (!userId || userId === 'guest') {
      return NextResponse.json({
        success: false,
        unlocked: false,
        error: 'Authentication required. Please log in to complete contact unlock.'
      }, { status: 401 });
    }

    if (!profileId) {
      return NextResponse.json({
        success: false,
        unlocked: false,
        error: 'Profile ID is required for contact unlock verification.'
      }, { status: 400 });
    }

    // Require genuine Razorpay transaction details
    const cleanOrderId = (razorpayOrderId || '').trim();
    const cleanPaymentId = (razorpayPaymentId || '').trim();
    const cleanSignature = (razorpaySignature || '').trim();

    if (!cleanOrderId || !cleanPaymentId || !cleanSignature) {
      return NextResponse.json({
        success: false,
        unlocked: false,
        error: 'Incomplete payment information. Missing order ID, payment ID, or signature.'
      }, { status: 400 });
    }

    const rawProfile = db.getRawProfileById(profileId);
    if (!rawProfile) {
      return NextResponse.json({
        success: false,
        unlocked: false,
        error: 'Target companion profile not found.'
      }, { status: 404 });
    }

    const razorpayKey = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TlJDgRJz0sQAhB';
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET || '8eAycuEQDmkZ4PUugAnL26PF';

    // 1. STEP 1: Verify HMAC-SHA256 signature using Razorpay Key Secret
    const expectedSignature = crypto
      .createHmac('sha256', razorpaySecret)
      .update(`${cleanOrderId}|${cleanPaymentId}`)
      .digest('hex');

    if (expectedSignature !== cleanSignature) {
      console.warn(`Payment signature mismatch for order ${cleanOrderId}, payment ${cleanPaymentId}`);
      return NextResponse.json({
        success: false,
        unlocked: false,
        error: 'Invalid payment signature. Contact remains locked.'
      }, { status: 400 });
    }

    // 2. STEP 2: Verify transaction directly with Razorpay API
    try {
      const basicAuth = Buffer.from(`${razorpayKey}:${razorpaySecret}`).toString('base64');
      const rzpRes = await fetch(`https://api.razorpay.com/v1/payments/${cleanPaymentId}`, {
        method: 'GET',
        headers: {
          Authorization: `Basic ${basicAuth}`
        }
      });

      if (!rzpRes.ok) {
        const errText = await rzpRes.text();
        console.error('Razorpay payment fetch failed:', errText);
        return NextResponse.json({
          success: false,
          unlocked: false,
          error: 'Could not verify transaction with Razorpay. Contact remains locked.'
        }, { status: 400 });
      }

      const paymentData = await rzpRes.json();

      // Verify order association
      if (paymentData.order_id && paymentData.order_id !== cleanOrderId) {
        return NextResponse.json({
          success: false,
          unlocked: false,
          error: 'Order mismatch: Payment does not match the generated order.'
        }, { status: 400 });
      }

      // Verify payment status
      if (!['captured', 'authorized'].includes(paymentData.status)) {
        return NextResponse.json({
          success: false,
          unlocked: false,
          error: `Payment is not successful (status: ${paymentData.status}). Contact remains locked.`
        }, { status: 400 });
      }

      // Verify amount (Exactly ₹499 = 49900 paise)
      if (Number(paymentData.amount) !== 49900) {
        return NextResponse.json({
          success: false,
          unlocked: false,
          error: `Payment amount mismatch: Expected ₹499 INR (49900 paise), received ${paymentData.amount}.`
        }, { status: 400 });
      }

      // Verify currency
      if (paymentData.currency !== 'INR') {
        return NextResponse.json({
          success: false,
          unlocked: false,
          error: 'Payment currency mismatch: Currency must be INR.'
        }, { status: 400 });
      }
    } catch (apiErr: any) {
      console.error('Razorpay API verification error:', apiErr);
      return NextResponse.json({
        success: false,
        unlocked: false,
        error: 'Backend failed to connect with Razorpay for verification. Contact remains locked.'
      }, { status: 502 });
    }

    // 3. STEP 3: Prevent replay attacks (payment ID used by another user)
    if (db.isPaymentIdUsed(cleanPaymentId, userId, profileId)) {
      return NextResponse.json({
        success: false,
        unlocked: false,
        error: 'This payment reference has already been claimed for another account.'
      }, { status: 409 });
    }

    // 4. STEP 4: Genuine verified payment! Unlock contact in database for this specific user
    const unlockResult = db.verifyAndUnlockContact(
      userId,
      profileId,
      cleanOrderId,
      cleanPaymentId
    );

    return NextResponse.json({
      success: true,
      unlocked: true,
      locked: false,
      message: 'Payment of ₹499 INR verified successfully. Contact unlocked!',
      contact: {
        username: rawProfile.username,
        whatsappNumber: rawProfile.whatsappNumber || '919087923641',
        whatsappUrl: unlockResult.whatsappUrl
      }
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({
      success: false,
      unlocked: false,
      error: error.message || 'Internal error verifying payment. Contact remains locked.'
    }, { status: 500 });
  }
}
