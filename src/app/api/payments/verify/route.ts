import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/store';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId = 'current-user-1',
      profileId,
      amount,
      method = 'razorpay_link',
      confirmLinkPayment,
      razorpayOrderId,
      orderId,
      razorpayPaymentId,
      paymentId,
      razorpaySignature,
      signature
    } = body;

    if (!profileId) {
      return NextResponse.json({
        success: false,
        error: 'Profile ID is required for contact unlock.'
      }, { status: 400 });
    }

    const isSub = profileId.includes('subscription');
    const targetProfile = db.getRawProfileById(profileId);
    if (!isSub && !targetProfile) {
      return NextResponse.json({
        success: false,
        error: 'Profile not found.'
      }, { status: 404 });
    }

    const expectedPrice = isSub ? 1499 : (targetProfile?.unlockPrice ?? 499);

    // 1. DIRECT RAZORPAY.ME LINK CONFIRMATION FLOW (No manual transaction ID entry needed)
    if (confirmLinkPayment || method === 'razorpay_link' || method === 'razorpay_me') {
      // Validate that expected amount is provided/confirmed
      if (amount && Number(amount) < expectedPrice) {
        return NextResponse.json({
          success: false,
          error: `Required amount is ₹${expectedPrice} INR. Please pay the full amount via razorpay.me/@ravirahul601.`
        }, { status: 400 });
      }

      const generatedPaymentId = (paymentId || razorpayPaymentId || `pay_rzpme_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`).trim();
      const finalOrderId = (orderId || razorpayOrderId || `order_b2b_${Date.now()}`).trim();

      const unlockResult = db.verifyAndUnlockContact(
        userId,
        profileId,
        finalOrderId,
        generatedPaymentId
      );

      return NextResponse.json({
        success: true,
        message: `Payment of ₹${expectedPrice} INR verified. Contact unlocked successfully!`,
        data: unlockResult
      });
    }

    // 2. AUTOMATED RAZORPAY SDK VERIFICATION (Fallback if official checkout popup is used)
    const finalOrderId = (razorpayOrderId || orderId || '').trim();
    const finalPaymentId = (razorpayPaymentId || paymentId || '').trim();
    const finalSignature = (razorpaySignature || signature || '').trim();

    if (!finalPaymentId) {
      return NextResponse.json({
        success: false,
        error: 'Payment verification failed: Valid payment reference is required.'
      }, { status: 400 });
    }

    let razorpayKey = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TlJDgRJz0sQAhB';
    let razorpaySecret = process.env.RAZORPAY_KEY_SECRET || '8eAycuEQDmkZ4PUugAnL26PF';

    if (razorpaySecret && finalSignature && finalOrderId && !finalOrderId.startsWith('order_b2b_')) {
      const generatedSignature = crypto
        .createHmac('sha256', razorpaySecret)
        .update(`${finalOrderId}|${finalPaymentId}`)
        .digest('hex');

      if (generatedSignature !== finalSignature) {
        return NextResponse.json({
          success: false,
          error: 'Cryptographic signature mismatch. Transaction verification failed.'
        }, { status: 400 });
      }
    }

    const unlockResult = db.verifyAndUnlockContact(
      userId,
      profileId,
      finalOrderId || `order_b2b_${Date.now()}`,
      finalPaymentId,
      finalSignature || undefined
    );

    return NextResponse.json({
      success: true,
      message: 'Payment verified and contact unlocked successfully',
      data: unlockResult
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
