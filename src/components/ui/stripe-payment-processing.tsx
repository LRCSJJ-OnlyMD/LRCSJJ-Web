"use client";

// Stripe Payment Processing Component for LRCSJJ
// Handles yearly insurance payments of 150 MAD per athlete

import React, { useState, useEffect, useCallback } from "react";
import {
  StripeClientService,
  type ClientPaymentRequest,
} from "@/lib/stripe-client";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Badge } from "./badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import {
  CreditCard,
  Shield,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Euro,
} from "lucide-react";
import { toast } from "sonner";

interface StripePaymentProcessingProps {
  athlete: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  club: {
    id: string;
    name: string;
  };
  season: {
    id: string;
    year: string;
    name: string;
  };
  onPaymentSuccess?: () => void;
  onPaymentError?: (error: string) => void;
}

interface InsuranceStatus {
  hasValidInsurance: boolean;
  paymentDate?: string;
  expiryDate?: string;
  paymentId?: string;
}

interface PaymentHistoryItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  date: string;
  seasonYear: string;
  description: string;
}

export function StripePaymentProcessing({
  athlete,
  club,
  season,
  onPaymentSuccess,
  onPaymentError,
}: StripePaymentProcessingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [insuranceStatus, setInsuranceStatus] =
    useState<InsuranceStatus | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>(
    []
  );
  const [activeTab, setActiveTab] = useState("overview");

  // Insurance amount (150 MAD per year)
  const INSURANCE_AMOUNT = 150;

  const checkInsuranceStatus = useCallback(async () => {
    try {
      const status = await StripeClientService.checkInsuranceStatus(
        athlete.id,
        season.id
      );
      setInsuranceStatus(status);
    } catch (error) {
      console.error("Failed to check insurance status:", error);
    }
  }, [athlete.id, season.id]);

  const loadPaymentHistory = useCallback(async () => {
    try {
      const history = await StripeClientService.getPaymentHistory(athlete.id);
      if (history.success) {
        setPaymentHistory(history.payments);
      }
    } catch (error) {
      console.error("Failed to load payment history:", error);
    }
  }, [athlete.id]);

  useEffect(() => {
    checkInsuranceStatus();
    loadPaymentHistory();
  }, [checkInsuranceStatus, loadPaymentHistory]);

  const handlePayment = async () => {
    setIsLoading(true);

    try {
      // Validate payment request
      const paymentRequest: ClientPaymentRequest = {
        athleteId: athlete.id,
        athleteName: athlete.name,
        clubId: club.id,
        clubName: club.name,
        seasonId: season.id,
        seasonYear: season.year,
        customerEmail: athlete.email,
        customerPhone: athlete.phone,
      };

      const validation =
        StripeClientService.validatePaymentRequest(paymentRequest);
      if (!validation.isValid) {
        toast.error(`Erreur de validation: ${validation.errors.join(", ")}`);
        onPaymentError?.(validation.errors.join(", "));
        return;
      }

      // Redirect to Stripe Checkout
      const result = await StripeClientService.redirectToCheckout(
        paymentRequest
      );

      if (!result.success) {
        toast.error(
          result.error || "Erreur lors de la redirection vers le paiement"
        );
        onPaymentError?.(result.error || "Payment redirection failed");
      } else {
        toast.success("Redirection vers le paiement sécurisé...");
        onPaymentSuccess?.();
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erreur inconnue";
      toast.error(`Erreur de paiement: ${errorMessage}`);
      onPaymentError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("fr-MA", {
      style: "currency",
      currency: "MAD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "payé":
      case "succeeded":
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 border-green-200"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Payé
          </Badge>
        );
      case "en attente":
      case "pending":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 border-yellow-200"
          >
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      case "échoué":
      case "failed":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-800 border-red-200"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Échoué
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            Assurance Ju-Jitsu - Saison {season.year}
          </CardTitle>
          <CardDescription>
            Paiement annuel obligatoire pour la participation aux activités
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Athlète</p>
              <p className="font-semibold">{athlete.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Club</p>
              <p className="font-semibold">{club.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Montant annuel</p>
              <p className="font-bold text-xl text-red-600">
                {formatAmount(INSURANCE_AMOUNT)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="payment">Nouveau paiement</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Insurance Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Statut de l&apos;assurance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {insuranceStatus ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Statut actuel:</span>
                    {insuranceStatus.hasValidInsurance ? (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Assurance active
                      </Badge>
                    ) : (
                      <Badge
                        variant="destructive"
                        className="bg-red-100 text-red-800 border-red-200"
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Assurance expirée
                      </Badge>
                    )}
                  </div>

                  {insuranceStatus.hasValidInsurance && (
                    <>
                      {insuranceStatus.paymentDate && (
                        <div className="flex items-center justify-between">
                          <span>Date de paiement:</span>
                          <span className="font-medium">
                            {insuranceStatus.paymentDate}
                          </span>
                        </div>
                      )}
                      {insuranceStatus.expiryDate && (
                        <div className="flex items-center justify-between">
                          <span>Date d&apos;expiration:</span>
                          <span className="font-medium">
                            {insuranceStatus.expiryDate}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">Chargement du statut...</p>
              )}
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle>Historique des paiements</CardTitle>
              <CardDescription>
                Tous les paiements d&apos;assurance pour cet athlète
              </CardDescription>
            </CardHeader>
            <CardContent>
              {paymentHistory.length > 0 ? (
                <div className="space-y-3">
                  {paymentHistory.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{payment.description}</p>
                        <p className="text-sm text-gray-600">
                          Saison {payment.seasonYear} • {payment.date}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="font-bold">
                          {formatAmount(payment.amount)}
                        </p>
                        {getStatusBadge(payment.status)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Aucun historique de paiement trouvé
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Paiement sécurisé par Stripe
              </CardTitle>
              <CardDescription>
                Paiement de l&apos;assurance annuelle pour la saison{" "}
                {season.year}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Payment Summary */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span>Assurance Ju-Jitsu - Saison {season.year}</span>
                  <span className="font-bold">
                    {formatAmount(INSURANCE_AMOUNT)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Validité</span>
                  <span>12 mois à partir du paiement</span>
                </div>
                <hr />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total à payer</span>
                  <span className="text-red-600">
                    {formatAmount(INSURANCE_AMOUNT)}
                  </span>
                </div>
              </div>

              {/* Payment Button */}
              <div className="space-y-4">
                {insuranceStatus?.hasValidInsurance ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">
                        Assurance déjà active pour cette saison
                      </span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Votre assurance est valide jusqu&apos;au{" "}
                      {insuranceStatus.expiryDate}
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-6"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Clock className="w-5 h-5 mr-2 animate-spin" />
                        Redirection vers le paiement...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Payer {formatAmount(INSURANCE_AMOUNT)} avec Stripe
                      </>
                    )}
                  </Button>
                )}

                {/* Payment Info */}
                <div className="text-center space-y-2">
                  <p className="text-sm text-gray-600">
                    Paiement sécurisé par Stripe • Cartes acceptées: Visa,
                    Mastercard
                  </p>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      SSL sécurisé
                    </span>
                    <span className="flex items-center gap-1">
                      <Euro className="w-3 h-3" />
                      Accepte MAD
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
