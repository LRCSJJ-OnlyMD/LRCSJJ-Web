'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { trpc } from '@/lib/trpc-client'
import { Plus, Edit, Trash2, Calendar, Users, Trophy, Activity, Eye } from 'lucide-react'

type Season = {
  id: string
  name: string
  startDate: Date
  endDate: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  _count?: {
    insurances: number
    championships: number
  }
}

export default function SeasonsManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null)
  const [editingSeason, setEditingSeason] = useState<Season | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isActive: false
  })

  const router = useRouter()

  // TRPC queries
  const { data: seasons, isLoading: seasonsLoading, refetch } = trpc.seasons.getAll.useQuery()
  const createSeasonMutation = trpc.seasons.create.useMutation()
  const updateSeasonMutation = trpc.seasons.update.useMutation()
  const deleteSeasonMutation = trpc.seasons.delete.useMutation()

  useEffect(() => {
    const token = localStorage.getItem('admin-token')
    if (!token) {
      router.push('/login')
      return
    }
    setIsAuthenticated(true)
    setIsLoading(false)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingSeason) {
        await updateSeasonMutation.mutateAsync({
          id: editingSeason.id,
          name: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
          isActive: formData.isActive
        })
      } else {
        await createSeasonMutation.mutateAsync({
          name: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
          isActive: formData.isActive
        })
      }
      
      await refetch()
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error('Error saving season:', error)
    }
  }

  const handleEdit = (season: Season) => {
    setEditingSeason(season)
    setFormData({
      name: season.name,
      startDate: season.startDate.toISOString().split('T')[0],
      endDate: season.endDate.toISOString().split('T')[0],
      isActive: season.isActive
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (seasonId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette saison ?')) {
      try {
        await deleteSeasonMutation.mutateAsync({ id: seasonId })
        await refetch()
      } catch (error) {
        console.error('Error deleting season:', error)
      }
    }
  }

  const handleViewDetails = (season: Season) => {
    setSelectedSeason(season)
    setIsDetailsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      isActive: false
    })
    setEditingSeason(null)
  }

  const getSeasonStatus = (season: Season) => {
    const now = new Date()
    const start = new Date(season.startDate)
    const end = new Date(season.endDate)
    
    if (now < start) return { label: 'À venir', color: 'text-primary', bg: 'bg-blue-50' }
    if (now > end) return { label: 'Terminée', color: 'text-muted-foreground', bg: 'bg-gray-50' }
    return { label: 'En cours', color: 'text-accent', bg: 'bg-green-50' }
  }

  const getSeasonDuration = (season: Season) => {
    const start = new Date(season.startDate)
    const end = new Date(season.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const diffMonths = Math.round(diffDays / 30)
    
    return diffMonths > 0 ? `${diffMonths} mois` : `${diffDays} jours`
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  // Statistics for overview cards
  const totalSeasons = seasons?.length || 0
  const activeSeasons = seasons?.filter(s => s.isActive).length || 0
  const currentSeasons = seasons?.filter(s => {
    const now = new Date()
    const start = new Date(s.startDate)
    const end = new Date(s.endDate)
    return now >= start && now <= end
  }).length || 0

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Saisons</h1>
          <p className="text-muted-foreground mt-2">Gérez les saisons de la ligue de Ju-Jitsu Casablanca-Settat</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => {
                setEditingSeason(null)
                resetForm()
                setIsDialogOpen(true)
              }}
              className="bg-[#d62027] hover:bg-[#b51d24]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Saison
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingSeason ? 'Modifier la Saison' : 'Nouvelle Saison'}
              </DialogTitle>
              <DialogDescription>
                {editingSeason 
                  ? 'Modifiez les informations de la saison' 
                  : 'Créez une nouvelle saison pour la ligue'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom de la saison</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="ex: Saison 2024-2025"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="startDate">Date de début</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="endDate">Date de fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 text-[#d62027] bg-gray-100 border-gray-300 rounded focus:ring-[#d62027]"
                  aria-label="Marquer comme saison active"
                />
                <Label htmlFor="isActive">Saison active</Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit"
                  disabled={createSeasonMutation.isPending || updateSeasonMutation.isPending}
                  className="bg-[#d62027] hover:bg-[#b51d24]"
                >
                  {createSeasonMutation.isPending || updateSeasonMutation.isPending 
                    ? 'Enregistrement...' 
                    : editingSeason ? 'Modifier' : 'Créer'
                  }
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Details Modal */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Détails de la Saison</DialogTitle>
              <DialogDescription>
                Informations complètes de la saison sportive
              </DialogDescription>
            </DialogHeader>
            
            {selectedSeason && (
              <div className="space-y-6">
                {/* Season Header */}
                <div className="flex items-start space-x-4 border-b pb-4">
                  <div className="w-16 h-16 bg-[#d62027] rounded-lg flex items-center justify-center shrink-0">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-foreground">{selectedSeason.name}</h3>
                    <div className="flex items-center space-x-3 mt-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedSeason.isActive 
                          ? 'bg-accent/10 text-accent-foreground' 
                          : 'bg-muted text-foreground'
                      }`}>
                        {selectedSeason.isActive ? 'Saison Active' : 'Saison Inactive'}
                      </span>
                      <span className="px-3 py-1 bg-primary/10 text-primary-foreground rounded-full text-sm">
                        {Math.ceil((new Date(selectedSeason.endDate).getTime() - new Date(selectedSeason.startDate).getTime()) / (1000 * 60 * 60 * 24))} jours
                      </span>
                    </div>
                  </div>
                </div>

                {/* Season Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Période de la Saison</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-accent" />
                        <div>
                          <p className="text-sm text-muted-foreground">Date de Début</p>
                          <p className="font-semibold text-foreground">
                            {new Date(selectedSeason.startDate).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="text-sm text-muted-foreground">Date de Fin</p>
                          <p className="font-semibold text-foreground">
                            {new Date(selectedSeason.endDate).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">Durée Totale</p>
                        <p className="font-semibold text-lg">
                          {Math.ceil((new Date(selectedSeason.endDate).getTime() - new Date(selectedSeason.startDate).getTime()) / (1000 * 60 * 60 * 24))} jours
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Statistiques</h4>
                    <div className="space-y-3">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <Users className="w-6 h-6 text-primary" />
                          <div>
                            <p className="text-sm text-primary">Assurances</p>
                            <p className="font-semibold text-2xl text-primary-foreground">
                              {selectedSeason._count?.insurances || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <Trophy className="w-6 h-6 text-yellow-600" />
                          <div>
                            <p className="text-sm text-yellow-600">Championnats</p>
                            <p className="font-semibold text-2xl text-yellow-800">
                              {selectedSeason._count?.championships || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Information */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Informations Système</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">Date de Création</p>
                      <p className="font-medium">
                        {new Date(selectedSeason.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground">Dernière Modification</p>
                      <p className="font-medium">
                        {new Date(selectedSeason.updatedAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Season Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">État de la Saison</h4>
                  <div className="text-sm text-foreground">
                    <p>
                      La saison <strong>{selectedSeason.name}</strong> est actuellement 
                      <strong> {selectedSeason.isActive ? 'active' : 'inactive'}</strong>.
                    </p>
                    <p className="mt-2">
                      Elle couvre une période de <strong>
                        {Math.ceil((new Date(selectedSeason.endDate).getTime() - new Date(selectedSeason.startDate).getTime()) / (1000 * 60 * 60 * 24))} jours
                      </strong> avec <strong>{selectedSeason._count?.insurances || 0} assurance(s)</strong> et 
                      <strong> {selectedSeason._count?.championships || 0} championnat(s)</strong> associés.
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
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total des Saisons</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#d62027]">{totalSeasons}</div>
            <p className="text-xs text-muted-foreground">
              Toutes les saisons créées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saisons Actives</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#017444]">{activeSeasons}</div>
            <p className="text-xs text-muted-foreground">
              Saisons marquées comme actives
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{currentSeasons}</div>
            <p className="text-xs text-muted-foreground">
              Saisons actuellement en cours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seasons Management */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Liste des Saisons</TabsTrigger>
          <TabsTrigger value="active">Saisons Actives</TabsTrigger>
          <TabsTrigger value="archive">Archives</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Toutes les Saisons
              </CardTitle>
              <CardDescription>
                Vue d&apos;ensemble de toutes les saisons avec leurs statistiques
              </CardDescription>
            </CardHeader>
            <CardContent>
              {seasonsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d62027] mx-auto"></div>
                  <p className="mt-2 text-muted-foreground">Chargement des saisons...</p>
                </div>
              ) : seasons && seasons.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Saison</TableHead>
                      <TableHead>Période</TableHead>
                      <TableHead>Durée</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Assurances</TableHead>
                      <TableHead>État</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {seasons.map((season) => {
                      const status = getSeasonStatus(season)
                      const duration = getSeasonDuration(season)
                      return (
                        <TableRow key={season.id}>
                          <TableCell className="font-medium">{season.name}</TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              <div className="flex items-center gap-1">
                                <span className="text-accent">📅</span>
                                {new Date(season.startDate).toLocaleDateString('fr-FR')}
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-red-600">🏁</span>
                                {new Date(season.endDate).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">{duration}</span>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color} ${status.bg}`}>
                              {status.label}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{season._count?.insurances || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              season.isActive 
                                ? 'bg-accent/10 text-accent-foreground' 
                                : 'bg-muted text-foreground'
                            }`}>
                              {season.isActive ? '✅ Active' : '⏸️ Inactive'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewDetails(season)}
                                className="h-8 w-8 p-0"
                                title="Voir les détails"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleEdit(season)}
                                className="h-8 w-8 p-0"
                                title="Modifier"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDelete(season.id)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
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
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Aucune saison trouvée
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Commencez par créer votre première saison pour la ligue
                  </p>
                  <Button 
                    onClick={() => {
                      setEditingSeason(null)
                      resetForm()
                      setIsDialogOpen(true)
                    }}
                    className="bg-[#d62027] hover:bg-[#b51d24]"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Créer la première saison
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#017444]" />
                Saisons Actives
              </CardTitle>
              <CardDescription>
                Saisons actuellement marquées comme actives
              </CardDescription>
            </CardHeader>
            <CardContent>
              {seasons?.filter(s => s.isActive).length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune saison active trouvée</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {seasons?.filter(s => s.isActive).map((season) => {
                    const status = getSeasonStatus(season)
                    return (
                      <div key={season.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{season.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Du {new Date(season.startDate).toLocaleDateString('fr-FR')} 
                              au {new Date(season.endDate).toLocaleDateString('fr-FR')}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className={`text-sm font-medium ${status.color}`}>
                                {status.label}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {season._count?.insurances || 0} assurances
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEdit(season)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archive" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-muted-foreground" />
                Archives
              </CardTitle>
              <CardDescription>
                Saisons terminées et inactives
              </CardDescription>
            </CardHeader>
            <CardContent>
              {seasons?.filter(s => !s.isActive).length === 0 ? (
                <div className="text-center py-8">
                  <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucune saison archivée</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {seasons?.filter(s => !s.isActive).map((season) => {
                    const status = getSeasonStatus(season)
                    return (
                      <div key={season.id} className="border rounded-lg p-3 bg-gray-50">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{season.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {new Date(season.startDate).toLocaleDateString('fr-FR')} - 
                              {new Date(season.endDate).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <span className={`text-sm ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
