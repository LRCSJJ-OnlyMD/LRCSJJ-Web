'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/primitives/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/primitives/card'
import { Input } from '@/components/ui/primitives/input'
import { Label } from '@/components/ui/primitives/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/primitives/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/primitives/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/primitives/table'
import { Textarea } from '@/components/ui/primitives/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/primitives/tabs'
import { trpc } from '@/lib/trpc-client'
import { Plus, Edit, Trash2, Users, Shield, Trophy, Award, Eye } from 'lucide-react'

type LeagueTeam = {
  id: string
  name: string
  division: string
  category: string | null
  description: string | null
  createdAt: Date
  members: Array<{
    id: string
    position: string | null
    athlete: {
      id: string
      firstName: string
      lastName: string
      club: {
        id: string
        name: string
      }
    }
    club: {
      id: string
      name: string
    }
  }>
  _count?: {
    members: number
  }
}

export default function TeamsManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<LeagueTeam | null>(null)
  const [editingTeam, setEditingTeam] = useState<LeagueTeam | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    division: '',
    category: '',
    description: ''
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
  const { data: teams = [], refetch: refetchTeams } = trpc.leagueTeams.getAll.useQuery(undefined, {
    enabled: isAuthenticated
  })

  // Mutations
  const createTeamMutation = trpc.leagueTeams.create.useMutation({
    onSuccess: () => {
      refetchTeams()
      setIsDialogOpen(false)
      resetForm()
    }
  })

  const updateTeamMutation = trpc.leagueTeams.update.useMutation({
    onSuccess: () => {
      refetchTeams()
      setIsDialogOpen(false)
      setEditingTeam(null)
      resetForm()
    }
  })

  const deleteTeamMutation = trpc.leagueTeams.delete.useMutation({
    onSuccess: () => {
      refetchTeams()
    }
  })

  const resetForm = () => {
    setFormData({
      name: '',
      division: '',
      category: '',
      description: ''
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const teamData = {
      name: formData.name,
      division: formData.division,
      category: formData.category || undefined,
      description: formData.description || undefined
    }

    if (editingTeam) {
      updateTeamMutation.mutate({ id: editingTeam.id, ...teamData })
    } else {
      createTeamMutation.mutate(teamData)
    }
  }

  const handleEdit = (team: LeagueTeam) => {
    setEditingTeam(team)
    setFormData({
      name: team.name,
      division: team.division,
      category: team.category || '',
      description: team.description || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (teamId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) {
      deleteTeamMutation.mutate({ id: teamId })
    }
  }

  const handleViewDetails = (team: LeagueTeam) => {
    setSelectedTeam(team)
    setIsDetailsDialogOpen(true)
  }

  // Statistics
  const stats = {
    total: teams.length,
    totalMembers: teams.reduce((sum, t) => sum + (t._count?.members || 0), 0),
    divisions: new Set(teams.map(t => t.division)).size,
    withCaptains: teams.filter(t => t.members.some(m => m.position === 'Captain')).length
  }

  // Group teams by division for better organization
  const teamsByDivision = teams.reduce((acc, team) => {
    const division = team.division
    if (!acc[division]) {
      acc[division] = []
    }
    acc[division].push(team)
    return acc
  }, {} as Record<string, LeagueTeam[]>)

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#d62027]"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
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
            <h1 className="text-3xl font-bold text-foreground">
              Gestion des Équipes de Ligue
            </h1>
            <p className="text-muted-foreground mt-2">
              Gérez les équipes de la ligue et leurs membres par division
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-[#d62027] hover:bg-[#d62027]/90"
                onClick={() => {
                  setEditingTeam(null)
                  resetForm()
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Équipe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingTeam ? 'Modifier l\'Équipe' : 'Nouvelle Équipe'}
                </DialogTitle>
                <DialogDescription>
                  {editingTeam ? 'Modifiez les informations de l\'équipe' : 'Créez une nouvelle équipe pour la ligue'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom de l&apos;équipe *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="ex: Équipe 1ère Division"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="division">Division *</Label>
                  <Select value={formData.division} onValueChange={(value) => setFormData(prev => ({ ...prev, division: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une division" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Première Division">Première Division</SelectItem>
                      <SelectItem value="Deuxième Division">Deuxième Division</SelectItem>
                      <SelectItem value="Troisième Division">Troisième Division</SelectItem>
                      <SelectItem value="Division Élite">Division Élite</SelectItem>
                      <SelectItem value="Division Junior">Division Junior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="ex: Senior, U21, Féminin"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description de l'équipe, objectifs, etc."
                    rows={3}
                  />
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button type="submit" className="flex-1 bg-[#d62027] hover:bg-[#d62027]/90">
                    {editingTeam ? 'Modifier' : 'Créer'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false)
                      setEditingTeam(null)
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
              <DialogTitle>Détails de l&apos;Équipe</DialogTitle>
              <DialogDescription>
                Informations complètes de l&apos;équipe de ligue
              </DialogDescription>
            </DialogHeader>
            
            {selectedTeam && (
              <div className="space-y-6">
                {/* Team Header */}
                <div className="flex items-start space-x-4 border-b pb-4">
                  <div className="w-16 h-16 bg-[#d62027] rounded-lg flex items-center justify-center shrink-0">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-foreground">{selectedTeam.name}</h3>
                    <p className="text-muted-foreground mt-1">Division {selectedTeam.division}</p>
                    <div className="flex items-center space-x-3 mt-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary-foreground rounded-full text-sm font-medium">
                        {selectedTeam._count?.members || 0} membre(s)
                      </span>
                      {selectedTeam.category && (
                        <span className="px-3 py-1 bg-accent/10 text-accent-foreground rounded-full text-sm">
                          {selectedTeam.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedTeam.description && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Description</h4>
                    <p className="text-foreground leading-relaxed">{selectedTeam.description}</p>
                  </div>
                )}

                {/* Team Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Informations de l&apos;Équipe</h4>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">Division</p>
                        <p className="font-semibold text-lg">{selectedTeam.division}</p>
                      </div>
                      {selectedTeam.category && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-muted-foreground">Catégorie</p>
                          <p className="font-semibold text-lg">{selectedTeam.category}</p>
                        </div>
                      )}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-muted-foreground">Date de Création</p>
                        <p className="font-semibold text-foreground">
                          {new Date(selectedTeam.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
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
                            <p className="text-sm text-primary">Total Membres</p>
                            <p className="font-semibold text-2xl text-primary-foreground">
                              {selectedTeam._count?.members || 0}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <Shield className="w-6 h-6 text-accent" />
                          <div>
                            <p className="text-sm text-accent">Clubs Représentés</p>
                            <p className="font-semibold text-2xl text-accent-foreground">
                              {[...new Set(selectedTeam.members.map(m => m.club.id))].length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                {selectedTeam.members && selectedTeam.members.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Membres de l&apos;Équipe</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {selectedTeam.members.map((member, index) => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-[#d62027] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">
                                {member.athlete.firstName} {member.athlete.lastName}
                              </p>
                              <p className="text-sm text-muted-foreground">{member.club.name}</p>
                            </div>
                          </div>
                          {member.position && (
                            <span className="px-2 py-1 bg-primary/10 text-primary-foreground rounded text-sm">
                              {member.position}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Club Distribution */}
                {selectedTeam.members && selectedTeam.members.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Répartition par Club</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(
                        selectedTeam.members.reduce((acc: Record<string, number>, member) => {
                          acc[member.club.name] = (acc[member.club.name] || 0) + 1
                          return acc
                        }, {})
                      ).map(([clubName, count]) => (
                        <div key={clubName} className="bg-gray-50 rounded-lg p-3">
                          <p className="font-medium">{clubName}</p>
                          <p className="text-sm text-muted-foreground">{count} membre(s)</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
            <TabsTrigger value="list">Liste des équipes</TabsTrigger>
            <TabsTrigger value="divisions">Par division</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Équipes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Membres</CardTitle>
                  <Trophy className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.totalMembers}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Divisions</CardTitle>
                  <Award className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{stats.divisions}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avec Capitaines</CardTitle>
                  <Shield className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{stats.withCaptains}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Équipes de la Ligue ({teams.length})</CardTitle>
                <CardDescription>
                  Liste complète des équipes enregistrées dans la ligue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Équipe</TableHead>
                      <TableHead>Division</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Capitaine</TableHead>
                      <TableHead>Membres</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teams.map((team) => {
                      const captain = team.members.find(m => m.position === 'Captain')
                      return (
                        <TableRow key={team.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{team.name}</div>
                              {team.description && (
                                <div className="text-sm text-muted-foreground line-clamp-2">{team.description}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="px-2 py-1 bg-primary/10 text-primary-foreground rounded-full text-xs font-medium">
                              {team.division}
                            </span>
                          </TableCell>
                          <TableCell>
                            {team.category && (
                              <span className="px-2 py-1 bg-accent/10 text-accent-foreground rounded-full text-xs font-medium">
                                {team.category}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <Shield className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">
                                {captain ? `${captain.athlete.firstName} ${captain.athlete.lastName}` : 'Aucun'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-center font-semibold">
                              {team._count?.members || 0}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(team)}
                                title="Voir les détails"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(team)}
                                title="Modifier"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(team.id)}
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
                
                {teams.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucune équipe enregistrée</p>
                    <Button 
                      className="mt-4 bg-[#d62027] hover:bg-[#d62027]/90"
                      onClick={() => {
                        setEditingTeam(null)
                        resetForm()
                        setIsDialogOpen(true)
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Créer la première équipe
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="divisions">
            <div className="space-y-6">
              {Object.keys(teamsByDivision).length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">Aucune équipe par division</p>
                  </CardContent>
                </Card>
              ) : (
                Object.entries(teamsByDivision).map(([division, divisionTeams]) => (
                  <Card key={division}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Award className="w-5 h-5" />
                        <span>{division}</span>
                        <span className="text-sm font-normal text-muted-foreground">
                          ({divisionTeams.length} équipe{divisionTeams.length > 1 ? 's' : ''})
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {divisionTeams.map((team) => {
                          const captain = team.members.find(m => m.position === 'Captain')
                          return (
                            <Card key={team.id} className="border border-gray-200">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{team.name}</h3>
                                    {team.category && (
                                      <span className="inline-block mt-1 px-2 py-1 bg-accent/10 text-accent-foreground rounded-full text-xs font-medium">
                                        {team.category}
                                      </span>
                                    )}
                                    {team.description && (
                                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                        {team.description}
                                      </p>
                                    )}
                                    <div className="mt-3 space-y-1">
                                      {captain && (
                                        <div className="flex items-center text-sm text-muted-foreground">
                                          <Shield className="w-4 h-4 mr-1" />
                                          Capitaine: {captain.athlete.firstName} {captain.athlete.lastName}
                                        </div>
                                      )}
                                      <div className="flex items-center text-sm text-muted-foreground">
                                        <Users className="w-4 h-4 mr-1" />
                                        {team._count?.members || 0} membre{(team._count?.members || 0) > 1 ? 's' : ''}
                                      </div>
                                      {team.members.length > 0 && (
                                        <div className="text-xs text-muted-foreground mt-2">
                                          Clubs: {[...new Set(team.members.map(m => m.club.name))].join(', ')}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex space-x-1 ml-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleViewDetails(team)}
                                      title="Voir les détails"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleEdit(team)}
                                      title="Modifier"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleDelete(team.id)}
                                      className="text-red-600 hover:text-red-700"
                                      title="Supprimer"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
