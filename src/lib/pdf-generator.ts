import jsPDF from 'jspdf'
import 'jspdf-autotable'

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: Record<string, unknown>) => jsPDF
  }
}

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
  total: number
  paymentMethod?: string
  paymentCode?: string
}

export interface PaymentHistory {
  clubName: string
  period: string
  payments: {
    date: string
    athleteName: string
    type: string
    amount: number
    status: string
    paymentMethod: string
    transactionId?: string
  }[]
  totalPaid: number
  totalPending: number
}

export class PDFGenerator {
  private static addHeader(doc: jsPDF, title: string) {
    // Add LRCSJJ Logo and Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(214, 32, 39) // LRCSJJ Red
    doc.text('LRCSJJ', 20, 25)
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text('Ligue Régionale de Ju-Jitsu Casablanca-Settat', 20, 35)
    doc.text('Fédération Royale Marocaine de Ju-Jitsu et Arts Assimilés', 20, 42)
    
    // Title
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(title, 20, 60)
    
    // Add date
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 150, 25)
    
    return 70 // Return Y position for content
  }

  private static addFooter(doc: jsPDF) {
    const pageHeight = doc.internal.pageSize.height
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text('LRCSJJ - Excellence, Discipline et Tradition Martiale', 20, pageHeight - 20)
    doc.text('Contact: contact@lrcsjj.ma | Tél: +212 522 XXX XXX', 20, pageHeight - 15)
    doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, 180, pageHeight - 15)
  }

  static generateInvoice(invoice: Invoice): jsPDF {
    const doc = new jsPDF()
    
    // Add header
    let yPos = this.addHeader(doc, `Facture N° ${invoice.invoiceNumber}`)
    
    // Club information
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Facturé à:', 20, yPos + 10)
    
    doc.setFont('helvetica', 'normal')
    doc.text(invoice.clubName, 20, yPos + 20)
    doc.text(invoice.clubAddress, 20, yPos + 28)
    
    // Invoice details
    doc.setFont('helvetica', 'bold')
    doc.text('Détails de la facture:', 120, yPos + 10)
    
    doc.setFont('helvetica', 'normal')
    doc.text(`Date: ${invoice.date}`, 120, yPos + 20)
    doc.text(`Échéance: ${invoice.dueDate}`, 120, yPos + 28)
    
    yPos += 50
    
    // Items table
    const tableColumn = ['Description', 'Qté', 'Prix unitaire (MAD)', 'Total (MAD)']
    const tableRows = invoice.items.map(item => [
      item.description,
      item.quantity.toString(),
      item.unitPrice.toFixed(2),
      item.total.toFixed(2)
    ])
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: yPos,
      theme: 'grid',
      headStyles: { fillColor: [214, 32, 39], textColor: 255 },
      styles: { fontSize: 10 },
      margin: { left: 20, right: 20 }
    })
    
    // Get the final Y position after the table
    yPos = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20
    
    // Totals
    doc.setFont('helvetica', 'bold')
    doc.text(`Sous-total: ${invoice.subtotal.toFixed(2)} MAD`, 130, yPos)
    doc.text(`Total à payer: ${invoice.total.toFixed(2)} MAD`, 130, yPos + 10)
    
    // Payment information
    if (invoice.paymentMethod && invoice.paymentCode) {
      yPos += 30
      doc.setFont('helvetica', 'bold')
      doc.text('Informations de paiement:', 20, yPos)
      
      doc.setFont('helvetica', 'normal')
      doc.text(`Méthode: ${invoice.paymentMethod}`, 20, yPos + 10)
      doc.text(`Code de paiement: ${invoice.paymentCode}`, 20, yPos + 18)
      doc.text('Valable 24 heures à partir de la génération', 20, yPos + 26)
    }
    
    this.addFooter(doc)
    
    return doc
  }

  static generatePaymentHistory(history: PaymentHistory): jsPDF {
    const doc = new jsPDF()
    
    // Add header
    let yPos = this.addHeader(doc, 'Historique des Paiements')
    
    // Club and period information
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`Club: ${history.clubName}`, 20, yPos + 10)
    doc.text(`Période: ${history.period}`, 20, yPos + 20)
    
    yPos += 40
    
    // Summary
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(1, 116, 68) // Green for paid
    doc.text(`Total payé: ${history.totalPaid.toFixed(2)} MAD`, 20, yPos)
    
    doc.setTextColor(214, 32, 39) // Red for pending
    doc.text(`Total en attente: ${history.totalPending.toFixed(2)} MAD`, 120, yPos)
    
    doc.setTextColor(0, 0, 0) // Reset color
    yPos += 20
    
    // Payments table
    const tableColumn = ['Date', 'Athlète', 'Type', 'Montant (MAD)', 'Statut', 'Méthode', 'Transaction']
    const tableRows = history.payments.map(payment => [
      new Date(payment.date).toLocaleDateString('fr-FR'),
      payment.athleteName,
      payment.type,
      payment.amount.toFixed(2),
      payment.status,
      payment.paymentMethod,
      payment.transactionId || '-'
    ])
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: yPos,
      theme: 'grid',
      headStyles: { fillColor: [214, 32, 39], textColor: 255 },
      styles: { fontSize: 8 },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 30 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 20 },
        5: { cellWidth: 25 },
        6: { cellWidth: 25 }
      }
    })
    
    this.addFooter(doc)
    
    return doc
  }

  static generateClubSummaryReport(data: {
    clubName: string
    period: string
    totalAthletes: number
    paidInsurance: number
    pendingInsurance: number
    totalRevenue: number
    pendingAmount: number
    recentPayments: {
      date: string
      athleteName: string
      amount: number
      status: string
    }[]
  }): jsPDF {
    const doc = new jsPDF()
    
    // Add header
    let yPos = this.addHeader(doc, 'Rapport de Synthèse du Club')
    
    // Club information
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(data.clubName, 20, yPos + 10)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Période: ${data.period}`, 20, yPos + 22)
    
    yPos += 40
    
    // Statistics cards
    const cardWidth = 80
    const cardHeight = 30
    
    // Athletes card
    doc.setDrawColor(214, 32, 39)
    doc.setFillColor(254, 242, 242)
    doc.roundedRect(20, yPos, cardWidth, cardHeight, 3, 3, 'FD')
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(214, 32, 39)
    doc.text(data.totalAthletes.toString(), 35, yPos + 15)
    
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text('Total Athlètes', 25, yPos + 25)
    
    // Revenue card
    doc.setDrawColor(1, 116, 68)
    doc.setFillColor(240, 253, 244)
    doc.roundedRect(110, yPos, cardWidth, cardHeight, 3, 3, 'FD')
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(1, 116, 68)
    doc.text(`${data.totalRevenue.toFixed(0)} MAD`, 120, yPos + 15)
    
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text('Revenus Collectés', 115, yPos + 25)
    
    yPos += 50
    
    // Insurance status
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('État des Assurances', 20, yPos)
    
    yPos += 15
    
    // Insurance progress bar
    const barWidth = 150
    const barHeight = 8
    const paidPercentage = data.totalAthletes > 0 ? (data.paidInsurance / data.totalAthletes) : 0
    
    // Background bar
    doc.setFillColor(229, 231, 235)
    doc.rect(20, yPos, barWidth, barHeight, 'F')
    
    // Progress bar
    doc.setFillColor(1, 116, 68)
    doc.rect(20, yPos, barWidth * paidPercentage, barHeight, 'F')
    
    // Labels
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text(`Payées: ${data.paidInsurance}`, 20, yPos + 20)
    doc.text(`En attente: ${data.pendingInsurance}`, 80, yPos + 20)
    doc.text(`${(paidPercentage * 100).toFixed(1)}%`, 140, yPos + 20)
    
    yPos += 40
    
    // Recent payments table
    if (data.recentPayments.length > 0) {
      doc.setFontSize(11)
      doc.setFont('helvetica', 'bold')
      doc.text('Paiements Récents', 20, yPos)
      
      yPos += 10
      
      const tableColumn = ['Date', 'Athlète', 'Montant (MAD)', 'Statut']
      const tableRows = data.recentPayments.slice(0, 8).map(payment => [
        new Date(payment.date).toLocaleDateString('fr-FR'),
        payment.athleteName,
        payment.amount.toFixed(2),
        payment.status
      ])
      
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: yPos,
        theme: 'grid',
        headStyles: { fillColor: [214, 32, 39], textColor: 255 },
        styles: { fontSize: 8 },
        margin: { left: 20, right: 20 }
      })
    }
    
    this.addFooter(doc)
    
    return doc
  }
}

// Export utilities for common operations
export const exportInvoicePDF = (invoice: Invoice, filename?: string) => {
  const doc = PDFGenerator.generateInvoice(invoice)
  doc.save(filename || `facture-${invoice.invoiceNumber}.pdf`)
}

export const exportPaymentHistoryPDF = (history: PaymentHistory, filename?: string) => {
  const doc = PDFGenerator.generatePaymentHistory(history)
  doc.save(filename || `historique-paiements-${history.clubName.replace(/\s+/g, '-')}.pdf`)
}

export const exportClubSummaryPDF = (data: {
  clubName: string
  period: string
  totalAthletes: number
  paidInsurance: number
  pendingInsurance: number
  totalRevenue: number
  pendingAmount: number
  recentPayments: {
    date: string
    athleteName: string
    amount: number
    status: string
  }[]
}, filename?: string) => {
  const doc = PDFGenerator.generateClubSummaryReport(data)
  doc.save(filename || `rapport-club-${data.clubName.replace(/\s+/g, '-')}.pdf`)
}
