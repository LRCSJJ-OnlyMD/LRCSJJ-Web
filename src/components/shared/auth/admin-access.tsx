"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/primitives/button";
import { Input } from "@/components/ui/primitives/input";
import { Label } from "@/components/ui/primitives/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/primitives/dialog";
import { Settings, Key } from "lucide-react";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

export function AdminAccess() {
  const [isOpen, setIsOpen] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if already authorized and session is still valid
    const authorized = localStorage.getItem("admin-access-authorized");
    const expiresAt = localStorage.getItem("admin-access-expires");

    if (authorized === "true" && expiresAt) {
      const now = new Date().getTime();
      const expiration = new Date(expiresAt).getTime();

      if (now < expiration) {
        setIsAuthorized(true);
      } else {
        // Session expired, clear storage
        localStorage.removeItem("admin-access-authorized");
        localStorage.removeItem("admin-access-token");
        localStorage.removeItem("admin-access-expires");
        setIsAuthorized(false);
        toast.info("Session d'accès administrateur expirée");
      }
    }
  }, []);

  const handleAccessCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Verify access code against environment variable or database
      const response = await fetch("/api/admin/verify-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessCode }),
      });

      if (response.ok) {
        const { token, expiresAt } = await response.json();

        // Store secure session with expiration
        localStorage.setItem("admin-access-token", token);
        localStorage.setItem("admin-access-expires", expiresAt);
        localStorage.setItem("admin-access-authorized", "true");

        setIsAuthorized(true);
        setIsOpen(false);
        toast.success("Accès administrateur autorisé");
      } else {
        toast.error("Code d'accès invalide");
      }
    } catch (error) {
      logger.error("Admin access verification failed", error, {
        feature: "admin_access",
        action: "verify_access_code",
      });
      toast.error("Erreur de connexion. Veuillez réessayer.");
    }
  };

  if (!isAuthorized) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="fixed bottom-4 left-4 opacity-20 hover:opacity-100 transition-opacity"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Accès Administrateur
            </DialogTitle>
            <DialogDescription>
              Entrez le code d&apos;accès pour accéder aux fonctionnalités
              d&apos;administration.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAccessCodeSubmit} className="space-y-4">
            <div>
              <Label htmlFor="accessCode">Code d&apos;accès</Label>
              <Input
                id="accessCode"
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                placeholder="Entrez le code d'accès"
                className="mt-1"
              />
            </div>
            <Button type="submit" className="w-full">
              Valider l&apos;accès
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 flex flex-col gap-2">
      <Link href="/login">
        <Button
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
        >
          Admin
        </Button>
      </Link>
      <Link href="/club-manager/login">
        <Button
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm"
        >
          Club Manager
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          localStorage.removeItem("admin-access-authorized");
          setIsAuthorized(false);
          toast.info("Accès administrateur révoqué");
        }}
        className="text-xs opacity-60 hover:opacity-100"
      >
        Révoquer
      </Button>
    </div>
  );
}
