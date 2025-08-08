'use client'

// Athlete Payment Management Component
// Create payments for individual athletes or bulk payments

import React, { useState, useEffect } from 'react'
import { Button } from './button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card'
import { Input } from './input'
import { Label } from './label'
import { Badge } from './badge'
import { Checkbox } from './checkbox'
import { 
  Users, 
  CreditCard, 
  Search, 
  CheckCircle, 
  XCircle, 
  Calendar,
  AlertTriangle
} from 'lucide-react'
import { StripeClientService, type ClientPaymentRequest } from '@/lib/stripe-client'
import { toast } from 'sonner'

// Mock data structure - in production, this would come from your database
interface Athlete {
  id: string
  name: string
  email?: string
  phone?: string
  clubId: string
  clubName: string
  insuranceStatus: 'ACTIVE' | 'EXPIRED' | 'NEVER_PAID'
  lastPaymentDate?: string
  expiryDate?: string
  category: string
  birthDate: string
}

interface Season {
  id: string
  year: string
  name: string
  isActive: boolean
}

export function AthletePaymentManager() {
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAthletes, setSelectedAthletes] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('')

  // Load mock data - replace with actual API calls
  useEffect(() => {
    loadMockData()
  }, [])

  const loadMockData = () => {
    // Mock seasons
    const mockSeasons: Season[] = [
      {
        id: 'season-2025',
        year: '2025',
        name: 'Saison 2025',
        isActive: true
      },
      {
        id: 'season-2024',
        year: '2024',
        name: 'Saison 2024',
        isActive: false
      }
    ]

    // Mock athletes
    const mockAthletes: Athlete[] = [
      {
        id: 'athlete-1',
        name: 'Ahmed Benali',
        email: 'ahmed.benali@example.com',
        phone: '+212612345678',
        clubId: 'club-1',
        clubName: 'Club Ju-Jitsu Casablanca',
        insuranceStatus: 'EXPIRED',
        lastPaymentDate: '2024-01-15',
        expiryDate: '2025-01-15',
        category: 'Senior',
        birthDate: '1995-05-20'
      },
      {
        id: 'athlete-2',
        name: 'Fatima El Alaoui',
        email: 'fatima.elalaoui@example.com',
        phone: '+212623456789',
        clubId: 'club-1',
        clubName: 'Club Ju-Jitsu Casablanca',
        insuranceStatus: 'ACTIVE',
        lastPaymentDate: '2025-02-10',
        expiryDate: '2026-02-10',
        category: 'Junior',
        birthDate: '2000-08-15'
      },
      {
        id: 'athlete-3',
        name: 'Youssef Kassimi',
        email: 'youssef.kassimi@example.com',
        phone: '+212634567890',
        clubId: 'club-1',
        clubName: 'Club Ju-Jitsu Casablanca',
        insuranceStatus: 'NEVER_PAID',
        category: 'Cadet',
        birthDate: '2005-12-03'
      },
      {
        id: 'athlete-4',
        name: 'Sophia Benomar',
        email: 'sophia.benomar@example.com',
        phone: '+212645678901',
        clubId: 'club-1',
        clubName: 'Club Ju-Jitsu Casablanca',
        insuranceStatus: 'EXPIRED',
        lastPaymentDate: '2024-06-20',
        expiryDate: '2025-06-20',
        category: 'Senior',
        birthDate: '1998-03-12'
      },
      {
        id: 'athlete-5',
        name: 'Hassan Moukrim',
        email: 'hassan.moukrim@example.com',
        phone: '+212656789012',
        clubId: 'club-1',
        clubName: 'Club Ju-Jitsu Casablanca',
        insuranceStatus: 'NEVER_PAID',
        category: 'Senior',
        birthDate: '1992-11-08'
      }
    ]

    setSeasons(mockSeasons)
    setAthletes(mockAthletes)
    setSelectedSeason(mockSeasons.find(s => s.isActive) || mockSeasons[0])
  }

  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = 
      athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !filterStatus || athlete.insuranceStatus === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const handleAthleteSelection = (athleteId: string, checked: boolean) => {
    const newSelection = new Set(selectedAthletes)
    if (checked) {
      newSelection.add(athleteId)
    } else {
      newSelection.delete(athleteId)
    }
    setSelectedAthletes(newSelection)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAthletes(new Set(filteredAthletes.map(a => a.id)))
    } else {
      setSelectedAthletes(new Set())
    }
  }

  const handleSinglePayment = async (athlete: Athlete) => {
    if (!selectedSeason) {
      toast.error('Veuillez sélectionner une saison')
      return
    }

    setIsLoading(true)
    try {
      const paymentRequest: ClientPaymentRequest = {
        athleteId: athlete.id,
        athleteName: athlete.name,
        clubId: athlete.clubId,
        clubName: athlete.clubName,
        seasonId: selectedSeason.id,
        seasonYear: selectedSeason.year,
        customerEmail: athlete.email,
        customerPhone: athlete.phone
      }

      const result = await StripeClientService.redirectToCheckout(paymentRequest)
      
      if (result.success) {
        toast.success(`Redirection vers le paiement pour ${athlete.name}`)
      } else {
        toast.error(result.error || 'Erreur lors de la création du paiement')
      }
    } catch (error) {
      toast.error('Erreur lors de la création du paiement')
      console.error('Payment error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkPayment = async () => {
    if (selectedAthletes.size === 0) {
      toast.error('Veuillez sélectionner au moins un athlète')
      return
    }

    if (!selectedSeason) {
      toast.error('Veuillez sélectionner une saison')
      return
    }

    // For bulk payments, we'll create individual Stripe sessions
    // In a more advanced implementation, you could create a single session with multiple line items
    
    const selectedAthletesList = athletes.filter(a => selectedAthletes.has(a.id))
    
    setIsLoading(true)
    try {
      // Create payment for the first athlete (for demo)
      // In production, you might want to create a bulk payment session
      const firstAthlete = selectedAthletesList[0]
      
      const paymentRequest: ClientPaymentRequest = {
        athleteId: firstAthlete.id,
        athleteName: `Paiement groupé pour ${selectedAthletes.size} athlètes`,
        clubId: firstAthlete.clubId,
        clubName: firstAthlete.clubName,
        seasonId: selectedSeason.id,
        seasonYear: selectedSeason.year,
        customerEmail: firstAthlete.email,
        customerPhone: firstAthlete.phone
      }

      const result = await StripeClientService.redirectToCheckout(paymentRequest)
      
      if (result.success) {
        toast.success(`Redirection vers le paiement groupé pour ${selectedAthletes.size} athlètes`)
      } else {
        toast.error(result.error || 'Erreur lors de la création du paiement groupé')
      }
    } catch (error) {
      toast.error('Erreur lors de la création du paiement groupé')
      console.error('Bulk payment error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case 'EXPIRED':
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Expiré
          </Badge>
        )
      case 'NEVER_PAID':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Jamais payé
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const getPaymentAmount = () => {
    return 150 * selectedAthletes.size // 150 MAD per athlete
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" />
            Gestion des Paiements d&apos;Assurance
          </CardTitle>
          <CardDescription>
            Créer des paiements d&apos;assurance pour les athlètes (150 MAD par an)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Saison sélectionnée</p>
              <p className="font-semibold">
                {selectedSeason ? selectedSeason.name : 'Aucune saison sélectionnée'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Athlètes sélectionnés</p>
              <p className="font-semibold">{selectedAthletes.size} athlète(s)</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Montant total</p>
              <p className="font-bold text-xl text-red-600">
                {formatAmount(getPaymentAmount())}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Season Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Sélection de la saison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {seasons.map((season) => (
              <Button
                key={season.id}
                variant={selectedSeason?.id === season.id ? "default" : "outline"}
                onClick={() => setSelectedSeason(season)}
                className={selectedSeason?.id === season.id ? "bg-red-600 hover:bg-red-700" : ""}
              >
                {season.name}
                {season.isActive && <span className="ml-2 text-xs">(Active)</span>}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Rechercher un athlète</Label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nom, email ou catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Label htmlFor="filter-status">Statut assurance</Label>
              <select
                id="filter-status"
                title="Filtrer par statut d'assurance"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="">Tous les statuts</option>
                <option value="ACTIVE">Active</option>
                <option value="EXPIRED">Expiré</option>
                <option value="NEVER_PAID">Jamais payé</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedAthletes.size > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium">
                  {selectedAthletes.size} athlète(s) sélectionné(s)
                </span>
                <span className="text-lg font-bold text-red-600">
                  Total: {formatAmount(getPaymentAmount())}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedAthletes(new Set())}
                >
                  Annuler sélection
                </Button>
                <Button
                  onClick={handleBulkPayment}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Paiement groupé
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Athletes List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des athlètes ({filteredAthletes.length})</CardTitle>
              <CardDescription>
                Sélectionnez les athlètes pour créer des paiements d&apos;assurance
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={selectedAthletes.size === filteredAthletes.length && filteredAthletes.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all" className="text-sm font-medium">
                Tout sélectionner
              </Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredAthletes.map((athlete) => (
              <div key={athlete.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <Checkbox
                    id={`athlete-${athlete.id}`}
                    checked={selectedAthletes.has(athlete.id)}
                    onCheckedChange={(checked: boolean) => handleAthleteSelection(athlete.id, checked)}
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <p className="font-medium">{athlete.name}</p>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-600">{athlete.category}</span>
                      {getStatusBadge(athlete.insuranceStatus)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {athlete.email && <span>{athlete.email}</span>}
                      {athlete.email && athlete.phone && <span> • </span>}
                      {athlete.phone && <span>{athlete.phone}</span>}
                    </div>
                    {athlete.insuranceStatus === 'ACTIVE' && athlete.expiryDate && (
                      <div className="text-xs text-green-600">
                        Expire le: {formatDate(athlete.expiryDate)}
                      </div>
                    )}
                    {athlete.insuranceStatus === 'EXPIRED' && athlete.expiryDate && (
                      <div className="text-xs text-red-600">
                        Expiré le: {formatDate(athlete.expiryDate)}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-red-600">150 MAD</span>
                  <Button
                    size="sm"
                    onClick={() => handleSinglePayment(athlete)}
                    disabled={isLoading}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <CreditCard className="w-4 h-4 mr-1" />
                    Payer
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {filteredAthletes.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || filterStatus 
                  ? 'Aucun athlète ne correspond aux critères de recherche'
                  : 'Aucun athlète trouvé'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
