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
      paymentId,
      razorpayPaymentId,
      razorpayOrderId,
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

    const rawProfile = db.getRawProfileById(profileId);
    if (!rawProfile) {
      return NextResponse.json({
        success: false,
        unlocked: false,
        error: 'Target companion profile not found.'
      }, { status: 404 });
    }

    // Check if already unlocked for this user
    if (db.isContactUnlocked(userId, profileId)) {
      const contactDetails = db.getUnlockedContactDetails(userId, profileId);
      return NextResponse.json({
        success: true,
        unlocked: true,
        locked: false,
        message: 'Contact is already unlocked!',
        contact: {
          username: rawProfile.username,
          whatsappNumber: rawProfile.whatsappNumber || '919087923641',
          whatsappUrl: contactDetails.whatsappUrl
        }
      });
    }

    const razorpayKey = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_TlJDgRJz0sQAhB';
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET || '8eAycuEQDmkZ4PUugAnL26PF';
    const basicAuth = Buffer.from(`${razorpayKey}:${razorpaySecret}`).toString('base64');

    const cleanPaymentId = (paymentId || razorpayPaymentId || '').trim();
    const cleanOrderId = (razorpayOrderId || '').trim();
    const cleanSignature = (razorpaySignature || '').trim();

    const expectedPaise = rawProfile.unlockPrice ? Math.round(rawProfile.unlockPrice * 100) : 49900;
    const expectedRupees = expectedPaise / 100;

    // =========================================================================
    // 1. STANDARD RAZORPAY SDK FLOW (If signature is provided)
    // =========================================================================
    if (cleanSignature && cleanOrderId && cleanPaymentId) {
      const expectedSignature = crypto
        .createHmac('sha256', razorpaySecret)
        .update(`${cleanOrderId}|${cleanPaymentId}`)
        .digest('hex');

      if (expectedSignature !== cleanSignature) {
        return NextResponse.json({
          success: false,
          unlocked: false,
          error: 'Invalid payment signature. Contact remains locked.'
        }, { status: 400 });
      }

      // Check payment with Razorpay API
      const rzpRes = await fetch(`https://api.razorpay.com/v1/payments/${cleanPaymentId}`, {
        headers: { Authorization: `Basic ${basicAuth}` }
      });

      if (!rzpRes.ok) {
        return NextResponse.json({
          success: false,
          unlocked: false,
          error: 'Could not verify transaction with Razorpay. Contact remains locked.'
        }, { status: 400 });
      }

      const pData = await rzpRes.json();
      if (!['captured', 'authorized'].includes(pData.status)) {
        return NextResponse.json({
          success: false,
          unlocked: false,
          error: `Payment is not completed (status: ${pData.status}). Contact remains locked.`
        }, { status: 400 });
      }

      if (Number(pData.amount) !== expectedPaise) {
        return NextResponse.json({
          success: false,
          unlocked: false,
          error: `Payment amount mismatch: Expected ₹${expectedRupees} INR (${expectedPaise} paise), received ₹${pData.amount / 100} (${pData.amount} paise).`
        }, { status: 400 });
      }

      if (db.isPaymentIdUsed(cleanPaymentId, userId, profileId)) {
        return NextResponse.json({
          success: false,
          unlocked: false,
          error: 'This payment has already been claimed for another account.'
        }, { status: 409 });
      }

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
        paymentId: cleanPaymentId,
        message: `Payment of ₹${expectedRupees} INR verified successfully. Contact unlocked!`,
        contact: {
          username: rawProfile.username,
          whatsappNumber: rawProfile.whatsappNumber || '919087923641',
          whatsappUrl: unlockResult.whatsappUrl
        }
      });
    }

    // =========================================================================
    // 2. RAZORPAY.ME LIVE PAYMENT VERIFICATION FLOW (https://razorpay.me/@ravirahul601)
    // =========================================================================
    // Case 2A: Specific paymentId was provided (e.g. from receipt, SMS, or screen)
    if (cleanPaymentId) {
      try {
        const pRes = await fetch(`https://api.razorpay.com/v1/payments/${cleanPaymentId}`, {
          headers: { Authorization: `Basic ${basicAuth}` }
        });

        if (!pRes.ok) {
          return NextResponse.json({
            success: false,
            unlocked: false,
            error: `Payment ID "${cleanPaymentId}" was not found on your Razorpay live account. Please verify the ID or complete the payment on razorpay.me/@ravirahul601.`
          }, { status: 400 });
        }

        const pData = await pRes.json();

        if (pData.status !== 'captured' && pData.status !== 'authorized') {
          return NextResponse.json({
            success: false,
            unlocked: false,
            error: `Payment status is "${pData.status}". Only successfully captured payments can unlock contacts.`
          }, { status: 400 });
        }

        if (Number(pData.amount) !== expectedPaise) {
          return NextResponse.json({
            success: false,
            unlocked: false,
            error: `Payment amount is ₹${pData.amount / 100} INR. Contact requires a payment of exactly ₹${expectedRupees} INR.`
          }, { status: 400 });
        }

        if (pData.currency !== 'INR') {
          return NextResponse.json({
            success: false,
            unlocked: false,
            error: 'Payment currency must be INR.'
          }, { status: 400 });
        }

        if (db.isPaymentIdUsed(cleanPaymentId, userId, profileId)) {
          return NextResponse.json({
            success: false,
            unlocked: false,
            error: 'This payment has already been used to unlock a contact.'
          }, { status: 409 });
        }

        const unlockResult = db.verifyAndUnlockContact(
          userId,
          profileId,
          `order_rzpme_${cleanPaymentId}`,
          cleanPaymentId
        );

        return NextResponse.json({
          success: true,
          unlocked: true,
          locked: false,
          paymentId: cleanPaymentId,
          message: `Razorpay.me payment of ₹${expectedRupees} INR verified successfully. Contact unlocked!`,
          contact: {
            username: rawProfile.username,
            whatsappNumber: rawProfile.whatsappNumber || '919087923641',
            whatsappUrl: unlockResult.whatsappUrl
          }
        });
      } catch (err: any) {
        return NextResponse.json({
          success: false,
          unlocked: false,
          error: `Error checking payment: ${err.message}`
        }, { status: 500 });
      }
    }

    // Case 2B: Auto-detect latest captured live payment on merchant account
    try {
      const listRes = await fetch('https://api.razorpay.com/v1/payments?count=20', {
        headers: { Authorization: `Basic ${basicAuth}` }
      });

      if (!listRes.ok) {
        return NextResponse.json({
          success: false,
          unlocked: false,
          error: 'Could not connect to Razorpay live API to verify payment.'
        }, { status: 502 });
      }

      const listData = await listRes.json();
      const items: any[] = listData.items || [];

      // Find any captured payment for expected amount that has not yet been used
      const matchedPayment = items.find(
        (item) =>
          item.status === 'captured' &&
          Number(item.amount) === expectedPaise &&
          item.currency === 'INR' &&
          !db.isPaymentIdUsed(item.id, userId, profileId)
      );

      if (!matchedPayment) {
        return NextResponse.json({
          success: false,
          unlocked: false,
          error: `No live captured payment of ₹${expectedRupees} found on Razorpay yet. Please complete the ₹${expectedRupees} payment on razorpay.me/@ravirahul601, then click "Verify Live Payment & Unlock Contact".`
        }, { status: 400 });
      }

      // Valid captured live payment detected! Unlock contact
      const unlockResult = db.verifyAndUnlockContact(
        userId,
        profileId,
        `order_rzpme_${matchedPayment.id}`,
        matchedPayment.id
      );

      return NextResponse.json({
        success: true,
        unlocked: true,
        locked: false,
        paymentId: matchedPayment.id,
        message: `Live Razorpay payment of ₹${expectedRupees} detected and verified! Contact unlocked successfully.`,
        contact: {
          username: rawProfile.username,
          whatsappNumber: rawProfile.whatsappNumber || '919087923641',
          whatsappUrl: unlockResult.whatsappUrl
        }
      });
    } catch (apiErr: any) {
      console.error('Razorpay live fetch error:', apiErr);
      return NextResponse.json({
        success: false,
        unlocked: false,
        error: 'Failed to connect to Razorpay API for verification. Please try again.'
      }, { status: 502 });
    }
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({
      success: false,
      unlocked: false,
      error: error.message || 'Internal error verifying payment. Contact remains locked.'
    }, { status: 500 });
  }
}
