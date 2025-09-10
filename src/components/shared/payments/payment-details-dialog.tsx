"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/primitives/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/primitives/card";
import { Badge } from "@/components/ui/primitives/badge";
import { Button } from "@/components/ui/primitives/button";
import {
  CreditCard,
  Calendar,
  User,
  Euro,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Download,
} from "lucide-react";
import { toast } from "sonner";

interface PaymentRequest {
  id: string;
  athleteId: string;
  athleteName: string;
  type: "INSURANCE" | "REGISTRATION" | "COMPETITION" | "OTHER";
  description: string;
  amount: number;
  currency: "MAD";
  status: "PENDING" | "PAID" | "EXPIRED" | "CANCELLED";
  paymentMethod?: "STRIPE" | "BANK_TRANSFER" | "CASH";
  stripeSessionId?: string;
  paymentIntentId?: string;
  paidAt?: string;
  dueDate: string;
  createdAt: string;
  notes?: string;
}

interface PaymentDetailsDialogProps {
  payment: PaymentRequest | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateInvoice?: (paymentId: string) => void;
}

export function PaymentDetailsDialog({
  payment,
  isOpen,
  onOpenChange,
  onGenerateInvoice,
}: PaymentDetailsDialogProps) {
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  if (!payment) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PAID":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "PENDING":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "EXPIRED":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "PAID":
        return "default";
      case "PENDING":
        return "secondary";
      case "EXPIRED":
        return "destructive";
      case "CANCELLED":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PAID":
        return "Payé";
      case "PENDING":
        return "En attente";
      case "EXPIRED":
        return "Expiré";
      case "CANCELLED":
        return "Annulé";
      default:
        return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "INSURANCE":
        return "Assurance";
      case "REGISTRATION":
        return "Inscription";
      case "COMPETITION":
        return "Compétition";
      case "OTHER":
        return "Autre";
      default:
        return type;
    }
  };

  const getPaymentMethodText = (method?: string) => {
    switch (method) {
      case "STRIPE":
        return "Carte bancaire (Stripe)";
      case "BANK_TRANSFER":
        return "Virement bancaire";
      case "CASH":
        return "Espèces";
      default:
        return "Non spécifiée";
    }
  };

  const handleGenerateInvoice = async () => {
    if (!onGenerateInvoice) return;

    setIsGeneratingInvoice(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      onGenerateInvoice(payment.id);
      toast.success("Facture générée avec succès");
    } catch {
      toast.error("Erreur lors de la génération de la facture");
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Détails du paiement #{payment.id}
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur cette demande de paiement
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Informations générales</span>
                <Badge
                  variant={getStatusBadgeVariant(payment.status)}
                  className="flex items-center gap-1"
                >
                  {getStatusIcon(payment.status)}
                  {getStatusText(payment.status)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    Athlète
                  </div>
                  <p className="font-medium">{payment.athleteName}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    Type
                  </div>
                  <p className="font-medium">{getTypeText(payment.type)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Description</div>
                <p className="font-medium">{payment.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Euro className="w-4 h-4" />
                    Montant
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    {payment.amount} {payment.currency}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Date d&apos;échéance
                  </div>
                  <p className="font-medium">{formatDate(payment.dueDate)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Détails du paiement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Méthode de paiement
                  </div>
                  <p className="font-medium">
                    {getPaymentMethodText(payment.paymentMethod)}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Date de création
                  </div>
                  <p className="font-medium">{formatDate(payment.createdAt)}</p>
                </div>
              </div>

              {payment.paidAt && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Date de paiement
                  </div>
                  <p className="font-medium text-green-600">
                    {formatDate(payment.paidAt)}
                  </p>
                </div>
              )}

              {payment.stripeSessionId && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    ID Session Stripe
                  </div>
                  <p className="font-mono text-sm bg-muted p-2 rounded">
                    {payment.stripeSessionId}
                  </p>
                </div>
              )}

              {payment.paymentIntentId && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    ID Payment Intent
                  </div>
                  <p className="font-mono text-sm bg-muted p-2 rounded">
                    {payment.paymentIntentId}
                  </p>
                </div>
              )}

              {payment.notes && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Notes</div>
                  <p className="text-sm bg-muted p-3 rounded">
                    {payment.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          {payment.status === "PAID" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleGenerateInvoice}
                  disabled={isGeneratingInvoice}
                  className="w-full"
                >
                  {isGeneratingInvoice ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger la facture
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
