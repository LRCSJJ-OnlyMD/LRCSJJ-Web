"use client";

import { useState } from "react";
import { Button } from "@/components/ui/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/primitives/card";
import { Badge } from "@/components/ui/primitives/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/primitives/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitives/select";
import {
  CreditCard,
  Smartphone,
  Download,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  PaymentService,
  createPaymentRequest,
  formatPaymentAmount,
} from "@/lib/payment-gateway";
import { PDFGenerator, type PaymentHistory } from "@/lib/pdf-generator";
import { toast } from "sonner";

interface PaymentItem {
  id: string;
  athleteName: string;
  type: "INSURANCE" | "REGISTRATION" | "COMPETITION";
  description: string;
  amount: number;
  status: "PENDING" | "PAID" | "EXPIRED" | "FAILED";
  paymentMethod?: "CMI" | "CASH_PLUS";
  paymentCode?: string;
  transactionId?: string;
  dueDate: string;
  createdAt: string;
}

interface PaymentComponentProps {
  clubName: string;
  payments: PaymentItem[];
  onPaymentUpdate: (paymentId: string, status: string) => void;
}

export default function PaymentProcessing({
  clubName,
  payments,
  onPaymentUpdate,
}: PaymentComponentProps) {
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<"CMI" | "CASH_PLUS">(
    "CMI"
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDialog, setPaymentDialog] = useState(false);

  const handleInitiatePayment = async (payment: PaymentItem) => {
    setIsProcessing(true);
    try {
      const paymentRequest = createPaymentRequest(
        payment.amount,
        `${payment.description} - ${payment.athleteName}`,
        payment.id,
        { email: "club@example.com" } // In real app, get from club data
      );

      const response = await PaymentService.initiatePayment(
        paymentMethod,
        paymentRequest
      );

      if (response.success) {
        if (paymentMethod === "CMI" && response.paymentUrl) {
          // Open payment URL in new tab
          window.open(response.paymentUrl, "_blank");
          toast.success("Redirection vers le portail de paiement CMI");
        } else if (paymentMethod === "CASH_PLUS" && response.paymentCode) {
          // Update payment with code
          onPaymentUpdate(payment.id, "PENDING");
          toast.success(`Code de paiement généré: ${response.paymentCode}`);

          // Show payment instructions
          const instructionsHTML = PaymentService.generatePaymentInstructions(
            paymentMethod,
            { code: response.paymentCode, amount: payment.amount }
          );

          // In a real app, you'd show this in a modal or dedicated page
          console.log("Payment instructions:", instructionsHTML);
        }
      } else {
        toast.error(
          response.error || "Erreur lors de l'initialisation du paiement"
        );
      }
    } catch (error) {
      toast.error("Erreur technique");
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
      setPaymentDialog(false);
    }
  };

  const generateInvoice = (payment: PaymentItem) => {
    const invoice = {
      invoiceNumber: `INV-${payment.id}`,
      clubName: clubName,
      clubAddress: "Adresse du club", // In real app, get from club data
      date: new Date().toLocaleDateString("fr-FR"),
      dueDate: new Date(payment.dueDate).toLocaleDateString("fr-FR"),
      items: [
        {
          description: payment.description,
          quantity: 1,
          unitPrice: payment.amount,
          total: payment.amount,
        },
      ],
      subtotal: payment.amount,
      tax: 0,
      total: payment.amount,
      paymentMethod: payment.paymentMethod,
      paymentCode: payment.paymentCode,
    };

    PDFGenerator.downloadInvoice(invoice);
    toast.success("Facture téléchargée");
  };

  const generatePaymentHistory = () => {
    const history: PaymentHistory = {
      clubName: clubName,
      period: "Saison 2024-2025",
      payments: payments.map((p) => ({
        date: p.createdAt,
        athlete: p.athleteName,
        type: p.type,
        amount: p.amount,
        status: p.status,
        paymentMethod: p.paymentMethod,
        transactionId: p.transactionId,
      })),
      summary: {
        totalPaid: payments
          .filter((p) => p.status === "PAID")
          .reduce((sum, p) => sum + p.amount, 0),
        totalPending: payments
          .filter((p) => p.status === "PENDING")
          .reduce((sum, p) => sum + p.amount, 0),
        totalOverdue: payments
          .filter((p) => p.status === "EXPIRED")
          .reduce((sum, p) => sum + p.amount, 0),
      },
    };

    PDFGenerator.downloadPaymentHistory(history);
    toast.success("Historique des paiements téléchargé");
  };

  const generateClubSummary = () => {
    const totalAthletes = new Set(payments.map((p) => p.athleteName)).size;
    const paidPayments = payments.filter((p) => p.status === "PAID");

    // For now, we'll create a simple report since we don't have AthleteReport interface
    const reportData = {
      clubName: clubName,
      athletes: Array.from(new Set(payments.map((p) => p.athleteName))).map(
        (name) => ({
          name,
          belt: "Non spécifié",
          age: 0,
          weight: 0,
          hasInsurance: payments.some(
            (p) => p.athleteName === name && p.status === "PAID"
          ),
          registrationDate:
            payments.find((p) => p.athleteName === name)?.createdAt ||
            "Non spécifié",
        })
      ),
      statistics: {
        totalAthletes: totalAthletes,
        averageAge: 0,
        beltDistribution: {},
        insuredPercentage: (paidPayments.length / totalAthletes) * 100,
      },
    };

    PDFGenerator.downloadAthleteReport(reportData);
    toast.success("Rapport de synthèse téléchargé");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "EXPIRED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "FAILED":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      PAID: "default",
      PENDING: "secondary",
      EXPIRED: "destructive",
      FAILED: "destructive",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {getStatusIcon(status)}
        <span className="ml-1">{status}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total à Encaisser
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatPaymentAmount(
                payments
                  .filter((p) => p.status === "PENDING")
                  .reduce((sum, p) => sum + p.amount, 0)
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Encaissé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPaymentAmount(
                payments
                  .filter((p) => p.status === "PAID")
                  .reduce((sum, p) => sum + p.amount, 0)
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Paiements en Attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter((p) => p.status === "PENDING").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Exportations PDF
          </CardTitle>
          <CardDescription>
            Générez et téléchargez vos documents de gestion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={generatePaymentHistory}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Historique des Paiements
            </Button>
            <Button
              variant="outline"
              onClick={generateClubSummary}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Rapport de Synthèse
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Paiements</CardTitle>
          <CardDescription>
            Initiez des paiements et suivez leur statut
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{payment.athleteName}</span>
                    {getStatusBadge(payment.status)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {payment.description}
                  </div>
                  <div className="text-sm text-gray-500">
                    Échéance:{" "}
                    {new Date(payment.dueDate).toLocaleDateString("fr-FR")}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-lg">
                    {formatPaymentAmount(payment.amount)}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {payment.status === "PENDING" && (
                      <Dialog
                        open={paymentDialog}
                        onOpenChange={setPaymentDialog}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => setSelectedPayment(payment)}
                            className="flex items-center gap-1"
                          >
                            <CreditCard className="h-3 w-3" />
                            Payer
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Initialiser le Paiement</DialogTitle>
                            <DialogDescription>
                              Choisissez votre méthode de paiement pour{" "}
                              {payment.athleteName}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">
                                Méthode de paiement
                              </label>
                              <Select
                                value={paymentMethod}
                                onValueChange={(value) =>
                                  setPaymentMethod(value as "CMI" | "CASH_PLUS")
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="CMI">
                                    <div className="flex items-center gap-2">
                                      <CreditCard className="h-4 w-4" />
                                      Carte Bancaire (CMI)
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="CASH_PLUS">
                                    <div className="flex items-center gap-2">
                                      <Smartphone className="h-4 w-4" />
                                      Cash Plus
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="bg-gray-50 p-4 rounded">
                              <div className="text-sm">
                                <strong>Montant:</strong>{" "}
                                {formatPaymentAmount(payment.amount)}
                              </div>
                              <div className="text-sm">
                                <strong>Description:</strong>{" "}
                                {payment.description}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                onClick={() =>
                                  selectedPayment &&
                                  handleInitiatePayment(selectedPayment)
                                }
                                disabled={isProcessing}
                                className="flex-1"
                              >
                                {isProcessing
                                  ? "Traitement..."
                                  : "Confirmer le Paiement"}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setPaymentDialog(false)}
                              >
                                Annuler
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateInvoice(payment)}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Facture
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
