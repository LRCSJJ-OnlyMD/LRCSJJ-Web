'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { trpc } from '@/lib/trpc-client'
import { Plus, Edit, Trash2, User, Eye } from 'lucide-react'
import ImageUpload from '@/components/ui/image-upload'
import { getOptimizedImageUrl } from '@/lib/cloudinary'
import Image from 'next/image'

type Athlete = {
  id: string
  firstName: string
  lastName: string
  nationalId: string | null
  email: string | null
  phone: string | null
  dateOfBirth: Date
  weight: number | null
  belt: string | null
  photoUrl: string | null
  clubId: string
  club: {
    id: string
    name: string
  }
}

export default function AthletesManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null)
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationalId: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    weight: '',
    belt: 'BLANCHE',
    clubId: '',
    photoUrl: ''
  })
  const router = useRouter()

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('auth-token')
    if (!token) {
      router.push('/login')
      return
    }
    setIsAuthenticated(true)
    setIsLoading(false)
  }, [router])

  // Data queries
  const { data: athletes = [], refetch: refetchAthletes } = trpc.athletes.getAll.useQuery({}, {
    enabled: isAuthenticated
  })

  const { data: clubs = [] } = trpc.clubs.getAll.useQuery(undefined, {
    enabled: isAuthenticated
  })

  // Mutations
  const createAthleteMutation = trpc.athletes.create.useMutation({
    onSuccess: () => {
      refetchAthletes()
      setIsDialogOpen(false)
      resetForm()
    }
  })

  const updateAthleteMutation = trpc.athletes.update.useMutation({
    onSuccess: () => {
      refetchAthletes()
      setIsDialogOpen(false)
      setEditingAthlete(null)
      resetForm()
    }
  })

  const deleteAthleteMutation = trpc.athletes.delete.useMutation({
    onSuccess: () => {
      refetchAthletes()
    }
  })

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      nationalId: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      weight: '',
      belt: 'BLANCHE',
      clubId: '',
      photoUrl: ''
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const athleteData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      nationalId: formData.nationalId || undefined,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      dateOfBirth: formData.dateOfBirth,
      weight: formData.weight ? parseFloat(formData.weight) : undefined,
      belt: formData.belt,
      clubId: formData.clubId,
      photoUrl: formData.photoUrl || undefined
    }

    if (editingAthlete) {
      updateAthleteMutation.mutate({ id: editingAthlete.id, ...athleteData })
    } else {
      createAthleteMutation.mutate(athleteData)
    }
  }

  const handleEdit = (athlete: Athlete) => {
    setEditingAthlete(athlete)
    setFormData({
      firstName: athlete.firstName,
      lastName: athlete.lastName,
      nationalId: athlete.nationalId || '',
      email: athlete.email || '',
      phone: athlete.phone || '',
      dateOfBirth: new Date(athlete.dateOfBirth).toISOString().split('T')[0],
      weight: athlete.weight?.toString() || '',
      belt: athlete.belt || 'BLANCHE',
      clubId: athlete.clubId,
      photoUrl: athlete.photoUrl || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (athleteId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet athlète ?')) {
      deleteAthleteMutation.mutate({ id: athleteId })
    }
  }

  const handleViewDetails = (athlete: Athlete) => {
    setSelectedAthlete(athlete)
    setIsDetailsDialogOpen(true)
  }

  const getBeltColor = (belt: string | null) => {
    switch (belt?.toUpperCase()) {
      case 'BLANCHE': return 'bg-gray-100 text-gray-800'
      case 'JAUNE': return 'bg-yellow-100 text-yellow-800'
      case 'ORANGE': return 'bg-orange-100 text-orange-800'
      case 'VERTE': return 'bg-green-100 text-green-800'
      case 'BLEUE': return 'bg-blue-100 text-blue-800'
      case 'MARRON': return 'bg-yellow-600 text-white'
      case 'NOIRE': return 'bg-gray-900 text-white'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center animate-fade-in">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#d62027] mx-auto"></div>
          <p className="mt-4 text-muted-foreground font-medium">Chargement des athlètes...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const beltOptions = [
    { value: 'BLANCHE', label: 'Ceinture Blanche' },
    { value: 'JAUNE', label: 'Ceinture Jaune' },
    { value: 'ORANGE', label: 'Ceinture Orange' },
    { value: 'VERTE', label: 'Ceinture Verte' },
    { value: 'BLEUE', label: 'Ceinture Bleue' },
    { value: 'MARRON', label: 'Ceinture Marron' },
    { value: 'NOIRE', label: 'Ceinture Noire' }
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto animate-fade-in">
        <div className="flex items-center justify-between mb-8 animate-slide-down">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#d62027] to-[#b91c1c] bg-clip-text text-transparent">
              Gestion des Athlètes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              Gérez tous les athlètes de la ligue Casablanca-Settat
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-gradient-to-r from-[#d62027] to-[#b91c1c] hover:from-[#b91c1c] hover:to-[#991b1b] text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={() => {
                  setEditingAthlete(null)
                  resetForm()
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvel Athlète
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingAthlete ? 'Modifier l\'Athlète' : 'Nouvel Athlète'}
                </DialogTitle>
                <DialogDescription>
                  {editingAthlete ? 'Modifiez les informations de l\'athlète' : 'Ajoutez un nouvel athlète à la ligue'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                {/* Photo Upload */}
                <ImageUpload
                  currentImageUrl={formData.photoUrl}
                  onImageChange={(url) => setFormData(prev => ({ ...prev, photoUrl: url || '' }))}
                  label="Photo de l'athlète"
                />
                
                <div>
                  <Label htmlFor="nationalId">CIN</Label>
                  <Input
                    id="nationalId"
                    value={formData.nationalId}
                    onChange={(e) => setFormData(prev => ({ ...prev, nationalId: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dateOfBirth">Date de Naissance *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="weight">Poids (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="belt">Ceinture *</Label>
                    <Select value={formData.belt} onValueChange={(value) => setFormData(prev => ({ ...prev, belt: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la ceinture" />
                      </SelectTrigger>
                      <SelectContent>
                        {beltOptions.map((belt) => (
                          <SelectItem key={belt.value} value={belt.value}>
                            {belt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="clubId">Club *</Label>
                    <Select value={formData.clubId} onValueChange={(value) => setFormData(prev => ({ ...prev, clubId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un club" />
                      </SelectTrigger>
                      <SelectContent>
                        {clubs.map((club) => (
                          <SelectItem key={club.id} value={club.id}>
                            {club.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button type="submit" className="flex-1 bg-[#d62027] hover:bg-[#d62027]/90">
                    {editingAthlete ? 'Modifier' : 'Créer'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false)
                      setEditingAthlete(null)
                      resetForm()
                    }}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Details Modal */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de l&apos;Athlète</DialogTitle>
              <DialogDescription>
                Informations complètes de l&apos;athlète
              </DialogDescription>
            </DialogHeader>
            
            {selectedAthlete && (
              <div className="space-y-6">
                {/* Photo and Basic Info */}
                <div className="flex items-start space-x-6">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                    {selectedAthlete.photoUrl ? (
                      <Image
                        src={getOptimizedImageUrl(selectedAthlete.photoUrl, 96, 96)}
                        alt={`${selectedAthlete.firstName} ${selectedAthlete.lastName}`}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedAthlete.firstName} {selectedAthlete.lastName}
                    </h3>
                    <p className="text-gray-600 mt-1">{selectedAthlete.club.name}</p>
                    <div className="flex items-center space-x-3 mt-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBeltColor(selectedAthlete.belt)}`}>
                        {selectedAthlete.belt || 'Non définie'}
                      </span>
                      {selectedAthlete.weight && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                          {selectedAthlete.weight} kg
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Informations Personnelles</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Date de Naissance</p>
                        <p className="font-medium">
                          {new Date(selectedAthlete.dateOfBirth).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      {selectedAthlete.nationalId && (
                        <div>
                          <p className="text-sm text-gray-500">CIN</p>
                          <p className="font-medium">{selectedAthlete.nationalId}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Contact</h4>
                    <div className="space-y-3">
                      {selectedAthlete.phone && (
                        <div>
                          <p className="text-sm text-gray-500">Téléphone</p>
                          <p className="font-medium">{selectedAthlete.phone}</p>
                        </div>
                      )}
                      {selectedAthlete.email && (
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{selectedAthlete.email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sports Information */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Informations Sportives</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Ceinture</p>
                      <p className="font-semibold text-lg">{selectedAthlete.belt || 'Non définie'}</p>
                    </div>
                    {selectedAthlete.weight && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500">Poids</p>
                        <p className="font-semibold text-lg">{selectedAthlete.weight} kg</p>
                      </div>
                    )}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Club</p>
                      <p className="font-semibold text-lg">{selectedAthlete.club.name}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDetailsDialogOpen(false)}
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Card className="backdrop-blur-sm bg-card/90 border-0 shadow-2xl animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-[#d62027]/10 to-[#b91c1c]/10 dark:from-[#d62027]/20 dark:to-[#b91c1c]/20">
            <CardTitle className="text-2xl text-gray-900 dark:text-white">Athlètes de la Ligue ({athletes.length})</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Gérez tous les athlètes de la ligue Casablanca-Settat
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 dark:border-gray-700">
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">Photo</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">Nom complet</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">Club</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">Ceinture</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">Poids</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">Contact</TableHead>
                    <TableHead className="text-gray-900 dark:text-gray-100 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {athletes.map((athlete, index) => (
                    <TableRow 
                      key={athlete.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 border-gray-200 dark:border-gray-700"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                    <TableCell>
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex items-center justify-center shadow-md">
                        {athlete.photoUrl ? (
                          <Image
                            src={getOptimizedImageUrl(athlete.photoUrl, 48, 48)}
                            alt={`${athlete.firstName} ${athlete.lastName}`}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {athlete.firstName} {athlete.lastName}
                        </div>
                        {athlete.nationalId && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">CIN: {athlete.nationalId}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900 dark:text-white">{athlete.club.name}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBeltColor(athlete.belt)}`}>
                        {athlete.belt || 'Non définie'}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-900 dark:text-white">
                      {athlete.weight ? `${athlete.weight} kg` : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {athlete.phone && <div className="text-gray-900 dark:text-white">{athlete.phone}</div>}
                        {athlete.email && <div className="text-gray-500 dark:text-gray-400">{athlete.email}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(athlete)}
                          title="Voir les détails"
                          className="hover:bg-blue-50 hover:border-blue-300 hover:scale-105 transition-all duration-200 dark:hover:bg-blue-900/20 dark:hover:border-blue-400"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(athlete)}
                          title="Modifier"
                          className="hover:bg-yellow-50 hover:border-yellow-300 hover:scale-105 transition-all duration-200 dark:hover:bg-yellow-900/20 dark:hover:border-yellow-400"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(athlete.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 hover:scale-105 transition-all duration-200 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:border-red-400"
                          title="Supprimer"
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
            
            {athletes.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <div className="bg-muted/50 rounded-2xl p-8 mx-6">
                  <User className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Aucun athlète enregistré</p>
                  <Button 
                    className="bg-gradient-to-r from-[#d62027] to-[#b91c1c] hover:from-[#b91c1c] hover:to-[#991b1b] text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    onClick={() => {
                      setEditingAthlete(null)
                      resetForm()
                      setIsDialogOpen(true)
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer le premier athlète
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
