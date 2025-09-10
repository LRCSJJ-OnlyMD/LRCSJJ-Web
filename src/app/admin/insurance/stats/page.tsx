'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/primitives/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/primitives/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/primitives/table'
import { trpc } from '@/lib/trpc-client'
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  CheckCircle,
  PieChart,
  BarChart3,
  Shield
} from 'lucide-react'

export default function InsuranceStatistics() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
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
  const { data: insurancePayments = [] } = trpc.insurance.getAll.useQuery(undefined, {
    enabled: isAuthenticated
  })

  const { data: seasons = [] } = trpc.seasons.getAll.useQuery(undefined, {
    enabled: isAuthenticated
  })

  const { data: athletes = [] } = trpc.athletes.getAll.useQuery({}, {
    enabled: isAuthenticated
  })

  // Calculate statistics
  const stats = {
    totalPayments: insurancePayments.length,
    paidPayments: insurancePayments.filter(p => p.isPaid).length,
    unpaidPayments: insurancePayments.filter(p => !p.isPaid).length,
    totalAmount: insurancePayments.reduce((sum, p) => sum + p.amount, 0),
    paidAmount: insurancePayments.filter(p => p.isPaid).reduce((sum, p) => sum + p.amount, 0),
    unpaidAmount: insurancePayments.filter(p => !p.isPaid).reduce((sum, p) => sum + p.amount, 0),
    complianceRate: insurancePayments.length > 0 ? (insurancePayments.filter(p => p.isPaid).length / insurancePayments.length) * 100 : 0,
    totalAthletes: athletes.length,
    athletesWithInsurance: new Set(insurancePayments.map(p => p.athleteId)).size,
    athletesWithoutInsurance: athletes.length - new Set(insurancePayments.map(p => p.athleteId)).size
  }

  // Group by season
  const paymentsBySeason = insurancePayments.reduce((acc, payment) => {
    const seasonName = seasons.find(s => s.id === payment.seasonId)?.name || 'Saison inconnue'
    if (!acc[seasonName]) {
      acc[seasonName] = []
    }
    acc[seasonName].push(payment)
    return acc
  }, {} as Record<string, typeof insurancePayments>)

  // Season statistics
  const seasonStats = Object.entries(paymentsBySeason).map(([seasonName, payments]) => {
    const paid = payments.filter(p => p.isPaid).length
    const total = payments.length
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
    const paidAmount = payments.filter(p => p.isPaid).reduce((sum, p) => sum + p.amount, 0)
    
    return {
      season: seasonName,
      total,
      paid,
      unpaid: total - paid,
      complianceRate: total > 0 ? (paid / total) * 100 : 0,
      totalAmount,
      paidAmount,
      unpaidAmount: totalAmount - paidAmount
    }
  })

  // Monthly payment trend (for current year)
  const currentYear = new Date().getFullYear()
  const monthlyPayments = insurancePayments
    .filter(p => p.paidAt && new Date(p.paidAt).getFullYear() === currentYear)
    .reduce((acc, payment) => {
      const month = new Date(payment.paidAt!).getMonth()
      const monthName = new Date(currentYear, month).toLocaleDateString('fr-FR', { month: 'long' })
      if (!acc[monthName]) {
        acc[monthName] = { count: 0, amount: 0 }
      }
      acc[monthName].count += 1
      acc[monthName].amount += payment.amount
      return acc
    }, {} as Record<string, { count: number; amount: number }>)

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
              Statistiques des Assurances
            </h1>
            <p className="text-muted-foreground mt-2">
              Analyse détaillée des paiements d&apos;assurance de la ligue
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
            <TabsTrigger value="seasons">Par saison</TabsTrigger>
            <TabsTrigger value="trends">Tendances</TabsTrigger>
            <TabsTrigger value="compliance">Conformité</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Paiements</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stats.totalPayments}</div>
                  <div className="text-sm text-muted-foreground">
                    {stats.paidPayments} payés, {stats.unpaidPayments} en attente
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Montant Total</CardTitle>
                  <DollarSign className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{stats.totalAmount.toFixed(2)} MAD</div>
                  <div className="text-sm text-muted-foreground">
                    {stats.paidAmount.toFixed(2)} MAD collectés
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taux de Conformité</CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats.complianceRate.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">
                    Paiements effectués
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Couverture Athlètes</CardTitle>
                  <Users className="h-4 w-4 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-accent">{stats.athletesWithInsurance}</div>
                  <div className="text-sm text-muted-foreground">
                    sur {stats.totalAthletes} athlètes
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="w-5 h-5" />
                    <span>Répartition des Paiements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Payés</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{stats.paidPayments}</div>
                        <div className="text-sm text-muted-foreground">{stats.paidAmount.toFixed(2)} MAD</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm">En attente</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{stats.unpaidPayments}</div>
                        <div className="text-sm text-muted-foreground">{stats.unpaidAmount.toFixed(2)} MAD</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Couverture des Athlètes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Avec assurance</span>
                      </div>
                      <div className="font-medium">{stats.athletesWithInsurance}</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm">Sans assurance</span>
                      </div>
                      <div className="font-medium">{stats.athletesWithoutInsurance}</div>
                    </div>
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        Taux de couverture: {stats.totalAthletes > 0 ? ((stats.athletesWithInsurance / stats.totalAthletes) * 100).toFixed(1) : 0}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="seasons">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques par Saison</CardTitle>
                <CardDescription>
                  Analyse des paiements d&apos;assurance pour chaque saison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Saison</TableHead>
                      <TableHead>Total Paiements</TableHead>
                      <TableHead>Payés</TableHead>
                      <TableHead>En Attente</TableHead>
                      <TableHead>Taux de Conformité</TableHead>
                      <TableHead>Montant Total</TableHead>
                      <TableHead>Montant Collecté</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {seasonStats.map((stat) => (
                      <TableRow key={stat.season}>
                        <TableCell className="font-medium">{stat.season}</TableCell>
                        <TableCell>{stat.total}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{stat.paid}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span>{stat.unpaid}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            stat.complianceRate >= 80 
                              ? 'bg-accent/10 text-accent-foreground' 
                              : stat.complianceRate >= 60 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {stat.complianceRate.toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell>{stat.totalAmount.toFixed(2)} MAD</TableCell>
                        <TableCell className="font-medium text-accent">
                          {stat.paidAmount.toFixed(2)} MAD
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Tendances des Paiements {currentYear}</span>
                </CardTitle>
                <CardDescription>
                  Évolution mensuelle des paiements d&apos;assurance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mois</TableHead>
                      <TableHead>Nombre de Paiements</TableHead>
                      <TableHead>Montant Total</TableHead>
                      <TableHead>Montant Moyen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(monthlyPayments).map(([month, data]) => (
                      <TableRow key={month}>
                        <TableCell className="font-medium capitalize">{month}</TableCell>
                        <TableCell>{data.count}</TableCell>
                        <TableCell>{data.amount.toFixed(2)} MAD</TableCell>
                        <TableCell>
                          {data.count > 0 ? (data.amount / data.count).toFixed(2) : '0.00'} MAD
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {Object.keys(monthlyPayments).length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucun paiement enregistré pour {currentYear}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5" />
                    <span>Alertes de Conformité</span>
                  </CardTitle>
                  <CardDescription>
                    Surveillance des paiements en retard et des problèmes de conformité
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.athletesWithoutInsurance > 0 && (
                      <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-5 h-5 text-red-500" />
                          <span className="font-medium text-red-800">
                            {stats.athletesWithoutInsurance} athlète{stats.athletesWithoutInsurance > 1 ? 's' : ''} sans assurance
                          </span>
                        </div>
                        <p className="text-sm text-red-600 mt-1">
                          Ces athlètes n&apos;ont aucun paiement d&apos;assurance enregistré
                        </p>
                      </div>
                    )}

                    {stats.unpaidPayments > 0 && (
                      <div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="w-5 h-5 text-yellow-500" />
                          <span className="font-medium text-yellow-800">
                            {stats.unpaidPayments} paiement{stats.unpaidPayments > 1 ? 's' : ''} en attente
                          </span>
                        </div>
                        <p className="text-sm text-yellow-600 mt-1">
                          Montant total en attente: {stats.unpaidAmount.toFixed(2)} MAD
                        </p>
                      </div>
                    )}

                    {stats.complianceRate === 100 && (
                      <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-medium text-accent-foreground">
                            Conformité parfaite !
                          </span>
                        </div>
                        <p className="text-sm text-accent mt-1">
                          Tous les paiements d&apos;assurance sont à jour
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommandations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.complianceRate < 80 && (
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium">Améliorer le taux de conformité</p>
                          <p className="text-sm text-muted-foreground">
                            Le taux de conformité est de {stats.complianceRate.toFixed(1)}%. 
                            Contactez les athlètes avec des paiements en retard.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {stats.athletesWithoutInsurance > 0 && (
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium">Enregistrer les assurances manquantes</p>
                          <p className="text-sm text-muted-foreground">
                            {stats.athletesWithoutInsurance} athlète{stats.athletesWithoutInsurance > 1 ? 's n\'ont' : ' n\'a'} 
                            aucun paiement d&apos;assurance enregistré.
                          </p>
                        </div>
                      </div>
                    )}

                    {stats.complianceRate >= 95 && stats.athletesWithoutInsurance === 0 && (
                      <div className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <div>
                          <p className="font-medium">Excellente gestion des assurances</p>
                          <p className="text-sm text-muted-foreground">
                            Continuez ce bon travail de suivi des paiements d&apos;assurance.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
