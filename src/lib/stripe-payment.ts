// Stripe Payment Integration for LRCSJJ
// Yearly Insurance Payment: 150 MAD per athlete per season

import Stripe from 'stripe'

// Initialize Stripe server-side
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export interface InsurancePaymentRequest {
  athleteId: string
  athleteName: string
  clubId: string
  clubName: string
  seasonId: string
  seasonYear: string
  customerEmail?: string
  customerPhone?: string
  metadata?: Record<string, string>
}

export interface StripePaymentResponse {
  success: boolean
  sessionId?: string
  paymentUrl?: string
  error?: string
  sessionData?: {
    id: string
    url: string
    expiresAt: number
  }
}

export class StripePaymentService {
  // Annual insurance amount in MAD (150 Dirhams)
  private static readonly ANNUAL_INSURANCE_AMOUNT = 150
  private static readonly CURRENCY = 'mad' // Moroccan Dirham
  
  // Stripe configuration
  private static readonly SUCCESS_URL = `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`
  private static readonly CANCEL_URL = `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`

  /**
   * Create Stripe Checkout Session for yearly insurance payment
   */
  static async createInsurancePaymentSession(
    request: InsurancePaymentRequest
  ): Promise<StripePaymentResponse> {
    try {
      // Create a unique order ID for this insurance payment
      const orderId = `INS_${request.seasonYear}_${request.athleteId}_${Date.now()}`

      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        
        // Line items (the insurance product)
        line_items: [
          {
            price_data: {
              currency: this.CURRENCY,
              product_data: {
                name: `Assurance Ju-Jitsu - Saison ${request.seasonYear}`,
                description: `Assurance annuelle pour ${request.athleteName} (${request.clubName})`,
                images: [`${process.env.NEXT_PUBLIC_APP_URL}/logos/league/league-main.png`],
                metadata: {
                  type: 'insurance',
                  athlete_id: request.athleteId,
                  club_id: request.clubId,
                  season_id: request.seasonId
                }
              },
              unit_amount: this.ANNUAL_INSURANCE_AMOUNT * 100, // Stripe expects amount in smallest currency unit (centimes for MAD)
            },
            quantity: 1,
          },
        ],

        // Customer information
        customer_email: request.customerEmail,
        
        // Session configuration
        expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // 30 minutes expiry
        
        // URLs
        success_url: this.SUCCESS_URL,
        cancel_url: this.CANCEL_URL,
        
        // Metadata for tracking
        metadata: {
          order_id: orderId,
          athlete_id: request.athleteId,
          athlete_name: request.athleteName,
          club_id: request.clubId,
          club_name: request.clubName,
          season_id: request.seasonId,
          season_year: request.seasonYear,
          payment_type: 'annual_insurance',
          ...request.metadata
        },

        // Payment configuration
        payment_intent_data: {
          description: `Assurance Ju-Jitsu ${request.seasonYear} - ${request.athleteName}`,
          metadata: {
            order_id: orderId,
            athlete_id: request.athleteId,
            season_id: request.seasonId,
            payment_type: 'annual_insurance'
          }
        },

        // Additional configuration
        billing_address_collection: 'auto',
        shipping_address_collection: {
          allowed_countries: ['MA'] // Morocco only
        },

        // Custom text and branding
        custom_text: {
          submit: {
            message: 'Votre assurance sera activée immédiatement après le paiement.'
          }
        }
      })

      return {
        success: true,
        sessionId: session.id,
        paymentUrl: session.url || '',
        sessionData: {
          id: session.id,
          url: session.url || '',
          expiresAt: session.expires_at || 0
        }
      }

    } catch (error) {
      console.error('Stripe payment session creation error:', error)
      return {
        success: false,
        error: `Erreur de création de session de paiement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      }
    }
  }

  /**
   * Verify and retrieve payment session details
   */
  static async verifyPaymentSession(sessionId: string): Promise<{
    success: boolean
    session?: Stripe.Checkout.Session
    paymentStatus: 'pending' | 'completed' | 'failed' | 'expired'
    error?: string
  }> {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['payment_intent', 'customer']
      })

      let paymentStatus: 'pending' | 'completed' | 'failed' | 'expired' = 'pending'

      if (session.payment_status === 'paid') {
        paymentStatus = 'completed'
      } else if (session.payment_status === 'unpaid' && session.status === 'expired') {
        paymentStatus = 'expired'
      } else if (session.payment_status === 'unpaid' && session.status === 'complete') {
        paymentStatus = 'failed'
      }

      return {
        success: true,
        session,
        paymentStatus
      }

    } catch (error) {
      console.error('Stripe session verification error:', error)
      return {
        success: false,
        paymentStatus: 'failed',
        error: `Erreur de vérification: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      }
    }
  }

  /**
   * Get payment history for an athlete
   */
  static async getAthletePaymentHistory(athleteId: string): Promise<{
    success: boolean
    payments: Array<{
      id: string
      amount: number
      currency: string
      status: string
      created: number
      seasonYear: string
      description: string
    }>
    error?: string
  }> {
    try {
      // Search for payment intents related to this athlete
      const paymentIntents = await stripe.paymentIntents.search({
        query: `metadata['athlete_id']:'${athleteId}' AND metadata['payment_type']:'annual_insurance'`,
        limit: 100
      })

      const payments = paymentIntents.data.map(intent => ({
        id: intent.id,
        amount: intent.amount / 100, // Convert back to MAD
        currency: intent.currency.toUpperCase(),
        status: intent.status,
        created: intent.created,
        seasonYear: intent.metadata.season_year || 'Unknown',
        description: intent.description || `Assurance Ju-Jitsu ${intent.metadata.season_year}`
      }))

      return {
        success: true,
        payments
      }

    } catch (error) {
      console.error('Stripe payment history error:', error)
      return {
        success: false,
        payments: [],
        error: `Erreur de récupération de l'historique: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      }
    }
  }

  /**
   * Create webhook endpoint handler for Stripe events
   */
  static async handleWebhook(
    body: string,
    signature: string
  ): Promise<{
    success: boolean
    event?: Stripe.Event
    error?: string
  }> {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
      const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed':
          const session = event.data.object as Stripe.Checkout.Session
          console.log('Payment successful for session:', session.id)
          // Here you would update your database to mark the insurance as paid
          break

        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object as Stripe.PaymentIntent
          console.log('Payment intent succeeded:', paymentIntent.id)
          // Additional handling if needed
          break

        case 'checkout.session.expired':
          const expiredSession = event.data.object as Stripe.Checkout.Session
          console.log('Payment session expired:', expiredSession.id)
          // Handle expired sessions
          break

        default:
          console.log(`Unhandled event type: ${event.type}`)
      }

      return {
        success: true,
        event
      }

    } catch (error) {
      console.error('Stripe webhook error:', error)
      return {
        success: false,
        error: `Webhook error: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      }
    }
  }

  /**
   * Format payment amount in MAD
   */
  static formatAmount(amount: number): string {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  /**
   * Get annual insurance amount
   */
  static getAnnualInsuranceAmount(): number {
    return this.ANNUAL_INSURANCE_AMOUNT
  }

  /**
   * Check if athlete has paid insurance for current season
   */
  static async checkInsuranceStatus(athleteId: string, seasonId: string): Promise<{
    hasPaid: boolean
    paymentDate?: Date
    expiryDate?: Date
    paymentId?: string
  }> {
    try {
      // Search for successful payments for this athlete and season
      const paymentIntents = await stripe.paymentIntents.search({
        query: `metadata['athlete_id']:'${athleteId}' AND metadata['season_id']:'${seasonId}' AND metadata['payment_type']:'annual_insurance' AND status:'succeeded'`,
        limit: 1
      })

      if (paymentIntents.data.length > 0) {
        const payment = paymentIntents.data[0]
        const paymentDate = new Date(payment.created * 1000)
        const expiryDate = new Date(paymentDate)
        expiryDate.setFullYear(expiryDate.getFullYear() + 1) // Insurance valid for 1 year

        return {
          hasPaid: true,
          paymentDate,
          expiryDate,
          paymentId: payment.id
        }
      }

      return { hasPaid: false }

    } catch (error) {
      console.error('Insurance status check error:', error)
      return { hasPaid: false }
    }
  }
}

// Utility functions
export const createInsurancePaymentRequest = (
  athleteId: string,
  athleteName: string,
  clubId: string,
  clubName: string,
  seasonId: string,
  seasonYear: string,
  customerEmail?: string,
  customerPhone?: string
): InsurancePaymentRequest => ({
  athleteId,
  athleteName,
  clubId,
  clubName,
  seasonId,
  seasonYear,
  customerEmail,
  customerPhone
})

export const STRIPE_CONFIG = {
  ANNUAL_INSURANCE_AMOUNT: 150,
  CURRENCY: 'MAD',
  PAYMENT_DESCRIPTION: 'Assurance Annuelle Ju-Jitsu',
  SESSION_EXPIRY_MINUTES: 30
}
