"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Download, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Force dynamic rendering
export const dynamic = "force-dynamic";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<{
    transactionId?: string;
    amount?: string;
    orderId?: string;
    method?: string;
  }>({});

  useEffect(() => {
    // Extract payment details from URL parameters
    setPaymentDetails({
      transactionId: searchParams.get("transactionId") || undefined,
      amount: searchParams.get("amount") || undefined,
      orderId: searchParams.get("orderId") || undefined,
      method: searchParams.get("method") || undefined,
    });

    // Show success toast
    toast.success("Paiement confirmé avec succès!");
  }, [searchParams]);

  const generateReceipt = () => {
    // In a real app, this would generate an official receipt
    toast.success("Reçu téléchargé");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-green-600">Paiement Réussi</CardTitle>
          <CardDescription>
            Votre paiement a été traité avec succès
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {paymentDetails.amount && (
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {paymentDetails.amount} MAD
                </div>
                <div className="text-sm text-green-700 mt-1">Montant payé</div>
              </div>
            </div>
          )}

          {paymentDetails.transactionId && (
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">ID Transaction:</span>{" "}
                {paymentDetails.transactionId}
              </div>
            </div>
          )}

          {paymentDetails.method && (
            <div className="text-sm">
              <span className="font-medium">Méthode:</span>{" "}
              {paymentDetails.method === "CMI"
                ? "Carte Bancaire (CMI)"
                : paymentDetails.method === "CASH_PLUS"
                ? "Cash Plus"
                : paymentDetails.method}
            </div>
          )}

          <div className="text-sm text-gray-600">
            <span className="font-medium">Date:</span>{" "}
            {new Date().toLocaleDateString("fr-FR")}
          </div>

          <div className="pt-4 space-y-2">
            <Button
              onClick={generateReceipt}
              className="w-full flex items-center gap-2"
              variant="outline"
            >
              <Download className="w-4 h-4" />
              Télécharger le Reçu
            </Button>

            <Link href="/club-manager/payments" className="w-full">
              <Button className="w-full flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Retour aux Paiements
              </Button>
            </Link>
          </div>

          <div className="text-xs text-center text-gray-500 pt-4 border-t">
            Un email de confirmation sera envoyé sous peu
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-4" />
          <p className="text-sm text-muted-foreground">Chargement...</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
