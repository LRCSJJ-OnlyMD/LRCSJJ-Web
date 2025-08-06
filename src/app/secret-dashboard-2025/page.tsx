'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, Users, Calendar, Trophy, Shield, UserCheck, MapPin, TrendingUp, Activity } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const managementSections = [
    {
      title: 'Clubs',
      description: 'Gérer les clubs affiliés et leurs informations',
      icon: Building,
      href: '/secret-dashboard-2025/clubs',
      gradient: 'gradient-primary',
      stats: '25+ clubs'
    },
    {
      title: 'Athlètes',
      description: 'Gérer les athlètes inscrits et leurs données',
      icon: Users,
      href: '/secret-dashboard-2025/athletes',
      gradient: 'gradient-accent',
      stats: '200+ athlètes'
    },
    {
      title: 'Saisons',
      description: 'Organiser les saisons sportives et compétitions',
      icon: Calendar,
      href: '/secret-dashboard-2025/seasons',
      gradient: 'gradient-primary',
      stats: '10+ saisons'
    },
    {
      title: 'Championnats',
      description: 'Gérer les compétitions et tournois',
      icon: Trophy,
      href: '/secret-dashboard-2025/championships',
      gradient: 'gradient-accent',
      stats: '15+ championnats'
    },
    {
      title: 'Assurances',
      description: 'Gérer les assurances des athlètes',
      icon: Shield,
      href: '/secret-dashboard-2025/insurance',
      gradient: 'gradient-primary',
      stats: 'Suivi complet'
    },
    {
      title: 'Équipes',
      description: 'Organiser les équipes de ligue',
      icon: UserCheck,
      href: '/secret-dashboard-2025/teams',
      gradient: 'gradient-accent',
      stats: 'Organisation'
    },
    {
      title: 'Configuration Carte',
      description: 'Gérer les emplacements sur la carte',
      icon: MapPin,
      href: '/secret-dashboard-2025/map-config',
      gradient: 'gradient-primary',
      stats: 'Géolocalisation'
    }
  ]

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <div className="animate-fade-in-down">
        <div className="bg-gradient-primary p-8 rounded-2xl text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2 animate-fade-in-up animate-stagger-1">
              Tableau de Bord LRCSJJ
            </h1>
            <p className="text-white/90 text-lg animate-fade-in-up animate-stagger-2">
              Excellence, Discipline et Tradition Martiale - Administration 2025
            </p>
            <div className="flex items-center mt-4 space-x-4 animate-fade-in-up animate-stagger-3">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span className="text-sm">Système Actif</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm">Performance Optimale</span>
              </div>
            </div>
          </div>
          {/* Animated background elements */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Management Cards */}
      <div className="animate-fade-in-up animate-stagger-2">
        <h2 className="text-2xl font-bold text-foreground mb-6">Gestion Administrative</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {managementSections.map((section, index) => {
            const IconComponent = section.icon
            return (
              <Link key={section.href} href={section.href}>
                <Card className={`h-full hover-lift cursor-pointer group border-border bg-card/50 backdrop-blur-sm hover:bg-card transition-all duration-300 animate-scale-in animate-stagger-${(index % 5) + 1}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-xl ${section.gradient} text-white group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {section.stats}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                      {section.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {section.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Statistics and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in-up animate-stagger-3">
        {/* Statistics Card */}
        <Card className="border-border bg-card/80 backdrop-blur-sm hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Statistiques en Temps Réel</span>
            </CardTitle>
            <CardDescription>Aperçu de l&apos;activité de la ligue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Total des Clubs', value: '25+', color: 'text-primary' },
                { label: 'Athlètes Actifs', value: '200+', color: 'text-accent' },
                { label: 'Saisons Organisées', value: '10+', color: 'text-primary' },
                { label: 'Championnats', value: '15+', color: 'text-accent' },
              ].map((stat, index) => (
                <div key={stat.label} className={`flex justify-between items-center animate-fade-in-right animate-stagger-${index + 1}`}>
                  <span className="text-muted-foreground">{stat.label}:</span>
                  <span className={`font-bold text-lg ${stat.color}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="border-border bg-card/80 backdrop-blur-sm hover-lift">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Actions Rapides</span>
            </CardTitle>
            <CardDescription>Raccourcis vers les fonctions principales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  title: 'Ajouter un nouveau club',
                  description: 'Enregistrer un club affilié',
                  href: '/secret-dashboard-2025/clubs',
                  icon: Building
                },
                {
                  title: 'Inscrire un athlète',
                  description: 'Ajouter un athlète à la ligue',
                  href: '/secret-dashboard-2025/athletes',
                  icon: Users
                },
                {
                  title: 'Créer une saison',
                  description: 'Planifier une saison sportive',
                  href: '/secret-dashboard-2025/seasons',
                  icon: Calendar
                },
                {
                  title: 'Configurer la carte',
                  description: 'Gérer les emplacements',
                  href: '/secret-dashboard-2025/map-config',
                  icon: MapPin
                }
              ].map((action, index) => {
                const ActionIcon = action.icon
                return (
                  <Link 
                    key={action.href} 
                    href={action.href} 
                    className={`block p-4 border border-border rounded-lg hover:bg-accent/10 hover:border-primary/30 transition-all duration-300 group animate-fade-in-left animate-stagger-${index + 1}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <ActionIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {action.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Info */}
      <div className="text-center animate-fade-in animate-stagger-5">
        <p className="text-muted-foreground text-sm">
          Sous l&apos;égide de la Fédération Royale Marocaine de Ju-Jitsu
        </p>
      </div>
    </div>
  )
}
