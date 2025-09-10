"use client";

import { Sidebar, MobileSidebar } from "@/components/ui/layout/sidebar";
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";
import { NotificationBell } from "@/components/shared/notifications/notification-bell";
import { useState, useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen bg-background">
        <div className="hidden lg:block lg:w-64 bg-card border-r border-border">
          <div className="animate-pulse p-4 space-y-4">
            <div className="h-16 bg-muted rounded"></div>
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-10 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="bg-card border-b border-border px-6 py-4">
            <div className="animate-pulse h-8 bg-muted rounded w-64"></div>
          </div>
          <div className="flex-1 p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-48"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background transition-colors duration-300">
      {/* Sidebar with animations */}
      <div className="animate-slide-in-left">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with animations */}
        <header className="bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4 animate-fade-in-down sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MobileSidebar />
              <div className="animate-fade-in-right animate-stagger-1">
                <h1 className="text-2xl font-bold text-foreground">
                  Administration LRCSJJ
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Gestion Avancée 2025
                </p>
              </div>
            </div>

            {/* Theme toggle and admin info */}
            <div className="flex items-center space-x-4 animate-fade-in-left animate-stagger-2">
              <NotificationBell />
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-foreground">
                  Administrateur
                </p>
                <p className="text-xs text-muted-foreground">Connecté</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main content with animations */}
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="animate-fade-in-up animate-stagger-3 h-full">
            {children}
          </div>
        </main>
      </div>

      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse animate-stagger-4"></div>
      </div>
    </div>
  );
}
