"use client";

import { useEffect, useState } from "react";
import { logger } from "@/lib/logger";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SessionValidationProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function SessionValidation({
  children,
  requireAuth = true,
  redirectTo = "/login",
}: SessionValidationProps) {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const validateSession = () => {
      const token = localStorage.getItem("auth-token");

      if (!token && requireAuth) {
        setIsAuthenticated(false);
        setIsValidating(false);
        router.push(redirectTo);
        return;
      }

      if (token) {
        try {
          // Basic JWT expiration check (client-side)
          const payload = JSON.parse(atob(token.split(".")[1]));
          const now = Math.floor(Date.now() / 1000);

          if (payload.exp && payload.exp < now) {
            // Token expired
            localStorage.removeItem("auth-token");
            localStorage.removeItem("admin-access-authorized");
            localStorage.removeItem("admin-access-token");
            localStorage.removeItem("admin-access-expires");

            toast.error("Session expirée. Veuillez vous reconnecter.");
            setIsAuthenticated(false);
            setIsValidating(false);
            router.push(redirectTo);
            return;
          }

          setIsAuthenticated(true);
        } catch (error) {
          logger.error("Token validation failed", {
            feature: "session_validation",
            action: "token_validation_error",
            error: error instanceof Error ? error.message : String(error),
          });
          localStorage.removeItem("auth-token");
          setIsAuthenticated(false);
          setIsValidating(false);
          router.push(redirectTo);
          return;
        }
      }

      setIsValidating(false);
    };

    validateSession();

    // Check session every 5 minutes
    const interval = setInterval(validateSession, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [requireAuth, redirectTo, router]);

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  // Show content only if authenticated (or auth not required)
  if (!requireAuth || isAuthenticated) {
    return <>{children}</>;
  }

  // This shouldn't be reached, but just in case
  return null;
}

// Hook for checking authentication status
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth-token");

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const now = Math.floor(Date.now() / 1000);

          if (payload.exp && payload.exp > now) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem("auth-token");
          }
        } catch {
          setIsAuthenticated(false);
          localStorage.removeItem("auth-token");
        }
      } else {
        setIsAuthenticated(false);
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  return { isAuthenticated, isLoading };
}
