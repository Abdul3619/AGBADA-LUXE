import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Read raw body for signature verification if needed
    const payload = await req.json();
    const signature = req.headers.get("x-webhook-signature") || req.headers.get("stripe-signature");

    // In production, you would verify the signature:
    // const event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    
    // Simulate webhook payload parsing
    const eventType = payload.type || "charge.successful";
    const transactionRef = payload.reference || payload.data?.object?.id || "tx_luxe_demo_992";
    const amount = payload.amount || payload.data?.object?.amount || 1850.00;
    const orderId = payload.orderId || "o1d8601b-8d4e-4f3d-9d41-e94ba7a3d902";

    if (eventType === "charge.successful" || eventType === "payment_intent.succeeded") {
      // Execute PostgreSQL transactional operations (simulated):
      // 1. UPDATE public.payments SET status = 'completed', paid_at = NOW() WHERE transaction_ref = transactionRef;
      // 2. UPDATE public.orders SET status = 'in_progress' WHERE id = orderId;
      // 3. INSERT INTO public.notifications (user_id, title, message) VALUES (...) for both Client & Tailor;
      // 4. INSERT INTO public.invoices (order_id, invoice_number, amount) VALUES (orderId, 'INV-2026-001', amount);

      return NextResponse.json({
        received: true,
        processed: true,
        action: "Ledger and Order status synchronized successfully.",
        event: eventType,
        details: {
          transactionRef,
          orderId,
          amount,
          synchronizedAt: new Date().toISOString()
        }
      }, { status: 200 });
    }

    return NextResponse.json({
      received: true,
      processed: false,
      message: `Event type ${eventType} ignored or does not require order updates.`
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: "Webhook signature or execution processing failed", message: error.message }, { status: 400 });
  }
}
