// Payment Gateway Integration for Morocco
// Supporting CMI (Centre Monétique Interbancaire) and Cash Plus

export interface PaymentRequest {
  amount: number;
  currency: string;
  orderId: string;
  customerEmail?: string;
  customerPhone?: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  paymentCode?: string;
  transactionId?: string;
  error?: string;
  expiresAt?: Date;
}

export class CMIPaymentGateway {
  private static readonly CMI_ENDPOINT =
    process.env.CMI_PAYMENT_URL ||
    "https://test-payment.cmi.co.ma/fim/est3Dgate";
  private static readonly MERCHANT_ID =
    process.env.CMI_MERCHANT_ID || "TEST_MERCHANT";
  private static readonly ACCESS_KEY = process.env.CMI_ACCESS_KEY || "TEST_KEY";
  private static readonly SECRET_KEY =
    process.env.CMI_SECRET_KEY || "TEST_SECRET";

  static async createPayment(
    request: PaymentRequest
  ): Promise<PaymentResponse> {
    try {
      // CMI requires specific parameters
      const cmiParams = {
        // Basic payment information
        amount: (request.amount * 100).toString(), // CMI expects amount in centimes
        currency: request.currency,
        orderId: request.orderId,

        // Merchant information
        clientid: this.MERCHANT_ID,
        shopurl: request.returnUrl,
        okUrl: request.returnUrl,
        failUrl: request.cancelUrl,

        // Transaction details
        trantype: "PreAuth", // or 'Sale' for immediate capture
        instalment: "",
        rnd: Math.random().toString(),

        // Customer information (optional)
        email: request.customerEmail || "",
        tel: request.customerPhone || "",

        // Description
        BillToName: request.description,

        // Language and encoding
        lang: "fr",
        encoding: "UTF-8",

        // Hash will be calculated
        HASH: "",
      };

      // Calculate HASH (simplified - in production use proper HMAC-SHA1)
      const hashString = `${cmiParams.amount}|${cmiParams.currency}|${cmiParams.orderId}|${cmiParams.clientid}|${cmiParams.rnd}|${this.SECRET_KEY}`;
      cmiParams.HASH = btoa(hashString); // Basic encoding - use proper crypto in production

      // In a real implementation, you would make an HTTP request to CMI
      // For now, we'll simulate the response
      const paymentUrl = `${this.CMI_ENDPOINT}?${new URLSearchParams(
        cmiParams
      ).toString()}`;

      return {
        success: true,
        paymentUrl: paymentUrl,
        transactionId: `CMI_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes expiry
      };
    } catch (error) {
      return {
        success: false,
        error: `CMI Payment Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  static async verifyPayment(
    transactionId: string,
    hash: string
  ): Promise<boolean> {
    try {
      // In production, verify the payment with CMI
      // This would involve checking the hash and confirming the payment status

      // Simulate verification
      return hash.length > 0 && transactionId.startsWith("CMI_");
    } catch (error) {
      console.error("CMI verification error:", error);
      return false;
    }
  }

  static generatePaymentForm(request: PaymentRequest): string {
    // Generate HTML form for CMI payment
    const cmiParams = {
      amount: (request.amount * 100).toString(),
      currency: request.currency,
      orderId: request.orderId,
      clientid: this.MERCHANT_ID,
      shopurl: request.returnUrl,
      okUrl: request.returnUrl,
      failUrl: request.cancelUrl,
      trantype: "PreAuth",
      instalment: "",
      rnd: Math.random().toString(),
      email: request.customerEmail || "",
      tel: request.customerPhone || "",
      BillToName: request.description,
      lang: "fr",
      encoding: "UTF-8",
    };

    const hashString = `${cmiParams.amount}|${cmiParams.currency}|${cmiParams.orderId}|${cmiParams.clientid}|${cmiParams.rnd}|${this.SECRET_KEY}`;
    const hash = btoa(hashString);

    return `
      <form id="cmi-payment-form" action="${
        this.CMI_ENDPOINT
      }" method="POST" target="_blank">
        ${Object.entries({ ...cmiParams, HASH: hash })
          .map(
            ([key, value]) =>
              `<input type="hidden" name="${key}" value="${value}" />`
          )
          .join("")}
        <button type="submit" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Payer avec CMI (${request.amount} MAD)
        </button>
      </form>
    `;
  }
}

export class CashPlusPaymentGateway {
  private static readonly CASHPLUS_API_URL =
    process.env.CASHPLUS_API_URL || "https://test-api.cashplus.ma";
  private static readonly MERCHANT_ID =
    process.env.CASHPLUS_MERCHANT_ID || "TEST_MERCHANT_CP";
  private static readonly API_KEY =
    process.env.CASHPLUS_API_KEY || "TEST_API_KEY";
  private static readonly SECRET_KEY =
    process.env.CASHPLUS_SECRET_KEY || "TEST_SECRET_CP";

  // Legacy method - kept for future Cash Plus integration
  static async createPaymentCode(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _request: PaymentRequest
  ): Promise<PaymentResponse> {
    try {
      // Cash Plus generates a payment code that users can use at agents
      // In production, prepare payment data for Cash Plus API
      /*
      const paymentDetails = {
        merchant_id: this.MERCHANT_ID,
        amount: request.amount,
        currency: request.currency,
        order_id: request.orderId,
        description: request.description,
        customer_phone: request.customerPhone,
        customer_email: request.customerEmail,
        validity_period: 24, // hours
      };
      */

      // In production, make actual API call to Cash Plus
      // const response = await fetch(`${this.CASHPLUS_API_URL}/payment/create`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${this.API_KEY}` },
      //   body: JSON.stringify(paymentDetails)
      // })

      // For now, simulate the response
      const paymentCode = this.generatePaymentCode();

      return {
        success: true,
        paymentCode: paymentCode,
        transactionId: `CP_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours expiry
      };
    } catch (error) {
      return {
        success: false,
        error: `Cash Plus Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  private static generatePaymentCode(): string {
    // Generate a Cash Plus style payment code (8 digits)
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }

  // Legacy method - kept for future implementation
  static async checkPaymentStatus(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _transactionId: string
  ): Promise<{
    status: "PENDING" | "PAID" | "EXPIRED" | "FAILED";
    paidAt?: Date;
  }> {
    try {
      // In production, check payment status with Cash Plus API
      // const response = await fetch(`${this.CASHPLUS_API_URL}/payment/status/${transactionId}`, {
      //   headers: { 'Authorization': `Bearer ${this.API_KEY}` }
      // })

      // For now, simulate random status based on transaction ID
      const statuses = ["PENDING", "PAID", "EXPIRED", "FAILED"] as const;
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];

      return {
        status: randomStatus,
        paidAt: randomStatus === "PAID" ? new Date() : undefined,
      };
    } catch (error) {
      console.error("Cash Plus status check error:", error);
      return { status: "FAILED" };
    }
  }

  static generateInstructions(paymentCode: string, amount: number): string {
    return `
      <div class="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h3 class="font-bold text-lg mb-4 text-amber-800">Instructions de paiement Cash Plus</h3>
        
        <div class="bg-white border border-amber-300 rounded p-4 mb-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-amber-600 mb-2">Code de paiement</div>
            <div class="text-4xl font-mono font-bold text-gray-800 tracking-wider">${paymentCode}</div>
            <div class="text-lg font-semibold text-gray-600 mt-2">${amount} MAD</div>
          </div>
        </div>
        
        <div class="space-y-3 text-sm">
          <div class="flex items-start space-x-2">
            <span class="bg-amber-100 text-amber-800 rounded-full px-2 py-1 text-xs font-semibold">1</span>
            <span>Rendez-vous chez un agent Cash Plus proche de chez vous</span>
          </div>
          <div class="flex items-start space-x-2">
            <span class="bg-amber-100 text-amber-800 rounded-full px-2 py-1 text-xs font-semibold">2</span>
            <span>Communiquez le code de paiement: <strong>${paymentCode}</strong></span>
          </div>
          <div class="flex items-start space-x-2">
            <span class="bg-amber-100 text-amber-800 rounded-full px-2 py-1 text-xs font-semibold">3</span>
            <span>Payez le montant de <strong>${amount} MAD</strong></span>
          </div>
          <div class="flex items-start space-x-2">
            <span class="bg-amber-100 text-amber-800 rounded-full px-2 py-1 text-xs font-semibold">4</span>
            <span>Votre paiement sera confirmé automatiquement</span>
          </div>
        </div>
        
        <div class="mt-4 p-3 bg-amber-100 rounded text-amber-800 text-xs">
          <strong>Important:</strong> Ce code expire dans 24 heures. 
          Gardez votre reçu jusqu'à confirmation du paiement.
        </div>
      </div>
    `;
  }
}

// Unified payment service
export class PaymentService {
  static async initiatePayment(
    method: "CMI" | "CASH_PLUS",
    request: PaymentRequest
  ): Promise<PaymentResponse> {
    switch (method) {
      case "CMI":
        return CMIPaymentGateway.createPayment(request);
      case "CASH_PLUS":
        return CashPlusPaymentGateway.createPaymentCode(request);
      default:
        return {
          success: false,
          error: "Méthode de paiement non supportée",
        };
    }
  }

  static async verifyPayment(
    method: "CMI" | "CASH_PLUS",
    transactionId: string,
    hash?: string
  ): Promise<boolean> {
    switch (method) {
      case "CMI":
        return CMIPaymentGateway.verifyPayment(transactionId, hash || "");
      case "CASH_PLUS":
        const status = await CashPlusPaymentGateway.checkPaymentStatus(
          transactionId
        );
        return status.status === "PAID";
      default:
        return false;
    }
  }

  static generatePaymentInstructions(
    method: "CMI" | "CASH_PLUS",
    paymentData: { code?: string; amount: number; url?: string }
  ): string {
    switch (method) {
      case "CMI":
        return `
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 class="font-bold text-lg mb-4 text-blue-800">Paiement par Carte Bancaire (CMI)</h3>
            <p class="mb-4">Cliquez sur le bouton ci-dessous pour accéder au portail de paiement sécurisé.</p>
            <a href="${paymentData.url}" target="_blank" 
               class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block">
              Payer ${paymentData.amount} MAD
            </a>
            <div class="mt-4 text-sm text-blue-600">
              <strong>Sécurisé par CMI</strong> - Cartes Visa, Mastercard acceptées
            </div>
          </div>
        `;
      case "CASH_PLUS":
        return CashPlusPaymentGateway.generateInstructions(
          paymentData.code || "",
          paymentData.amount
        );
      default:
        return '<div class="text-red-500">Méthode de paiement non supportée</div>';
    }
  }
}

// Utility functions for easy integration
export const createPaymentRequest = (
  amount: number,
  description: string,
  orderId: string,
  customerInfo?: { email?: string; phone?: string }
): PaymentRequest => ({
  amount,
  currency: "MAD",
  orderId,
  description,
  customerEmail: customerInfo?.email,
  customerPhone: customerInfo?.phone,
  returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
  cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
});

export const formatPaymentAmount = (amount: number): string => {
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: "MAD",
    minimumFractionDigits: 2,
  }).format(amount);
};
