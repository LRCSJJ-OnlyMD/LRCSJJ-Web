"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/primitives/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/primitives/card";
import { Input } from "@/components/ui/primitives/input";
import { Label } from "@/components/ui/primitives/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/primitives/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/primitives/select";
import { Textarea } from "@/components/ui/primitives/textarea";
import { toast } from "sonner";
import { UserPlus, Edit, Save, X } from "lucide-react";

interface Athlete {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "MALE" | "FEMALE";
  belt: string;
  weight: number;
  hasInsurance: boolean;
  insuranceExpiry: string | null;
  notes?: string;
}

interface AthleteFormDialogProps {
  athlete?: Athlete;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (athlete: Athlete) => void;
  mode: "add" | "edit" | "view";
}

const BELT_OPTIONS = [
  "Blanche",
  "Jaune",
  "Orange",
  "Verte",
  "Bleue",
  "Marron",
  "Noire",
];

export function AthleteFormDialog({
  athlete,
  isOpen,
  onOpenChange,
  onSave,
  mode,
}: AthleteFormDialogProps) {
  const [formData, setFormData] = useState<Athlete>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "MALE",
    belt: "Blanche",
    weight: 50,
    hasInsurance: false,
    insuranceExpiry: null,
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (athlete) {
      setFormData({
        ...athlete,
        notes: athlete.notes || "",
      });
    } else if (mode === "add") {
      // Reset form for new athlete
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "MALE",
        belt: "Blanche",
        weight: 50,
        hasInsurance: false,
        insuranceExpiry: null,
        notes: "",
      });
    }
    setErrors({});
  }, [athlete, mode, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le téléphone est requis";
    } else if (
      !/^(\+212|0)[0-9]{9}$/.test(formData.phone.replace(/[\s-]/g, ""))
    ) {
      newErrors.phone = "Format de téléphone invalide (ex: +212612345678)";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "La date de naissance est requise";
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 5 || age > 80) {
        newErrors.dateOfBirth = "L'âge doit être entre 5 et 80 ans";
      }
    }

    if (formData.weight < 30 || formData.weight > 200) {
      newErrors.weight = "Le poids doit être entre 30 et 200 kg";
    }

    if (formData.hasInsurance && !formData.insuranceExpiry) {
      newErrors.insuranceExpiry = "Date d'expiration de l'assurance requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof Athlete,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const athleteData: Athlete = {
        ...formData,
        id: athlete?.id || `athlete-${Date.now()}`,
        phone: formData.phone.replace(/[\s-]/g, ""), // Clean phone format
        insuranceExpiry: formData.hasInsurance
          ? formData.insuranceExpiry
          : null,
      };

      onSave(athleteData);

      const action = mode === "add" ? "ajouté" : "modifié";
      toast.success(
        `Athlète ${athleteData.firstName} ${athleteData.lastName} ${action} avec succès`
      );

      onOpenChange(false);
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde");
      console.error("Save athlete error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "add":
        return "Ajouter un nouvel athlète";
      case "edit":
        return "Modifier l'athlète";
      case "view":
        return "Détails de l'athlète";
      default:
        return "Athlète";
    }
  };

  const getIcon = () => {
    switch (mode) {
      case "add":
        return <UserPlus className="w-5 h-5" />;
      case "edit":
        return <Edit className="w-5 h-5" />;
      default:
        return <UserPlus className="w-5 h-5" />;
    }
  };

  const isReadOnly = mode === "view";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" &&
              "Remplissez les informations de l'athlète à ajouter"}
            {mode === "edit" && "Modifiez les informations de l'athlète"}
            {mode === "view" && "Consultez les détails de l'athlète"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Informations personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="Prénom de l'athlète"
                    disabled={isReadOnly}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Nom de famille"
                    disabled={isReadOnly}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="email@example.com"
                    disabled={isReadOnly}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+212612345678"
                    disabled={isReadOnly}
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">Date de naissance *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    disabled={isReadOnly}
                    className={errors.dateOfBirth ? "border-red-500" : ""}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="gender">Genre *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value: "MALE" | "FEMALE") =>
                      handleInputChange("gender", value)
                    }
                    disabled={isReadOnly}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Homme</SelectItem>
                      <SelectItem value="FEMALE">Femme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sports Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations sportives</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="belt">Ceinture *</Label>
                  <Select
                    value={formData.belt}
                    onValueChange={(value) => handleInputChange("belt", value)}
                    disabled={isReadOnly}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BELT_OPTIONS.map((belt) => (
                        <SelectItem key={belt} value={belt}>
                          {belt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="weight">Poids (kg) *</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="30"
                    max="200"
                    value={formData.weight}
                    onChange={(e) =>
                      handleInputChange(
                        "weight",
                        parseInt(e.target.value) || 50
                      )
                    }
                    disabled={isReadOnly}
                    className={errors.weight ? "border-red-500" : ""}
                  />
                  {errors.weight && (
                    <p className="text-sm text-red-500 mt-1">{errors.weight}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insurance Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assurance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hasInsurance"
                  checked={formData.hasInsurance}
                  onChange={(e) =>
                    handleInputChange("hasInsurance", e.target.checked)
                  }
                  disabled={isReadOnly}
                  className="rounded"
                  aria-label="L'athlète possède une assurance"
                />
                <Label htmlFor="hasInsurance">
                  L&apos;athlète possède une assurance
                </Label>
              </div>

              {formData.hasInsurance && (
                <div>
                  <Label htmlFor="insuranceExpiry">
                    Date d&apos;expiration *
                  </Label>
                  <Input
                    id="insuranceExpiry"
                    type="date"
                    value={formData.insuranceExpiry || ""}
                    onChange={(e) =>
                      handleInputChange("insuranceExpiry", e.target.value)
                    }
                    disabled={isReadOnly}
                    className={errors.insuranceExpiry ? "border-red-500" : ""}
                  />
                  {errors.insuranceExpiry && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.insuranceExpiry}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="notes">Notes additionnelles</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Notes ou commentaires sur l'athlète..."
                  disabled={isReadOnly}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          {!isReadOnly && (
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#017444] hover:bg-[#017444]/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          )}

          {isReadOnly && (
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Fermer
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
