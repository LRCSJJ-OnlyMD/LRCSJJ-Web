import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../src/lib/auth'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin users
  const adminPassword = await hashPassword(process.env.ADMIN_DEFAULT_PASSWORD || 'AdminPass2025!')
  const admin3Password = await hashPassword('mdol2003') // Hash the specific password for admin 3
  
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
      password: admin3Password, // Use the specific hashed password for admin 3
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
        name: 'Club Ju-Jitsu Casablanca Elite',
        address: 'Boulevard Mohammed V, Casablanca 20000, Morocco',
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
        name: 'Club Ju-Jitsu Settat Champions',
        address: 'Avenue Hassan II, Settat 26000, Morocco',
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
        name: 'Club Ju-Jitsu Berrechid Warriors',
        address: 'Rue Al Qods, Berrechid 26100, Morocco',
        phone: '+212 522 789 012',
        email: 'contact@jjberrechid.ma',
        president: 'Omar Tazi',
        coach: 'Karim Senhaji'
      }
    }),
    prisma.club.upsert({
      where: { id: 'club-mohammedia-1' },
      update: {},
      create: {
        id: 'club-mohammedia-1',
        name: 'Club Ju-Jitsu Mohammedia Fighters',
        address: 'Boulevard Ibn Sina, Mohammedia 28810, Morocco',
        phone: '+212 523 321 654',
        email: 'contact@jjmohammedia.ma',
        president: 'Rachid Benjelloun',
        coach: 'Noureddine Lahlou'
      }
    })
  ])

  console.log('✅ Created clubs:', clubs.map(c => c.name))

  // Create comprehensive athlete data for each club (10+ athletes per club)
  console.log('🏃 Creating athletes for each club...')
  
  // Casablanca Elite Club Athletes
  const casablancaAthletes = [
    { firstName: 'Hassan', lastName: 'Bouali', nationalId: 'MA123456', belt: 'Black', weight: 70.5, category: 'Adult Male -73kg', phone: '+212 612 345 678', email: 'hassan.bouali@email.ma', dob: '1995-03-15' },
    { firstName: 'Fatima', lastName: 'El Mansouri', nationalId: 'MA456789', belt: 'Brown', weight: 60.0, category: 'Adult Female -62kg', phone: '+212 615 678 901', email: 'fatima.elmansouri@email.ma', dob: '1997-05-18' },
    { firstName: 'Youssef', lastName: 'Chakraoui', nationalId: 'MA789456', belt: 'Purple', weight: 85.0, category: 'Adult Male -85kg', phone: '+212 618 234 567', email: 'youssef.chakraoui@email.ma', dob: '1996-08-22' },
    { firstName: 'Amina', lastName: 'Benkirane', nationalId: 'MA321654', belt: 'Blue', weight: 55.0, category: 'Adult Female -57kg', phone: '+212 619 345 678', email: 'amina.benkirane@email.ma', dob: '1998-12-10' },
    { firstName: 'Omar', lastName: 'Senhaji', nationalId: 'MA654321', belt: 'Black', weight: 78.0, category: 'Adult Male -81kg', phone: '+212 620 456 789', email: 'omar.senhaji@email.ma', dob: '1994-11-03' },
    { firstName: 'Khadija', lastName: 'Alami', nationalId: 'MA987654', belt: 'Brown', weight: 52.0, category: 'Adult Female -52kg', phone: '+212 621 567 890', email: 'khadija.alami@email.ma', dob: '1999-04-17' },
    { firstName: 'Mehdi', lastName: 'Tazi', nationalId: 'MA147258', belt: 'Purple', weight: 90.0, category: 'Adult Male -90kg', phone: '+212 622 678 901', email: 'mehdi.tazi@email.ma', dob: '1997-09-12' },
    { firstName: 'Nadia', lastName: 'Benjelloun', nationalId: 'MA258369', belt: 'Blue', weight: 48.0, category: 'Adult Female -48kg', phone: '+212 623 789 012', email: 'nadia.benjelloun@email.ma', dob: '2000-01-28' },
    { firstName: 'Rachid', lastName: 'Lahlou', nationalId: 'MA369147', belt: 'Black', weight: 66.0, category: 'Adult Male -66kg', phone: '+212 624 890 123', email: 'rachid.lahlou@email.ma', dob: '1993-07-05' },
    { firstName: 'Salma', lastName: 'Fassi', nationalId: 'MA159753', belt: 'Brown', weight: 70.0, category: 'Adult Female -70kg', phone: '+212 625 901 234', email: 'salma.fassi@email.ma', dob: '1996-03-14' },
    { firstName: 'Karim', lastName: 'Berrada', nationalId: 'MA753159', belt: 'Purple', weight: 73.0, category: 'Adult Male -73kg', phone: '+212 626 012 345', email: 'karim.berrada@email.ma', dob: '1998-10-20' },
    { firstName: 'Zineb', lastName: 'Mouline', nationalId: 'MA951357', belt: 'Blue', weight: 57.0, category: 'Adult Female -57kg', phone: '+212 627 123 456', email: 'zineb.mouline@email.ma', dob: '2001-06-08' }
  ]

  // Settat Champions Club Athletes
  const settatAthletes = [
    { firstName: 'Aicha', lastName: 'Bennani', nationalId: 'SE123456', belt: 'Black', weight: 57.0, category: 'Adult Female -57kg', phone: '+212 613 456 789', email: 'aicha.bennani@email.ma', dob: '1998-07-22' },
    { firstName: 'Omar', lastName: 'Benkirane', nationalId: 'SE654321', belt: 'Brown', weight: 78.0, category: 'Adult Male -81kg', phone: '+212 616 789 012', email: 'omar.benkirane@email.ma', dob: '1996-11-03' },
    { firstName: 'Maryam', lastName: 'El Idrissi', nationalId: 'SE789123', belt: 'Purple', weight: 62.0, category: 'Adult Female -62kg', phone: '+212 628 234 567', email: 'maryam.elidrissi@email.ma', dob: '1997-04-15' },
    { firstName: 'Abdellah', lastName: 'Chraibi', nationalId: 'SE321789', belt: 'Blue', weight: 85.0, category: 'Adult Male -85kg', phone: '+212 629 345 678', email: 'abdellah.chraibi@email.ma', dob: '1995-12-08' },
    { firstName: 'Latifa', lastName: 'Benali', nationalId: 'SE456123', belt: 'Black', weight: 52.0, category: 'Adult Female -52kg', phone: '+212 630 456 789', email: 'latifa.benali@email.ma', dob: '1999-09-25' },
    { firstName: 'Noureddine', lastName: 'Tahiri', nationalId: 'SE987456', belt: 'Brown', weight: 73.0, category: 'Adult Male -73kg', phone: '+212 631 567 890', email: 'noureddine.tahiri@email.ma', dob: '1994-02-17' },
    { firstName: 'Hanane', lastName: 'Kettani', nationalId: 'SE654789', belt: 'Purple', weight: 48.0, category: 'Adult Female -48kg', phone: '+212 632 678 901', email: 'hanane.kettani@email.ma', dob: '2000-08-11' },
    { firstName: 'Said', lastName: 'Bouazza', nationalId: 'SE123789', belt: 'Blue', weight: 90.0, category: 'Adult Male -90kg', phone: '+212 633 789 012', email: 'said.bouazza@email.ma', dob: '1996-05-30' },
    { firstName: 'Rajae', lastName: 'Amrani', nationalId: 'SE789456', belt: 'Black', weight: 70.0, category: 'Adult Female -70kg', phone: '+212 634 890 123', email: 'rajae.amrani@email.ma', dob: '1993-11-19' },
    { firstName: 'Hamid', lastName: 'Bensouda', nationalId: 'SE456789', belt: 'Brown', weight: 66.0, category: 'Adult Male -66kg', phone: '+212 635 901 234', email: 'hamid.bensouda@email.ma', dob: '1998-01-06' },
    { firstName: 'Siham', lastName: 'Zouine', nationalId: 'SE159753', belt: 'Purple', weight: 55.0, category: 'Adult Female -55kg', phone: '+212 636 012 345', email: 'siham.zouine@email.ma', dob: '2001-03-23' }
  ]

  // Berrechid Warriors Club Athletes
  const berrechidAthletes = [
    { firstName: 'Nadia', lastName: 'Chakir', nationalId: 'BR987654', belt: 'Black', weight: 52.0, category: 'Adult Female -52kg', phone: '+212 617 890 123', email: 'nadia.chakir@email.ma', dob: '1999-09-12' },
    { firstName: 'Youssef', lastName: 'Alaoui', nationalId: 'BR789012', belt: 'Brown', weight: 85.0, category: 'Adult Male -85kg', phone: '+212 614 567 890', email: 'youssef.alaoui@email.ma', dob: '2000-12-10' },
    { firstName: 'Samira', lastName: 'Benali', nationalId: 'BR456789', belt: 'Purple', weight: 57.0, category: 'Adult Female -57kg', phone: '+212 637 123 456', email: 'samira.benali@email.ma', dob: '1997-06-18' },
    { firstName: 'Khalid', lastName: 'Mahmoudi', nationalId: 'BR123456', belt: 'Blue', weight: 78.0, category: 'Adult Male -81kg', phone: '+212 638 234 567', email: 'khalid.mahmoudi@email.ma', dob: '1995-10-05' },
    { firstName: 'Zahra', lastName: 'Bouzid', nationalId: 'BR789123', belt: 'Black', weight: 62.0, category: 'Adult Female -62kg', phone: '+212 639 345 678', email: 'zahra.bouzid@email.ma', dob: '1996-03-27' },
    { firstName: 'Mustapha', lastName: 'Louafi', nationalId: 'BR321654', belt: 'Brown', weight: 73.0, category: 'Adult Male -73kg', phone: '+212 640 456 789', email: 'mustapha.louafi@email.ma', dob: '1994-08-14' },
    { firstName: 'Karima', lastName: 'Benjelloun', nationalId: 'BR654321', belt: 'Purple', weight: 48.0, category: 'Adult Female -48kg', phone: '+212 641 567 890', email: 'karima.benjelloun@email.ma', dob: '2000-12-02' },
    { firstName: 'Ahmed', lastName: 'Slaoui', nationalId: 'BR987123', belt: 'Blue', weight: 90.0, category: 'Adult Male -90kg', phone: '+212 642 678 901', email: 'ahmed.slaoui@email.ma', dob: '1998-04-09' },
    { firstName: 'Laila', lastName: 'Fikri', nationalId: 'BR159357', belt: 'Black', weight: 70.0, category: 'Adult Female -70kg', phone: '+212 643 789 012', email: 'laila.fikri@email.ma', dob: '1992-07-21' },
    { firstName: 'Brahim', lastName: 'Naciri', nationalId: 'BR753951', belt: 'Brown', weight: 66.0, category: 'Adult Male -66kg', phone: '+212 644 890 123', email: 'brahim.naciri@email.ma', dob: '1997-11-16' },
    { firstName: 'Fadwa', lastName: 'Serghini', nationalId: 'BR357159', belt: 'Purple', weight: 55.0, category: 'Adult Female -55kg', phone: '+212 645 901 234', email: 'fadwa.serghini@email.ma', dob: '2001-01-13' }
  ]

  // Mohammedia Fighters Club Athletes  
  const mohammediaAthletes = [
    { firstName: 'Driss', lastName: 'Benali', nationalId: 'MH123456', belt: 'Black', weight: 81.0, category: 'Adult Male -81kg', phone: '+212 646 012 345', email: 'driss.benali@email.ma', dob: '1995-05-12' },
    { firstName: 'Souad', lastName: 'Berrada', nationalId: 'MH654321', belt: 'Brown', weight: 57.0, category: 'Adult Female -57kg', phone: '+212 647 123 456', email: 'souad.berrada@email.ma', dob: '1998-08-29' },
    { firstName: 'Hicham', lastName: 'Tounsi', nationalId: 'MH789456', belt: 'Purple', weight: 73.0, category: 'Adult Male -73kg', phone: '+212 648 234 567', email: 'hicham.tounsi@email.ma', dob: '1996-11-07' },
    { firstName: 'Malika', lastName: 'Cherkaoui', nationalId: 'MH456123', belt: 'Blue', weight: 62.0, category: 'Adult Female -62kg', phone: '+212 649 345 678', email: 'malika.cherkaoui@email.ma', dob: '1999-02-14' },
    { firstName: 'Samir', lastName: 'Ouali', nationalId: 'MH123789', belt: 'Black', weight: 85.0, category: 'Adult Male -85kg', phone: '+212 650 456 789', email: 'samir.ouali@email.ma', dob: '1993-09-03' },
    { firstName: 'Nawal', lastName: 'Bennani', nationalId: 'MH987654', belt: 'Brown', weight: 52.0, category: 'Adult Female -52kg', phone: '+212 651 567 890', email: 'nawal.bennani@email.ma', dob: '2000-06-18' },
    { firstName: 'Ismail', lastName: 'Dahbi', nationalId: 'MH321456', belt: 'Purple', weight: 90.0, category: 'Adult Male -90kg', phone: '+212 652 678 901', email: 'ismail.dahbi@email.ma', dob: '1997-12-25' },
    { firstName: 'Ghizlane', lastName: 'Amellal', nationalId: 'MH654789', belt: 'Blue', weight: 48.0, category: 'Adult Female -48kg', phone: '+212 653 789 012', email: 'ghizlane.amellal@email.ma', dob: '2001-03-10' },
    { firstName: 'Redouane', lastName: 'Benjelloun', nationalId: 'MH789123', belt: 'Black', weight: 66.0, category: 'Adult Male -66kg', phone: '+212 654 890 123', email: 'redouane.benjelloun@email.ma', dob: '1994-07-28' },
    { firstName: 'Hayat', lastName: 'Lamrani', nationalId: 'MH456789', belt: 'Brown', weight: 70.0, category: 'Adult Female -70kg', phone: '+212 655 901 234', email: 'hayat.lamrani@email.ma', dob: '1996-10-15' }
  ]

  // Create all athletes
  const allAthletesData = [
    ...casablancaAthletes.map(a => ({ ...a, clubId: clubs[0].id })),
    ...settatAthletes.map(a => ({ ...a, clubId: clubs[1].id })),
    ...berrechidAthletes.map(a => ({ ...a, clubId: clubs[2].id })),
    ...mohammediaAthletes.map(a => ({ ...a, clubId: clubs[3].id }))
  ]

  const athletes = []
  for (const athleteData of allAthletesData) {
    const athlete = await prisma.athlete.upsert({
      where: { nationalId: athleteData.nationalId },
      update: {},
      create: {
        firstName: athleteData.firstName,
        lastName: athleteData.lastName,
        dateOfBirth: new Date(athleteData.dob),
        nationalId: athleteData.nationalId,
        phone: athleteData.phone,
        email: athleteData.email,
        belt: athleteData.belt,
        weight: athleteData.weight,
        category: athleteData.category,
        clubId: athleteData.clubId
      }
    })
    athletes.push(athlete)
  }

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

  // Create comprehensive insurance data for athletes
  console.log('🛡️ Creating insurance records...')
  const insuranceRecords = []
  for (let i = 0; i < athletes.length; i++) {
    const athlete = athletes[i]
    const isPaid = Math.random() > 0.3 // 70% chance of being paid
    const insurance = await prisma.insurance.upsert({
      where: { 
        athleteId_seasonId: {
          athleteId: athlete.id,
          seasonId: season.id
        }
      },
      update: {},
      create: {
        athleteId: athlete.id,
        seasonId: season.id,
        amount: 150.0,
        isPaid: isPaid,
        paidAt: isPaid ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null // Random date in last 30 days
      }
    })
    insuranceRecords.push(insurance)
  }

  console.log(`✅ Created ${insuranceRecords.length} insurance records (${insuranceRecords.filter(i => i.isPaid).length} paid)`)

  // Create club managers for testing with proper model name
  const managerPassword = await hashPassword('manager123')
  const tempPassword = await hashPassword('temp123')
  
  const clubManager1 = await prisma.clubManager.upsert({
    where: { email: 'manager@club-casablanca.com' },
    update: {},
    create: {
      email: 'manager@club-casablanca.com',
      password: managerPassword,
      name: 'Mohammed Alaoui',
      clubId: clubs[0].id, // Casablanca Elite
      isActive: true,
      temporaryPassword: null
    }
  })

  const clubManager2 = await prisma.clubManager.upsert({
    where: { email: 'manager@club-settat.com' },
    update: {},
    create: {
      email: 'manager@club-settat.com',
      password: tempPassword,
      name: 'Fatima Bennani',
      clubId: clubs[1].id, // Settat Champions
      isActive: true,
      temporaryPassword: 'temp123'
    }
  })

  const clubManager3 = await prisma.clubManager.upsert({
    where: { email: 'manager@club-berrechid.com' },
    update: {},
    create: {
      email: 'manager@club-berrechid.com',
      password: managerPassword,
      name: 'Omar Tazi',
      clubId: clubs[2].id, // Berrechid Warriors
      isActive: true,
      temporaryPassword: null
    }
  })

  const clubManager4 = await prisma.clubManager.upsert({
    where: { email: 'manager@club-mohammedia.com' },
    update: {},
    create: {
      email: 'manager@club-mohammedia.com',
      password: managerPassword,
      name: 'Rachid Benjelloun',
      clubId: clubs[3].id, // Mohammedia Fighters
      isActive: true,
      temporaryPassword: null
    }
  })

  console.log('✅ Created club managers:', {
    manager1: clubManager1.email,
    manager2: clubManager2.email,
    manager3: clubManager3.email,
    manager4: clubManager4.email
  })

  console.log(`📊 Database Summary:`)
  console.log(`   - ${clubs.length} clubs`)
  console.log(`   - ${athletes.length} athletes`)
  console.log(`   - ${insuranceRecords.length} insurance records`)
  console.log(`   - ${insuranceRecords.filter(i => i.isPaid).length} paid insurance`)
  console.log(`   - ${insuranceRecords.filter(i => !i.isPaid).length} unpaid insurance`)
  console.log(`   - 4 club managers`)

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
