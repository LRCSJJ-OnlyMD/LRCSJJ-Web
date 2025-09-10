"use client";

import Link from "next/link";
import { Button } from "@/components/ui/primitives/button";
import { Card, CardContent } from "@/components/ui/primitives/card";
import { Navbar } from "@/components/ui/layout/navbar";
import { Footer } from "@/components/ui/layout/footer";
import {
  Trophy,
  Users,
  Star,
  ArrowLeft,
  Target,
  Shield,
  Award,
  Quote,
} from "lucide-react";
import { PersonAvatar, FederationLogo } from "@/components/shared/logos";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />

      {/* Page Header */}
      <section className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l&apos;accueil
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            À Propos de la
            <span className="text-gradient moroccan-accent block mt-2">
              Ligue Régionale Casablanca-Settat
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Découvrez l&apos;histoire, la mission et les valeurs qui font de
            notre ligue la référence du Ju-Jitsu Traditionnel dans la région de
            Casablanca-Settat.
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
                La Ligue Régionale de Casablanca-Settat pour le Ju-Jitsu a pour
                mission de promouvoir et développer la pratique du Ju-Jitsu
                Traditionnel dans notre région, en offrant un environnement
                d&apos;excellence sportive et de formation continue.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Nous nous engageons à former des athlètes de haut niveau tout en
                transmettant les valeurs fondamentales de respect, discipline et
                persévérance qui caractérisent cet art martial.
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
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        25+
                      </h3>
                      <p className="text-muted-foreground">Clubs Affiliés</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        500+
                      </h3>
                      <p className="text-muted-foreground">
                        Athlètes Licenciés
                      </p>
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
                  Nous prônons l&apos;honnêteté, la transparence et le fair-play
                  dans toutes nos actions et compétitions.
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
                  Nous visons l&apos;excellence dans la formation technique et
                  le développement personnel de nos athlètes.
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
                  Nous cultivons l&apos;esprit d&apos;équipe et l&apos;entraide
                  entre tous les membres de notre communauté.
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
                      Créée sous l&apos;égide de la Fédération Royale Marocaine
                      de Ju-Jitsu, notre ligue a vu le jour avec l&apos;objectif
                      ambitieux de développer le Ju-Jitsu Traditionnel dans la
                      région économique du Maroc.
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
                      Au fil des années, notre ligue s&apos;est imposée comme un
                      acteur majeur du Ju-Jitsu marocain, organisant des
                      championnats de haut niveau et formant des athlètes qui
                      représentent fièrement notre pays à l&apos;international.
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
                      Aujourd&apos;hui, nous continuons d&apos;innover et de
                      nous développer, avec l&apos;ambition de faire du Maroc
                      une référence mondiale en matière de Ju-Jitsu, tout en
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
              Une équipe dirigeante expérimentée au service de l&apos;excellence
              sportive
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
                  Yakine Missbah
                </h3>
                <p className="text-muted-foreground mb-4">
                  Leadership et vision stratégique pour le développement du
                  Ju-Jitsu régional
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    &quot;Notre mission est de faire rayonner l&apos;excellence
                    du Ju-Jitsu marocain sur la scène internationale.&quot;
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
                  Mohammed ElFahd
                </h3>
                <p className="text-muted-foreground mb-4">
                  Formation des entraîneurs et développement des programmes
                  techniques
                </p>
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    &quot;La qualité de la formation technique est la clé du
                    succès de nos athlètes.&quot;
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4 moroccan-accent">
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

          <div className="text-center mt-12">
            <p className="text-muted-foreground text-lg mb-6">
              Rejoignez une communauté de champions qui transforment leur
              passion en excellence
            </p>
            <Link href="/contact">
              <Button className="btn-primary text-lg px-8 py-3">
                Commencer Mon Parcours
                <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Affiliations */}
      <section className="py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-8 moroccan-accent">
            Nos Affiliations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="card-smooth">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <FederationLogo type="main" size="md" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Fédération Royale Marocaine
                </h3>
                <p className="text-sm text-muted-foreground">
                  Membre officiel de la FRMJJ, garantissant notre légitimité et
                  conformité aux standards nationaux.
                </p>
              </CardContent>
            </Card>

            <Card className="card-smooth">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <FederationLogo type="northAfrica" size="md" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Union Nord-Africaine
                </h3>
                <p className="text-sm text-muted-foreground">
                  Membre de l&apos;UNAJJ, renforçant nos liens avec les pays
                  voisins du Maghreb.
                </p>
              </CardContent>
            </Card>

            <Card className="card-smooth">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <FederationLogo type="africa" size="md" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Union Africaine
                </h3>
                <p className="text-sm text-muted-foreground">
                  Membre de la JJAU, participant au développement du Ju-Jitsu en
                  Afrique.
                </p>
              </CardContent>
            </Card>

            <Card className="card-smooth">
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <FederationLogo type="jjif" size="md" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Fédération Internationale
                </h3>
                <p className="text-sm text-muted-foreground">
                  Reconnaissance JJIF pour les compétitions mondiales et
                  règlements internationaux.
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
                Découvrez comment notre ligue peut vous accompagner dans votre
                parcours de Ju-Jitsu, que vous soyez débutant ou athlète
                confirmé.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="btn-primary text-lg px-8 py-3">
                    Nous Contacter
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="outline"
                    className="btn-secondary text-lg px-8 py-3"
                  >
                    Retour à l&apos;accueil
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
