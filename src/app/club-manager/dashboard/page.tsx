"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/primitives/card";
import { toast } from "sonner";
import {
  ArrowLeft,
  Users,
  Trophy,
  Shield,
  CreditCard,
  FileText,
  Calendar,
  UserPlus,
  LogOut,
} from "lucide-react";
import { LeagueLogo } from "@/components/shared/logos";

export default function ClubManagerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [clubManager, setClubManager] = useState<{
    id: string;
    name: string;
    email: string;
    club: {
      name: string;
      city: string;
      establishedYear: number;
    };
    lastLogin: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const tokenData = localStorage.getItem("club-manager-token");
    if (!tokenData) {
      toast.error("Vous devez être connecté pour accéder à cette page");
      router.push("/club-manager/login");
      return;
    }

    try {
      const parsedData = JSON.parse(tokenData);
      setClubManager({
        id: parsedData.clubId || "1",
        name: parsedData.name || "Gestionnaire",
        email: parsedData.email || "manager@club.com",
        club: {
          name: parsedData.clubName || "Club Ju-Jitsu",
          city: "Casablanca",
          establishedYear: 2010,
        },
        lastLogin: new Date().toISOString(),
      });
      setIsLoading(false);
    } catch {
      toast.error("Session invalide");
      router.push("/club-manager/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("club-manager-token");
    toast.success("Déconnexion réussie");
    router.push("/club-manager/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LeagueLogo size="lg" className="mb-4" />
          <p className="text-muted-foreground">
            Chargement du tableau de bord...
          </p>
        </div>
      </div>
    );
  }

  if (!clubManager) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Accès non autorisé</h1>
          <p className="text-muted-foreground mb-4">
            Vous devez être connecté en tant que gestionnaire de club
          </p>
          <Button onClick={() => router.push("/club-manager/login")}>
            Se Connecter
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LeagueLogo size="sm" />
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Espace Gestionnaire
                </h1>
                <p className="text-sm text-muted-foreground">
                  {clubManager.club.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  {clubManager.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {clubManager.email}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back to home link */}
        <Link
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l&apos;Accueil
        </Link>

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Bienvenue, {clubManager.name}
          </h2>
          <p className="text-muted-foreground">
            Gérez votre club et vos athlètes depuis votre tableau de bord
            personnalisé
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Athlètes
                  </p>
                  <p className="text-3xl font-bold text-foreground">24</p>
                </div>
                <Users className="w-8 h-8 text-[#017444]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Championnats
                  </p>
                  <p className="text-3xl font-bold text-foreground">3</p>
                </div>
                <Trophy className="w-8 h-8 text-[#d62027]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Assurances
                  </p>
                  <p className="text-3xl font-bold text-foreground">22</p>
                </div>
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Paiements
                  </p>
                  <p className="text-3xl font-bold text-foreground">1,250€</p>
                </div>
                <CreditCard className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#017444]" />
                Gestion des Athlètes
              </CardTitle>
              <CardDescription>
                Gérez les athlètes de votre club, leurs informations et statuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/club-manager/athletes">
                <Button className="w-full bg-[#017444] hover:bg-[#017444]/90">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Gérer les Athlètes
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Assurances & Licences
              </CardTitle>
              <CardDescription>
                Suivez les assurances et licences de vos athlètes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-blue-600 hover:bg-blue-600/90">
                <FileText className="w-4 h-4 mr-2" />
                Gérer les Assurances
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#d62027]" />
                Championnats
              </CardTitle>
              <CardDescription>
                Inscrivez vos équipes aux championnats de la ligue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-[#d62027] hover:bg-[#d62027]/90">
                <Calendar className="w-4 h-4 mr-2" />
                Voir les Championnats
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-green-600" />
                Paiements & Facturation
              </CardTitle>
              <CardDescription>
                Gérez les paiements, factures et frais d&apos;inscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/club-manager/payments">
                <Button className="w-full bg-green-600 hover:bg-green-600/90">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Gérer les Paiements
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Documents & Rapports
              </CardTitle>
              <CardDescription>
                Accédez aux documents officiels et générez des rapports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-purple-600 hover:bg-purple-600/90">
                <FileText className="w-4 h-4 mr-2" />
                Voir les Documents
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-600" />
                Profil du Club
              </CardTitle>
              <CardDescription>
                Modifiez les informations de votre club et paramètres
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-orange-600 hover:bg-orange-600/90">
                <Users className="w-4 h-4 mr-2" />
                Modifier le Profil
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Activité Récente</CardTitle>
            <CardDescription>
              Dernières actions effectuées sur votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <UserPlus className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">Nouvel athlète ajouté</p>
                  <p className="text-sm text-muted-foreground">
                    Youssef Benali inscrit avec succès - Il y a 2 heures
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">Paiement traité</p>
                  <p className="text-sm text-muted-foreground">
                    Assurance annuelle - 150€ - Il y a 1 jour
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <Trophy className="w-5 h-5 text-[#d62027]" />
                <div>
                  <p className="font-medium">Inscription championnat</p>
                  <p className="text-sm text-muted-foreground">
                    Équipe senior inscrite au championnat régional - Il y a 3
                    jours
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
