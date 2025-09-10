import { logger } from "./logger";
import { createTransport } from "nodemailer";

// Email configuration
const transporter = createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  reference: string;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const mailOptions = {
      from: options.from || process.env.SMTP_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info("Email sent successfully", {
      feature: "email",
      action: "send_success",
      messageId: result.messageId,
    });
    return true;
  } catch (error) {
    logger.error("Email sending failed", {
      feature: "email",
      action: "send_error",
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

export async function sendContactNotificationEmail(data: ContactEmailData) {
  try {
    // Email to admin
    const adminMailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `[LRCSJJ] Nouveau message de contact: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #d62027, #017444); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Nouveau Message de Contact</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Ligue Régionale Casablanca-Settat Ju-Jitsu</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef;">
            <h2 style="color: #d62027; margin-top: 0;">Détails du Message</h2>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #d62027;">
              <p><strong>Nom:</strong> ${data.name}</p>
              <p><strong>Email:</strong> <a href="mailto:${
                data.email
              }" style="color: #d62027;">${data.email}</a></p>
              <p><strong>Sujet:</strong> ${data.subject}</p>
              <p><strong>Date:</strong> ${new Date(
                data.timestamp
              ).toLocaleString("fr-FR")}</p>
              <p><strong>Référence:</strong> ${data.reference}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #017444;">
              <h3 style="color: #017444; margin-top: 0;">Message:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${
                data.message
              }</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 8px;">
              <p style="margin: 0; font-size: 14px; color: #1565c0;">
                <strong>Action requise:</strong> Répondez à ce message en contactant directement ${
                  data.name
                } à l'adresse ${data.email}
              </p>
            </div>
          </div>
          
          <div style="background: #343a40; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center;">
            <p style="margin: 0; font-size: 12px;">
              © 2025 LRCSJJ - Ligue Régionale Casablanca-Settat Ju-Jitsu<br>
              Système automatique - Ne pas répondre à cet email
            </p>
          </div>
        </div>
      `,
    };

    // Confirmation email to user
    const userMailOptions = {
      from: process.env.SMTP_FROM,
      to: data.email,
      subject: "Confirmation de réception - LRCSJJ",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #d62027, #017444); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Message Reçu avec Succès</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Ligue Régionale Casablanca-Settat Ju-Jitsu</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef;">
            <p>Bonjour <strong>${data.name}</strong>,</p>
            
            <p>Nous avons bien reçu votre message concernant "<strong>${
              data.subject
            }</strong>" et nous vous remercions pour votre intérêt.</p>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #017444;">
              <h3 style="color: #017444; margin-top: 0;">Votre message:</h3>
              <p style="white-space: pre-wrap; line-height: 1.6; color: #666;">${
                data.message
              }</p>
            </div>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #155724;">
                <strong>✓ Référence de votre demande:</strong> ${
                  data.reference
                }<br>
                <strong>✓ Date de réception:</strong> ${new Date(
                  data.timestamp
                ).toLocaleString("fr-FR")}
              </p>
            </div>
            
            <p>Notre équipe reviendra vers vous dans les plus brefs délais, généralement sous 24-48h.</p>
            
            <div style="margin: 20px 0; padding: 15px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px;">
              <p style="margin: 0; color: #856404;">
                <strong>Besoin d'aide urgente?</strong><br>
                Téléphone: <a href="tel:+212522123456" style="color: #d62027;">+212 522 123 456</a><br>
                Email: <a href="mailto:contact@lrcsjj.ma" style="color: #d62027;">contact@lrcsjj.ma</a>
              </p>
            </div>
            
            <p>Cordialement,<br>
            <strong>L'équipe LRCSJJ</strong></p>
          </div>
          
          <div style="background: #343a40; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center;">
            <p style="margin: 0; font-size: 12px;">
              © 2025 LRCSJJ - Ligue Régionale Casablanca-Settat Ju-Jitsu<br>
              Complexe Sportif Mohammed V, Avenue Hassan II, Casablanca
            </p>
          </div>
        </div>
      `,
    };

    // Send both emails
    const adminResult = await transporter.sendMail(adminMailOptions);
    const userResult = await transporter.sendMail(userMailOptions);

    logger.info("Contact form emails sent successfully", {
      feature: "contact",
      action: "emails_sent",
      adminMessageId: adminResult.messageId,
      userMessageId: userResult.messageId,
    });

    return {
      success: true,
      adminMessageId: adminResult.messageId,
      userMessageId: userResult.messageId,
    };
  } catch (error) {
    logger.error("Contact form email sending failed", {
      feature: "contact",
      action: "email_error",
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

export async function sendClubManagerWelcomeEmail(
  email: string,
  name: string,
  clubName: string,
  temporaryPassword: string
): Promise<boolean> {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Bienvenue - Accès Gestionnaire de Club LRCSJJ",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #d62027, #017444); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Bienvenue dans l'Espace Gestionnaire</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Ligue Régionale Casablanca-Settat Ju-Jitsu</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef;">
            <p>Bonjour <strong>${name}</strong>,</p>
            
            <p>Félicitations ! Vous avez été désigné(e) comme gestionnaire du club <strong>${clubName}</strong> dans notre système de gestion LRCSJJ.</p>
            
            <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #155724; margin-top: 0;">🔑 Vos Identifiants de Connexion</h3>
              <p style="margin: 0; color: #155724;">
                <strong>Email:</strong> ${email}<br>
                <strong>Mot de passe temporaire:</strong> <code style="background: #f8f9fa; padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #d62027;">${temporaryPassword}</code>
              </p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;">
                <strong>⚠️ Important:</strong> Vous devez changer ce mot de passe lors de votre première connexion pour des raisons de sécurité.
              </p>
            </div>
            
            <div style="text-align: center; margin: 25px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/club-manager/login" 
                 style="background: #d62027; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Se Connecter à l'Espace Gestionnaire
              </a>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #017444;">
              <h3 style="color: #017444; margin-top: 0;">🏆 Vos Responsabilités</h3>
              <ul style="color: #666; line-height: 1.6;">
                <li>Gestion des athlètes de votre club</li>
                <li>Suivi des assurances et licences</li>
                <li>Gestion des équipes et inscriptions aux championnats</li>
                <li>Suivi des paiements et facturation</li>
                <li>Communication avec la ligue</li>
              </ul>
            </div>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #1565c0;">
                <strong>💡 Besoin d'aide?</strong><br>
                Notre équipe support est disponible pour vous accompagner dans la prise en main de votre espace gestionnaire.
              </p>
            </div>
            
            <p>Nous vous souhaitons une excellente gestion et restons à votre disposition pour toute question.</p>
            
            <p>Cordialement,<br>
            <strong>L'équipe LRCSJJ</strong></p>
          </div>
          
          <div style="background: #343a40; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center;">
            <p style="margin: 0; font-size: 12px;">
              © 2025 LRCSJJ - Ligue Régionale Casablanca-Settat Ju-Jitsu<br>
              Complexe Sportif Mohammed V, Avenue Hassan II, Casablanca<br>
              Email: <a href="mailto:contact@lrcsjj.ma" style="color: #fff;">contact@lrcsjj.ma</a> | Tél: +212 522 123 456
            </p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info("Club manager welcome email sent", {
      feature: "email",
      action: "welcome_email_sent",
      messageId: result.messageId,
    });
    return true;
  } catch (error) {
    logger.error("Club manager welcome email failed", {
      feature: "email",
      action: "welcome_email_error",
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

export async function testEmailConnection() {
  try {
    await transporter.verify();
    logger.info("Email configuration verified successfully", {
      feature: "email",
      action: "config_verified",
    });
    return true;
  } catch (error) {
    logger.error("Email configuration verification failed", {
      feature: "email",
      action: "config_error",
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

export async function sendAdminNotificationEmail({
  type,
  title,
  message,
  clubName,
  clubManagerName,
  metadata,
}: {
  type: string;
  title: string;
  message: string;
  clubName: string;
  clubManagerName: string;
  metadata?: Record<string, unknown>;
}): Promise<boolean> {
  try {
    // Get the appropriate icon and color based on notification type
    const getNotificationStyles = (type: string) => {
      switch (type) {
        case "ATHLETE_ADDED":
          return { icon: "👤", color: "#22c55e", label: "Nouvel Athlète" };
        case "ATHLETE_UPDATED":
          return {
            icon: "✏️",
            color: "#3b82f6",
            label: "Modification Athlète",
          };
        case "ATHLETE_DELETED":
          return { icon: "🗑️", color: "#ef4444", label: "Suppression Athlète" };
        case "INSURANCE_UPDATED":
          return { icon: "🛡️", color: "#8b5cf6", label: "Assurance Modifiée" };
        case "PAYMENT_MADE":
          return { icon: "💳", color: "#059669", label: "Paiement Effectué" };
        default:
          return { icon: "📢", color: "#6b7280", label: "Notification" };
      }
    };

    const styles = getNotificationStyles(type);

    const mailOptions = {
      from: `"LRCSJJ - Admin" <${process.env.SMTP_FROM}>`,
      to: process.env.ADMIN_EMAIL || "admin@lrcsjj.ma",
      subject: `[LRCSJJ] ${styles.label} - ${clubName}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #d62027 0%, #b91c23 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">
              LRCSJJ - Administration
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">
              Notification Système
            </p>
          </div>

          <!-- Content -->
          <div style="padding: 30px 20px; background: #ffffff;">
            <!-- Notification Type Badge -->
            <div style="text-align: center; margin-bottom: 20px;">
              <span style="background: ${
                styles.color
              }; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600;">
                ${styles.icon} ${styles.label}
              </span>
            </div>

            <!-- Main Message -->
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid ${
              styles.color
            }; margin-bottom: 25px;">
              <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 18px;">${title}</h2>
              <p style="color: #4b5563; margin: 0; line-height: 1.6; font-size: 16px;">${message}</p>
            </div>

            <!-- Club Information -->
            <div style="background: #ffffff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">
                📍 Informations du Club
              </h3>
              <div style="display: grid; gap: 10px;">
                <div>
                  <span style="color: #6b7280; font-size: 14px;">Club:</span>
                  <span style="color: #1f2937; font-weight: 600; margin-left: 10px;">${clubName}</span>
                </div>
                <div>
                  <span style="color: #6b7280; font-size: 14px;">Gestionnaire:</span>
                  <span style="color: #1f2937; font-weight: 600; margin-left: 10px;">${clubManagerName}</span>
                </div>
                <div>
                  <span style="color: #6b7280; font-size: 14px;">Date:</span>
                  <span style="color: #1f2937; font-weight: 600; margin-left: 10px;">${new Date().toLocaleString(
                    "fr-FR"
                  )}</span>
                </div>
              </div>
            </div>

            ${
              metadata && Object.keys(metadata).length > 0
                ? `
            <!-- Additional Details -->
            <div style="background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h4 style="color: #92400e; margin: 0 0 10px 0; font-size: 14px; font-weight: 600;">
                📋 Détails Supplémentaires
              </h4>
              <div style="color: #78350f; font-size: 14px; line-height: 1.5;">
                ${Object.entries(metadata)
                  .map(
                    ([key, value]) =>
                      `<div><strong>${key}:</strong> ${value}</div>`
                  )
                  .join("")}
              </div>
            </div>
            `
                : ""
            }

            <!-- Action Button -->
            <div style="text-align: center; margin: 25px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" 
                 style="background: #d62027; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block; transition: all 0.3s ease;">
                🔗 Accéder au Tableau de Bord
              </a>
            </div>

            <!-- Note -->
            <div style="background: #eff6ff; border: 1px solid #3b82f6; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.5;">
                <strong>💡 Information:</strong> Cette notification a été générée automatiquement par le système LRCSJJ. 
                Vous pouvez consulter tous les détails dans votre tableau de bord administrateur.
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">
              © 2025 LRCSJJ - Ligue Régionale Casablanca-Settat de Ju-Jitsu<br>
              Email: <a href="mailto:admin@lrcsjj.ma" style="color: #60a5fa;">admin@lrcsjj.ma</a> | Tél: +212 522 123 456
            </p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info("Admin notification email sent", {
      feature: "email",
      action: "admin_notification_sent",
      messageId: result.messageId,
    });
    return true;
  } catch (error) {
    logger.error("Admin notification email failed", {
      feature: "email",
      action: "admin_notification_error",
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}
