// API Route: Create Stripe Checkout Session
// POST /api/payments/create-session

import { NextRequest, NextResponse } from 'next/server'
import { StripePaymentService, type InsurancePaymentRequest } from '@/lib/stripe-payment'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const {
      athleteId,
      athleteName,
      clubId,
      clubName,
      seasonId,
      seasonYear,
      customerEmail,
      customerPhone
    } = body

    if (!athleteId || !athleteName || !clubId || !clubName || !seasonId || !seasonYear) {
      return NextResponse.json({
        success: false,
        error: 'Informations manquantes pour créer la session de paiement'
      }, { status: 400 })
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
      customerPhone
    }

    // Create Stripe checkout session
    const result = await StripePaymentService.createInsurancePaymentSession(paymentRequest)

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 })
    }

    // Return session details
    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
      paymentUrl: result.paymentUrl,
      sessionData: result.sessionData
    })

  } catch (error) {
    console.error('Create session API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur lors de la création de la session'
    }, { status: 500 })
  }
}
