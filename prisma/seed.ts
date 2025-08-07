import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin users
  const adminPassword = await hashPassword(process.env.ADMIN_DEFAULT_PASSWORD || 'AdminPass2025!')
  const admin3Password = await hashPassword('mdol2003') // Hash the third admin's password
  
  const admin1 = await prisma.admin.upsert({
    where: { email: 'admin@lrcsjj.ma' },
    update: {},
    create: {
      email: 'admin@lrcsjj.ma',
      password: adminPassword,
      name: 'Administrator 1'
    }
  })

  const admin2 = await prisma.admin.upsert({
    where: { email: 'admin2@lrcsjj.ma' },
    update: {},
    create: {
      email: 'admin2@lrcsjj.ma',
      password: adminPassword,
      name: 'Administrator 2'
    }
  })

  const admin3 = await prisma.admin.upsert({
    where: { email: 'mouadom2003@gmail.com' },
    update: {},
    create: {
      email: 'mouadom2003@gmail.com',
      password: admin3Password, // Use the hashed password
      name: 'Administrator 3'
    }
  })

  console.log('✅ Created admin users:', { admin1: admin1.email, admin2: admin2.email, admin3: admin3.email })

  // Create a sample season
  const season = await prisma.season.upsert({
    where: { name: '2024-2025' },
    update: {},
    create: {
      name: '2024-2025',
      startDate: new Date('2024-09-01'),
      endDate: new Date('2025-08-31'),
      isActive: true
    }
  })

  console.log('✅ Created season:', season.name)

  // Create sample clubs
  const clubs = await Promise.all([
    prisma.club.upsert({
      where: { id: 'club-casa-1' },
      update: {},
      create: {
        id: 'club-casa-1',
        name: 'Club Ju-Jitsu Casablanca',
        address: 'Casablanca, Morocco',
        phone: '+212 522 123 456',
        email: 'contact@jjcasa.ma',
        president: 'Ahmed Benali',
        coach: 'Mohamed El Fassi'
      }
    }),
    prisma.club.upsert({
      where: { id: 'club-settat-1' },
      update: {},
      create: {
        id: 'club-settat-1',
        name: 'Club Ju-Jitsu Settat',
        address: 'Settat, Morocco',
        phone: '+212 523 456 789',
        email: 'contact@jjsettat.ma',
        president: 'Fatima Zahra',
        coach: 'Youssef Alami'
      }
    }),
    prisma.club.upsert({
      where: { id: 'club-berrechid-1' },
      update: {},
      create: {
        id: 'club-berrechid-1',
        name: 'Club Ju-Jitsu Berrechid',
        address: 'Berrechid, Morocco',
        phone: '+212 522 789 012',
        email: 'contact@jjberrechid.ma',
        president: 'Omar Tazi',
        coach: 'Karim Senhaji'
      }
    })
  ])

  console.log('✅ Created clubs:', clubs.map(c => c.name))

  // Create sample athletes with testimonials
  const athletes = await Promise.all([
    prisma.athlete.upsert({
      where: { nationalId: 'MA123456' },
      update: {},
      create: {
        firstName: 'Hassan',
        lastName: 'Bouali',
        dateOfBirth: new Date('1995-03-15'),
        nationalId: 'MA123456',
        phone: '+212 612 345 678',
        email: 'hassan.bouali@email.ma',
        belt: 'Brown',
        weight: 70.5,
        category: 'Adult Male -73kg',
        clubId: clubs[0].id
      }
    }),
    prisma.athlete.upsert({
      where: { nationalId: 'BE123456' },
      update: {},
      create: {
        firstName: 'Aicha',
        lastName: 'Bennani',
        dateOfBirth: new Date('1998-07-22'),
        nationalId: 'BE123456',
        phone: '+212 613 456 789',
        email: 'aicha.bennani@email.ma',
        belt: 'Purple',
        weight: 57.0,
        category: 'Adult Female -57kg',
        clubId: clubs[1].id
      }
    }),
    prisma.athlete.upsert({
      where: { nationalId: 'MA789012' },
      update: {},
      create: {
        firstName: 'Youssef',
        lastName: 'Alaoui',
        dateOfBirth: new Date('2000-12-10'),
        nationalId: 'MA789012',
        phone: '+212 614 567 890',
        belt: 'Blue',
        weight: 85.0,
        category: 'Adult Male -85kg',
        clubId: clubs[2].id
      }
    }),
    prisma.athlete.upsert({
      where: { nationalId: 'MA456789' },
      update: {},
      create: {
        firstName: 'Fatima',
        lastName: 'El Mansouri',
        dateOfBirth: new Date('1997-05-18'),
        nationalId: 'MA456789',
        phone: '+212 615 678 901',
        email: 'fatima.elmansouri@email.ma',
        belt: 'Black',
        weight: 60.0,
        category: 'Adult Female -62kg',
        clubId: clubs[0].id
      }
    }),
    prisma.athlete.upsert({
      where: { nationalId: 'SE654321' },
      update: {},
      create: {
        firstName: 'Omar',
        lastName: 'Benkirane',
        dateOfBirth: new Date('1996-11-03'),
        nationalId: 'SE654321',
        phone: '+212 616 789 012',
        email: 'omar.benkirane@email.ma',
        belt: 'Brown',
        weight: 78.0,
        category: 'Adult Male -81kg',
        clubId: clubs[1].id
      }
    }),
    prisma.athlete.upsert({
      where: { nationalId: 'BR987654' },
      update: {},
      create: {
        firstName: 'Nadia',
        lastName: 'Chakir',
        dateOfBirth: new Date('1999-09-12'),
        nationalId: 'BR987654',
        phone: '+212 617 890 123',
        email: 'nadia.chakir@email.ma',
        belt: 'Purple',
        weight: 52.0,
        category: 'Adult Female -52kg',
        clubId: clubs[2].id
      }
    })
  ])

  console.log('✅ Created athletes:', athletes.map(a => `${a.firstName} ${a.lastName}`))

  // Create sample championship
  const championship = await prisma.championship.upsert({
    where: { id: 'championship-2025-regional' },
    update: {},
    create: {
      id: 'championship-2025-regional',
      name: 'Casablanca-Settat Regional Championship 2025',
      seasonId: season.id,
      entryFee: 200.0,
      startDate: new Date('2025-03-15'),
      endDate: new Date('2025-03-17'),
      location: 'Casablanca Sports Complex',
      description: 'Annual regional championship for Casablanca-Settat league'
    }
  })

  console.log('✅ Created championship:', championship.name)

  // Create league teams
  const team1 = await prisma.leagueTeam.upsert({
    where: { id: 'team-1st-division' },
    update: {},
    create: {
      id: 'team-1st-division',
      name: '1st League Team',
      division: 'First Division',
      category: 'Mixed Adult',
      description: 'Elite team representing Casablanca-Settat in national competitions'
    }
  })

  const team2 = await prisma.leagueTeam.upsert({
    where: { id: 'team-2nd-division' },
    update: {},
    create: {
      id: 'team-2nd-division',
      name: '2nd League Team',
      division: 'Second Division',
      category: 'Youth',
      description: 'Development team for young athletes'
    }
  })

  console.log('✅ Created league teams:', [team1.name, team2.name])

  // Create default map configuration
  const mapConfig = await prisma.mapConfiguration.upsert({
    where: { id: 'default-map' },
    update: {},
    create: {
      id: 'default-map',
      latitude: 33.5731, // Casablanca
      longitude: -7.5898,
      locationName: 'Complexe Sportif Mohammed V',
      zoom: 15,
      address: 'Avenue Hassan II, Casablanca, Maroc 20000',
      isActive: true
    }
  })

  console.log('✅ Created map configuration:', mapConfig.locationName)

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
