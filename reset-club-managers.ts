import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetAndSeed() {
  try {
    console.log('🧹 Cleaning up club managers...');
    
    // Delete all club managers first
    await prisma.clubManager.deleteMany({});
    console.log('✅ Deleted all club managers');
    
    // Get all clubs
    const clubs = await prisma.club.findMany();
    console.log(`📋 Found ${clubs.length} clubs`);
    
    // Create club managers for each club
    for (const club of clubs) {
      const managerEmail = `manager.${club.name
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "")}@lrcsjj.ma`;

      // Static temporary passwords based on club names
      const staticPasswords: Record<string, string> = {
        "Club Atlas Ju-Jitsu Casablanca": "atlas2025",
        "Champions de Settat Ju-Jitsu": "champions2025",
        "Dragon Ju-Jitsu Mohammedia": "dragon2025",
        "Elite Ju-Jitsu Berrechid": "elite2025",
        "Phoenix Ju-Jitsu El Jadida": "phoenix2025",
      };

      const tempPassword = staticPasswords[club.name] || "manager2025";

      console.log(`Creating manager for ${club.name}:`);
      console.log(`  Email: ${managerEmail}`);
      console.log(`  Temporary Password: ${tempPassword}`);

      const manager = await prisma.clubManager.create({
        data: {
          email: managerEmail,
          name: `Manager ${club.name.split(" ")[1] || club.name.split(" ")[0]}`,
          clubId: club.id,
          temporaryPassword: tempPassword,
          isActive: true,
          password: null,
          passwordResetAt: new Date(),
        },
      });

      console.log(`✅ Created manager: ${manager.email} with temp password: ${tempPassword}`);
    }
    
    console.log('\n🎉 Club managers reset completed!');
    console.log('\n📧 Login credentials:');
    console.log('Email: manager.clubatlasjujitsucasablanca@lrcsjj.ma');
    console.log('Password: atlas2025');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAndSeed();
