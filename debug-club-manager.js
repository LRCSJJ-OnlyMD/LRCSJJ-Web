import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkClubManager() {
  try {
    console.log('🔍 Checking club manager status...');
    
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
      
      // Let's see what managers exist
      const allManagers = await prisma.clubManager.findMany({
        include: { club: true }
      });
      
      console.log('\n📋 Existing club managers:');
      allManagers.forEach(m => {
        console.log(`- ${m.email} (${m.name}) - Club: ${m.club.name} - Active: ${m.isActive} - Has Password: ${!!m.password}`);
      });
      
    } else {
      console.log('✅ Club manager found:');
      console.log(`- Email: ${manager.email}`);
      console.log(`- Name: ${manager.name}`);
      console.log(`- Club: ${manager.club.name}`);
      console.log(`- Is Active: ${manager.isActive}`);
      console.log(`- Has Password: ${!!manager.password}`);
      console.log(`- Has Temporary Password: ${!!manager.temporaryPassword}`);
      console.log(`- Temporary Password: ${manager.temporaryPassword}`);
      console.log(`- Password Reset At: ${manager.passwordResetAt}`);
      console.log(`- Last Login: ${manager.lastLoginAt}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkClubManager();
