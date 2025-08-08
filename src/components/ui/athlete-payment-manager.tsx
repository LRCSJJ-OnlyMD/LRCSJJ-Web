"use client";

// Athlete Payment Management Component
// Create payments for individual athletes or bulk payments

import React, { useState, useEffect } from "react";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { Input } from "./input";
import { Label } from "./label";
import { Badge } from "./badge";
import { Checkbox } from "./checkbox";
import {
  Users,
  CreditCard,
  Search,
  CheckCircle,
  XCircle,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import {
  StripeClientService,
  type ClientPaymentRequest,
} from "@/lib/stripe-client";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc-client";

// Types based on Prisma schema
interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  clubId: string;
  club: {
    id: string;
    name: string;
  };
  insurances: Array<{
    id: string;
    isPaid: boolean;
    paidAt?: Date;
    season: {
      id: string;
      year: string;
      name: string;
    };
  }>;
  category?: string;
  dateOfBirth: Date;
}

interface Season {
  id: string;
  year: string;
  name: string;
  isActive: boolean;
}

export function AthletePaymentManager() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAthletes, setSelectedAthletes] = useState<Set<string>>(
    new Set()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("");

  // tRPC queries
  const { data: seasonsData, isLoading: loadingSeasons } =
    trpc.seasons.getAll.useQuery();
  const {
    data: athletesData,
    isLoading: loadingAthletes,
    refetch: refetchAthletes,
  } = trpc.athletes.getMyClubAthletes.useQuery({
    search: searchTerm,
    seasonId: selectedSeason?.id,
  });

  // Load data from tRPC
  useEffect(() => {
    if (seasonsData) {
      setSeasons(seasonsData);
      const activeSeason = seasonsData.find((s) => s.isActive);
      if (activeSeason && !selectedSeason) {
        setSelectedSeason(activeSeason);
      }
    }
  }, [seasonsData, selectedSeason]);

  useEffect(() => {
    if (athletesData) {
      setAthletes(athletesData);
    }
  }, [athletesData]);

  // Refetch athletes when season changes
  useEffect(() => {
    if (selectedSeason) {
      refetchAthletes();
    }
  }, [selectedSeason, refetchAthletes]);

  const getAthleteInsuranceStatus = (athlete: Athlete) => {
    if (!selectedSeason) return "UNKNOWN";

    const seasonInsurance = athlete.insurances.find(
      (ins) => ins.season.id === selectedSeason.id
    );

    if (!seasonInsurance) return "NEVER_PAID";
    if (seasonInsurance.isPaid) return "ACTIVE";
    return "EXPIRED";
  };

  const filteredAthletes = athletes.filter((athlete) => {
    const fullName = `${athlete.firstName} ${athlete.lastName}`;
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const insuranceStatus = getAthleteInsuranceStatus(athlete);
    const matchesStatus = !filterStatus || insuranceStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleAthleteSelection = (athleteId: string, checked: boolean) => {
    console.log("Checkbox clicked:", athleteId, checked);
    const newSelection = new Set(selectedAthletes);
    if (checked) {
      newSelection.add(athleteId);
    } else {
      newSelection.delete(athleteId);
    }
    setSelectedAthletes(newSelection);
    console.log("New selection:", Array.from(newSelection));
  };

  const handleSelectAll = (checked: boolean) => {
    console.log("Select all clicked:", checked);
    if (checked) {
      const allIds = filteredAthletes.map((a) => a.id);
      setSelectedAthletes(new Set(allIds));
      console.log("Selected all:", allIds);
    } else {
      setSelectedAthletes(new Set());
      console.log("Deselected all");
    }
  };

  const handleSinglePayment = async (athlete: Athlete) => {
    if (!selectedSeason) {
      toast.error("Veuillez sélectionner une saison");
      return;
    }

    console.log(
      "Starting single payment for:",
      `${athlete.firstName} ${athlete.lastName}`
    );
    setIsLoading(true);

    try {
      const paymentRequest: ClientPaymentRequest = {
        athleteId: athlete.id,
        athleteName: `${athlete.firstName} ${athlete.lastName}`,
        clubId: athlete.clubId,
        clubName: athlete.club.name,
        seasonId: selectedSeason.id,
        seasonYear: selectedSeason.year,
        customerEmail: athlete.email,
        customerPhone: athlete.phone,
      };

      console.log("Payment request:", paymentRequest);
      toast.loading("Création de la session de paiement...", {
        id: "payment-loading",
      });

      const result = await StripeClientService.redirectToCheckout(
        paymentRequest
      );

      toast.dismiss("payment-loading");

      if (result.success) {
        toast.success(
          `Redirection vers le paiement pour ${athlete.firstName} ${athlete.lastName}`
        );
      } else {
        console.error("Payment error:", result.error);
        toast.error(result.error || "Erreur lors de la création du paiement");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.dismiss("payment-loading");
      toast.error("Erreur lors de la création du paiement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkPayment = async () => {
    if (selectedAthletes.size === 0) {
      toast.error("Veuillez sélectionner au moins un athlète");
      return;
    }

    if (!selectedSeason) {
      toast.error("Veuillez sélectionner une saison");
      return;
    }

    console.log("Starting bulk payment for:", Array.from(selectedAthletes));

    const selectedAthletesList = athletes.filter((a) =>
      selectedAthletes.has(a.id)
    );
    console.log(
      "Selected athletes list:",
      selectedAthletesList.map((a) => `${a.firstName} ${a.lastName}`)
    );

    setIsLoading(true);
    try {
      const athleteNames = selectedAthletesList
        .map((a) => `${a.firstName} ${a.lastName}`)
        .join(", ");

      const paymentRequest: ClientPaymentRequest = {
        athleteId: "bulk-payment",
        athleteName: `Paiement groupé (${selectedAthletes.size} athlètes): ${athleteNames}`,
        clubId: selectedAthletesList[0].clubId,
        clubName: selectedAthletesList[0].club.name,
        seasonId: selectedSeason.id,
        seasonYear: selectedSeason.year,
        customerEmail: selectedAthletesList[0].email,
        customerPhone: selectedAthletesList[0].phone,
      };

      console.log("Bulk payment request:", paymentRequest);
      toast.loading("Création de la session de paiement groupé...", {
        id: "bulk-payment-loading",
      });

      const result = await StripeClientService.redirectToCheckout(
        paymentRequest
      );

      toast.dismiss("bulk-payment-loading");

      if (result.success) {
        toast.success(
          `Redirection vers le paiement groupé pour ${selectedAthletes.size} athlètes`
        );
        setSelectedAthletes(new Set());
      } else {
        console.error("Bulk payment error:", result.error);
        toast.error(
          result.error || "Erreur lors de la création du paiement groupé"
        );
      }
    } catch (error) {
      console.error("Bulk payment error:", error);
      toast.dismiss("bulk-payment-loading");
      toast.error("Erreur lors de la création du paiement groupé");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Expiré
          </Badge>
        );
      case "NEVER_PAID":
        return (
          <Badge
            variant="secondary"
            className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
          >
            <AlertTriangle className="w-3 h-3 mr-1" />
            Jamais payé
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR");
  };

  const getPaymentAmount = () => {
    return 150 * selectedAthletes.size; // 150 MAD per athlete
  };

  const formatAmount = (amount: number) => {
    return `${amount} MAD`;
  };

  if (loadingSeasons || loadingAthletes) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
              <span className="ml-2">Chargement...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" />
            Gestion des Paiements d&apos;Assurance
          </CardTitle>
          <CardDescription>
            Créer des paiements d&apos;assurance pour les athlètes (150 MAD par
            an)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Saison sélectionnée</p>
              <p className="font-semibold">
                {selectedSeason
                  ? selectedSeason.name
                  : "Aucune saison sélectionnée"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Athlètes sélectionnés</p>
              <p className="font-semibold">
                {selectedAthletes.size} athlète(s)
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Montant total</p>
              <p className="font-bold text-xl text-red-600">
                {formatAmount(getPaymentAmount())}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Season Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Sélection de la saison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {seasons.map((season) => (
              <Button
                key={season.id}
                variant={
                  selectedSeason?.id === season.id ? "default" : "outline"
                }
                onClick={() => setSelectedSeason(season)}
                className={
                  selectedSeason?.id === season.id
                    ? "bg-red-600 hover:bg-red-700"
                    : ""
                }
              >
                {season.name}
                {season.isActive && (
                  <span className="ml-2 text-xs">(Active)</span>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Rechercher un athlète</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom, email ou catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="w-full md:w-48">
              <Label htmlFor="filter-status">Statut assurance</Label>
              <select
                id="filter-status"
                title="Filtrer par statut d'assurance"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="">Tous les statuts</option>
                <option value="ACTIVE">Active</option>
                <option value="EXPIRED">Expiré</option>
                <option value="NEVER_PAID">Jamais payé</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedAthletes.size > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium">
                  {selectedAthletes.size} athlète(s) sélectionné(s)
                </span>
                <span className="text-lg font-bold text-red-600">
                  Total: {formatAmount(getPaymentAmount())}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedAthletes(new Set())}
                >
                  Annuler sélection
                </Button>
                <Button
                  onClick={handleBulkPayment}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Paiement groupé
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Athletes List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Liste des athlètes ({filteredAthletes.length})
              </CardTitle>
              <CardDescription>
                Sélectionnez les athlètes pour créer des paiements
                d&apos;assurance
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={
                  selectedAthletes.size === filteredAthletes.length &&
                  filteredAthletes.length > 0
                }
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all" className="text-sm font-medium">
                Tout sélectionner
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAthletes.map((athlete) => (
              <div
                key={athlete.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    id={`athlete-${athlete.id}`}
                    checked={selectedAthletes.has(athlete.id)}
                    onCheckedChange={(checked: boolean) =>
                      handleAthleteSelection(athlete.id, checked)
                    }
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <p className="font-medium">
                        {athlete.firstName} {athlete.lastName}
                      </p>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-600">
                        {athlete.category || "Non spécifié"}
                      </span>
                      {getStatusBadge(getAthleteInsuranceStatus(athlete))}
                    </div>
                    <div className="text-sm text-gray-600">
                      {athlete.email && <span>{athlete.email}</span>}
                      {athlete.email && athlete.phone && <span> • </span>}
                      {athlete.phone && <span>{athlete.phone}</span>}
                    </div>
                    {(() => {
                      const status = getAthleteInsuranceStatus(athlete);
                      const seasonInsurance = athlete.insurances.find(
                        (ins) => ins.season.id === selectedSeason?.id
                      );

                      if (status === "ACTIVE" && seasonInsurance?.paidAt) {
                        return (
                          <div className="text-xs text-green-600">
                            Payé le:{" "}
                            {formatDate(new Date(seasonInsurance.paidAt))}
                          </div>
                        );
                      }

                      if (status === "EXPIRED" && seasonInsurance?.paidAt) {
                        return (
                          <div className="text-xs text-red-600">
                            Expiré (payé le:{" "}
                            {formatDate(new Date(seasonInsurance.paidAt))})
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-red-600">
                    150 MAD
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleSinglePayment(athlete)}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <CreditCard className="w-4 h-4 mr-1" />
                    Payer
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredAthletes.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || filterStatus
                  ? "Aucun athlète ne correspond aux critères de recherche"
                  : "Aucun athlète trouvé"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
