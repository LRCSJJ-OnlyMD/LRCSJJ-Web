// Client-side Stripe integration for LRCSJJ
// Handles checkout redirection and payment status

import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe client-side
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export interface ClientPaymentRequest {
  athleteId: string;
  athleteName: string;
  clubId: string;
  clubName: string;
  seasonId: string;
  seasonYear: string;
  customerEmail?: string;
  customerPhone?: string;
}

export class StripeClientService {
  /**
   * Redirect to Stripe Checkout for insurance payment
   */
  static async redirectToCheckout(
    paymentRequest: ClientPaymentRequest
  ): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      console.log("Starting checkout process for:", paymentRequest); // Debug log

      // Validate request first
      const validation = this.validatePaymentRequest(paymentRequest);
      if (!validation.isValid) {
        console.error("Validation failed:", validation.errors); // Debug log
        return {
          success: false,
          error: validation.errors.join(", "),
        };
      }

      console.log("Calling create-session API..."); // Debug log

      // Create payment session on server
      const response = await fetch("/api/payments/create-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentRequest),
      });

      console.log("API Response status:", response.status); // Debug log

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error response:", errorText); // Debug log
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorText}`
        );
      }

      const data = await response.json();
      console.log("API Response data:", data); // Debug log

      if (!data.success || !data.sessionId) {
        console.error("API returned error:", data.error); // Debug log
        return {
          success: false,
          error:
            data.error ||
            "Erreur lors de la création de la session de paiement",
        };
      }

      console.log("Loading Stripe..."); // Debug log

      // Get Stripe instance
      const stripe = await stripePromise;
      if (!stripe) {
        console.error("Failed to load Stripe"); // Debug log
        return {
          success: false,
          error: "Erreur de chargement de Stripe",
        };
      }

      console.log(
        "Redirecting to Stripe checkout with session ID:",
        data.sessionId
      ); // Debug log

      // Option 1: Use direct URL redirect (more reliable for VS Code browser)
      if (data.paymentUrl) {
        console.log("Using direct URL redirect to:", data.paymentUrl); // Debug log
        window.location.href = data.paymentUrl;
        return { success: true };
      }

      // Option 2: Fallback to Stripe SDK redirect
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        console.error("Stripe checkout error:", error); // Debug log
        return {
          success: false,
          error: error.message || "Erreur de redirection vers le paiement",
        };
      }

      console.log("Successfully initiated Stripe checkout"); // Debug log
      return { success: true };
    } catch (error) {
      console.error("Stripe checkout error:", error);
      return {
        success: false,
        error: "Erreur lors de la redirection vers le paiement",
      };
    }
  }

  /**
   * Check payment status after return from Stripe
   */
  static async checkPaymentStatus(sessionId: string): Promise<{
    success: boolean;
    status: "pending" | "completed" | "failed" | "expired";
    session?: Record<string, unknown>;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `/api/payments/verify-session?session_id=${sessionId}`
      );
      const data = await response.json();

      return {
        success: data.success,
        status: data.paymentStatus,
        session: data.session,
        error: data.error,
      };
    } catch (error) {
      console.error("Payment status check error:", error);
      return {
        success: false,
        status: "failed",
        error: "Erreur lors de la vérification du statut de paiement",
      };
    }
  }

  /**
   * Get payment history for an athlete
   */
  static async getPaymentHistory(athleteId: string): Promise<{
    success: boolean;
    payments: Array<{
      id: string;
      amount: number;
      currency: string;
      status: string;
      date: string;
      seasonYear: string;
      description: string;
    }>;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `/api/payments/history?athlete_id=${athleteId}`
      );
      const data = await response.json();

      if (!data.success) {
        return {
          success: false,
          payments: [],
          error: data.error || "Erreur lors de la récupération de l'historique",
        };
      }

      // Format payment data for display
      const formattedPayments = data.payments.map(
        (payment: {
          id: string;
          amount: number;
          currency: string;
          status: string;
          created: number;
          seasonYear: string;
          description: string;
        }) => ({
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: this.translatePaymentStatus(payment.status),
          date: new Date(payment.created * 1000).toLocaleDateString("fr-FR"),
          seasonYear: payment.seasonYear,
          description: payment.description,
        })
      );

      return {
        success: true,
        payments: formattedPayments,
      };
    } catch (error) {
      console.error("Payment history error:", error);
      return {
        success: false,
        payments: [],
        error: "Erreur lors de la récupération de l'historique des paiements",
      };
    }
  }

  /**
   * Check if athlete has valid insurance for current season
   */
  static async checkInsuranceStatus(
    athleteId: string,
    seasonId: string
  ): Promise<{
    hasValidInsurance: boolean;
    paymentDate?: string;
    expiryDate?: string;
    paymentId?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(
        `/api/payments/insurance-status?athlete_id=${athleteId}&season_id=${seasonId}`
      );
      const data = await response.json();

      if (!data.success) {
        return {
          hasValidInsurance: false,
          error: data.error || "Erreur lors de la vérification de l'assurance",
        };
      }

      return {
        hasValidInsurance: data.hasPaid,
        paymentDate: data.paymentDate
          ? new Date(data.paymentDate).toLocaleDateString("fr-FR")
          : undefined,
        expiryDate: data.expiryDate
          ? new Date(data.expiryDate).toLocaleDateString("fr-FR")
          : undefined,
        paymentId: data.paymentId,
      };
    } catch (error) {
      console.error("Insurance status check error:", error);
      return {
        hasValidInsurance: false,
        error: "Erreur lors de la vérification du statut de l'assurance",
      };
    }
  }

  /**
   * Translate payment status to French
   */
  private static translatePaymentStatus(status: string): string {
    const statusMap: Record<string, string> = {
      succeeded: "Payé",
      pending: "En attente",
      failed: "Échoué",
      canceled: "Annulé",
      requires_payment_method: "Méthode de paiement requise",
      requires_confirmation: "Confirmation requise",
      requires_action: "Action requise",
      processing: "En cours de traitement",
      requires_capture: "Capture requise",
    };

    return statusMap[status] || status;
  }

  /**
   * Format amount in MAD
   */
  static formatAmount(amount: number): string {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 2,
    }).format(amount);
  }

  /**
   * Get insurance amount
   */
  static getInsuranceAmount(): number {
    return 150; // 150 MAD per year
  }

  /**
   * Validate payment session before redirect
   */
  static validatePaymentRequest(request: ClientPaymentRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!request.athleteId) {
      errors.push("ID de l'athlète requis");
    }

    if (!request.athleteName) {
      errors.push("Nom de l'athlète requis");
    }

    if (!request.clubId) {
      errors.push("ID du club requis");
    }

    if (!request.clubName) {
      errors.push("Nom du club requis");
    }

    if (!request.seasonId) {
      errors.push("ID de la saison requis");
    }

    if (!request.seasonYear) {
      errors.push("Année de la saison requise");
    }

    if (request.customerEmail && !this.isValidEmail(request.customerEmail)) {
      errors.push("Adresse email invalide");
    }

    if (request.customerPhone && !this.isValidPhone(request.customerPhone)) {
      errors.push("Numéro de téléphone invalide");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate Moroccan phone number format
   */
  private static isValidPhone(phone: string): boolean {
    // Moroccan phone numbers: +212 followed by 9 digits, or 0 followed by 9 digits
    const phoneRegex = /^(\+212|0)[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ""));
  }
}

// Constants for easy import
export const STRIPE_CONFIG = {
  INSURANCE_AMOUNT: 150,
  CURRENCY: "MAD",
  SESSION_EXPIRY_MINUTES: 30,
  SUPPORTED_PAYMENT_METHODS: ["card"],
  ALLOWED_COUNTRIES: ["MA"],
};

// Payment status types
export type PaymentStatus = "pending" | "completed" | "failed" | "expired";

// Insurance status interface
export interface InsuranceStatus {
  hasValidInsurance: boolean;
  paymentDate?: string;
  expiryDate?: string;
  paymentId?: string;
  daysUntilExpiry?: number;
}
