import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixClubManager() {
  try {
    console.log('🔍 Checking club manager account...');
    
    const manager = await prisma.clubManager.findUnique({
      where: { 
        email: 'manager.clubatlasjujitsucasablanca@lrcsjj.ma' 
      },
      include: {
        club: true
      }
    });
    
    if (!manager) {
      console.log('❌ Club manager not found');
      return;
    }
    
    console.log('✅ Club manager found:');
    console.log(`- Email: ${manager.email}`);
    console.log(`- Name: ${manager.name}`);
    console.log(`- Club: ${manager.club.name}`);
    console.log(`- Is Active: ${manager.isActive}`);
    console.log(`- Has Password: ${!!manager.password}`);
    console.log(`- Has Temporary Password: ${!!manager.temporaryPassword}`);
    console.log(`- Temporary Password: ${manager.temporaryPassword}`);
    console.log(`- Password Reset At: ${manager.passwordResetAt}`);
    
    // Fix the account if needed
    if (!manager.isActive || (!manager.password && !manager.temporaryPassword)) {
      console.log('\n🔧 Fixing account...');
      
      // Generate a new temporary password
      const temporaryPassword = Math.random()
        .toString(36)
        .slice(-8)
        .toUpperCase();
      
      const updatedManager = await prisma.clubManager.update({
        where: { id: manager.id },
        data: {
          isActive: true,
          temporaryPassword: temporaryPassword,
          password: null, // Reset password so they have to set it
          passwordResetAt: new Date(),
        },
      });
      
      console.log('✅ Account fixed!');
      console.log(`- New temporary password: ${temporaryPassword}`);
      console.log(`- Account is now active: ${updatedManager.isActive}`);
      console.log('\n📧 You can now login with:');
      console.log(`Email: ${manager.email}`);
      console.log(`Password: ${temporaryPassword}`);
    } else {
      console.log('\n✅ Account is already properly configured');
      if (manager.temporaryPassword) {
        console.log(`\n📧 You can login with:`);
        console.log(`Email: ${manager.email}`);
        console.log(`Password: ${manager.temporaryPassword}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixClubManager();
