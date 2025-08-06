import { NextResponse } from 'next/server'
import { sendContactNotificationEmail } from '@/lib/email'

export async function POST() {
  try {
    // Test email data
    const testData = {
      name: 'Test User',
      email: 'mouadomlil.321@gmail.com',
      subject: 'Test Email Configuration',
      message: 'This is a test message to verify email configuration is working properly.',
      timestamp: new Date().toISOString(),
      reference: `TEST-${Date.now()}`
    }

    console.log('🧪 Sending test email...')
    
    const result = await sendContactNotificationEmail(testData)
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      data: result
    })
    
  } catch (error) {
    console.error('❌ Test email failed:', error)
    
    return NextResponse.json({
      success: false,
      message: 'Test email failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test email endpoint - POST to send test email'
  })
}
