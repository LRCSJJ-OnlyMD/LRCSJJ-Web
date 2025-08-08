import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log(
    "🌱 Starting LRCSJJ database seed with realistic startup data..."
  );

  // Create admin users
  const adminPassword = await hashPassword(
    process.env.ADMIN_DEFAULT_PASSWORD || "AdminPass2025!"
  );
  const admin3Password = await hashPassword("mdol2003");

  const admin1 = await prisma.admin.upsert({
    where: { email: "admin@lrcsjj.ma" },
    update: {},
    create: {
      email: "admin@lrcsjj.ma",
      password: adminPassword,
      name: "Administrateur Principal LRCSJJ",
      role: "SUPER_ADMIN",
    },
  });

  const admin2 = await prisma.admin.upsert({
    where: { email: "secretaire@lrcsjj.ma" },
    update: {},
    create: {
      email: "secretaire@lrcsjj.ma",
      password: adminPassword,
      name: "Secrétaire Général",
      role: "ADMIN",
    },
  });

  const admin3 = await prisma.admin.upsert({
    where: { email: "mouadom2003@gmail.com" },
    update: {},
    create: {
      email: "mouadom2003@gmail.com",
      password: admin3Password,
      name: "Développeur Système",
      role: "SUPER_ADMIN",
    },
  });

  console.log("✅ Created admin users:", {
    admin1: admin1.email,
    admin2: admin2.email,
    admin3: admin3.email,
  });

  // Create current season (2024-2025)
  const currentSeason = await prisma.season.upsert({
    where: { name: "2024-2025" },
    update: {},
    create: {
      name: "2024-2025",
      startDate: new Date("2024-09-01"),
      endDate: new Date("2025-08-31"),
      isActive: true,
    },
  });

  // Create previous season for historical data
  const previousSeason = await prisma.season.upsert({
    where: { name: "2023-2024" },
    update: {},
    create: {
      name: "2023-2024",
      startDate: new Date("2023-09-01"),
      endDate: new Date("2024-08-31"),
      isActive: false,
    },
  });

  console.log("✅ Created seasons:", {
    current: currentSeason.name,
    previous: previousSeason.name,
  });

  // Create realistic clubs for startup presentation
  const clubsData = [
    {
      name: "Club Atlas Ju-Jitsu Casablanca",
      address: "Quartier Maarif, Boulevard Zerktouni, Casablanca",
      phone: "+212 522 123 456",
      email: "atlas.jj@gmail.com",
      president: "Ahmed Benali",
      coach: "Karim Elmounir",
    },
    {
      name: "Champions de Settat Ju-Jitsu",
      address: "Avenue Mohammed V, Centre Ville, Settat",
      phone: "+212 523 789 012",
      email: "champions.settat@outlook.com",
      president: "Fatima Zahra Alami",
      coach: "Youssef Bennani",
    },
    {
      name: "Dragon Ju-Jitsu Mohammedia",
      address: "Zone Industrielle, Boulevard des FAR, Mohammedia",
      phone: "+212 523 345 678",
      email: "dragon.mohammedia@yahoo.fr",
      president: "Rachid Tahiri",
      coach: "Abdellah Kabbaj",
    },
    {
      name: "Elite Ju-Jitsu Berrechid",
      address: "Centre Ville, Avenue Hassan II, Berrechid",
      phone: "+212 522 456 789",
      email: "elite.berrechid@gmail.com",
      president: "Noureddine Fassi",
      coach: "Mohamed Cherkaoui",
    },
    {
      name: "Phoenix Ju-Jitsu El Jadida",
      address: "Route de Casablanca, Quartier Al Qods, El Jadida",
      phone: "+212 523 567 890",
      email: "phoenix.eljadida@hotmail.com",
      president: "Samira Bennani",
      coach: "Hassan Lahlou",
    },
  ];

  const createdClubs = [];
  for (const clubData of clubsData) {
    const club = await prisma.club.create({
      data: clubData,
    });
    createdClubs.push(club);

    // Create club manager for each club
    const managerEmail = `manager.${club.name
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "")}@lrcsjj.ma`;

    // Static temporary passwords based on club names for consistent testing
    const staticPasswords: Record<string, string> = {
      "Club Atlas Ju-Jitsu Casablanca": "atlas2025",
      "Champions de Settat Ju-Jitsu": "champions2025",
      "Dragon Ju-Jitsu Mohammedia": "dragon2025",
      "Elite Ju-Jitsu Berrechid": "elite2025",
      "Phoenix Ju-Jitsu El Jadida": "phoenix2025",
    };

    const tempPassword = staticPasswords[club.name] || "manager2025";

    await prisma.clubManager.upsert({
      where: { email: managerEmail },
      update: {},
      create: {
        email: managerEmail,
        name: `Manager ${club.name.split(" ")[0]}`,
        clubId: club.id,
        temporaryPassword: tempPassword,
        isActive: true,
      },
    });
  }

  console.log("✅ Created clubs and managers:", createdClubs.length);

  // Realistic athlete names for Moroccan context
  const athleteNames = [
    { firstName: "Ahmed", lastName: "Benali", gender: "M" },
    { firstName: "Mohamed", lastName: "Alami", gender: "M" },
    { firstName: "Youssef", lastName: "Chakir", gender: "M" },
    { firstName: "Karim", lastName: "Fassi", gender: "M" },
    { firstName: "Omar", lastName: "Bennani", gender: "M" },
    { firstName: "Amine", lastName: "Tahiri", gender: "M" },
    { firstName: "Rachid", lastName: "Kabbaj", gender: "M" },
    { firstName: "Abdellah", lastName: "Cherkaoui", gender: "M" },
    { firstName: "Hassan", lastName: "Lahlou", gender: "M" },
    { firstName: "Othmane", lastName: "Sebti", gender: "M" },
    { firstName: "Mehdi", lastName: "Berrada", gender: "M" },
    { firstName: "Zakaria", lastName: "Ouali", gender: "M" },
    { firstName: "Hamza", lastName: "Nejjar", gender: "M" },
    { firstName: "Bilal", lastName: "Tazi", gender: "M" },
    { firstName: "Adnane", lastName: "Kettani", gender: "M" },
    { firstName: "Fatima", lastName: "Zahra", gender: "F" },
    { firstName: "Aicha", lastName: "Bennani", gender: "F" },
    { firstName: "Khadija", lastName: "Alaoui", gender: "F" },
    { firstName: "Samira", lastName: "Fassi", gender: "F" },
    { firstName: "Nadia", lastName: "Chakir", gender: "F" },
    { firstName: "Laila", lastName: "Berrada", gender: "F" },
    { firstName: "Zineb", lastName: "Tahiri", gender: "F" },
    { firstName: "Meriem", lastName: "Kabbaj", gender: "F" },
    { firstName: "Sophia", lastName: "Benali", gender: "F" },
    { firstName: "Salma", lastName: "Cherkaoui", gender: "F" },
    { firstName: "Yasmine", lastName: "Ouali", gender: "F" },
    { firstName: "Dounia", lastName: "Sebti", gender: "F" },
    { firstName: "Imane", lastName: "Nejjar", gender: "F" },
    { firstName: "Ghita", lastName: "Tazi", gender: "F" },
    { firstName: "Hanane", lastName: "Kettani", gender: "F" },
  ];

  // Helper functions for realistic data generation
  function getRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  function generateAge(): number {
    // Realistic age distribution for ju-jitsu clubs
    const ageRanges = [
      { min: 12, max: 16, weight: 0.2 }, // Youth
      { min: 17, max: 25, weight: 0.5 }, // Prime age
      { min: 26, max: 35, weight: 0.3 }, // Adults
    ];

    const random = Math.random();
    let cumulative = 0;

    for (const range of ageRanges) {
      cumulative += range.weight;
      if (random <= cumulative) {
        return (
          Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
        );
      }
    }
    return 20; // fallback
  }

  function generateWeight(age: number, gender: string): number {
    let base = gender === "M" ? 70 : 55;
    if (age < 16) base -= 20;
    else if (age < 20) base -= 10;

    return Math.round(base + (Math.random() - 0.5) * 20);
  }

  function generateEmail(firstName: string, lastName: string): string {
    const domains = ["gmail.com", "outlook.com", "yahoo.fr", "hotmail.com"];
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${getRandomElement(
      domains
    )}`;
  }

  function generatePhone(): string {
    const prefixes = ["06", "07"];
    const prefix = getRandomElement(prefixes);
    const number = Math.floor(Math.random() * 90000000) + 10000000;
    return `+212 ${prefix} ${
      number
        .toString()
        .match(/.{1,2}/g)
        ?.join(" ") || ""
    }`;
  }

  function generateRealisticBelt(age: number): string {
    // Realistic belt progression based on age and typical training progression
    if (age < 16) {
      return getRandomElement(["Blanche", "Jaune", "Orange", "Verte"]);
    } else if (age < 20) {
      return getRandomElement(["Verte", "Bleue", "Marron"]);
    } else if (age < 25) {
      return getRandomElement(["Bleue", "Marron", "Noire 1er Dan"]);
    } else {
      return getRandomElement(["Marron", "Noire 1er Dan", "Noire 2ème Dan"]);
    }
  }

  // Create realistic athletes for each club
  const allAthletes = [];
  let totalAthletes = 0;

  for (const club of createdClubs) {
    // Each club has 10-20 athletes (realistic for startup league)
    const athleteCount = Math.floor(Math.random() * 11) + 10;

    for (let i = 0; i < athleteCount; i++) {
      const athleteName = getRandomElement(athleteNames);
      const age = generateAge();
      const weight = generateWeight(age, athleteName.gender);

      // Generate realistic birth date
      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - age);
      birthDate.setMonth(Math.floor(Math.random() * 12));
      birthDate.setDate(Math.floor(Math.random() * 28) + 1);

      const belt = generateRealisticBelt(age);

      try {
        const athlete = await prisma.athlete.create({
          data: {
            firstName: athleteName.firstName,
            lastName: athleteName.lastName,
            dateOfBirth: birthDate,
            phone: Math.random() > 0.3 ? generatePhone() : null,
            email:
              Math.random() > 0.4
                ? generateEmail(athleteName.firstName, athleteName.lastName)
                : null,
            belt: belt,
            weight: weight,
            category: age < 18 ? "Moins de 18 ans" : "Adulte",
            clubId: club.id,
          },
        });

        allAthletes.push(athlete);
        totalAthletes++;
      } catch {
        // Skip duplicates due to unique constraints
        console.log(
          `⚠️ Skipped duplicate: ${athleteName.firstName} ${athleteName.lastName}`
        );
      }
    }
  }

  console.log("✅ Created athletes:", totalAthletes);

  // Create insurance records with CONSISTENT status between table and display
  let totalInsurances = 0;
  let paidInsurances = 0;

  for (const athlete of allAthletes) {
    // Current season insurance (all athletes need it)
    const isPaidCurrent = Math.random() > 0.25; // 75% payment rate (realistic for startup)
    await prisma.insurance.create({
      data: {
        athleteId: athlete.id,
        seasonId: currentSeason.id,
        amount: 150.0, // 150 MAD
        isPaid: isPaidCurrent,
        paidAt: isPaidCurrent
          ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
          : null,
      },
    });

    totalInsurances++;
    if (isPaidCurrent) paidInsurances++;

    // Previous season insurance (60% have historical data)
    if (Math.random() > 0.4) {
      const isPaidPrevious = Math.random() > 0.1; // 90% paid for previous season
      await prisma.insurance.create({
        data: {
          athleteId: athlete.id,
          seasonId: previousSeason.id,
          amount: 140.0, // Previous year was slightly less
          isPaid: isPaidPrevious,
          paidAt: isPaidPrevious ? new Date("2024-01-15") : null,
        },
      });

      totalInsurances++;
      if (isPaidPrevious) paidInsurances++;
    }
  }

  console.log("✅ Created insurance records with consistent status:", {
    total: totalInsurances,
    paid: paidInsurances,
    paymentRate: `${Math.round((paidInsurances / totalInsurances) * 100)}%`,
  });

  // Create realistic championships
  const championships = [
    {
      name: "Championnat Régional LRCSJJ 2025",
      entryFee: 200.0,
      startDate: new Date("2025-03-15"),
      endDate: new Date("2025-03-17"),
      location: "Complexe Sportif Mohammed V, Casablanca",
      description: "Championnat annuel de la ligue Casablanca-Settat",
    },
    {
      name: "Coupe Casablanca-Settat Ju-Jitsu",
      entryFee: 150.0,
      startDate: new Date("2025-05-10"),
      endDate: new Date("2025-05-11"),
      location: "Salle OCP, Settat",
      description: "Compétition inter-clubs de la région",
    },
    {
      name: "Tournoi de Fin d'Année",
      entryFee: 100.0,
      startDate: new Date("2025-06-20"),
      endDate: new Date("2025-06-21"),
      location: "Gymnase Municipal, Mohammedia",
      description: "Tournoi traditionnel de clôture de saison",
    },
  ];

  for (const champData of championships) {
    await prisma.championship.create({
      data: {
        ...champData,
        seasonId: currentSeason.id,
      },
    });
  }

  console.log("✅ Created championships:", championships.length);

  // Create league teams for regional representation
  const team1 = await prisma.leagueTeam.create({
    data: {
      name: "Équipe Première Division LRCSJJ",
      division: "Première Division",
      category: "Élite Adulte",
      description:
        "Équipe principale représentant la ligue dans les compétitions nationales",
    },
  });

  const team2 = await prisma.leagueTeam.create({
    data: {
      name: "Équipe Jeunes LRCSJJ",
      division: "Division Jeunes",
      category: "Moins de 20 ans",
      description:
        "Équipe de développement pour les jeunes talents de la région",
    },
  });

  // Select best athletes for league teams (realistic selection criteria)
  const seniorAthletes = allAthletes
    .filter((a) => {
      const age =
        new Date().getFullYear() - new Date(a.dateOfBirth).getFullYear();
      return (
        age >= 18 && (a.belt?.includes("Marron") || a.belt?.includes("Noire"))
      );
    })
    .slice(0, 10); // Top 10 senior athletes

  const juniorAthletes = allAthletes
    .filter((a) => {
      const age =
        new Date().getFullYear() - new Date(a.dateOfBirth).getFullYear();
      return (
        age >= 16 &&
        age < 20 &&
        (a.belt?.includes("Bleue") || a.belt?.includes("Marron"))
      );
    })
    .slice(0, 8); // Top 8 junior athletes

  // Add athletes to senior team
  for (let i = 0; i < seniorAthletes.length; i++) {
    const athlete = seniorAthletes[i];
    await prisma.leagueTeamMember.create({
      data: {
        teamId: team1.id,
        athleteId: athlete.id,
        clubId: athlete.clubId,
        position: i === 0 ? "Capitaine" : "Membre",
      },
    });
  }

  // Add athletes to junior team
  for (let i = 0; i < juniorAthletes.length; i++) {
    const athlete = juniorAthletes[i];
    await prisma.leagueTeamMember.create({
      data: {
        teamId: team2.id,
        athleteId: athlete.id,
        clubId: athlete.clubId,
        position: i === 0 ? "Capitaine" : "Membre",
      },
    });
  }

  console.log("✅ Created league teams:", {
    senior: `${team1.name} (${seniorAthletes.length} membres)`,
    junior: `${team2.name} (${juniorAthletes.length} membres)`,
  });

  // Create map configuration for LRCSJJ headquarters
  await prisma.mapConfiguration.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      latitude: 33.5731,
      longitude: -7.5898,
      locationName: "Siège LRCSJJ - Ligue Régionale Casablanca-Settat",
      zoom: 13,
      address:
        "Complexe Sportif Mohammed V, Boulevard de la Corniche, Casablanca",
      isActive: true,
      updatedBy: admin1.id,
    },
  });

  console.log("✅ Created map configuration");

  // Create some realistic payment requests for demonstration
  const samplePaymentRequests = [];
  for (let i = 0; i < 3; i++) {
    const club = getRandomElement(createdClubs);
    const athleteCount = Math.floor(Math.random() * 3) + 1; // 1-3 athletes per request
    const amount = athleteCount * 150.0; // 150 MAD per athlete

    const paymentRequest = await prisma.paymentRequest.create({
      data: {
        clubId: club.id,
        amount: amount,
        currency: "MAD",
        status: getRandomElement(["PENDING", "PAID"]),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      },
    });

    samplePaymentRequests.push(paymentRequest);
  }

  console.log(
    "✅ Created sample payment requests:",
    samplePaymentRequests.length
  );

  // Final comprehensive statistics for startup presentation
  const stats = {
    clubs: createdClubs.length,
    athletes: totalAthletes,
    insurances: totalInsurances,
    paidInsurances: paidInsurances,
    paymentRate: Math.round((paidInsurances / totalInsurances) * 100),
    championships: championships.length,
    leagueTeams: 2,
    paymentRequests: samplePaymentRequests.length,
    averageAthletesPerClub: Math.round(totalAthletes / createdClubs.length),
  };

  console.log("\n🎉 LRCSJJ Database seeded successfully!");
  console.log("📊 Startup Statistics (Ready for Presentation):");
  console.log(`   🏢 Clubs: ${stats.clubs}`);
  console.log(
    `   🥋 Athletes: ${stats.athletes} (avg ${stats.averageAthletesPerClub}/club)`
  );
  console.log(`   📋 Insurance Records: ${stats.insurances}`);
  console.log(`   ✅ Paid: ${stats.paidInsurances} (${stats.paymentRate}%)`);
  console.log(`   🏆 Championships: ${stats.championships}`);
  console.log(`   👥 League Teams: ${stats.leagueTeams}`);
  console.log(`   💳 Payment Requests: ${stats.paymentRequests}`);
  console.log("\n🔐 Admin Access Credentials:");
  console.log(`   📧 ${admin1.email} (Super Admin)`);
  console.log(`   📧 ${admin2.email} (Secretary)`);
  console.log(`   📧 ${admin3.email} (Developer)`);
  console.log("\n🌟 System Ready for Professional Presentation!");
  console.log("   • Realistic club and athlete data");
  console.log("   • Consistent insurance payment status");
  console.log("   • Proper league team composition");
  console.log("   • Sample payment requests for demo");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
