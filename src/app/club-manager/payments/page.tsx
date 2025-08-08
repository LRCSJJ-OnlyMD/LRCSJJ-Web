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
import { StripePaymentProcessing } from '@/components/ui/stripe-payment-processing'
import { AthletePaymentManager } from '@/components/ui/athlete-payment-manager'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  CreditCard, 
  Plus, 
  Eye, 
  Download, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Euro,
  Calendar,
  Search,
  FileText
} from 'lucide-react'
import { LeagueLogo } from '@/components/logos'

interface PaymentRequest {
  id: string
  athleteId: string
  athleteName: string
  type: 'INSURANCE' | 'REGISTRATION' | 'COMPETITION' | 'OTHER'
  description: string
  amount: number
  currency: 'MAD'
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED'
  paymentMethod?: 'STRIPE' | 'BANK_TRANSFER' | 'CASH'
  stripeSessionId?: string
  paymentIntentId?: string
  paidAt?: string
  createdAt: string
  dueDate: string
}

export default function ClubManagerPaymentsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [payments, setPayments] = useState<PaymentRequest[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterType, setFilterType] = useState('')
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
      console.log('Club Manager:', parsedData.name, 'managing payments for club:', parsedData.clubName)
      
      // TODO: Fetch payments for this specific club using parsedData.clubId
      
      // Mock payment data
      setTimeout(() => {
        setPayments([
          {
            id: 'PAY-001',
            athleteId: '1',
            athleteName: 'Ahmed Benali',
            type: 'INSURANCE',
            description: 'Assurance annuelle 2025',
            amount: 150,
            currency: 'MAD',
            status: 'PAID',
            paymentMethod: 'STRIPE',
            stripeSessionId: 'cs_test_123456789',
            paymentIntentId: 'pi_test_123456789',
            paidAt: '2025-01-15T10:30:00Z',
            createdAt: '2025-01-10T09:00:00Z',
            dueDate: '2025-01-20T23:59:59Z'
          },
          {
            id: 'PAY-002',
            athleteId: '2',
            athleteName: 'Fatima El Alaoui',
            type: 'REGISTRATION',
            description: 'Inscription championnat régional',
            amount: 75,
            currency: 'MAD',
            status: 'PENDING',
            paymentMethod: 'STRIPE',
            stripeSessionId: 'cs_test_987654321',
            createdAt: '2025-08-08T14:00:00Z',
            dueDate: '2025-08-15T23:59:59Z'
          },
          {
            id: 'PAY-003',
            athleteId: '3',
            athleteName: 'Youssef Kassimi',
            type: 'INSURANCE',
            description: 'Assurance annuelle 2025',
            amount: 150,
            currency: 'MAD',
            status: 'EXPIRED',
            paymentMethod: 'STRIPE',
            stripeSessionId: 'cs_test_expired_123',
            createdAt: '2025-07-20T11:15:00Z',
            dueDate: '2025-07-25T23:59:59Z'
          },
          {
            id: 'PAY-004',
            athleteId: '4',
            athleteName: 'Sophia Benomar',
            type: 'COMPETITION',
            description: 'Participation Championnat National',
            amount: 120,
            currency: 'MAD',
            status: 'PENDING',
            paymentMethod: 'STRIPE',
            stripeSessionId: 'cs_test_pending_456',
            createdAt: '2025-08-08T16:20:00Z',
            dueDate: '2025-08-20T23:59:59Z'
          }
        ])
        setIsLoading(false)
      }, 1000)
    } catch {
      toast.error('Session invalide')
      router.push('/club-manager/login')
    }
  }, [router])

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.athleteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !filterStatus || payment.status === filterStatus
    const matchesType = !filterType || payment.type === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PAID': 'bg-green-100 text-green-800',
      'EXPIRED': 'bg-red-100 text-red-800',
      'CANCELLED': 'bg-gray-100 text-gray-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-4 h-4" />
      case 'PAID': return <CheckCircle className="w-4 h-4" />
      case 'EXPIRED': return <XCircle className="w-4 h-4" />
      case 'CANCELLED': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'INSURANCE': 'Assurance',
      'REGISTRATION': 'Inscription',
      'COMPETITION': 'Compétition',
      'OTHER': 'Autre'
    }
    return labels[type] || type
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const handleCreatePayment = () => {
    // Switch to the athletes tab to create new payments
    const athleteTab = document.querySelector('[data-value="athletes"]') as HTMLElement
    if (athleteTab) {
      athleteTab.click()
      toast.success('Créez des paiements depuis l\'onglet "Gestion des Athlètes"')
    } else {
      toast.info('Utilisez l\'onglet "Gestion des Athlètes" pour créer de nouveaux paiements')
    }
  }

  const handleViewPayment = (paymentId: string) => {
    toast.info(`Détails du paiement ${paymentId} - En cours de développement`)
  }

  const handleGenerateInvoice = (paymentId: string) => {
    toast.info(`Génération de facture pour ${paymentId} - En cours de développement`)
  }

  const handleExportData = () => {
    toast.info('Export des données de paiements - En cours de développement')
  }

  const getTotalPending = () => {
    return payments
      .filter(p => p.status === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0)
  }

  const getTotalPaid = () => {
    return payments
      .filter(p => p.status === 'PAID')
      .reduce((sum, p) => sum + p.amount, 0)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LeagueLogo size="lg" className="mb-4" />
          <p className="text-muted-foreground">Chargement des paiements...</p>
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
                <h1 className="text-xl font-bold text-foreground">Gestion des Paiements</h1>
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
              Paiements & Facturation
            </h2>
            <p className="text-muted-foreground">
              Gérez les paiements, générez des codes de paiement et suivez les encaissements
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleExportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Button onClick={handleCreatePayment} className="bg-[#017444] hover:bg-[#017444]/90">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Paiement
            </Button>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
            <TabsTrigger value="athletes">Gestion des Athlètes</TabsTrigger>
            <TabsTrigger value="processing">Paiement Stripe</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Encaissé</p>
                  <p className="text-3xl font-bold text-green-600">{getTotalPaid()} MAD</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">En Attente</p>
                  <p className="text-3xl font-bold text-yellow-600">{getTotalPending()} MAD</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Demandes</p>
                  <p className="text-3xl font-bold text-foreground">{payments.length}</p>
                </div>
                <CreditCard className="w-8 h-8 text-[#017444]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sessions Actives</p>
                  <p className="text-3xl font-bold text-foreground">
                    {payments.filter(p => p.status === 'PENDING' && p.stripeSessionId).length}
                  </p>
                </div>
                <Euro className="w-8 h-8 text-blue-600" />
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
                    placeholder="Nom d'athlète, description ou ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <Label htmlFor="filter-status">Statut</Label>
                <select
                  id="filter-status"
                  title="Filtrer par statut"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="">Tous les statuts</option>
                  <option value="PENDING">En attente</option>
                  <option value="PAID">Payé</option>
                  <option value="EXPIRED">Expiré</option>
                  <option value="CANCELLED">Annulé</option>
                </select>
              </div>

              <div className="w-full md:w-48">
                <Label htmlFor="filter-type">Type</Label>
                <select
                  id="filter-type"
                  title="Filtrer par type"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                >
                  <option value="">Tous les types</option>
                  <option value="INSURANCE">Assurance</option>
                  <option value="REGISTRATION">Inscription</option>
                  <option value="COMPETITION">Compétition</option>
                  <option value="OTHER">Autre</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Demandes de Paiement ({filteredPayments.length})</CardTitle>
            <CardDescription>
              Toutes les demandes de paiement pour votre club
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Athlète</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Session Stripe</TableHead>
                    <TableHead>Échéance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.athleteName}</p>
                          <p className="text-sm text-muted-foreground">{payment.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getTypeLabel(payment.type)}
                        </span>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {payment.amount} {payment.currency}
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          {payment.status === 'PENDING' ? 'En attente' :
                           payment.status === 'PAID' ? 'Payé' :
                           payment.status === 'EXPIRED' ? 'Expiré' : 'Annulé'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {payment.stripeSessionId ? (
                          <div className="space-y-1">
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {payment.stripeSessionId.substring(0, 16)}...
                            </code>
                            {payment.status === 'PENDING' && (
                              <p className="text-xs text-blue-600">
                                Session Stripe active
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{formatDate(payment.dueDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewPayment(payment.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGenerateInvoice(payment.id)}
                          >
                            <FileText className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {filteredPayments.length === 0 && (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm || filterStatus || filterType 
                    ? 'Aucun paiement ne correspond aux critères de recherche'
                    : 'Aucune demande de paiement'
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="athletes">
            <AthletePaymentManager />
          </TabsContent>

          <TabsContent value="processing">
            <StripePaymentProcessing 
              athlete={{
                id: '1',
                name: 'Ahmed Benali',
                email: 'ahmed.benali@example.com',
                phone: '+212612345678'
              }}
              club={{
                id: 'club-1',
                name: 'Club Ju-Jitsu Casablanca'
              }}
              season={{
                id: 'season-2025',
                year: '2025',
                name: 'Saison 2025'
              }}
              onPaymentSuccess={() => {
                toast.success('Redirection vers le paiement...')
              }}
              onPaymentError={(error) => {
                toast.error(`Erreur de paiement: ${error}`)
              }}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
