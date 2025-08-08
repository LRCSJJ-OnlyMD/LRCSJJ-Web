"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  ArrowLeft,
  Users,
  UserPlus,
  Trash2,
  Shield,
  Search,
  Download,
  Eye,
  RotateCcw,
  Mail,
} from "lucide-react";
import { LeagueLogo } from "@/components/logos";

interface ClubManager {
  id: string;
  name: string;
  email: string;
  clubId: string;
  clubName: string;
  isActive: boolean;
  mustChangePassword: boolean;
  lastLogin?: string;
  createdAt: string;
}

export default function AdminClubManagersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [managers, setManagers] = useState<ClubManager[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    clubId: "",
  });
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated as admin
    const token = localStorage.getItem("auth-token");
    if (!token) {
      toast.error("Vous devez être connecté en tant qu'administrateur");
      router.push("/login");
      return;
    }

    // Mock club managers data
    setTimeout(() => {
      setManagers([
        {
          id: "cm-1",
          name: "Mohammed Alaoui",
          email: "manager@club-casablanca.com",
          clubId: "club-1",
          clubName: "Club Ju-Jitsu Casablanca",
          isActive: true,
          mustChangePassword: false,
          lastLogin: "2025-08-08T10:30:00Z",
          createdAt: "2025-01-15T09:00:00Z",
        },
        {
          id: "cm-2",
          name: "Fatima Bennani",
          email: "manager@club-rabat.com",
          clubId: "club-2",
          clubName: "Club Ju-Jitsu Rabat",
          isActive: true,
          mustChangePassword: true,
          createdAt: "2025-02-10T14:20:00Z",
        },
        {
          id: "cm-3",
          name: "Youssef El Fassi",
          email: "manager@club-sale.com",
          clubId: "club-3",
          clubName: "Club Ju-Jitsu Salé",
          isActive: false,
          mustChangePassword: false,
          lastLogin: "2025-07-20T16:45:00Z",
          createdAt: "2025-03-05T11:10:00Z",
        },
      ]);
      setIsLoading(false);
    }, 1000);
  }, [router]);

  const filteredManagers = managers.filter((manager) => {
    const matchesSearch =
      manager.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.clubName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      !filterStatus ||
      (filterStatus === "active" && manager.isActive) ||
      (filterStatus === "inactive" && !manager.isActive) ||
      (filterStatus === "needs-password-change" && manager.mustChangePassword);

    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleCreateManager = async () => {
    if (!formData.name || !formData.email || !formData.clubId) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    try {
      // TODO: Call API to create club manager
      const newManager: ClubManager = {
        id: "cm-" + Date.now(),
        name: formData.name,
        email: formData.email,
        clubId: formData.clubId,
        clubName: `Club pour ${formData.name}`,
        isActive: true,
        mustChangePassword: true,
        createdAt: new Date().toISOString(),
      };

      setManagers([...managers, newManager]);
      setFormData({ name: "", email: "", clubId: "" });
      setShowCreateForm(false);
      toast.success(
        "Gestionnaire de club créé avec succès! Email de bienvenue envoyé."
      );
    } catch {
      toast.error("Erreur lors de la création du gestionnaire");
    }
  };

  const handleToggleStatus = (managerId: string) => {
    setManagers(
      managers.map((manager) =>
        manager.id === managerId
          ? { ...manager, isActive: !manager.isActive }
          : manager
      )
    );
    toast.success("Statut mis à jour");
  };

  const handleResetPassword = (managerId: string) => {
    setManagers(
      managers.map((manager) =>
        manager.id === managerId
          ? { ...manager, mustChangePassword: true }
          : manager
      )
    );
    toast.success(
      "Mot de passe réinitialisé. L'utilisateur devra le changer à sa prochaine connexion."
    );
  };

  const handleDeleteManager = (managerId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce gestionnaire ?")) {
      setManagers(managers.filter((manager) => manager.id !== managerId));
      toast.success("Gestionnaire supprimé");
    }
  };

  const handleSendWelcomeEmail = (managerEmail: string) => {
    toast.success(`Email de bienvenue envoyé à ${managerEmail}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LeagueLogo size="lg" className="mb-4" />
          <p className="text-muted-foreground">
            Chargement des gestionnaires...
          </p>
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
                  Gestionnaires de Clubs
                </h1>
                <p className="text-sm text-muted-foreground">
                  Administration LRCSJJ
                </p>
              </div>
            </div>

            <Link href="/admin">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l&apos;Administration
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Gestion des Gestionnaires de Clubs
            </h2>
            <p className="text-muted-foreground">
              Créez et gérez les comptes des gestionnaires de clubs de la ligue
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => toast.info("Export en cours...")}
              variant="outline"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-[#017444] hover:bg-[#017444]/90"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Nouveau Gestionnaire
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {managers.length}
                  </p>
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
                    Actifs
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {managers.filter((m) => m.isActive).length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Inactifs
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    {managers.filter((m) => !m.isActive).length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Changement MDP
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    {managers.filter((m) => m.mustChangePassword).length}
                  </p>
                </div>
                <RotateCcw className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Créer un Nouveau Gestionnaire de Club</CardTitle>
              <CardDescription>
                Ajoutez un nouveau gestionnaire pour un club de la ligue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="name">Nom Complet</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Mohammed Alaoui"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="manager@club.com"
                  />
                </div>
                <div>
                  <Label htmlFor="clubId">ID du Club</Label>
                  <Input
                    id="clubId"
                    value={formData.clubId}
                    onChange={(e) =>
                      setFormData({ ...formData, clubId: e.target.value })
                    }
                    placeholder="club-1"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleCreateManager}
                  className="bg-[#017444] hover:bg-[#017444]/90"
                >
                  Créer le Gestionnaire
                </Button>
                <Button
                  onClick={() => setShowCreateForm(false)}
                  variant="outline"
                >
                  Annuler
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Rechercher</Label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nom, email ou club..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="w-full md:w-48">
                <Label htmlFor="filter-status">Statut</Label>
                <select
                  id="filter-status"
                  title="Filtrer par statut"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="">Tous les statuts</option>
                  <option value="active">Actifs</option>
                  <option value="inactive">Inactifs</option>
                  <option value="needs-password-change">
                    Changement MDP requis
                  </option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Managers Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Gestionnaires de Clubs ({filteredManagers.length})
            </CardTitle>
            <CardDescription>
              Liste de tous les gestionnaires de clubs de la ligue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gestionnaire</TableHead>
                    <TableHead>Club</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière Connexion</TableHead>
                    <TableHead>Créé le</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredManagers.map((manager) => (
                    <TableRow key={manager.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{manager.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {manager.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{manager.clubName}</p>
                          <p className="text-sm text-muted-foreground">
                            ID: {manager.clubId}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              manager.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {manager.isActive ? "Actif" : "Inactif"}
                          </span>
                          {manager.mustChangePassword && (
                            <span className="block px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              Changement MDP requis
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {manager.lastLogin ? (
                          formatDate(manager.lastLogin)
                        ) : (
                          <span className="text-muted-foreground">Jamais</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(manager.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              toast.info(`Détails de ${manager.name}`)
                            }
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(manager.id)}
                          >
                            <Shield className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResetPassword(manager.id)}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleSendWelcomeEmail(manager.email)
                            }
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteManager(manager.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredManagers.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm || filterStatus
                    ? "Aucun gestionnaire ne correspond aux critères de recherche"
                    : "Aucun gestionnaire de club créé"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
