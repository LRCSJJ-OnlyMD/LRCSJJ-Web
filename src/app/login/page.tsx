'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { trpc } from '@/lib/trpc-client'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { LeagueLogo } from '@/components/logos'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem('auth-token', data.token)
      toast.success('Connexion réussie!')
      router.push('/admin')
    },
    onError: (error) => {
      toast.error(error.message || 'Échec de la connexion')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs')
      return
    }
    loginMutation.mutate({ email, password })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Back to home link */}
        <Link 
          href="/" 
          className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors animate-fade-in-down"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à l&apos;Accueil
        </Link>

        <Card className="shadow-lg border-border bg-card animate-fade-in-up animate-stagger-1">
          <CardHeader className="text-center">
            <LeagueLogo size="lg" className="mb-4" />
            <CardTitle className="text-2xl font-bold text-foreground">Administration LRCSJJ</CardTitle>
            <CardDescription className="text-muted-foreground">
              Portail de connexion sécurisé pour les administrateurs de la Ligue
            </CardDescription>
          </CardHeader>
          
          <CardContent className="animate-fade-in-up animate-stagger-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">Adresse Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@lrcsjj.ma"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loginMutation.isPending}
                  required
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">Mot de Passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loginMutation.isPending}
                  required
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#d62027] hover:bg-[#d62027]/90 text-white transition-all duration-300 hover-lift"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? 'Connexion en cours...' : 'Se Connecter'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground animate-fade-in-up animate-stagger-3">
              <p>Accès réservé au personnel autorisé</p>
              <p className="mt-2">
                Identifiants de test par défaut:
                <br />
                <span className="font-mono text-xs bg-muted text-muted-foreground px-2 py-1 rounded mt-1 inline-block">
                  admin@lrcsjj.ma / AdminPass2025!
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
