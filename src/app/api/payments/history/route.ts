// API Route: Get Payment History
// GET /api/payments/history

import { NextRequest, NextResponse } from 'next/server'
import { StripePaymentService } from '@/lib/stripe-payment'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const athleteId = searchParams.get('athlete_id')

    if (!athleteId) {
      return NextResponse.json({
        success: false,
        error: 'ID de l\'athlète manquant'
      }, { status: 400 })
    }

    // Get payment history from Stripe
    const result = await StripePaymentService.getAthletePaymentHistory(athleteId)

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error,
        payments: []
      }, { status: 500 })
    }

    // Return payment history
    return NextResponse.json({
      success: true,
      payments: result.payments
    })

  } catch (error) {
    console.error('Payment history API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur lors de la récupération de l\'historique',
      payments: []
    }, { status: 500 })
  }
}
