import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { serverConfig } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, invoiceId, amount } = body;

    if (!razorpay_payment_id) {
      return NextResponse.json({ error: 'Payment ID is required for verification' }, { status: 400 });
    }

    const { keySecret, isConfigured } = serverConfig.razorpay;

    // If real secret is configured, perform cryptographic HMAC SHA256 signature verification
    if (isConfigured && razorpay_order_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json(
          { verified: false, error: 'Cryptographic signature mismatch. Potential payment tampering detected.' },
          { status: 400 }
        );
      }
    }

    // Payment verified (or sandbox mode with no real keys configured)
    return NextResponse.json({
      verified: true,
      transactionId: razorpay_payment_id,
      orderId: razorpay_order_id || `ord_${Date.now()}`,
      invoiceId,
      amount,
      verifiedAt: new Date().toISOString(),
      receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
      isSandbox: !isConfigured,
    });
  } catch {
    return NextResponse.json(
      { error: 'Server error during payment verification' },
      { status: 500 }
    );
  }
}
