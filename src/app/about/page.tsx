'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Trophy, Users, Star, ArrowLeft, Target, Shield, Award } from "lucide-react";
import { LeagueLogo, PersonAvatar, FederationLogo } from "@/components/logos";
import { useEffect, useState } from 'react';

export default function AboutPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <LeagueLogo size="sm" />
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold text-foreground">LRCSJJ</h1>
                <p className="text-xs text-muted-foreground">Ligue Régionale Casablanca-Settat</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Accueil
                </Link>
                <Link href="/about" className="text-foreground font-medium hover:text-primary transition-colors duration-200">
                  À Propos
                </Link>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                  Contact
                </Link>
              </nav>
              
              <div className="flex items-center space-x-3">
                <ThemeToggle />
                <Link href="/login">
                  <Button className="btn-smooth bg-primary text-primary-foreground hover:bg-primary/90">
                    Connexion
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l&apos;accueil
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            À Propos de la
            <span className="text-gradient moroccan-accent block mt-2">Ligue Régionale Casablanca-Settat</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Découvrez l&apos;histoire, la mission et les valeurs qui font de notre ligue 
            la référence du Ju-Jitsu Traditionnel dans la région de Casablanca-Settat.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <h2 className="text-3xl font-bold text-foreground mb-6 moroccan-accent">
                Notre Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                La Ligue Régionale de Casablanca-Settat pour le Ju-Jitsu a pour mission de 
                promouvoir et développer la pratique du Ju-Jitsu Traditionnel dans notre région, 
                en offrant un environnement d&apos;excellence sportive et de formation continue.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nous nous engageons à former des athlètes de haut niveau tout en transmettant 
                les valeurs fondamentales de respect, discipline et persévérance qui caractérisent 
                cet art martial.
              </p>
            </div>
            
            <div className="animate-scale-in delay-200">
              <Card className="card-smooth">
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">25+</h3>
                      <p className="text-muted-foreground">Clubs Affiliés</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">500+</h3>
                      <p className="text-muted-foreground">Athlètes Licenciés</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4 moroccan-accent">
              Nos Valeurs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Les principes qui guident notre action au quotidien
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-smooth animate-scale-in delay-300">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Intégrité
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Nous prônons l&apos;honnêteté, la transparence et le fair-play dans toutes nos actions 
                  et compétitions.
                </p>
              </CardContent>
            </Card>

            <Card className="card-smooth animate-scale-in delay-400">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Excellence
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Nous visons l&apos;excellence dans la formation technique et le développement 
                  personnel de nos athlètes.
                </p>
              </CardContent>
            </Card>

            <Card className="card-smooth animate-scale-in delay-500">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Solidarité
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Nous cultivons l&apos;esprit d&apos;équipe et l&apos;entraide entre tous les membres 
                  de notre communauté.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4 moroccan-accent">
              Notre Histoire
            </h2>
          </div>
          
          <div className="space-y-12">
            <Card className="card-smooth">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Fondation et Premiers Pas
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Créée sous l&apos;égide de la Fédération Royale Marocaine de Ju-Jitsu, 
                      notre ligue a vu le jour avec l&apos;objectif ambitieux de développer le Ju-Jitsu 
                      Traditionnel dans la région économique du Maroc.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-smooth">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Croissance et Reconnaissance
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Au fil des années, notre ligue s&apos;est imposée comme un acteur majeur du 
                      Ju-Jitsu marocain, organisant des championnats de haut niveau et formant 
                      des athlètes qui représentent fièrement notre pays à l&apos;international.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-smooth">
              <CardContent className="p-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      Vers l&apos;Avenir
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Aujourd&apos;hui, nous continuons d&apos;innover et de nous développer, avec l&apos;ambition 
                      de faire du Maroc une référence mondiale en matière de Ju-Jitsu, tout en 
                      restant fidèles à nos valeurs fondamentales.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4 moroccan-accent">
              Direction et Gouvernance
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Une équipe dirigeante expérimentée au service de l&apos;excellence sportive
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="card-smooth animate-fade-in">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <PersonAvatar 
                    name="Président de la Ligue"
                    role="Direction"
                    initials="PL"
                    size="lg" 
                  />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Président de la Ligue
                </h3>
                <p className="text-muted-foreground mb-4">
                  Leadership et vision stratégique pour le développement du Ju-Jitsu régional
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    &quot;Notre mission est de faire rayonner l&apos;excellence du Ju-Jitsu marocain 
                    sur la scène internationale.&quot;
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="card-smooth animate-fade-in">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <PersonAvatar 
                    name="Directeur Technique"
                    role="Formation"
                    initials="DT"
                    size="lg" 
                  />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Directeur Technique
                </h3>
                <p className="text-muted-foreground mb-4">
                  Formation des entraîneurs et développement des programmes techniques
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    &quot;La qualité de la formation technique est la clé du succès de nos athlètes.&quot;
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Affiliations */}
      <section className="py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8 moroccan-accent">
            Nos Affiliations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="card-smooth">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <FederationLogo type="main" size="lg" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Fédération Royale Marocaine
                </h3>
                <p className="text-muted-foreground">
                  Membre officiel de la Fédération Royale Marocaine de Ju-Jitsu, 
                  garantissant notre légitimité et notre conformité aux standards nationaux.
                </p>
              </CardContent>
            </Card>

            <Card className="card-smooth">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <FederationLogo type="jjif" size="lg" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  Ju-Jitsu International Federation
                </h3>
                <p className="text-muted-foreground">
                  Reconnaissance internationale par la JJIF, nous permettant de participer 
                  aux compétitions mondiales et d&apos;appliquer les règlements internationaux.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="card-smooth border-0 shadow-lg">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Rejoignez Notre Communauté
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Découvrez comment notre ligue peut vous accompagner dans votre parcours 
                de Ju-Jitsu, que vous soyez débutant ou athlète confirmé.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="btn-primary text-lg px-8 py-3">
                    Nous Contacter
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="btn-secondary text-lg px-8 py-3">
                    Retour à l&apos;accueil
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
                  <h3 className="text-lg font-semibold text-foreground">LRCSJJ</h3>
                  <p className="text-sm text-muted-foreground">Ligue Régionale Casablanca-Settat</p>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Excellence, discipline et tradition martiale au service du développement 
                du Ju-Jitsu dans la région Casablanca-Settat.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-6">Navigation</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Accueil</Link></li>
                <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">À Propos</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-6">Sous l&apos;égide de</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <FederationLogo type="main" size="sm" showLabel={false} />
                  <div>
                    <p className="text-sm text-muted-foreground">Fédération Royale Marocaine</p>
                    <p className="text-sm text-muted-foreground">de Ju-Jitsu</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FederationLogo type="jjif" size="sm" showLabel={false} />
                  <div>
                    <p className="text-sm text-muted-foreground">Ju-Jitsu International</p>
                    <p className="text-sm text-muted-foreground">Federation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2025 LRCSJJ. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
