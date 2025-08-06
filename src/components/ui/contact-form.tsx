'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

type FormErrors = {
  [key: string]: string
}

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})
    setSubmitError('')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const result = await response.json()
      
      if (result.success) {
        setSubmitted(true)
        // Reset form
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        if (result.errors) {
          // Handle validation errors
          const newErrors: FormErrors = {}
          result.errors.forEach((error: { field: string; message: string }) => {
            newErrors[error.field] = error.message
          })
          setErrors(newErrors)
        } else {
          setSubmitError(result.message || 'Une erreur est survenue')
        }
      }
    } catch (error) {
      console.error('Contact form error:', error)
      setSubmitError('Erreur de connexion. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="space-y-6">
      {submitted ? (
        <div className="text-center py-8">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-green-800 dark:text-green-300 text-lg font-medium mb-2">
              Message envoyé avec succès !
            </h3>
            <p className="text-green-600 dark:text-green-400">
              Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.
            </p>
          </div>
          <Button 
            onClick={() => setSubmitted(false)}
            className="mt-6 btn-smooth"
            variant="outline"
          >
            Envoyer un autre message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {submitError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-800 dark:text-red-300">{submitError}</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                placeholder="Votre nom complet"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="email">Adresse email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                placeholder="votre.email@exemple.com"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>
          
          <div>
            <Label htmlFor="subject">Sujet *</Label>
            <Input
              id="subject"
              name="subject"
              type="text"
              required
              value={formData.subject}
              onChange={handleInputChange}
              className={`mt-1 ${errors.subject ? 'border-red-500' : ''}`}
              placeholder="De quoi souhaitez-vous parler ?"
            />
            {errors.subject && (
              <p className="text-red-600 text-sm mt-1">{errors.subject}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              name="message"
              rows={6}
              required
              value={formData.message}
              onChange={handleInputChange}
              className={`mt-1 ${errors.message ? 'border-red-500' : ''}`}
              placeholder="Décrivez votre demande ou question en détail..."
            />
            {errors.message && (
              <p className="text-red-600 text-sm mt-1">{errors.message}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting}
            size="lg"
            className="w-full btn-smooth bg-[#017444] hover:bg-emerald-700 text-white"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Envoyer le message
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
