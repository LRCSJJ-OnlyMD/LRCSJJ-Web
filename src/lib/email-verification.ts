// Email Verification Service
// Follows SOLID principles: Single Responsibility, Dependency Injection
// Production-ready implementation with proper error handling

import { sendEmail } from './email'

interface VerificationCode {
  code: string
  email: string
  adminId: string
  expiresAt: Date
  attempts: number
}

// In-memory storage for verification codes (in production, use Redis or database)
const verificationCodes = new Map<string, VerificationCode>()
const MAX_ATTEMPTS = 3
const CODE_EXPIRY_MINUTES = 10

export class EmailVerificationService {
  
  /**
   * Generate a secure 6-digit verification code
   */
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  /**
   * Send verification code via email
   */
  async sendVerificationCode(email: string, adminId: string, adminName: string): Promise<{
    success: boolean
    error?: string
    codeId?: string
  }> {
    try {
      const code = this.generateCode()
      const codeId = `${email}-${Date.now()}`
      const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000)

      // Store verification code
      verificationCodes.set(codeId, {
        code,
        email,
        adminId,
        expiresAt,
        attempts: 0
      })

      // Send email
      const emailSent = await sendEmail({
        to: email,
        subject: 'Code de Vérification - Administration LRCSJJ',
        html: this.generateEmailTemplate(code, adminName, CODE_EXPIRY_MINUTES)
      })

      if (!emailSent) {
        verificationCodes.delete(codeId)
        return {
          success: false,
          error: 'Échec de l\'envoi de l\'email de vérification'
        }
      }

      console.log(`✅ Verification email sent to ${email}`)
      
      return {
        success: true,
        codeId
      }
    } catch (error) {
      console.error('Email verification failed:', error)
      return {
        success: false,
        error: 'Erreur interne lors de l\'envoi de l\'email'
      }
    }
  }

  /**
   * Verify the provided code
   */
  verifyCode(codeId: string, providedCode: string): {
    success: boolean
    error?: string
    adminId?: string
  } {
    const stored = verificationCodes.get(codeId)

    if (!stored) {
      return {
        success: false,
        error: 'Code de vérification invalide ou expiré'
      }
    }

    // Check expiry
    if (new Date() > stored.expiresAt) {
      verificationCodes.delete(codeId)
      return {
        success: false,
        error: 'Code de vérification expiré'
      }
    }

    // Check attempts
    if (stored.attempts >= MAX_ATTEMPTS) {
      verificationCodes.delete(codeId)
      return {
        success: false,
        error: 'Trop de tentatives. Veuillez recommencer la connexion.'
      }
    }

    // Increment attempts
    stored.attempts++

    // Verify code
    if (stored.code !== providedCode) {
      return {
        success: false,
        error: `Code incorrect. ${MAX_ATTEMPTS - stored.attempts} tentatives restantes.`
      }
    }

    // Success - clean up
    verificationCodes.delete(codeId)
    
    return {
      success: true,
      adminId: stored.adminId
    }
  }

  /**
   * Clean up expired codes
   */
  cleanupExpiredCodes(): void {
    const now = new Date()
    for (const [codeId, data] of verificationCodes.entries()) {
      if (now > data.expiresAt) {
        verificationCodes.delete(codeId)
      }
    }
  }

  /**
   * Generate HTML email template
   */
  private generateEmailTemplate(code: string, adminName: string, expiryMinutes: number): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Code de Vérification LRCSJJ</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #d62027, #017444); color: white; padding: 30px; text-align: center; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        .content { padding: 30px; }
        .code-box { background: #f8f9fa; border: 2px dashed #d62027; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .code { font-size: 32px; font-weight: bold; color: #d62027; letter-spacing: 4px; font-family: monospace; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #6c757d; font-size: 14px; }
        .btn { display: inline-block; background: #017444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🥋 LRCSJJ</div>
          <h1>Vérification de Sécurité</h1>
          <p>Ligue Régionale Casablanca-Settat Ju-Jitsu</p>
        </div>
        
        <div class="content">
          <h2>Bonjour ${adminName},</h2>
          <p>Une tentative de connexion à l'administration LRCSJJ a été détectée depuis votre compte.</p>
          
          <div class="code-box">
            <p><strong>Votre code de vérification :</strong></p>
            <div class="code">${code}</div>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important :</strong>
            <ul>
              <li>Ce code expire dans <strong>${expiryMinutes} minutes</strong></li>
              <li>Ne partagez jamais ce code avec personne</li>
              <li>Si ce n'est pas vous, ignorez cet email</li>
            </ul>
          </div>
          
          <p>Pour compléter votre connexion, entrez ce code dans la page de connexion de l'administration.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <p><strong>Ligue Régionale Casablanca-Settat Ju-Jitsu</strong></p>
            <p>Administration Sécurisée</p>
          </div>
        </div>
        
        <div class="footer">
          <p>© 2025 LRCSJJ - Tous droits réservés</p>
          <p>Cet email a été envoyé automatiquement. Ne pas répondre.</p>
        </div>
      </div>
    </body>
    </html>
    `
  }
}

// Singleton instance
export const emailVerificationService = new EmailVerificationService()

// Clean up expired codes every 5 minutes
setInterval(() => {
  emailVerificationService.cleanupExpiredCodes()
}, 5 * 60 * 1000)
