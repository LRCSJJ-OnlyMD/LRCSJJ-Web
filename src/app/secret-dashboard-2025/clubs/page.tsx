'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { trpc } from '@/lib/trpc-client'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'

type Club = {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  president: string | null
  coach: string | null
  createdAt: Date
  updatedAt: Date
  _count?: {
    athletes: number
  }
}

export default function ClubsManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedClub, setSelectedClub] = useState<Club | null>(null)
  const [editingClub, setEditingClub] = useState<Club | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    president: '',
    coach: ''
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
  const { data: clubs = [], refetch: refetchClubs } = trpc.clubs.getAll.useQuery(undefined, {
    enabled: isAuthenticated
  })

  // Mutations
  const createClubMutation = trpc.clubs.create.useMutation({
    onSuccess: () => {
      refetchClubs()
      setIsDialogOpen(false)
      resetForm()
    }
  })

  const updateClubMutation = trpc.clubs.update.useMutation({
    onSuccess: () => {
      refetchClubs()
      setIsDialogOpen(false)
      setEditingClub(null)
      resetForm()
    }
  })

  const deleteClubMutation = trpc.clubs.delete.useMutation({
    onSuccess: () => {
      refetchClubs()
    }
  })

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      phone: '',
      email: '',
      president: '',
      coach: ''
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingClub) {
      updateClubMutation.mutate({ id: editingClub.id, ...formData })
    } else {
      createClubMutation.mutate(formData)
    }
  }

  const handleEdit = (club: Club) => {
    setEditingClub(club)
    setFormData({
      name: club.name,
      address: club.address || '',
      phone: club.phone || '',
      email: club.email || '',
      president: club.president || '',
      coach: club.coach || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (clubId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce club ?')) {
      deleteClubMutation.mutate({ id: clubId })
    }
  }

  const handleViewDetails = (club: Club) => {
    setSelectedClub(club)
    setIsDetailsDialogOpen(true)
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
              Gestion des Clubs
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez tous les clubs de la ligue Casablanca-Settat
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-[#d62027] hover:bg-[#d62027]/90"
                onClick={() => {
                  setEditingClub(null)
                  resetForm()
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Club
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingClub ? 'Modifier le Club' : 'Ajouter un Club'}
                </DialogTitle>
                <DialogDescription>
                  {editingClub ? 'Modifiez les informations du club' : 'Créez un nouveau club dans la ligue'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom du Club *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
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
                  <Label htmlFor="president">Président</Label>
                  <Input
                    id="president"
                    value={formData.president}
                    onChange={(e) => setFormData(prev => ({ ...prev, president: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="coach">Entraîneur</Label>
                  <Input
                    id="coach"
                    value={formData.coach}
                    onChange={(e) => setFormData(prev => ({ ...prev, coach: e.target.value }))}
                  />
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button type="submit" className="flex-1 bg-[#d62027] hover:bg-[#d62027]/90">
                    {editingClub ? 'Modifier' : 'Créer'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false)
                      setEditingClub(null)
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
              <DialogTitle>Détails du Club</DialogTitle>
              <DialogDescription>
                Informations complètes du club
              </DialogDescription>
            </DialogHeader>
            
            {selectedClub && (
              <div className="space-y-6">
                {/* Club Header */}
                <div className="border-b pb-4">
                  <h3 className="text-2xl font-semibold text-gray-900">{selectedClub.name}</h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {selectedClub._count?.athletes || 0} athlète(s)
                    </span>
                    <span className="text-sm text-gray-500">
                      Créé le {new Date(selectedClub.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Informations de Contact</h4>
                    <div className="space-y-3">
                      {selectedClub.address && (
                        <div>
                          <p className="text-sm text-gray-500">Adresse</p>
                          <p className="font-medium">{selectedClub.address}</p>
                        </div>
                      )}
                      {selectedClub.phone && (
                        <div>
                          <p className="text-sm text-gray-500">Téléphone</p>
                          <p className="font-medium">{selectedClub.phone}</p>
                        </div>
                      )}
                      {selectedClub.email && (
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{selectedClub.email}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Responsables</h4>
                    <div className="space-y-3">
                      {selectedClub.president && (
                        <div>
                          <p className="text-sm text-gray-500">Président</p>
                          <p className="font-medium">{selectedClub.president}</p>
                        </div>
                      )}
                      {selectedClub.coach && (
                        <div>
                          <p className="text-sm text-gray-500">Entraîneur</p>
                          <p className="font-medium">{selectedClub.coach}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Statistiques</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Athlètes Inscrits</p>
                      <p className="font-semibold text-2xl text-blue-600">{selectedClub._count?.athletes || 0}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Date de Création</p>
                      <p className="font-semibold text-lg">
                        {new Date(selectedClub.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-500">Dernière Mise à Jour</p>
                      <p className="font-semibold text-lg">
                        {new Date(selectedClub.updatedAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
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

        <Card>
          <CardHeader>
            <CardTitle>Clubs de la Ligue ({clubs.length})</CardTitle>
            <CardDescription>
              Liste complète des clubs affiliés à la ligue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du Club</TableHead>
                  <TableHead>Adresse</TableHead>
                  <TableHead>Président</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Athlètes</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clubs.map((club) => (
                  <TableRow key={club.id}>
                    <TableCell className="font-medium">{club.name}</TableCell>
                    <TableCell>{club.address || '-'}</TableCell>
                    <TableCell>{club.president || '-'}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {club.phone && <div>{club.phone}</div>}
                        {club.email && <div className="text-gray-500">{club.email}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {club._count?.athletes || 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(club)}
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(club)}
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(club.id)}
                          className="text-red-600 hover:text-red-700"
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
            
            {clubs.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun club enregistré</p>
                <Button 
                  className="mt-4 bg-[#d62027] hover:bg-[#d62027]/90"
                  onClick={() => {
                    setEditingClub(null)
                    resetForm()
                    setIsDialogOpen(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer le premier club
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
