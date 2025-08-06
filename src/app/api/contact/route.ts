import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendContactNotificationEmail, testEmailConnection } from '@/lib/email'

// Contact form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  subject: z.string().min(5, 'Le sujet doit contenir au moins 5 caractères'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the form data
    const validatedData = contactSchema.parse(body)
    
    // Generate reference ID
    const reference = `LRCSJJ-${Date.now()}`
    const timestamp = new Date().toISOString()
    
    // Log the contact form submission
    console.log('📧 Contact Form Submission:', {
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject,
      message: validatedData.message,
      timestamp,
      reference,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    })
    
    // Send email notifications
    try {
      const emailResult = await sendContactNotificationEmail({
        name: validatedData.name,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message,
        timestamp,
        reference,
      })
      
      console.log('✅ Emails sent successfully:', emailResult)
      
      return NextResponse.json({
        success: true,
        message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
        data: {
          submittedAt: timestamp,
          reference,
          emailSent: true,
          adminMessageId: emailResult.adminMessageId,
          userMessageId: emailResult.userMessageId,
        }
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      })
      
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError)
      
      // Still return success but indicate email issue
      return NextResponse.json({
        success: true,
        message: 'Votre message a été reçu mais il y a eu un problème avec l\'envoi de l\'email de confirmation. Nous vous contacterons bientôt.',
        data: {
          submittedAt: timestamp,
          reference,
          emailSent: false,
          error: 'Email delivery failed'
        }
      }, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      })
    }
    
  } catch (error) {
    console.error('❌ Contact form error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Données invalides',
        errors: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      }, { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.'
    }, { 
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function GET() {
  try {
    // Test email configuration
    const emailWorks = await testEmailConnection()
    
    return NextResponse.json({
      message: 'Contact API endpoint is working',
      methods: ['POST'],
      emailConfigured: emailWorks,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (error) {
    console.error('Email test failed:', error)
    return NextResponse.json({
      message: 'Contact API endpoint is working',
      methods: ['POST'],
      emailConfigured: false,
      error: 'Email configuration test failed',
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })
  }
}
