// API Route: Create Stripe Checkout Session
// POST /api/payments/create-session

import { NextRequest, NextResponse } from "next/server";
import {
  StripePaymentService,
  type InsurancePaymentRequest,
} from "@/lib/stripe-payment";

export async function POST(request: NextRequest) {
  try {
    console.log("Create session API called"); // Debug log

    const body = await request.json();
    console.log("Request body:", body); // Debug log

    // Validate required fields
    const {
      athleteId,
      athleteName,
      clubId,
      clubName,
      seasonId,
      seasonYear,
      customerEmail,
      customerPhone,
    } = body;

    if (
      !athleteId ||
      !athleteName ||
      !clubId ||
      !clubName ||
      !seasonId ||
      !seasonYear
    ) {
      console.log("Missing required fields"); // Debug log
      return NextResponse.json(
        {
          success: false,
          error: "Informations manquantes pour créer la session de paiement",
        },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY not found in environment variables");
      return NextResponse.json(
        {
          success: false,
          error: "Configuration Stripe manquante",
        },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.error("NEXT_PUBLIC_APP_URL not found in environment variables");
      return NextResponse.json(
        {
          success: false,
          error: "Configuration URL manquante",
        },
        { status: 500 }
      );
    }

    // Create payment request
    const paymentRequest: InsurancePaymentRequest = {
      athleteId,
      athleteName,
      clubId,
      clubName,
      seasonId,
      seasonYear,
      customerEmail,
      customerPhone,
    };

    console.log("Creating Stripe session for:", paymentRequest); // Debug log

    // Create Stripe checkout session
    const result = await StripePaymentService.createInsurancePaymentSession(
      paymentRequest
    );

    console.log("Stripe session result:", result); // Debug log

    if (!result.success) {
      console.error("Stripe session creation failed:", result.error);
      return NextResponse.json(
        {
          success: false,
          error:
            result.error || "Erreur lors de la création de la session Stripe",
        },
        { status: 500 }
      );
    }

    if (!result.sessionId || !result.paymentUrl) {
      console.error("Missing session ID or payment URL in result");
      return NextResponse.json(
        {
          success: false,
          error: "Session Stripe invalide",
        },
        { status: 500 }
      );
    }

    // Return session details
    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
      paymentUrl: result.paymentUrl,
      sessionData: result.sessionData,
    });
  } catch (error) {
    console.error("Create session API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur lors de la création de la session",
      },
      { status: 500 }
    );
  }
}
