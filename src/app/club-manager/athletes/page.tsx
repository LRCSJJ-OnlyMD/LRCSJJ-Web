'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { toast } from 'sonner'
import { 
  ArrowLeft, 
  Users, 
  UserPlus, 
  Edit, 
  Trash2, 
  Shield, 
  Search,
  Download,
  Eye
} from 'lucide-react'
import { LeagueLogo } from '@/components/logos'

interface Athlete {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: 'MALE' | 'FEMALE'
  belt: string
  weight: number
  hasInsurance: boolean
  insuranceExpiry: string | null
  createdAt: string
}

export default function ClubManagerAthletesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBelt, setFilterBelt] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const tokenData = localStorage.getItem('club-manager-token')
    if (!tokenData) {
      toast.error('Vous devez être connecté pour accéder à cette page')
      router.push('/club-manager/login')
      return
    }

    try {
      const parsedData = JSON.parse(tokenData)
      console.log('Club Manager:', parsedData.name, 'managing club:', parsedData.clubName)
      
      // TODO: Fetch athletes for this specific club using parsedData.clubId
      
      // Mock athletes data for the club
      setTimeout(() => {
        setAthletes([
          {
            id: '1',
            firstName: 'Ahmed',
            lastName: 'Benali',
            email: 'ahmed.benali@email.com',
            phone: '+212 6 12 34 56 78',
            dateOfBirth: '1995-05-15',
            gender: 'MALE',
            belt: 'Marron',
            weight: 75,
            hasInsurance: true,
            insuranceExpiry: '2025-12-31',
            createdAt: '2024-01-15T10:00:00Z'
          },
          {
            id: '2',
            firstName: 'Fatima',
            lastName: 'El Alaoui',
            email: 'fatima.alaoui@email.com',
            phone: '+212 6 23 45 67 89',
            dateOfBirth: '1998-03-22',
            gender: 'FEMALE',
            belt: 'Bleue',
            weight: 60,
            hasInsurance: true,
            insuranceExpiry: '2025-11-30',
            createdAt: '2024-02-20T14:30:00Z'
          },
          {
            id: '3',
            firstName: 'Youssef',
            lastName: 'Kassimi',
            email: 'youssef.kassimi@email.com',
            phone: '+212 6 34 56 78 90',
            dateOfBirth: '2000-08-10',
            gender: 'MALE',
            belt: 'Verte',
            weight: 82,
            hasInsurance: false,
            insuranceExpiry: null,
            createdAt: '2024-03-10T09:15:00Z'
          },
          {
            id: '4',
            firstName: 'Sophia',
            lastName: 'Benomar',
            email: 'sophia.benomar@email.com',
            phone: '+212 6 45 67 89 01',
            dateOfBirth: '1997-11-05',
            gender: 'FEMALE',
            belt: 'Noire',
            weight: 55,
            hasInsurance: true,
            insuranceExpiry: '2025-10-15',
            createdAt: '2024-01-05T16:45:00Z'
          }
        ])
        setIsLoading(false)
      }, 1000)
    } catch {
      toast.error('Session invalide')
      router.push('/club-manager/login')
    }
  }, [router])

  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = 
      athlete.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesBelt = !filterBelt || athlete.belt === filterBelt
    
    return matchesSearch && matchesBelt
  })

  const getBeltColor = (belt: string) => {
    const colors: Record<string, string> = {
      'Blanche': 'bg-gray-100 text-gray-800',
      'Jaune': 'bg-yellow-100 text-yellow-800',
      'Orange': 'bg-orange-100 text-orange-800',
      'Verte': 'bg-green-100 text-green-800',
      'Bleue': 'bg-blue-100 text-blue-800',
      'Marron': 'bg-amber-100 text-amber-800',
      'Noire': 'bg-gray-800 text-white'
    }
    return colors[belt] || 'bg-gray-100 text-gray-800'
  }

  const calculateAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth)
    const now = new Date()
    return now.getFullYear() - birth.getFullYear()
  }

  const handleAddAthlete = () => {
    toast.info('Fonctionnalité d\'ajout d\'athlète en cours de développement')
  }

  const handleEditAthlete = (athleteId: string) => {
    toast.info(`Modification de l'athlète ${athleteId} - En cours de développement`)
  }

  const handleDeleteAthlete = (athleteId: string) => {
    toast.info(`Suppression de l'athlète ${athleteId} - En cours de développement`)
  }

  const handleExportData = () => {
    toast.info('Export des données - En cours de développement')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LeagueLogo size="lg" className="mb-4" />
          <p className="text-muted-foreground">Chargement des athlètes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LeagueLogo size="sm" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Gestion des Athlètes</h1>
                <p className="text-sm text-muted-foreground">Club Ju-Jitsu Casablanca</p>
              </div>
            </div>
            
            <Link href="/club-manager/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour au Tableau de Bord
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Athlètes du Club
            </h2>
            <p className="text-muted-foreground">
              Gérez les athlètes de votre club et leurs informations
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleExportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button onClick={handleAddAthlete} className="bg-[#017444] hover:bg-[#017444]/90">
              <UserPlus className="w-4 h-4 mr-2" />
              Ajouter un Athlète
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Athlètes</p>
                  <p className="text-3xl font-bold text-foreground">{athletes.length}</p>
                </div>
                <Users className="w-8 h-8 text-[#017444]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avec Assurance</p>
                  <p className="text-3xl font-bold text-foreground">
                    {athletes.filter(a => a.hasInsurance).length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Hommes</p>
                  <p className="text-3xl font-bold text-foreground">
                    {athletes.filter(a => a.gender === 'MALE').length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Femmes</p>
                  <p className="text-3xl font-bold text-foreground">
                    {athletes.filter(a => a.gender === 'FEMALE').length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-pink-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search">Rechercher</Label>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nom, prénom ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <Label htmlFor="filter-belt">Filtrer par ceinture</Label>
                <select
                  id="filter-belt"
                  title="Filtrer par ceinture"
                  value={filterBelt}
                  onChange={(e) => setFilterBelt(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="">Toutes les ceintures</option>
                  <option value="Blanche">Blanche</option>
                  <option value="Jaune">Jaune</option>
                  <option value="Orange">Orange</option>
                  <option value="Verte">Verte</option>
                  <option value="Bleue">Bleue</option>
                  <option value="Marron">Marron</option>
                  <option value="Noire">Noire</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Athletes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des Athlètes ({filteredAthletes.length})</CardTitle>
            <CardDescription>
              Tous les athlètes inscrits dans votre club
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom Complet</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Âge</TableHead>
                    <TableHead>Ceinture</TableHead>
                    <TableHead>Poids (kg)</TableHead>
                    <TableHead>Assurance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAthletes.map((athlete) => (
                    <TableRow key={athlete.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{athlete.firstName} {athlete.lastName}</p>
                          <p className="text-sm text-muted-foreground">
                            {athlete.gender === 'MALE' ? 'Homme' : 'Femme'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{athlete.email}</p>
                          <p className="text-sm text-muted-foreground">{athlete.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{calculateAge(athlete.dateOfBirth)} ans</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBeltColor(athlete.belt)}`}>
                          {athlete.belt}
                        </span>
                      </TableCell>
                      <TableCell>{athlete.weight} kg</TableCell>
                      <TableCell>
                        {athlete.hasInsurance ? (
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-600">Valide</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-red-600" />
                            <span className="text-sm text-red-600">Aucune</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAthlete(athlete.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditAthlete(athlete.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteAthlete(athlete.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredAthletes.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm || filterBelt 
                    ? 'Aucun athlète ne correspond aux critères de recherche'
                    : 'Aucun athlète inscrit dans ce club'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
