"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings, Key } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function AdminAccess() {
  const [isOpen, setIsOpen] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if already authorized
    const authorized = localStorage.getItem("admin-access-authorized");
    if (authorized === "true") {
      setIsAuthorized(true);
    }
  }, []);

  const handleAccessCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple access code check (in production, this should be more secure)
    if (accessCode === "LRCSJJ2025ADMIN") {
      localStorage.setItem("admin-access-authorized", "true");
      setIsAuthorized(true);
      setIsOpen(false);
      toast.success("Accès administrateur autorisé");
    } else {
      toast.error("Code d'accès invalide");
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
