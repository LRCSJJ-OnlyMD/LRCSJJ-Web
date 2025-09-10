'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/primitives/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/primitives/card'
import { Input } from '@/components/ui/primitives/input'
import { Label } from '@/components/ui/primitives/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/primitives/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/primitives/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/primitives/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/primitives/tabs'
import { trpc } from '@/lib/trpc-client'
import { Plus, Edit, Trash2, Shield, AlertTriangle, CheckCircle, Euro, User, Eye } from 'lucide-react'
import { getOptimizedImageUrl } from '@/lib/cloudinary'

type Insurance = {
  id: string
  athleteId: string
  seasonId: string
  amount: number
  isPaid: boolean
  paidAt: Date | null
  createdAt: Date
  athlete: {
    id: string
    firstName: string
    lastName: string
    photoUrl: string | null
    club: {
      name: string
    }
  }
  season: {
    id: string
    name: string
    startDate: Date
    endDate: Date
  }
}

export default function InsuranceManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedInsurance, setSelectedInsurance] = useState<Insurance | null>(null)
  const [editingInsurance, setEditingInsurance] = useState<Insurance | null>(null)
  const [formData, setFormData] = useState({
    athleteId: '',
    seasonId: '',
    amount: '',
    isPaid: false,
    paidAt: ''
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
  const { data: insurances = [], refetch: refetchInsurances } = trpc.insurance.getAll.useQuery(undefined, {
    enabled: isAuthenticated
  })

  const { data: athletes = [] } = trpc.athletes.getAll.useQuery({}, {
    enabled: isAuthenticated
  })

  const { data: seasons = [] } = trpc.seasons.getAll.useQuery(undefined, {
    enabled: isAuthenticated
  })

  const { data: stats } = trpc.insurance.getStats.useQuery(undefined, {
    enabled: isAuthenticated
  })

  // Mutations
  const createInsuranceMutation = trpc.insurance.create.useMutation({
    onSuccess: () => {
      refetchInsurances()
      setIsDialogOpen(false)
      resetForm()
    }
  })

  const updateInsuranceMutation = trpc.insurance.update.useMutation({
    onSuccess: () => {
      refetchInsurances()
      setIsDialogOpen(false)
      setEditingInsurance(null)
      resetForm()
    }
  })

  const deleteInsuranceMutation = trpc.insurance.delete.useMutation({
    onSuccess: () => {
      refetchInsurances()
    }
  })

  const markAsPaidMutation = trpc.insurance.markAsPaid.useMutation({
    onSuccess: () => {
      refetchInsurances()
    }
  })

  const resetForm = () => {
    setFormData({
      athleteId: '',
      seasonId: '',
      amount: '',
      isPaid: false,
      paidAt: ''
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const insuranceData = {
      athleteId: formData.athleteId,
      seasonId: formData.seasonId,
      amount: parseFloat(formData.amount),
      isPaid: formData.isPaid,
      paidAt: formData.isPaid && formData.paidAt ? formData.paidAt : undefined
    }

    if (editingInsurance) {
      updateInsuranceMutation.mutate({ id: editingInsurance.id, ...insuranceData })
    } else {
      createInsuranceMutation.mutate(insuranceData)
    }
  }

  const handleEdit = (insurance: Insurance) => {
    setEditingInsurance(insurance)
    setFormData({
      athleteId: insurance.athleteId,
      seasonId: insurance.seasonId,
      amount: insurance.amount.toString(),
      isPaid: insurance.isPaid,
      paidAt: insurance.paidAt ? new Date(insurance.paidAt).toISOString().split('T')[0] : ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (insuranceId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette assurance ?')) {
      deleteInsuranceMutation.mutate({ id: insuranceId })
    }
  }

  const handleMarkAsPaid = (insuranceId: string) => {
    markAsPaidMutation.mutate({ id: insuranceId })
  }

  const handleViewDetails = (insurance: Insurance) => {
    setSelectedInsurance(insurance)
    setIsDetailsDialogOpen(true)
  }

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
              Gestion des Assurances
            </h1>
            <p className="text-muted-foreground mt-2">
              Gérez les paiements d&apos;assurance des athlètes par saison
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-[#d62027] hover:bg-[#d62027]/90"
                onClick={() => {
                  setEditingInsurance(null)
                  resetForm()
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle Assurance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingInsurance ? 'Modifier l&apos;Assurance' : 'Nouvelle Assurance'}
                </DialogTitle>
                <DialogDescription>
                  {editingInsurance ? 'Modifiez les informations de l&apos;assurance' : 'Ajoutez un nouveau paiement d&apos;assurance'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="athleteId">Athlète *</Label>
                  <Select value={formData.athleteId} onValueChange={(value) => setFormData(prev => ({ ...prev, athleteId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un athlète" />
                    </SelectTrigger>
                    <SelectContent>
                      {athletes.map(athlete => (
                        <SelectItem key={athlete.id} value={athlete.id}>
                          {athlete.firstName} {athlete.lastName} - {athlete.club.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                
                <div>
                  <Label htmlFor="amount">Montant (MAD) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="500.00"
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    id="isPaid"
                    type="checkbox"
                    checked={formData.isPaid}
                    onChange={(e) => setFormData(prev => ({ ...prev, isPaid: e.target.checked }))}
                    className="rounded border-gray-300 text-[#d62027] focus:ring-[#d62027]"
                    title="Marquer comme payé"
                  />
                  <Label htmlFor="isPaid">Payé</Label>
                </div>
                
                {formData.isPaid && (
                  <div>
                    <Label htmlFor="paidAt">Date de paiement</Label>
                    <Input
                      id="paidAt"
                      type="date"
                      value={formData.paidAt}
                      onChange={(e) => setFormData(prev => ({ ...prev, paidAt: e.target.value }))}
                    />
                  </div>
                )}
                
                <div className="flex space-x-2 pt-4">
                  <Button type="submit" className="flex-1 bg-[#d62027] hover:bg-[#d62027]/90">
                    {editingInsurance ? 'Modifier' : 'Créer'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false)
                      setEditingInsurance(null)
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
              <DialogTitle>Détails de l&apos;Assurance</DialogTitle>
              <DialogDescription>
                Informations complètes du paiement d&apos;assurance
              </DialogDescription>
            </DialogHeader>
            
            {selectedInsurance && (
              <div className="space-y-6">
                {/* Athlete Header */}
                <div className="flex items-start space-x-4 border-b pb-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                    {selectedInsurance.athlete.photoUrl ? (
                      <Image
                        src={getOptimizedImageUrl(selectedInsurance.athlete.photoUrl, 64, 64)}
                        alt={`${selectedInsurance.athlete.firstName} ${selectedInsurance.athlete.lastName}`}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground">
                      {selectedInsurance.athlete.firstName} {selectedInsurance.athlete.lastName}
                    </h3>
                    <p className="text-muted-foreground">{selectedInsurance.athlete.club.name}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedInsurance.isPaid 
                          ? 'bg-accent/10 text-accent-foreground' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedInsurance.isPaid ? 'Payé' : 'Non payé'}
                      </span>
                      <span className="px-3 py-1 bg-primary/10 text-primary-foreground rounded-full text-sm">
                        {selectedInsurance.season.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Informations de Paiement</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Euro className="w-5 h-5 text-[#d62027]" />
                        <div>
                          <p className="text-sm text-muted-foreground">Montant</p>
                          <p className="font-semibold text-lg text-[#d62027]">
                            {selectedInsurance.amount} MAD
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm text-muted-foreground">Statut</p>
                          <p className={`font-semibold ${
                            selectedInsurance.isPaid ? 'text-accent' : 'text-red-600'
                          }`}>
                            {selectedInsurance.isPaid ? 'Payé' : 'En attente'}
                          </p>
                        </div>
                      </div>
                      {selectedInsurance.isPaid && selectedInsurance.paidAt && (
                        <div>
                          <p className="text-sm text-muted-foreground">Date de Paiement</p>
                          <p className="font-medium">
                            {new Date(selectedInsurance.paidAt).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Informations de Saison</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Saison</p>
                        <p className="font-semibold text-lg">{selectedInsurance.season.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Période</p>
                        <p className="font-medium">
                          Du {new Date(selectedInsurance.season.startDate).toLocaleDateString('fr-FR')} au {new Date(selectedInsurance.season.endDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Date d&apos;Enregistrement</p>
                        <p className="font-medium">
                          {new Date(selectedInsurance.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Résumé</h4>
                  <div className="text-sm text-foreground">
                    <p>
                      L&apos;athlète <strong>{selectedInsurance.athlete.firstName} {selectedInsurance.athlete.lastName}</strong> 
                      {selectedInsurance.isPaid ? ' a payé ' : ' doit payer '}
                      <strong>{selectedInsurance.amount} MAD</strong> pour l&apos;assurance de la saison 
                      <strong> {selectedInsurance.season.name}</strong>.
                    </p>
                    {selectedInsurance.isPaid && selectedInsurance.paidAt && (
                      <p className="mt-2 text-green-700">
                        ✓ Paiement effectué le {new Date(selectedInsurance.paidAt).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  {!selectedInsurance.isPaid && (
                    <Button 
                      onClick={() => {
                        handleMarkAsPaid(selectedInsurance.id)
                        setIsDetailsDialogOpen(false)
                      }}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marquer comme Payé
                    </Button>
                  )}
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
            <TabsTrigger value="list">Liste des assurances</TabsTrigger>
            <TabsTrigger value="statistics">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Assurances</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Payées</CardTitle>
                    <CheckCircle className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-accent">{stats.paid}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Non payées</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">{stats.unpaid}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                    <Euro className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{stats.totalRevenue.toLocaleString()} MAD</div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Assurances des Athlètes ({insurances.length})</CardTitle>
                <CardDescription>
                  Liste complète des paiements d&apos;assurance par athlète et saison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Athlète</TableHead>
                      <TableHead>Club</TableHead>
                      <TableHead>Saison</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date de paiement</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {insurances.map((insurance) => (
                      <TableRow key={insurance.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                              {insurance.athlete.photoUrl ? (
                                <Image
                                  src={getOptimizedImageUrl(insurance.athlete.photoUrl, 40, 40)}
                                  alt={`${insurance.athlete.firstName} ${insurance.athlete.lastName}`}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="font-medium">
                              {insurance.athlete.firstName} {insurance.athlete.lastName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{insurance.athlete.club.name}</TableCell>
                        <TableCell>{insurance.season.name}</TableCell>
                        <TableCell className="font-semibold text-foreground">{insurance.amount.toLocaleString()} MAD</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {insurance.isPaid ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-accent" />
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent-foreground">
                                  Payé
                                </span>
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Non payé
                                </span>
                              </>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {insurance.paidAt ? new Date(insurance.paidAt).toLocaleDateString('fr-FR') : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {!insurance.isPaid && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkAsPaid(insurance.id)}
                                className="text-accent hover:text-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(insurance)}
                              title="Voir les détails"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(insurance)}
                              title="Modifier"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(insurance.id)}
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
                
                {insurances.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucune assurance enregistrée</p>
                    <Button 
                      className="mt-4 bg-[#d62027] hover:bg-[#d62027]/90"
                      onClick={() => {
                        setEditingInsurance(null)
                        resetForm()
                        setIsDialogOpen(true)
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Créer la première assurance
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics">
            {stats && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition des Paiements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-accent" />
                          <span>Payées</span>
                        </div>
                        <span className="font-semibold text-foreground">{stats.paid}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span>Non payées</span>
                        </div>
                        <span className="font-semibold text-foreground">{stats.unpaid}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Taux de paiement</span>
                        <span className="font-semibold text-foreground">
                          {stats.total > 0 ? Math.round((stats.paid / stats.total) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Informations Financières</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Revenus collectés</span>
                        <span className="font-semibold text-accent">
                          {stats.totalRevenue.toLocaleString()} MAD
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Revenus en attente</span>
                        <span className="font-semibold text-red-600">
                          {stats.pendingRevenue.toLocaleString()} MAD
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Montant moyen</span>
                        <span className="font-semibold text-foreground">
                          {stats.total > 0 ? Math.round((stats.totalRevenue + stats.pendingRevenue) / stats.total).toLocaleString() : 0} MAD
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
