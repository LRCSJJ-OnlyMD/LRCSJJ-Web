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
import { ArrowLeft, Eye, EyeOff, Mail, Shield } from 'lucide-react'
import { LeagueLogo } from '@/components/logos'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginStep, setLoginStep] = useState<'credentials' | 'verification'>('credentials')
  const [codeId, setCodeId] = useState('')
  const [maskedEmail, setMaskedEmail] = useState('')
  const router = useRouter()

  const initiateLoginMutation = trpc.auth.initiateLogin.useMutation({
    onSuccess: (data) => {
      if (data.requiresVerification) {
        setCodeId(data.codeId || '')
        setMaskedEmail(data.maskedEmail || '')
        setLoginStep('verification')
        toast.success('Code de vérification envoyé par email!')
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Échec de la connexion')
    }
  })

  const completeLoginMutation = trpc.auth.completeLogin.useMutation({
    onSuccess: (data) => {
      localStorage.setItem('auth-token', data.token)
      toast.success('Connexion réussie!')
      router.push('/admin')
    },
    onError: (error) => {
      toast.error(error.message || 'Code de vérification invalide')
    }
  })

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs')
      return
    }
    initiateLoginMutation.mutate({ email, password })
  }

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!verificationCode || !codeId) {
      toast.error('Veuillez entrer le code de vérification')
      return
    }
    completeLoginMutation.mutate({ codeId, verificationCode })
  }

  const handleBackToCredentials = () => {
    setLoginStep('credentials')
    setVerificationCode('')
    setCodeId('')
    setMaskedEmail('')
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
            <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
              <Shield className="w-6 h-6 text-[#d62027]" />
              Administration LRCSJJ
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {loginStep === 'credentials' ? (
                'Portail de connexion sécurisé pour les administrateurs de la Ligue'
              ) : (
                'Vérification Email en cours - Consultez votre boîte mail'
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="animate-fade-in-up animate-stagger-2">
            {loginStep === 'credentials' ? (
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Adresse Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@lrcsjj.ma"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={initiateLoginMutation.isPending}
                    required
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Mot de Passe</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={initiateLoginMutation.isPending}
                      required
                      className="bg-background border-border text-foreground placeholder:text-muted-foreground pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#d62027] hover:bg-[#d62027]/90 text-white transition-all duration-300 hover-lift"
                  disabled={initiateLoginMutation.isPending}
                >
                  {initiateLoginMutation.isPending ? 'Vérification en cours...' : 'Se Connecter'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerificationSubmit} className="space-y-4">
                <div className="text-center space-y-3 mb-6">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto border border-blue-200 dark:border-blue-800">
                    <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Code de Vérification</h3>
                    <p className="text-sm text-muted-foreground">
                      Un code à 6 chiffres a été envoyé à
                    </p>
                    <p className="text-sm font-mono text-blue-600 dark:text-blue-400">
                      {maskedEmail}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="verificationCode" className="text-foreground">Code de Vérification</Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
                    disabled={completeLoginMutation.isPending}
                    required
                    maxLength={6}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground text-center text-lg font-mono tracking-widest"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#017444] hover:bg-[#017444]/90 text-white transition-all duration-300 hover-lift"
                  disabled={completeLoginMutation.isPending || verificationCode.length !== 6}
                >
                  {completeLoginMutation.isPending ? 'Vérification en cours...' : 'Vérifier le Code'}
                </Button>

                <Button 
                  type="button" 
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-foreground"
                  onClick={handleBackToCredentials}
                  disabled={completeLoginMutation.isPending}
                >
                  ← Retour à la connexion
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-muted-foreground animate-fade-in-up animate-stagger-3">
              {loginStep === 'credentials' ? (
                <p>Accès réservé au personnel autorisé</p>
              ) : (
                <div className="space-y-1">
                  <p>Code expire dans 10 minutes</p>
                  <p className="text-xs">Vérifiez vos spams si nécessaire</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
