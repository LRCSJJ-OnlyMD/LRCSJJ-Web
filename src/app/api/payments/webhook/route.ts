// API Route: Stripe Webhook Handler
// POST /api/payments/webhook

import { NextRequest, NextResponse } from "next/server";
import { StripePaymentService } from "@/lib/stripe-payment";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        {
          success: false,
          error: "Signature Stripe manquante",
        },
        { status: 400 }
      );
    }

    // Handle Stripe webhook
    const result = await StripePaymentService.handleWebhook(body, signature);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 400 }
      );
    }

    // Process the webhook event
    if (result.event) {
      switch (result.event.type) {
        case "checkout.session.completed":
          // Handle successful payment
          const session = result.event.data.object as Stripe.Checkout.Session;
          console.log("✅ Payment completed for session:", session.id);

          // Here you would typically:
          // 1. Update database to mark insurance as paid
          // 2. Send confirmation email
          // 3. Generate insurance certificate
          // 4. Update athlete status

          break;

        case "payment_intent.succeeded":
          // Handle successful payment intent
          const paymentIntent = result.event.data
            .object as Stripe.PaymentIntent;
          console.log("✅ Payment intent succeeded:", paymentIntent.id);
          break;

        case "checkout.session.expired":
          // Handle expired session
          const expiredSession = result.event.data
            .object as Stripe.Checkout.Session;
          console.log("⏰ Payment session expired:", expiredSession.id);
          break;

        default:
          console.log(`ℹ️ Unhandled event type: ${result.event.type}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur lors du traitement du webhook",
      },
      { status: 500 }
    );
  }
}
