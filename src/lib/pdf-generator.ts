// PDF Generator utilities
// Simplified version for document generation without external dependencies

export interface Invoice {
  invoiceNumber: string
  clubName: string
  clubAddress: string
  date: string
  dueDate: string
  items: {
    description: string
    quantity: number
    unitPrice: number
    total: number
  }[]
  subtotal: number
  tax: number
  total: number
  paymentMethod?: string
  paymentCode?: string
}

export interface PaymentHistory {
  clubName: string
  period: string
  payments: {
    date: string
    athlete: string
    amount: number
    type: string
    status: string
    paymentMethod?: string
    transactionId?: string
  }[]
  summary: {
    totalPaid: number
    totalPending: number
    totalOverdue: number
  }
}

export interface AthleteReport {
  clubName: string
  athletes: {
    name: string
    belt: string
    age: number
    weight: number
    hasInsurance: boolean
    insuranceExpiry?: string
    registrationDate: string
  }[]
  statistics: {
    totalAthletes: number
    averageAge: number
    beltDistribution: Record<string, number>
    insuredPercentage: number
  }
}

export class PDFGenerator {
  // Generate invoice as HTML content
  static generateInvoiceHTML(invoice: Invoice): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture ${invoice.invoiceNumber}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #d62027; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { color: #d62027; font-size: 24px; font-weight: bold; }
        .subtitle { color: #017444; font-size: 14px; margin-top: 5px; }
        .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .bill-to, .invoice-info { width: 45%; }
        .bill-to h3, .invoice-info h3 { color: #d62027; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #d62027; color: white; }
        .total-row { background-color: #f9f9f9; font-weight: bold; }
        .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
        .payment-info { background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">LRCSJJ</div>
        <div class="subtitle">Ligue Régionale de Ju-Jitsu Casablanca-Settat</div>
        <div class="subtitle">Fédération Royale Marocaine de Ju-Jitsu et Arts Assimilés</div>
    </div>

    <h1>Facture N° ${invoice.invoiceNumber}</h1>

    <div class="invoice-details">
        <div class="bill-to">
            <h3>Facturé à:</h3>
            <p><strong>${invoice.clubName}</strong></p>
            <p>${invoice.clubAddress}</p>
        </div>
        <div class="invoice-info">
            <h3>Détails de la facture:</h3>
            <p><strong>Date:</strong> ${invoice.date}</p>
            <p><strong>Échéance:</strong> ${invoice.dueDate}</p>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th>Quantité</th>
                <th>Prix unitaire (MAD)</th>
                <th>Total (MAD)</th>
            </tr>
        </thead>
        <tbody>
            ${invoice.items.map(item => `
                <tr>
                    <td>${item.description}</td>
                    <td>${item.quantity}</td>
                    <td>${item.unitPrice.toFixed(2)}</td>
                    <td>${item.total.toFixed(2)}</td>
                </tr>
            `).join('')}
            <tr class="total-row">
                <td colspan="3"><strong>Sous-total</strong></td>
                <td><strong>${invoice.subtotal.toFixed(2)} MAD</strong></td>
            </tr>
            <tr class="total-row">
                <td colspan="3"><strong>TVA</strong></td>
                <td><strong>${invoice.tax.toFixed(2)} MAD</strong></td>
            </tr>
            <tr class="total-row">
                <td colspan="3"><strong>TOTAL</strong></td>
                <td><strong>${invoice.total.toFixed(2)} MAD</strong></td>
            </tr>
        </tbody>
    </table>

    ${invoice.paymentMethod ? `
        <div class="payment-info">
            <h3>Informations de paiement:</h3>
            <p><strong>Méthode:</strong> ${invoice.paymentMethod}</p>
            ${invoice.paymentCode ? `<p><strong>Code de paiement:</strong> ${invoice.paymentCode}</p>` : ''}
        </div>
    ` : ''}

    <div class="footer">
        <p>Merci pour votre confiance!</p>
        <p>LRCSJJ - Excellence, Discipline et Tradition Martiale</p>
        <p>Contact: contact@lrcsjj.ma | Tél: +212 522 XXX XXX</p>
    </div>
</body>
</html>
    `.trim()
  }

  // Generate payment history as HTML
  static generatePaymentHistoryHTML(history: PaymentHistory): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historique des Paiements - ${history.clubName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #d62027; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { color: #d62027; font-size: 24px; font-weight: bold; }
        .subtitle { color: #017444; font-size: 14px; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #d62027; color: white; }
        .status-paid { color: #017444; font-weight: bold; }
        .status-pending { color: #ff8c00; font-weight: bold; }
        .status-overdue { color: #d62027; font-weight: bold; }
        .summary { background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .summary-item { display: flex; justify-content: space-between; margin: 10px 0; }
        .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">LRCSJJ</div>
        <div class="subtitle">Ligue Régionale de Ju-Jitsu Casablanca-Settat</div>
    </div>

    <h1>Historique des Paiements</h1>
    <h2>${history.clubName}</h2>
    <p><strong>Période:</strong> ${history.period}</p>

    <div class="summary">
        <h3>Résumé financier:</h3>
        <div class="summary-item">
            <span>Total payé:</span>
            <span><strong>${history.summary.totalPaid.toFixed(2)} MAD</strong></span>
        </div>
        <div class="summary-item">
            <span>Total en attente:</span>
            <span><strong>${history.summary.totalPending.toFixed(2)} MAD</strong></span>
        </div>
        <div class="summary-item">
            <span>Total en retard:</span>
            <span><strong>${history.summary.totalOverdue.toFixed(2)} MAD</strong></span>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Athlète</th>
                <th>Type</th>
                <th>Montant (MAD)</th>
                <th>Statut</th>
                <th>Méthode</th>
                <th>Transaction ID</th>
            </tr>
        </thead>
        <tbody>
            ${history.payments.map(payment => `
                <tr>
                    <td>${payment.date}</td>
                    <td>${payment.athlete}</td>
                    <td>${payment.type}</td>
                    <td>${payment.amount.toFixed(2)}</td>
                    <td class="status-${payment.status.toLowerCase()}">${payment.status}</td>
                    <td>${payment.paymentMethod || '-'}</td>
                    <td>${payment.transactionId || '-'}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="footer">
        <p>Document généré le ${new Date().toLocaleDateString('fr-FR')}</p>
        <p>LRCSJJ - Excellence, Discipline et Tradition Martiale</p>
    </div>
</body>
</html>
    `.trim()
  }

  // Generate athlete report as HTML
  static generateAthleteReportHTML(report: AthleteReport): string {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rapport des Athlètes - ${report.clubName}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; border-bottom: 2px solid #d62027; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { color: #d62027; font-size: 24px; font-weight: bold; }
        .subtitle { color: #017444; font-size: 14px; margin-top: 5px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #d62027; color: white; }
        .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
        .stat-card { background-color: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center; }
        .stat-number { font-size: 24px; font-weight: bold; color: #d62027; }
        .insured-yes { color: #017444; font-weight: bold; }
        .insured-no { color: #d62027; font-weight: bold; }
        .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">LRCSJJ</div>
        <div class="subtitle">Ligue Régionale de Ju-Jitsu Casablanca-Settat</div>
    </div>

    <h1>Rapport des Athlètes</h1>
    <h2>${report.clubName}</h2>

    <div class="stats">
        <div class="stat-card">
            <div class="stat-number">${report.statistics.totalAthletes}</div>
            <div>Total Athlètes</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${report.statistics.averageAge.toFixed(1)}</div>
            <div>Âge Moyen</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${report.statistics.insuredPercentage.toFixed(1)}%</div>
            <div>Taux d'Assurance</div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Nom</th>
                <th>Ceinture</th>
                <th>Âge</th>
                <th>Poids (kg)</th>
                <th>Assuré</th>
                <th>Expiration Assurance</th>
                <th>Date d'Inscription</th>
            </tr>
        </thead>
        <tbody>
            ${report.athletes.map(athlete => `
                <tr>
                    <td>${athlete.name}</td>
                    <td>${athlete.belt}</td>
                    <td>${athlete.age}</td>
                    <td>${athlete.weight}</td>
                    <td class="${athlete.hasInsurance ? 'insured-yes' : 'insured-no'}">
                        ${athlete.hasInsurance ? 'Oui' : 'Non'}
                    </td>
                    <td>${athlete.insuranceExpiry || '-'}</td>
                    <td>${athlete.registrationDate}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="footer">
        <p>Document généré le ${new Date().toLocaleDateString('fr-FR')}</p>
        <p>LRCSJJ - Excellence, Discipline et Tradition Martiale</p>
    </div>
</body>
</html>
    `.trim()
  }

  // Download HTML content as PDF-ready file
  static downloadAsHTML(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename.replace('.pdf', '.html'))
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  // Print HTML content (user can save as PDF)
  static printHTML(content: string): void {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(content)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }

  // Generate and download invoice
  static downloadInvoice(invoice: Invoice): void {
    const content = this.generateInvoiceHTML(invoice)
    const filename = `facture_${invoice.invoiceNumber}_${new Date().toISOString().split('T')[0]}.html`
    this.downloadAsHTML(content, filename)
  }

  // Generate and print invoice
  static printInvoice(invoice: Invoice): void {
    const content = this.generateInvoiceHTML(invoice)
    this.printHTML(content)
  }

  // Generate and download payment history
  static downloadPaymentHistory(history: PaymentHistory): void {
    const content = this.generatePaymentHistoryHTML(history)
    const filename = `historique_paiements_${history.period.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`
    this.downloadAsHTML(content, filename)
  }

  // Generate and download athlete report
  static downloadAthleteReport(report: AthleteReport): void {
    const content = this.generateAthleteReportHTML(report)
    const filename = `rapport_athletes_${report.clubName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`
    this.downloadAsHTML(content, filename)
  }

  // Export as CSV for data analysis
  static exportPaymentHistoryCSV(history: PaymentHistory): void {
    const headers = ['Date', 'Athlète', 'Type', 'Montant', 'Statut', 'Méthode', 'Transaction ID']
    const csvContent = [
      headers.join(','),
      ...history.payments.map(payment => [
        payment.date,
        `"${payment.athlete}"`,
        payment.type,
        payment.amount,
        payment.status,
        payment.paymentMethod || '',
        payment.transactionId || ''
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `paiements_${history.period.replace(/\s+/g, '_')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }
}
