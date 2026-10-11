import { NextResponse } from 'next/server';
import { serverConfig } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', invoiceId, studentId } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid payment amount is required' }, { status: 400 });
    }

    const { keyId, keySecret, isConfigured } = serverConfig.razorpay;

    // If real keys are provided and not placeholders, call the live Razorpay Orders API
    if (isConfigured) {
      try {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const res = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // in paise
            currency,
            receipt: `rcpt_${invoiceId || Date.now()}`,
            notes: { invoiceId, studentId },
          }),
        });

        if (res.ok) {
          const order = await res.json();
          return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId,
            isSandbox: false,
          });
        }

        // Log warning without leaking key material
        console.warn('Razorpay Orders API returned non-OK status. Falling back to test sandbox mode.');
      } catch (err) {
        console.warn('Razorpay order creation failed, falling back to test sandbox mode:', String(err));
      }
    }

    if (!isConfigured) {
      // Sandbox/test mode — no real credentials configured
      console.info(
        'RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are not configured. ' +
          'Running in test/sandbox mode. Copy .env.example to .env.local and add your Razorpay test keys.'
      );
    }

    // Test / Sandbox mode — generates a mock order for UI testing
    const mockOrderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).substring(4, 9)}`;

    return NextResponse.json({
      orderId: mockOrderId,
      amount: Math.round(amount * 100),
      currency,
      keyId: keyId || null,
      isSandbox: true,
      message: 'Razorpay sandbox mode — configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to enable live payments',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error while creating order' },
      { status: 500 }
    );
  }
}
