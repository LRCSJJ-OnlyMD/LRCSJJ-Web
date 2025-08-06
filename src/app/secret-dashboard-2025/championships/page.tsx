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
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { trpc } from '@/lib/trpc-client'
import { Plus, Edit, Trash2, Trophy, Calendar, MapPin, Users, Medal, Eye } from 'lucide-react'

type Championship = {
  id: string
  name: string
  description: string | null
  location: string | null
  startDate: Date
  endDate: Date
  entryFee: number
  seasonId: string
  season: {
    id: string
    name: string
  }
  createdAt: Date
  _count?: {
    clubs: number
  }
}

export default function ChampionshipsManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedChampionship, setSelectedChampionship] = useState<Championship | null>(null)
  const [editingChampionship, setEditingChampionship] = useState<Championship | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    entryFee: '',
    seasonId: ''
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
  const { data: championships = [], refetch: refetchChampionships } = trpc.championships.getAll.useQuery(undefined, {
    enabled: isAuthenticated
  })

  const { data: seasons = [] } = trpc.seasons.getAll.useQuery(undefined, {
    enabled: isAuthenticated
  })

  // Mutations
  const createChampionshipMutation = trpc.championships.create.useMutation({
    onSuccess: () => {
      refetchChampionships()
      setIsDialogOpen(false)
      resetForm()
    }
  })

  const updateChampionshipMutation = trpc.championships.update.useMutation({
    onSuccess: () => {
      refetchChampionships()
      setIsDialogOpen(false)
      setEditingChampionship(null)
      resetForm()
    }
  })

  const deleteChampionshipMutation = trpc.championships.delete.useMutation({
    onSuccess: () => {
      refetchChampionships()
    }
  })

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      startDate: '',
      endDate: '',
      entryFee: '',
      seasonId: ''
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const championshipData = {
      name: formData.name,
      description: formData.description || undefined,
      location: formData.location || undefined,
      startDate: formData.startDate,
      endDate: formData.endDate,
      entryFee: formData.entryFee ? parseFloat(formData.entryFee) : 0,
      seasonId: formData.seasonId
    }

    if (editingChampionship) {
      updateChampionshipMutation.mutate({ id: editingChampionship.id, ...championshipData })
    } else {
      createChampionshipMutation.mutate(championshipData)
    }
  }

  const handleEdit = (championship: Championship) => {
    setEditingChampionship(championship)
    setFormData({
      name: championship.name,
      description: championship.description || '',
      location: championship.location || '',
      startDate: new Date(championship.startDate).toISOString().split('T')[0],
      endDate: new Date(championship.endDate).toISOString().split('T')[0],
      entryFee: championship.entryFee.toString(),
      seasonId: championship.seasonId
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (championshipId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce championnat ?')) {
      deleteChampionshipMutation.mutate({ id: championshipId })
    }
  }

  const handleViewDetails = (championship: Championship) => {
    setSelectedChampionship(championship)
    setIsDetailsDialogOpen(true)
  }

  const getStatusByDate = (startDate: Date, endDate: Date) => {
    const now = new Date()
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (now < start) return 'upcoming'
    if (now >= start && now <= end) return 'ongoing'
    return 'completed'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      case 'ongoing': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'upcoming': return 'À venir'
      case 'ongoing': return 'En cours'
      case 'completed': return 'Terminé'
      default: return status
    }
  }

  // Statistics
  const stats = {
    total: championships.length,
    upcoming: championships.filter(c => getStatusByDate(c.startDate, c.endDate) === 'upcoming').length,
    ongoing: championships.filter(c => getStatusByDate(c.startDate, c.endDate) === 'ongoing').length,
    completed: championships.filter(c => getStatusByDate(c.startDate, c.endDate) === 'completed').length,
    totalClubs: championships.reduce((sum, c) => sum + (c._count?.clubs || 0), 0)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#d62027]"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des Championnats
            </h1>
            <p className="text-gray-600 mt-2">
              Organisez et gérez les compétitions de Ju-Jitsu de la ligue
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-[#d62027] hover:bg-[#d62027]/90"
                onClick={() => {
                  setEditingChampionship(null)
                  resetForm()
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Championnat
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingChampionship ? 'Modifier le Championnat' : 'Nouveau Championnat'}
                </DialogTitle>
                <DialogDescription>
                  {editingChampionship ? 'Modifiez les informations du championnat' : 'Créez un nouveau championnat pour la ligue'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom du championnat *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="ex: Championnat Régional 2025"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description du championnat, règles spéciales, etc."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Lieu</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="ex: Complexe Sportif Mohammed V, Casablanca"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Date de début *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="endDate">Date de fin *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="entryFee">Frais d&apos;inscription (MAD) *</Label>
                    <Input
                      id="entryFee"
                      type="number"
                      step="0.01"
                      value={formData.entryFee}
                      onChange={(e) => setFormData(prev => ({ ...prev, entryFee: e.target.value }))}
                      placeholder="200.00"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="seasonId">Saison *</Label>
                    <Select value={formData.seasonId} onValueChange={(value) => setFormData(prev => ({ ...prev, seasonId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une saison" />
                      </SelectTrigger>
                      <SelectContent>
                        {seasons.map(season => (
                          <SelectItem key={season.id} value={season.id}>
                            {season.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button type="submit" className="flex-1 bg-[#d62027] hover:bg-[#d62027]/90">
                    {editingChampionship ? 'Modifier' : 'Créer'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false)
                      setEditingChampionship(null)
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
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Détails du Championnat</DialogTitle>
              <DialogDescription>
                Informations complètes du championnat
              </DialogDescription>
            </DialogHeader>
            
            {selectedChampionship && (
              <div className="space-y-6">
                {/* Championship Header */}
                <div className="flex items-start space-x-4 border-b pb-4">
                  <div className="w-16 h-16 bg-[#d62027] rounded-lg flex items-center justify-center shrink-0">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900">{selectedChampionship.name}</h3>
                    <p className="text-gray-600 mt-1">{selectedChampionship.season.name}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getStatusByDate(selectedChampionship.startDate, selectedChampionship.endDate))}`}>
                        {getStatusLabel(getStatusByDate(selectedChampionship.startDate, selectedChampionship.endDate))}
                      </span>
                      <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                        {selectedChampionship.entryFee} MAD
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {selectedChampionship._count?.clubs || 0} club(s)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedChampionship.description && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-700 leading-relaxed">{selectedChampionship.description}</p>
                  </div>
                )}

                {/* Event Details */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Informations de l&apos;Événement</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Date de début</p>
                          <p className="font-medium">
                            {new Date(selectedChampionship.startDate).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Date de fin</p>
                          <p className="font-medium">
                            {new Date(selectedChampionship.endDate).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      {selectedChampionship.location && (
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Lieu</p>
                            <p className="font-medium">{selectedChampionship.location}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Statistiques</h4>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <Users className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-500">Clubs Participants</p>
                            <p className="font-semibold text-xl text-blue-600">
                              {selectedChampionship._count?.clubs || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <Trophy className="w-5 h-5 text-[#d62027]" />
                          <div>
                            <p className="text-sm text-gray-500">Frais d&apos;Inscription</p>
                            <p className="font-semibold text-xl text-[#d62027]">
                              {selectedChampionship.entryFee} MAD
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Duration Calculation */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Durée de l&apos;Événement</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-lg font-medium text-gray-800">
                      {Math.ceil((new Date(selectedChampionship.endDate).getTime() - new Date(selectedChampionship.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1)} jour(s)
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Du {new Date(selectedChampionship.startDate).toLocaleDateString('fr-FR')} au {new Date(selectedChampionship.endDate).toLocaleDateString('fr-FR')}
                    </p>
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

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
            <TabsTrigger value="list">Liste des championnats</TabsTrigger>
            <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Championnats</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">À venir</CardTitle>
                  <Calendar className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats.upcoming}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En cours</CardTitle>
                  <Medal className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats.ongoing}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clubs Participants</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalClubs}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Championnats de la Ligue ({championships.length})</CardTitle>
                <CardDescription>
                  Liste complète des championnats organisés par la ligue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Championnat</TableHead>
                      <TableHead>Lieu</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Saison</TableHead>
                      <TableHead>Clubs</TableHead>
                      <TableHead>Frais</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {championships.map((championship) => {
                      const status = getStatusByDate(championship.startDate, championship.endDate)
                      return (
                        <TableRow key={championship.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{championship.name}</div>
                              {championship.description && (
                                <div className="text-sm text-gray-500 line-clamp-2">{championship.description}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{championship.location || 'Non spécifié'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{new Date(championship.startDate).toLocaleDateString('fr-FR')}</div>
                              <div className="text-gray-500">au {new Date(championship.endDate).toLocaleDateString('fr-FR')}</div>
                            </div>
                          </TableCell>
                          <TableCell>{championship.season.name}</TableCell>
                          <TableCell>
                            <div className="text-center font-semibold">
                              {championship._count?.clubs || 0}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{championship.entryFee} MAD</div>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                              {getStatusLabel(status)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(championship)}
                                title="Voir les détails"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(championship)}
                                title="Modifier"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(championship.id)}
                                className="text-red-600 hover:text-red-700"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
                
                {championships.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aucun championnat organisé</p>
                    <Button 
                      className="mt-4 bg-[#d62027] hover:bg-[#d62027]/90"
                      onClick={() => {
                        setEditingChampionship(null)
                        resetForm()
                        setIsDialogOpen(true)
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Organiser le premier championnat
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendrier des Championnats</CardTitle>
                <CardDescription>
                  Vue chronologique des championnats à venir et passés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {championships
                    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                    .map((championship) => {
                      const status = getStatusByDate(championship.startDate, championship.endDate)
                      return (
                        <div key={championship.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-[#d62027] rounded-lg flex items-center justify-center">
                              <Trophy className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{championship.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(championship.startDate).toLocaleDateString('fr-FR')}</span>
                              </div>
                              {championship.location && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{championship.location}</span>
                                </div>
                              )}
                              <div className="flex items-center space-x-1">
                                <Users className="w-4 h-4" />
                                <span>{championship._count?.clubs || 0} clubs</span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                              {getStatusLabel(status)}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
