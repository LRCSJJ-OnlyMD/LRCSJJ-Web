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
import { XCircle, ArrowLeft, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Force dynamic rendering
export const dynamic = "force-dynamic";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<{
    orderId?: string;
    reason?: string;
  }>({});

  useEffect(() => {
    // Extract details from URL parameters
    setPaymentDetails({
      orderId: searchParams.get("orderId") || undefined,
      reason: searchParams.get("reason") || "Paiement annulé par l'utilisateur",
    });

    // Show cancel toast
    toast.error("Paiement annulé");
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-red-600">Paiement Annulé</CardTitle>
          <CardDescription>Le paiement n&apos;a pas été traité</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-red-700">
              <strong>Raison:</strong> {paymentDetails.reason}
            </div>
          </div>

          {paymentDetails.orderId && (
            <div className="text-sm">
              <span className="font-medium">Référence:</span>{" "}
              {paymentDetails.orderId}
            </div>
          )}

          <div className="text-sm text-gray-600">
            <span className="font-medium">Date:</span>{" "}
            {new Date().toLocaleDateString("fr-FR")}
          </div>

          <div className="pt-4 space-y-2">
            <Link href="/club-manager/payments" className="w-full">
              <Button className="w-full flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Réessayer le Paiement
              </Button>
            </Link>

            <Link href="/club-manager/dashboard" className="w-full">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour au Dashboard
              </Button>
            </Link>
          </div>

          <div className="text-xs text-center text-gray-500 pt-4 border-t">
            Vous pouvez réessayer le paiement à tout moment. En cas de problème,
            contactez l&apos;administration.
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

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PaymentCancelContent />
    </Suspense>
  );
}
