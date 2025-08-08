"use client";

import { FederationLogo, LeagueLogo } from "@/components/logos";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";
import { Trophy, Users, Shield, ArrowRight, Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <LeagueLogo size="sm" />
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-foreground">
                  LRCSJJ
                </h1>
                <p className="text-xs text-muted-foreground">
                  Ligue Régionale Casablanca-Settat
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-6">
                <Link
                  href="/"
                  className="text-foreground font-medium hover:text-primary transition-colors duration-200"
                >
                  Accueil
                </Link>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  À Propos
                </Link>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  Contact
                </Link>
                <Link
                  href="/club-manager/login"
                  className="text-muted-foreground hover:text-[#017444] transition-colors duration-200"
                >
                  Clubs
                </Link>
              </nav>

              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <Link href="/login">
                  <Button className="btn-smooth bg-primary text-primary-foreground hover:bg-primary/90">
                    Connexion
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <Trophy className="h-4 w-4 mr-2" />
              Excellence en Ju-Jitsu Traditionnel
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Ligue Régionale
              <br />
              <span className="text-primary">Casablanca-Settat</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              La référence du Ju-Jitsu Traditionnel au Maroc. Rejoignez notre
              communauté d&apos;excellence et découvrez l&apos;art martial qui
              transforme des vies.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="btn-smooth text-lg px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90">
                Découvrir nos Clubs
              </Button>
              <Button
                variant="outline"
                className="btn-smooth text-lg px-8 py-3"
              >
                Nos Championnats
              </Button>
            </div>
          </div>

          {/* Logos showcase */}
          <div className="flex justify-center items-center space-x-12 mb-16 animate-slide-up">
            <div className="opacity-60 hover:opacity-100 transition-all duration-300 hover-lift">
              <LeagueLogo size="lg" />
            </div>
            <div className="opacity-60 hover:opacity-100 transition-all duration-300 hover-lift">
              <FederationLogo type="main" size="lg" />
            </div>
            <div className="opacity-60 hover:opacity-100 transition-all duration-300 hover-lift">
              <FederationLogo type="jjif" size="lg" />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-smooth animate-fade-in">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">
                  500+
                </h3>
                <p className="text-muted-foreground">Athlètes Licenciés</p>
              </CardContent>
            </Card>

            <Card className="card-smooth animate-fade-in">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">25+</h3>
                <p className="text-muted-foreground">Clubs Affiliés</p>
              </CardContent>
            </Card>

            <Card className="card-smooth animate-fade-in">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">
                  100+
                </h3>
                <p className="text-muted-foreground">Compétitions Organisées</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Nos Réalisations
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Représentant le Maroc avec fierté sur la scène internationale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-smooth animate-fade-in">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Champions Nationaux
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Multiples titres de champion national dans diverses catégories
                  de poids et groupes d&apos;âge.
                </p>
              </CardContent>
            </Card>

            <Card className="card-smooth animate-fade-in">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Reconnaissance Internationale
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Représentant le Maroc dans les compétitions africaines et
                  internationales de Ju-Jitsu.
                </p>
              </CardContent>
            </Card>

            <Card className="card-smooth animate-fade-in">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Développement Jeunesse
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Former la prochaine génération d&apos;athlètes marocains grâce
                  à des programmes dédiés.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              La Voix de nos Champions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez les témoignages authentiques de nos athlètes qui font la
              fierté de notre ligue
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="card-smooth animate-fade-in">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
                <div className="mb-6">
                  <Quote className="h-8 w-8 text-primary/30 mb-4" />
                  <p className="text-muted-foreground leading-relaxed italic text-lg">
                    &quot;La LRCSJJ m&apos;a donné les outils pour exceller non
                    seulement dans le Ju-Jitsu, mais aussi dans la vie.
                    L&apos;discipline et les valeurs apprises ici
                    m&apos;accompagnent chaque jour. Je suis fière de
                    représenter le Maroc grâce à cette formation
                    exceptionnelle.&quot;
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-xl">
                      AE
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">
                      Abdellah ElAbdellaoui
                    </h4>
                    <p className="text-muted-foreground">
                      Champion Continental - Ceinture Noire - 2ème DAN
                    </p>
                    <p className="text-sm text-primary">
                      Équipe Nationale du Maroc
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-smooth animate-fade-in">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
                <div className="mb-6">
                  <Quote className="h-8 w-8 text-accent/30 mb-4" />
                  <p className="text-muted-foreground leading-relaxed italic text-lg">
                    &quot;Avoir commencé mon parcours dans cette ligue est la
                    meilleure décision que j&apos;ai prise. L&apos;encadrement
                    professionnel, l&apos;esprit de famille et la qualité de
                    l&apos;enseignement font de cette ligue une référence
                    internationale.&quot;
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="text-accent font-semibold text-xl">
                      MZ
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">
                      Mouhssin Zengher
                    </h4>
                    <p className="text-muted-foreground">
                      Médaillé Continental - Ceinture Noire - 1er DAN
                    </p>
                    <p className="text-sm text-accent">Sélection Africaine</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-smooth animate-fade-in">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
                <div className="mb-6">
                  <Quote className="h-8 w-8 text-green-500/30 mb-4" />
                  <p className="text-muted-foreground leading-relaxed italic text-lg">
                    &quot;Cette ligue ne forme pas que des athlètes, elle forme
                    des champions de la vie. Chaque entraînement est une leçon
                    de persévérance, de respect et d&apos;excellence. Merci de
                    m&apos;avoir aidée à devenir la femme que je suis
                    aujourd&apos;hui.&quot;
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-xl">
                      YE
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">
                      Youssef ElHadi
                    </h4>
                    <p className="text-muted-foreground">
                      Champion Continental - Ceinture Noire - 2ème DAN
                    </p>
                    <p className="text-sm text-green-600">
                      Équipe Nationale du Maroc
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-smooth animate-fade-in">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
                <div className="mb-6">
                  <Quote className="h-8 w-8 text-blue-500/30 mb-4" />
                  <p className="text-muted-foreground leading-relaxed italic text-lg">
                    &quot;De mes débuts comme jeune athlète jusqu&apos;à mon
                    rôle actuel d&apos;encadrement, la LRCSJJ a été ma famille.
                    Les valeurs transmises ici transcendent le sport et
                    façonnent des citoyens exemplaires.&quot;
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-xl">
                      MB
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-lg">
                      Mohammed Bahdou
                    </h4>
                    <p className="text-muted-foreground">
                      Ancien Champion - Ceinture Noire - 4ème DAN
                    </p>
                    <p className="text-sm text-blue-600">Entraîneur Certifié</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to action for testimonials */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground text-lg mb-6">
              Rejoignez une communauté de champions qui transforment leur
              passion en excellence
            </p>
            <Button className="btn-smooth bg-primary text-primary-foreground hover:bg-primary/90">
              Commencer Mon Parcours
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="card-smooth border-0 shadow-lg animate-fade-in">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Prêt à Commencer Votre Parcours ?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Rejoignez-nous dès aujourd&apos;hui et découvrez l&apos;art du
                Ju-Jitsu dans un cadre professionnel et bienveillant.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="btn-smooth text-lg px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90">
                    Commencer Maintenant
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    className="btn-smooth text-lg px-8 py-3"
                  >
                    En Savoir Plus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
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
    </div>
  );
}
