// API Route: Check Insurance Status
// GET /api/payments/insurance-status

import { NextRequest, NextResponse } from 'next/server'
import { StripePaymentService } from '@/lib/stripe-payment'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const athleteId = searchParams.get('athlete_id')
    const seasonId = searchParams.get('season_id')

    if (!athleteId || !seasonId) {
      return NextResponse.json({
        success: false,
        error: 'ID de l\'athlète et de la saison requis'
      }, { status: 400 })
    }

    // Check insurance status with Stripe
    const result = await StripePaymentService.checkInsuranceStatus(athleteId, seasonId)

    // Return insurance status
    return NextResponse.json({
      success: true,
      hasPaid: result.hasPaid,
      paymentDate: result.paymentDate?.toISOString(),
      expiryDate: result.expiryDate?.toISOString(),
      paymentId: result.paymentId
    })

  } catch (error) {
    console.error('Insurance status API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Erreur serveur lors de la vérification de l\'assurance',
      hasPaid: false
    }, { status: 500 })
  }
}
