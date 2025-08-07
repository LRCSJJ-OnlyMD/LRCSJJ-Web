import { PrismaClient } from '@prisma/client'
import { verifyPassword } from './src/lib/auth'

async function testAuth() {
  console.log('🧪 Testing authentication...')
  
  const prisma = new PrismaClient()
  
  try {
    // Try to connect to database
    await prisma.$connect()
    console.log('✅ Database connection successful')
    
    // Check if admin 3 exists
    const admin3 = await prisma.admin.findUnique({
      where: { email: 'mouadom2003@gmail.com' }
    })
    
    if (!admin3) {
      console.log('❌ Admin 3 not found in database')
      return
    }
    
    console.log('✅ Admin 3 found:', { email: admin3.email, name: admin3.name })
    
    // Test password verification
    const testPassword = 'mdol2003'
    const isValid = await verifyPassword(testPassword, admin3.password)
    
    console.log(`🔐 Password test for "${testPassword}":`, isValid ? '✅ VALID' : '❌ INVALID')
    
    // Test if password is properly hashed
    const isHashed = admin3.password.startsWith('$2')
    console.log('🔒 Password is hashed:', isHashed ? '✅ YES' : '❌ NO (plain text)')
    
    // Show password hash (first 20 chars for security)
    console.log('🔑 Password hash preview:', admin3.password.substring(0, 20) + '...')
    
  } catch (error) {
    console.error('❌ Test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAuth()
