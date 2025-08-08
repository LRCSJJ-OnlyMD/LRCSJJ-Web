// Professional PDF Generator for LRCSJJ
// Generates proper PDF documents for invoices, payment history, and reports

export interface Invoice {
  invoiceNumber: string;
  clubName: string;
  clubAddress: string;
  date: string;
  dueDate: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod?: string;
  paymentCode?: string;
}

export interface PaymentHistory {
  clubName: string;
  period: string;
  payments: {
    date: string;
    athlete: string;
    amount: number;
    type: string;
    status: string;
    paymentMethod?: string;
    transactionId?: string;
  }[];
  summary: {
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
  };
}

export interface AthleteReport {
  clubName: string;
  athletes: {
    name: string;
    belt: string;
    age: number;
    weight: number;
    hasInsurance: boolean;
    insuranceExpiry?: string;
    registrationDate: string;
  }[];
  statistics: {
    totalAthletes: number;
    averageAge: number;
    beltDistribution: Record<string, number>;
    insuredPercentage: number;
  };
}

export class PDFGenerator {
  // Brand colors for consistent styling
  private static readonly BRAND_COLORS = {
    primary: "#d62027",
    secondary: "#017444",
    accent: "#ffffff",
    text: "#333333",
    lightGray: "#f9f9f9",
    mediumGray: "#ddd",
    darkGray: "#666",
  };

  // Generate professional invoice HTML for PDF conversion
  static generateInvoiceHTML(invoice: Invoice): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture ${invoice.invoiceNumber}</title>
    <style>
        @page {
            size: A4;
            margin: 2cm;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            line-height: 1.6;
            color: ${this.BRAND_COLORS.text};
            font-size: 12px;
        }
        .container {
            max-width: 100%;
            margin: 0 auto;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid ${this.BRAND_COLORS.primary};
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo-section {
            flex: 1;
        }
        .logo {
            color: ${this.BRAND_COLORS.primary};
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .subtitle {
            color: ${this.BRAND_COLORS.secondary};
            font-size: 14px;
            font-weight: 600;
        }
        .invoice-title {
            flex: 1;
            text-align: right;
        }
        .invoice-title h1 {
            color: ${this.BRAND_COLORS.primary};
            font-size: 24px;
            margin-bottom: 10px;
        }
        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            gap: 40px;
        }
        .bill-to, .invoice-info {
            flex: 1;
            padding: 20px;
            background-color: ${this.BRAND_COLORS.lightGray};
            border-radius: 8px;
        }
        .bill-to h3, .invoice-info h3 {
            color: ${this.BRAND_COLORS.primary};
            border-bottom: 2px solid ${this.BRAND_COLORS.mediumGray};
            padding-bottom: 8px;
            margin-bottom: 15px;
            font-size: 16px;
        }
        .bill-to p, .invoice-info p {
            margin: 8px 0;
            font-size: 14px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .items-table th {
            background: linear-gradient(135deg, ${this.BRAND_COLORS.primary}, ${
      this.BRAND_COLORS.secondary
    });
            color: white;
            padding: 15px 10px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
        }
        .items-table td {
            padding: 12px 10px;
            border-bottom: 1px solid ${this.BRAND_COLORS.mediumGray};
            font-size: 13px;
        }
        .items-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        .total-row {
            background-color: ${this.BRAND_COLORS.lightGray};
            font-weight: bold;
        }
        .total-row.final {
            background: linear-gradient(135deg, ${
              this.BRAND_COLORS.primary
            }15, ${this.BRAND_COLORS.secondary}15);
            color: ${this.BRAND_COLORS.primary};
            font-size: 16px;
        }
        .payment-info {
            background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
            border: 2px solid ${this.BRAND_COLORS.secondary};
            border-radius: 12px;
            padding: 25px;
            margin: 30px 0;
        }
        .payment-info h3 {
            color: ${this.BRAND_COLORS.secondary};
            margin-bottom: 15px;
            font-size: 18px;
        }
        .payment-info p {
            margin: 10px 0;
            font-size: 14px;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            padding-top: 30px;
            border-top: 2px solid ${this.BRAND_COLORS.mediumGray};
        }
        .footer-logo {
            color: ${this.BRAND_COLORS.primary};
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .footer p {
            color: ${this.BRAND_COLORS.darkGray};
            font-size: 12px;
            margin: 5px 0;
        }
        .contact-info {
            margin-top: 15px;
            padding: 15px;
            background-color: ${this.BRAND_COLORS.lightGray};
            border-radius: 8px;
        }
        @media print {
            .no-print { display: none; }
            body { -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-section">
                <div class="logo">LRCSJJ</div>
                <div class="subtitle">Ligue Régionale de Ju-Jitsu</div>
                <div class="subtitle">Casablanca-Settat</div>
            </div>
            <div class="invoice-title">
                <h1>FACTURE</h1>
                <p style="font-size: 16px; color: ${
                  this.BRAND_COLORS.secondary
                };">N° ${invoice.invoiceNumber}</p>
            </div>
        </div>

        <div class="invoice-details">
            <div class="bill-to">
                <h3>📍 Facturé à</h3>
                <p><strong>${invoice.clubName}</strong></p>
                <p>${invoice.clubAddress}</p>
            </div>
            <div class="invoice-info">
                <h3>📅 Détails de facturation</h3>
                <p><strong>Date d'émission:</strong> ${invoice.date}</p>
                <p><strong>Date d'échéance:</strong> ${invoice.dueDate}</p>
                <p><strong>Statut:</strong> <span style="color: ${
                  this.BRAND_COLORS.secondary
                };">En attente</span></p>
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th style="width: 50%">Description</th>
                    <th style="width: 15%; text-align: center">Quantité</th>
                    <th style="width: 20%; text-align: right">Prix unitaire (MAD)</th>
                    <th style="width: 15%; text-align: right">Total (MAD)</th>
                </tr>
            </thead>
            <tbody>
                ${invoice.items
                  .map(
                    (item) => `
                    <tr>
                        <td>${item.description}</td>
                        <td style="text-align: center">${item.quantity}</td>
                        <td style="text-align: right">${item.unitPrice.toFixed(
                          2
                        )}</td>
                        <td style="text-align: right; font-weight: 600">${item.total.toFixed(
                          2
                        )}</td>
                    </tr>
                `
                  )
                  .join("")}
                <tr class="total-row">
                    <td colspan="3" style="text-align: right; padding-right: 20px">
                        <strong>Sous-total:</strong>
                    </td>
                    <td style="text-align: right; font-weight: bold">
                        ${invoice.subtotal.toFixed(2)} MAD
                    </td>
                </tr>
                <tr class="total-row">
                    <td colspan="3" style="text-align: right; padding-right: 20px">
                        <strong>TVA (20%):</strong>
                    </td>
                    <td style="text-align: right; font-weight: bold">
                        ${invoice.tax.toFixed(2)} MAD
                    </td>
                </tr>
                <tr class="total-row final">
                    <td colspan="3" style="text-align: right; padding-right: 20px; font-size: 18px">
                        <strong>TOTAL À PAYER:</strong>
                    </td>
                    <td style="text-align: right; font-weight: bold; font-size: 18px">
                        ${invoice.total.toFixed(2)} MAD
                    </td>
                </tr>
            </tbody>
        </table>

        ${
          invoice.paymentMethod
            ? `
            <div class="payment-info">
                <h3>💳 Informations de paiement</h3>
                <p><strong>Méthode de paiement:</strong> ${
                  invoice.paymentMethod
                }</p>
                ${
                  invoice.paymentCode
                    ? `<p><strong>Référence de paiement:</strong> <code style="background: white; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${invoice.paymentCode}</code></p>`
                    : ""
                }
                <p style="color: ${
                  this.BRAND_COLORS.secondary
                }; font-weight: 600; margin-top: 15px;">
                    ⏰ Paiement à effectuer avant le ${invoice.dueDate}
                </p>
            </div>
        `
            : ""
        }

        <div class="footer">
            <div class="footer-logo">LRCSJJ</div>
            <p><strong>Excellence • Discipline • Tradition Martiale</strong></p>
            
            <div class="contact-info">
                <p><strong>📧 Email:</strong> contact@lrcsjj.ma</p>
                <p><strong>📞 Téléphone:</strong> +212 522 XXX XXX</p>
                <p><strong>🌐 Site web:</strong> www.lrcsjj.ma</p>
                <p><strong>📍 Siège:</strong> Complexe Sportif Mohammed V, Casablanca</p>
            </div>
            
            <p style="margin-top: 20px; font-size: 11px; color: ${
              this.BRAND_COLORS.darkGray
            };">
                Document généré automatiquement le ${new Date().toLocaleDateString(
                  "fr-FR"
                )} à ${new Date().toLocaleTimeString("fr-FR")}
            </p>
        </div>
    </div>
</body>
</html>`.trim();
  }

  // Generate professional payment history HTML for PDF conversion
  static generatePaymentHistoryHTML(history: PaymentHistory): string {
    const statusStyles = {
      PAID: `color: ${this.BRAND_COLORS.secondary}; background: ${this.BRAND_COLORS.secondary}20; padding: 4px 8px; border-radius: 4px; font-weight: 600;`,
      PENDING: `color: #f59e0b; background: #f59e0b20; padding: 4px 8px; border-radius: 4px; font-weight: 600;`,
      OVERDUE: `color: ${this.BRAND_COLORS.primary}; background: ${this.BRAND_COLORS.primary}20; padding: 4px 8px; border-radius: 4px; font-weight: 600;`,
      EXPIRED: `color: #dc2626; background: #dc262620; padding: 4px 8px; border-radius: 4px; font-weight: 600;`,
    };

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historique des Paiements - ${history.clubName}</title>
    <style>
        @page {
            size: A4;
            margin: 1.5cm;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            line-height: 1.5;
            color: ${this.BRAND_COLORS.text};
            font-size: 11px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid ${this.BRAND_COLORS.primary};
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo-section h1 {
            color: ${this.BRAND_COLORS.primary};
            font-size: 24px;
            margin-bottom: 5px;
        }
        .logo-section p {
            color: ${this.BRAND_COLORS.secondary};
            font-size: 12px;
        }
        .report-info {
            text-align: right;
        }
        .report-info h2 {
            color: ${this.BRAND_COLORS.primary};
            font-size: 20px;
            margin-bottom: 5px;
        }
        .club-info {
            background: linear-gradient(135deg, ${
              this.BRAND_COLORS.primary
            }15, ${this.BRAND_COLORS.secondary}15);
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
            border-left: 5px solid ${this.BRAND_COLORS.primary};
        }
        .club-info h3 {
            color: ${this.BRAND_COLORS.primary};
            margin-bottom: 10px;
            font-size: 18px;
        }
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin: 30px 0;
        }
        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border-top: 4px solid;
        }
        .summary-card.paid {
            border-top-color: ${this.BRAND_COLORS.secondary};
        }
        .summary-card.pending {
            border-top-color: #f59e0b;
        }
        .summary-card.overdue {
            border-top-color: ${this.BRAND_COLORS.primary};
        }
        .summary-card h4 {
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 10px;
            color: ${this.BRAND_COLORS.darkGray};
        }
        .summary-card .amount {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .summary-card.paid .amount {
            color: ${this.BRAND_COLORS.secondary};
        }
        .summary-card.pending .amount {
            color: #f59e0b;
        }
        .summary-card.overdue .amount {
            color: ${this.BRAND_COLORS.primary};
        }
        .payments-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        .payments-table th {
            background: linear-gradient(135deg, ${this.BRAND_COLORS.primary}, ${
      this.BRAND_COLORS.secondary
    });
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
            font-size: 11px;
        }
        .payments-table td {
            padding: 10px 8px;
            border-bottom: 1px solid ${this.BRAND_COLORS.mediumGray};
            font-size: 10px;
        }
        .payments-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        .payments-table tr:hover {
            background-color: #e9ecef;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            padding-top: 20px;
            border-top: 2px solid ${this.BRAND_COLORS.mediumGray};
            font-size: 10px;
            color: ${this.BRAND_COLORS.darkGray};
        }
        @media print {
            .no-print { display: none; }
            body { -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-section">
            <h1>LRCSJJ</h1>
            <p>Ligue Régionale de Ju-Jitsu Casablanca-Settat</p>
        </div>
        <div class="report-info">
            <h2>RAPPORT DE PAIEMENTS</h2>
            <p>Période: <strong>${history.period}</strong></p>
            <p>Généré le: <strong>${new Date().toLocaleDateString(
              "fr-FR"
            )}</strong></p>
        </div>
    </div>

    <div class="club-info">
        <h3>📊 ${history.clubName}</h3>
        <p><strong>Période d'analyse:</strong> ${history.period}</p>
        <p><strong>Total des transactions:</strong> ${
          history.payments.length
        }</p>
    </div>

    <div class="summary-grid">
        <div class="summary-card paid">
            <h4>💰 Total Payé</h4>
            <div class="amount">${history.summary.totalPaid.toFixed(
              2
            )} MAD</div>
            <p>${Math.round(
              (history.summary.totalPaid /
                (history.summary.totalPaid +
                  history.summary.totalPending +
                  history.summary.totalOverdue)) *
                100
            )}% du total</p>
        </div>
        <div class="summary-card pending">
            <h4>⏳ En Attente</h4>
            <div class="amount">${history.summary.totalPending.toFixed(
              2
            )} MAD</div>
            <p>${Math.round(
              (history.summary.totalPending /
                (history.summary.totalPaid +
                  history.summary.totalPending +
                  history.summary.totalOverdue)) *
                100
            )}% du total</p>
        </div>
        <div class="summary-card overdue">
            <h4>⚠️ En Retard</h4>
            <div class="amount">${history.summary.totalOverdue.toFixed(
              2
            )} MAD</div>
            <p>${Math.round(
              (history.summary.totalOverdue /
                (history.summary.totalPaid +
                  history.summary.totalPending +
                  history.summary.totalOverdue)) *
                100
            )}% du total</p>
        </div>
    </div>

    <table class="payments-table">
        <thead>
            <tr>
                <th style="width: 12%">Date</th>
                <th style="width: 25%">Athlète</th>
                <th style="width: 15%">Type</th>
                <th style="width: 12%">Montant</th>
                <th style="width: 12%">Statut</th>
                <th style="width: 12%">Méthode</th>
                <th style="width: 12%">Réf. Transaction</th>
            </tr>
        </thead>
        <tbody>
            ${history.payments
              .map(
                (payment) => `
                <tr>
                    <td>${new Date(payment.date).toLocaleDateString(
                      "fr-FR"
                    )}</td>
                    <td><strong>${payment.athlete}</strong></td>
                    <td>${payment.type}</td>
                    <td style="text-align: right; font-weight: 600;">${payment.amount.toFixed(
                      2
                    )} MAD</td>
                    <td><span style="${
                      statusStyles[
                        payment.status as keyof typeof statusStyles
                      ] || statusStyles.PENDING
                    }">${payment.status}</span></td>
                    <td>${payment.paymentMethod || "-"}</td>
                    <td style="font-family: monospace; font-size: 9px;">${
                      payment.transactionId
                        ? payment.transactionId.substring(0, 12) + "..."
                        : "-"
                    }</td>
                </tr>
            `
              )
              .join("")}
        </tbody>
    </table>

    <div class="footer">
        <p><strong>LRCSJJ - Excellence, Discipline et Tradition Martiale</strong></p>
        <p>📧 contact@lrcsjj.ma | 📞 +212 522 XXX XXX | 🌐 www.lrcsjj.ma</p>
        <p>Document confidentiel généré automatiquement - ${new Date().toLocaleString(
          "fr-FR"
        )}</p>
    </div>
</body>
</html>`.trim();
  }

  // Generate professional athlete report HTML for PDF conversion
  static generateAthleteReportHTML(report: AthleteReport): string {
    const beltColors = {
      Blanche: "#ffffff",
      Jaune: "#fbbf24",
      Orange: "#f97316",
      Verte: "#22c55e",
      Bleue: "#3b82f6",
      Marron: "#8b4513",
      Noire: "#000000",
    };

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport des Athlètes - ${report.clubName}</title>
    <style>
        @page {
            size: A4;
            margin: 1.5cm;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            line-height: 1.5;
            color: ${this.BRAND_COLORS.text};
            font-size: 11px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid ${this.BRAND_COLORS.primary};
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo-section h1 {
            color: ${this.BRAND_COLORS.primary};
            font-size: 24px;
            margin-bottom: 5px;
        }
        .logo-section p {
            color: ${this.BRAND_COLORS.secondary};
            font-size: 12px;
        }
        .report-info {
            text-align: right;
        }
        .report-info h2 {
            color: ${this.BRAND_COLORS.primary};
            font-size: 20px;
            margin-bottom: 5px;
        }
        .club-banner {
            background: linear-gradient(135deg, ${this.BRAND_COLORS.primary}, ${
      this.BRAND_COLORS.secondary
    });
            color: white;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 30px;
            text-align: center;
        }
        .club-banner h3 {
            font-size: 22px;
            margin-bottom: 10px;
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin: 30px 0;
        }
        .stat-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border-top: 4px solid;
        }
        .stat-card:nth-child(1) { border-top-color: ${
          this.BRAND_COLORS.primary
        }; }
        .stat-card:nth-child(2) { border-top-color: ${
          this.BRAND_COLORS.secondary
        }; }
        .stat-card:nth-child(3) { border-top-color: #f59e0b; }
        .stat-card:nth-child(4) { border-top-color: #8b5cf6; }
        .stat-card h4 {
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 10px;
            color: ${this.BRAND_COLORS.darkGray};
        }
        .stat-card .number {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
            color: ${this.BRAND_COLORS.primary};
        }
        .athletes-table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        .athletes-table th {
            background: linear-gradient(135deg, ${this.BRAND_COLORS.primary}, ${
      this.BRAND_COLORS.secondary
    });
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
            font-size: 11px;
        }
        .athletes-table td {
            padding: 10px 8px;
            border-bottom: 1px solid ${this.BRAND_COLORS.mediumGray};
            font-size: 10px;
        }
        .athletes-table tr:nth-child(even) {
            background-color: #f8f9fa;
        }
        .athletes-table tr:hover {
            background-color: #e9ecef;
        }
        .belt-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 9px;
            text-align: center;
            min-width: 60px;
            border: 1px solid #ddd;
        }
        .insurance-status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 9px;
        }
        .insurance-yes {
            background: ${this.BRAND_COLORS.secondary}20;
            color: ${this.BRAND_COLORS.secondary};
            border: 1px solid ${this.BRAND_COLORS.secondary};
        }
        .insurance-no {
            background: ${this.BRAND_COLORS.primary}20;
            color: ${this.BRAND_COLORS.primary};
            border: 1px solid ${this.BRAND_COLORS.primary};
        }
        .belt-distribution {
            background: ${this.BRAND_COLORS.lightGray};
            padding: 20px;
            border-radius: 12px;
            margin: 30px 0;
        }
        .belt-distribution h4 {
            color: ${this.BRAND_COLORS.primary};
            margin-bottom: 15px;
            font-size: 16px;
        }
        .belt-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
        }
        .belt-stat {
            text-align: center;
            padding: 10px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            padding-top: 20px;
            border-top: 2px solid ${this.BRAND_COLORS.mediumGray};
            font-size: 10px;
            color: ${this.BRAND_COLORS.darkGray};
        }
        @media print {
            .no-print { display: none; }
            body { -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-section">
            <h1>LRCSJJ</h1>
            <p>Ligue Régionale de Ju-Jitsu Casablanca-Settat</p>
        </div>
        <div class="report-info">
            <h2>RAPPORT DES ATHLÈTES</h2>
            <p>Généré le: <strong>${new Date().toLocaleDateString(
              "fr-FR"
            )}</strong></p>
        </div>
    </div>

    <div class="club-banner">
        <h3>🥋 ${report.clubName}</h3>
        <p>Rapport complet des athlètes et statistiques du club</p>
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <h4>👥 Total Athlètes</h4>
            <div class="number">${report.statistics.totalAthletes}</div>
            <p>Membres actifs</p>
        </div>
        <div class="stat-card">
            <h4>📊 Âge Moyen</h4>
            <div class="number">${report.statistics.averageAge.toFixed(1)}</div>
            <p>Années</p>
        </div>
        <div class="stat-card">
            <h4>🛡️ Assurance</h4>
            <div class="number">${report.statistics.insuredPercentage.toFixed(
              1
            )}%</div>
            <p>Taux de couverture</p>
        </div>
        <div class="stat-card">
            <h4>🥋 Niveaux</h4>
            <div class="number">${
              Object.keys(report.statistics.beltDistribution).length
            }</div>
            <p>Ceintures différentes</p>
        </div>
    </div>

    <div class="belt-distribution">
        <h4>📈 Répartition par Ceintures</h4>
        <div class="belt-stats">
            ${Object.entries(report.statistics.beltDistribution)
              .map(
                ([belt, count]) => `
                <div class="belt-stat">
                    <div class="belt-badge" style="background: ${
                      beltColors[belt as keyof typeof beltColors] || "#e5e7eb"
                    }; color: ${
                  belt === "Blanche"
                    ? "#000"
                    : belt === "Noire"
                    ? "#fff"
                    : "#000"
                }; border-color: ${
                  beltColors[belt as keyof typeof beltColors] || "#d1d5db"
                };">
                        ${belt}
                    </div>
                    <div style="font-weight: bold; margin-top: 8px; color: ${
                      this.BRAND_COLORS.primary
                    };">${count}</div>
                    <div style="font-size: 9px; color: ${
                      this.BRAND_COLORS.darkGray
                    };">${(
                  (count / report.statistics.totalAthletes) *
                  100
                ).toFixed(1)}%</div>
                </div>
            `
              )
              .join("")}
        </div>
    </div>

    <table class="athletes-table">
        <thead>
            <tr>
                <th style="width: 20%">Nom Complet</th>
                <th style="width: 12%">Ceinture</th>
                <th style="width: 8%">Âge</th>
                <th style="width: 10%">Poids (kg)</th>
                <th style="width: 12%">Assurance</th>
                <th style="width: 15%">Expiration</th>
                <th style="width: 23%">Date d'Inscription</th>
            </tr>
        </thead>
        <tbody>
            ${report.athletes
              .map(
                (athlete) => `
                <tr>
                    <td><strong>${athlete.name}</strong></td>
                    <td>
                        <span class="belt-badge" style="background: ${
                          beltColors[athlete.belt as keyof typeof beltColors] ||
                          "#e5e7eb"
                        }; color: ${
                  athlete.belt === "Blanche"
                    ? "#000"
                    : athlete.belt === "Noire"
                    ? "#fff"
                    : "#000"
                };">
                            ${athlete.belt}
                        </span>
                    </td>
                    <td style="text-align: center;">${athlete.age}</td>
                    <td style="text-align: center;">${athlete.weight}</td>
                    <td>
                        <span class="insurance-status ${
                          athlete.hasInsurance
                            ? "insurance-yes"
                            : "insurance-no"
                        }">
                            ${athlete.hasInsurance ? "✓ Oui" : "✗ Non"}
                        </span>
                    </td>
                    <td style="text-align: center;">${
                      athlete.insuranceExpiry || "-"
                    }</td>
                    <td style="text-align: center;">${new Date(
                      athlete.registrationDate
                    ).toLocaleDateString("fr-FR")}</td>
                </tr>
            `
              )
              .join("")}
        </tbody>
    </table>

    <div class="footer">
        <p><strong>LRCSJJ - Excellence, Discipline et Tradition Martiale</strong></p>
        <p>📧 contact@lrcsjj.ma | 📞 +212 522 XXX XXX | 🌐 www.lrcsjj.ma</p>
        <p>Document confidentiel généré automatiquement - ${new Date().toLocaleString(
          "fr-FR"
        )}</p>
    </div>
</body>
</html>`.trim();
  }

  // Enhanced PDF generation methods

  // Generate and print document as PDF (user can save as PDF from print dialog)
  static async printToPDF(content: string, title: string): Promise<void> {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) {
      throw new Error(
        "Impossible d'ouvrir la fenêtre d'impression. Vérifiez que les pop-ups sont autorisés."
      );
    }

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.document.title = title;

    // Wait for content to load then trigger print
    printWindow.addEventListener("load", () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();

        // Close window after printing
        printWindow.addEventListener("afterprint", () => {
          printWindow.close();
        });
      }, 500);
    });
  }

  // Download as HTML file (backup method)
  static downloadHTML(content: string, filename: string): void {
    try {
      const blob = new Blob([content], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = filename.replace(".pdf", ".html");
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Erreur lors du téléchargement:", error);
      throw new Error("Erreur lors du téléchargement du fichier");
    }
  }

  // Main invoice generation methods
  static async downloadInvoice(invoice: Invoice): Promise<void> {
    try {
      const content = this.generateInvoiceHTML(invoice);

      // Try to print as PDF first
      await this.printToPDF(content, `Facture ${invoice.invoiceNumber}`);
    } catch (error) {
      console.error("Erreur génération PDF:", error);
      // Fallback to HTML download
      const content = this.generateInvoiceHTML(invoice);
      const filename = `LRCSJJ_Facture_${invoice.invoiceNumber}_${
        new Date().toISOString().split("T")[0]
      }.html`;
      this.downloadHTML(content, filename);
    }
  }

  static async printInvoice(invoice: Invoice): Promise<void> {
    const content = this.generateInvoiceHTML(invoice);
    await this.printToPDF(content, `Facture ${invoice.invoiceNumber}`);
  }

  static async downloadPaymentHistory(history: PaymentHistory): Promise<void> {
    try {
      const content = this.generatePaymentHistoryHTML(history);

      await this.printToPDF(
        content,
        `Historique des Paiements - ${history.clubName}`
      );
    } catch (error) {
      console.error("Erreur génération PDF:", error);
      const content = this.generatePaymentHistoryHTML(history);
      const filename = `LRCSJJ_Historique_${history.clubName.replace(
        /\s+/g,
        "_"
      )}_${history.period.replace(/\s+/g, "_")}.html`;
      this.downloadHTML(content, filename);
    }
  }

  static async downloadAthleteReport(report: AthleteReport): Promise<void> {
    try {
      const content = this.generateAthleteReportHTML(report);

      await this.printToPDF(
        content,
        `Rapport des Athlètes - ${report.clubName}`
      );
    } catch (error) {
      console.error("Erreur génération PDF:", error);
      const content = this.generateAthleteReportHTML(report);
      const filename = `LRCSJJ_Rapport_Athletes_${report.clubName.replace(
        /\s+/g,
        "_"
      )}_${new Date().toISOString().split("T")[0]}.html`;
      this.downloadHTML(content, filename);
    }
  }

  // Enhanced CSV export with proper formatting
  static exportPaymentHistoryCSV(history: PaymentHistory): void {
    try {
      const headers = [
        "Date",
        "Athlète",
        "Type de paiement",
        "Montant (MAD)",
        "Statut",
        "Méthode de paiement",
        "ID Transaction",
        "Club",
      ];

      const csvRows = [
        headers.join(","),
        // Add summary row
        "",
        `RÉSUMÉ FINANCIER - ${history.clubName}`,
        `Période,${history.period}`,
        `Total payé,${history.summary.totalPaid.toFixed(2)} MAD`,
        `Total en attente,${history.summary.totalPending.toFixed(2)} MAD`,
        `Total en retard,${history.summary.totalOverdue.toFixed(2)} MAD`,
        `Total général,${(
          history.summary.totalPaid +
          history.summary.totalPending +
          history.summary.totalOverdue
        ).toFixed(2)} MAD`,
        "",
        "DÉTAIL DES TRANSACTIONS",
        headers.join(","),
        ...history.payments.map((payment) =>
          [
            new Date(payment.date).toLocaleDateString("fr-FR"),
            `"${payment.athlete}"`,
            payment.type,
            payment.amount.toFixed(2),
            payment.status,
            payment.paymentMethod || "Non spécifié",
            payment.transactionId || "N/A",
            history.clubName,
          ].join(",")
        ),
      ];

      const csvContent = csvRows.join("\n");
      const BOM = "\uFEFF"; // UTF-8 BOM for proper Excel encoding
      const blob = new Blob([BOM + csvContent], {
        type: "text/csv;charset=utf-8",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `LRCSJJ_Paiements_${history.clubName.replace(
        /\s+/g,
        "_"
      )}_${history.period.replace(/\s+/g, "_")}.csv`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Erreur export CSV:", error);
      throw new Error("Erreur lors de l'export CSV");
    }
  }

  // Export athlete data as CSV
  static exportAthleteReportCSV(report: AthleteReport): void {
    try {
      const headers = [
        "Nom complet",
        "Ceinture",
        "Âge",
        "Poids (kg)",
        "Assurance active",
        "Date expiration assurance",
        "Date d'inscription",
        "Club",
      ];

      const csvRows = [
        headers.join(","),
        // Add summary
        "",
        `STATISTIQUES - ${report.clubName}`,
        `Total athlètes,${report.statistics.totalAthletes}`,
        `Âge moyen,${report.statistics.averageAge.toFixed(1)} ans`,
        `Taux d'assurance,${report.statistics.insuredPercentage.toFixed(1)}%`,
        "",
        "RÉPARTITION DES CEINTURES",
        ...Object.entries(report.statistics.beltDistribution).map(
          ([belt, count]) =>
            `${belt},${count} athlètes (${(
              (count / report.statistics.totalAthletes) *
              100
            ).toFixed(1)}%)`
        ),
        "",
        "LISTE DES ATHLÈTES",
        headers.join(","),
        ...report.athletes.map((athlete) =>
          [
            `"${athlete.name}"`,
            athlete.belt,
            athlete.age,
            athlete.weight,
            athlete.hasInsurance ? "Oui" : "Non",
            athlete.insuranceExpiry || "N/A",
            new Date(athlete.registrationDate).toLocaleDateString("fr-FR"),
            report.clubName,
          ].join(",")
        ),
      ];

      const csvContent = csvRows.join("\n");
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csvContent], {
        type: "text/csv;charset=utf-8",
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `LRCSJJ_Athletes_${report.clubName.replace(
        /\s+/g,
        "_"
      )}_${new Date().toISOString().split("T")[0]}.csv`;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Erreur export CSV:", error);
      throw new Error("Erreur lors de l'export CSV des athlètes");
    }
  }

  // Utility method to check if browser supports PDF generation
  static checkPDFSupport(): boolean {
    return typeof window !== "undefined" && "print" in window;
  }
}
