"use client";

import Link from "next/link";
import { LeagueLogo, FederationLogo } from "@/components/shared/logos";

export function Footer() {
  return (
    <footer className="bg-card border-t py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center space-x-4 mb-6">
              <LeagueLogo size="sm" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  LRCSJJ
                </h3>
                <p className="text-sm text-muted-foreground">
                  Ligue Régionale Casablanca-Settat
                </p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Excellence, discipline et tradition martiale au service du
              développement du Ju-Jitsu dans la région Casablanca-Settat.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  À Propos
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Actualités
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-foreground mb-6">
              Sous l&apos;égide de
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <FederationLogo type="main" size="sm" showLabel={false} />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Fédération Royale Marocaine
                  </p>
                  <p className="text-sm text-muted-foreground">de Ju-Jitsu</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FederationLogo
                  type="northAfrica"
                  size="sm"
                  showLabel={false}
                />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Union Nord-Africaine
                  </p>
                  <p className="text-sm text-muted-foreground">de Ju-Jitsu</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FederationLogo type="africa" size="sm" showLabel={false} />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Ju-Jitsu African Union
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FederationLogo type="jjif" size="sm" showLabel={false} />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Ju-Jitsu International
                  </p>
                  <p className="text-sm text-muted-foreground">Federation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2025 LRCSJJ. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
