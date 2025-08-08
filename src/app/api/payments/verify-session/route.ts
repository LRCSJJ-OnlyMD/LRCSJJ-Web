// API Route: Verify Stripe Payment Session
// GET /api/payments/verify-session

import { NextRequest, NextResponse } from "next/server";
import { StripePaymentService } from "@/lib/stripe-payment";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: "ID de session manquant",
        },
        { status: 400 }
      );
    }

    // Verify payment session with Stripe
    const result = await StripePaymentService.verifyPaymentSession(sessionId);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          paymentStatus: result.paymentStatus,
        },
        { status: 500 }
      );
    }

    // Return session verification result
    return NextResponse.json({
      success: true,
      paymentStatus: result.paymentStatus,
      session: {
        id: result.session?.id,
        status: result.session?.status,
        payment_status: result.session?.payment_status,
        amount_total: result.session?.amount_total,
        currency: result.session?.currency,
        customer_details: result.session?.customer_details,
        metadata: result.session?.metadata,
      },
    });
  } catch (error) {
    console.error("Verify session API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur lors de la vérification de la session",
        paymentStatus: "failed",
      },
      { status: 500 }
    );
  }
}
