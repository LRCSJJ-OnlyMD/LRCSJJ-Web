"use client";

import { useState } from "react";
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
import { toast } from "sonner";
import { ArrowLeft, Eye, EyeOff, Users, UserCheck, Lock } from "lucide-react";
import { LeagueLogo } from "@/components/logos";
import { trpc } from "@/lib/trpc-client";

export default function ClubManagerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginStep, setLoginStep] = useState<
    "credentials" | "change-password" | "verification"
  >("credentials");
  const [managerId, setManagerId] = useState<string>("");
  const [temporaryPassword, setTemporaryPassword] = useState<string>("");
  const [codeId, setCodeId] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [maskedEmail, setMaskedEmail] = useState<string>("");
  const router = useRouter();

  // Use real tRPC mutations
  const loginMutation = trpc.clubManager.initiateLogin.useMutation({
    onSuccess: (data) => {
      if (data.requiresPasswordReset) {
        setManagerId(data.managerId);
        setTemporaryPassword(password);
        setLoginStep("change-password");
        toast.info("Vous devez changer votre mot de passe temporaire");
      } else if (data.requiresVerification) {
        setCodeId(data.codeId!);
        setMaskedEmail(data.maskedEmail!);
        setLoginStep("verification");
        toast.success("Code de vérification envoyé par email");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Email ou mot de passe incorrect");
    },
  });

  const setPasswordMutation = trpc.clubManager.setPassword.useMutation({
    onSuccess: () => {
      toast.success(
        "Mot de passe défini avec succès! Veuillez vous reconnecter."
      );
      // Reset form and go back to login
      setLoginStep("credentials");
      setEmail("");
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setManagerId("");
      setTemporaryPassword("");
    },
    onError: (error) => {
      toast.error(error.message || "Erreur lors du changement de mot de passe");
    },
  });

  const completeLoginMutation = trpc.clubManager.completeLogin.useMutation({
    onSuccess: (data) => {
      // Store authentication token
      localStorage.setItem(
        "club-manager-token",
        JSON.stringify({
          token: data.token,
          email: data.manager.email,
          name: data.manager.name,
          clubId: data.manager.clubId,
          clubName: data.manager.clubName,
          role: data.manager.role,
        })
      );
      toast.success("Connexion réussie!");
      router.push("/club-manager/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Code de vérification invalide");
    },
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    loginMutation.mutate({ email, password });
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    setPasswordMutation.mutate({
      managerId,
      temporaryPassword,
      newPassword,
    });
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Veuillez entrer le code de vérification à 6 chiffres");
      return;
    }
    completeLoginMutation.mutate({
      codeId,
      verificationCode,
    });
  };

  const handleBackToLogin = () => {
    setLoginStep("credentials");
    setNewPassword("");
    setConfirmPassword("");
    setVerificationCode("");
    setManagerId("");
    setTemporaryPassword("");
    setCodeId("");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Back to home link */}
        <Link
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors animate-fade-in-down"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l&apos;Accueil
        </Link>

        <Card className="shadow-lg border-border bg-card animate-fade-in-up animate-stagger-1">
          <CardHeader className="text-center">
            <LeagueLogo size="lg" className="mb-4" />
            <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
              <Users className="w-6 h-6 text-[#017444]" />
              Espace Gestionnaire de Club
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {loginStep === "credentials"
                ? "Portail de connexion pour les gestionnaires de clubs LRCSJJ"
                : "Changement de mot de passe obligatoire - Première connexion"}
            </CardDescription>
          </CardHeader>

          <CardContent className="animate-fade-in-up animate-stagger-2">
            {loginStep === "credentials" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Adresse Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="gestionnaire@club.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loginMutation.isPending}
                    required
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">
                    Mot de Passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loginMutation.isPending}
                      required
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#017444] hover:bg-[#017444]/90 text-white transition-all duration-300 hover-lift"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending
                    ? "Vérification en cours..."
                    : "Se Connecter"}
                </Button>

                <div className="text-center">
                  <Link
                    href="/club-manager/forgot-password"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </form>
            ) : loginStep === "change-password" ? (
              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                <div className="text-center space-y-3 mb-6">
                  <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950/30 rounded-full flex items-center justify-center mx-auto border border-orange-200 dark:border-orange-800">
                    <Lock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Changement de Mot de Passe
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Pour votre sécurité, vous devez définir un nouveau mot de
                      passe
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-foreground">
                    Nouveau Mot de Passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Au moins 8 caractères"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={setPasswordMutation.isPending}
                      required
                      minLength={8}
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground">
                    Confirmer le Mot de Passe
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Répétez le mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={setPasswordMutation.isPending}
                      required
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {newPassword && newPassword.length > 0 && (
                  <div className="text-xs space-y-1">
                    <div
                      className={`flex items-center gap-2 ${
                        newPassword.length >= 8
                          ? "text-green-600 dark:text-green-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      <UserCheck className="w-3 h-3" />
                      Au moins 8 caractères
                    </div>
                    <div
                      className={`flex items-center gap-2 ${
                        newPassword !== confirmPassword
                          ? "text-muted-foreground"
                          : confirmPassword
                          ? "text-green-600 dark:text-green-400"
                          : "text-muted-foreground"
                      }`}
                    >
                      <UserCheck className="w-3 h-3" />
                      Les mots de passe correspondent
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#017444] hover:bg-[#017444]/90 text-white transition-all duration-300 hover-lift"
                  disabled={
                    setPasswordMutation.isPending ||
                    newPassword !== confirmPassword ||
                    newPassword.length < 8
                  }
                >
                  {setPasswordMutation.isPending
                    ? "Changement en cours..."
                    : "Changer le Mot de Passe"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-foreground"
                  onClick={handleBackToLogin}
                  disabled={setPasswordMutation.isPending}
                >
                  ← Retour à la connexion
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerificationSubmit} className="space-y-4">
                <div className="text-center space-y-3 mb-6">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-800">
                    <UserCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Vérification Email
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Un code de vérification a été envoyé à <br />
                      <span className="font-medium">{maskedEmail}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verificationCode" className="text-foreground">
                    Code de Vérification
                  </Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) =>
                      setVerificationCode(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    disabled={completeLoginMutation.isPending}
                    required
                    maxLength={6}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground text-center text-2xl font-mono tracking-widest"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#017444] hover:bg-[#017444]/90 text-white transition-all duration-300 hover-lift"
                  disabled={
                    completeLoginMutation.isPending ||
                    verificationCode.length !== 6
                  }
                >
                  {completeLoginMutation.isPending
                    ? "Vérification en cours..."
                    : "Vérifier et Se Connecter"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-foreground"
                  onClick={handleBackToLogin}
                  disabled={completeLoginMutation.isPending}
                >
                  ← Retour à la connexion
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-muted-foreground animate-fade-in-up animate-stagger-3">
              {loginStep === "credentials" ? (
                <div className="space-y-1">
                  <p>Accès réservé aux gestionnaires de clubs</p>
                  <p className="text-xs">
                    Contactez l&apos;administration si vous n&apos;avez pas de
                    compte
                  </p>
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">
                      Identifiants de test:
                    </p>
                    <div className="text-xs space-y-1 text-blue-600 dark:text-blue-300">
                      <p>Email: manager.clubatlasjujitsucasablanca@lrcsjj.ma</p>
                      <p>Mot de passe: atlas2025</p>
                    </div>
                  </div>
                </div>
              ) : loginStep === "change-password" ? (
                <div className="space-y-1">
                  <p>
                    Ce changement est obligatoire pour votre première connexion
                  </p>
                  <p className="text-xs">Choisissez un mot de passe sécurisé</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p>Entrez le code reçu par email</p>
                  <p className="text-xs">Le code expire dans 10 minutes</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
