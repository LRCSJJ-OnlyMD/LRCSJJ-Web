import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// Type assertion to fix Prisma client types issue
/* eslint-disable @typescript-eslint/no-explicit-any */
type PrismaClientWithModels = PrismaClient & {
  post: any;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

const prismaWithModels = prisma as PrismaClientWithModels;

async function main() {
  console.log("🌱 Starting LRCSJJ Complete Database Seed...");
  console.log("=".repeat(60));

  try {
    // 1. Create Admin Users (3 admins)
    console.log("\n👑 Creating Admin Users...");
    const adminPassword = await hashPassword(process.env.ADMIN_DEFAULT_PASSWORD || "AdminPass2025!");
    const devPassword = await hashPassword("mdol2003");

    const admin1 = await prisma.admin.create({
      data: {
        email: "admin@lrcsjj.ma",
        password: adminPassword,
        name: "Administrateur Principal LRCSJJ",
        role: "SUPER_ADMIN",
      },
    });

    await prisma.admin.create({
      data: {
        email: "secretaire@lrcsjj.ma",
        password: adminPassword,
        name: "Secrétaire Général",
        role: "ADMIN",
      },
    });

    await prisma.admin.create({
      data: {
        email: "mouadom2003@gmail.com",
        password: devPassword,
        name: "Développeur Système",
        role: "SUPER_ADMIN",
      },
    });

    console.log(`✅ Created 3 admin users`);

    // 2. Create Seasons (3 seasons)
    console.log("\n📅 Creating Seasons...");
    const currentSeason = await prisma.season.create({
      data: {
        name: "2024-2025",
        startDate: new Date("2024-09-01"),
        endDate: new Date("2025-06-30"),
        isActive: true,
      },
    });

    await prisma.season.create({
      data: {
        name: "2023-2024",
        startDate: new Date("2023-09-01"),
        endDate: new Date("2024-06-30"),
        isActive: false,
      },
    });

    await prisma.season.create({
      data: {
        name: "2025-2026",
        startDate: new Date("2025-09-01"),
        endDate: new Date("2026-06-30"),
        isActive: false,
      },
    });

    console.log(`✅ Created 3 seasons`);

    // 3. Create Map Configuration
    console.log("\n🗺️ Creating Map Configuration...");
    await prisma.mapConfiguration.create({
      data: {
        latitude: 33.5731,
        longitude: -7.5898,
        locationName: "Ligue Régionale Casablanca-Settat de Ju-Jitsu",
        zoom: 10,
        address: "Région Casablanca-Settat, Maroc",
        isActive: true,
      },
    });

    console.log("✅ Created map configuration");

    // 4. Create Clubs with Managers (12 clubs)
    console.log("\n🏢 Creating Clubs and Managers...");
    const clubsData = [
      {
        name: "Club Olympic Casablanca Ju-Jitsu",
        address: "Avenue Hassan II, Casablanca",
        phone: "+212 522 123 456",
        email: "contact@olympic-casa-jj.ma",
        president: "Hassan Benjelloun",
        coach: "Karim El Fassi",
        managerName: "Ahmed El Fassi",
        managerEmail: "ahmed.elfassi@olympic-casa-jj.ma",
      },
      {
        name: "Association Sportive Settat Ju-Jitsu",
        address: "Rue Moulay Youssef, Settat",
        phone: "+212 523 456 789",
        email: "info@as-settat-jj.ma",
        president: "Fatima Zahra Alami",
        coach: "Omar Benali",
        managerName: "Fatima Zahra Benali",
        managerEmail: "f.benali@as-settat-jj.ma",
      },
      {
        name: "Club Royal Berrechid Ju-Jitsu",
        address: "Boulevard Mohammed V, Berrechid",
        phone: "+212 522 789 012",
        email: "contact@royal-berrechid-jj.ma",
        president: "Mohammed Benjelloun",
        coach: "Rachid Fassi",
        managerName: "Omar Benjelloun",
        managerEmail: "o.benjelloun@royal-berrechid-jj.ma",
      },
      {
        name: "Académie Mohammedia Arts Martiaux",
        address: "Avenue des FAR, Mohammedia",
        phone: "+212 523 345 678",
        email: "contact@amam-mohammedia.ma",
        president: "Youssef Alaoui",
        coach: "Hassan Idrissi",
        managerName: "Youssef Alaoui",
        managerEmail: "y.alaoui@amam-mohammedia.ma",
      },
      {
        name: "Club Atlas El Jadida Ju-Jitsu",
        address: "Place Mohammed VI, El Jadida",
        phone: "+212 523 901 234",
        email: "info@atlas-eljadida-jj.ma",
        president: "Aicha Kettani",
        coach: "Said Berrada",
        managerName: "Aicha Kettani",
        managerEmail: "a.kettani@atlas-eljadida-jj.ma",
      },
      {
        name: "Club Sportif Temara Ju-Jitsu",
        address: "Avenue Allal Ben Abdellah, Temara",
        phone: "+212 537 234 567",
        email: "contact@cs-temara-jj.ma",
        president: "Mustapha Sekkat",
        coach: "Khalid Bouabid",
        managerName: "Mustapha Sekkat",
        managerEmail: "m.sekkat@cs-temara-jj.ma",
      },
      {
        name: "Association Jeunesse Nouaceur",
        address: "Rue de la Jeunesse, Nouaceur",
        phone: "+212 522 567 890",
        email: "info@aj-nouaceur.ma",
        president: "Nadia Idrissi",
        coach: "Tarik Cherkaoui",
        managerName: "Nadia Idrissi",
        managerEmail: "n.idrissi@aj-nouaceur.ma",
      },
      {
        name: "Club Renaissance Bouznika",
        address: "Avenue Mohammed V, Bouznika",
        phone: "+212 537 345 678",
        email: "contact@cr-bouznika.ma",
        president: "Driss Lamrani",
        coach: "Brahim Kettani",
        managerName: "Driss Lamrani",
        managerEmail: "d.lamrani@cr-bouznika.ma",
      },
      {
        name: "Académie Skhirat Arts Martiaux",
        address: "Boulevard de la Plage, Skhirat",
        phone: "+212 537 456 789",
        email: "info@asam-skhirat.ma",
        president: "Zineb Lahlou",
        coach: "Fouad Meziane",
        managerName: "Zineb Lahlou",
        managerEmail: "z.lahlou@asam-skhirat.ma",
      },
      {
        name: "Club Avenir Ben Slimane",
        address: "Place de l'Indépendance, Ben Slimane",
        phone: "+212 523 678 901",
        email: "contact@ca-benslimane.ma",
        president: "Jamal Chraibi",
        coach: "Hicham Benkirane",
        managerName: "Jamal Chraibi",
        managerEmail: "j.chraibi@ca-benslimane.ma",
      },
      {
        name: "Club Espoir Médiouna",
        address: "Rue El Amal, Médiouna",
        phone: "+212 522 789 123",
        email: "info@ce-mediouna.ma",
        president: "Houda Benjelloun",
        coach: "Anas Zerouali",
        managerName: "Houda Benjelloun",
        managerEmail: "h.benjelloun@ce-mediouna.ma",
      },
      {
        name: "Association Tit Mellil Sports",
        address: "Avenue Hassan II, Tit Mellil",
        phone: "+212 522 890 234",
        email: "contact@atm-sports.ma",
        president: "Abdellatif Guerraoui",
        coach: "Mehdi Alaoui",
        managerName: "Abdellatif Guerraoui",
        managerEmail: "a.guerraoui@atm-sports.ma",
      },
    ];

    const clubs = [];
    for (const clubData of clubsData) {
      const hashedPassword = await hashPassword("ClubManager2025!");
      
      const club = await prisma.club.create({
        data: {
          name: clubData.name,
          address: clubData.address,
          phone: clubData.phone,
          email: clubData.email,
          president: clubData.president,
          coach: clubData.coach,
        },
      });

      await prisma.clubManager.create({
        data: {
          email: clubData.managerEmail,
          password: hashedPassword,
          name: clubData.managerName,
          clubId: club.id,
          isActive: true,
        },
      });

      clubs.push(club);
    }

    console.log(`✅ Created ${clubs.length} clubs with managers`);

    // 5. Create Athletes (15+ per club = 180+ total)
    console.log("\n🥋 Creating Athletes...");
    const maleNames = [
      "Mohammed Alami", "Ahmed Benali", "Omar Fassi", "Youssef Bennani", "Hassan Idrissi",
      "Karim Lahlou", "Rachid Benjelloun", "Said Berrada", "Tarik Cherkaoui", "Khalid Bouabid",
      "Abderrahim Tazi", "Mustapha Sekkat", "Noureddine Andaloussi", "Brahim Kettani", "Jamal Chraibi",
      "Abdellatif Guerraoui", "Driss Lamrani", "Fouad Meziane", "Hicham Benkirane", "Anas Zerouali",
      "Mehdi Alaoui", "Oussama Semlali", "Adil Benaissa", "Imad Rouissi", "Hamza Oudghiri",
      "Adam Benomar", "Ilyas Hajji", "Soufiane Berrabah", "Othmane Sbihi", "Ismail Naciri",
    ];

    const femaleNames = [
      "Fatima Zahra Alami", "Aicha Benali", "Khadija Fassi", "Salma Bennani", "Nadia Idrissi",
      "Zineb Lahlou", "Houda Benjelloun", "Amina Berrada", "Leila Cherkaoui", "Samira Bouabid",
      "Wafa Tazi", "Karima Sekkat", "Souad Andaloussi", "Rajae Kettani", "Malika Chraibi",
      "Nezha Guerraoui", "Btissam Lamrani", "Hanane Meziane", "Ghita Benkirane", "Yousra Zerouali",
      "Sofia Tahiri", "Meriem Badre", "Yasmine Sqalli", "Rim Benmoussa", "Sanaa Jettou",
      "Dounia Serghini", "Hiba Benabdellah", "Maryam Tabet", "Chaimae Bensouda", "Inas Benali",
    ];

    const athletes = [];
    let maleIndex = 0;
    let femaleIndex = 0;

    for (const club of clubs) {
      const numAthletes = 15 + Math.floor(Math.random() * 10); // 15-24 athletes per club
      
      for (let i = 0; i < numAthletes; i++) {
        const isMale = Math.random() > 0.35; // 65% male, 35% female
        const names = isMale ? maleNames : femaleNames;
        const nameIndex = isMale ? maleIndex % maleNames.length : femaleIndex % femaleNames.length;
        
        const fullName = names[nameIndex];
        const [firstName, ...lastNameParts] = fullName.split(" ");
        const lastName = lastNameParts.join(" ");
        
        const birthDate = new Date();
        const age = 16 + Math.floor(Math.random() * 30); // Age 16-45
        birthDate.setFullYear(birthDate.getFullYear() - age);
        
        // Determine category based on age
        let category;
        if (age < 18) category = "JUNIOR";
        else if (age < 35) category = "SENIOR";
        else category = "VETERAN";
        
        const athlete = await prisma.athlete.create({
          data: {
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: birthDate,
            weight: 50 + Math.floor(Math.random() * 50), // 50-100 kg
            category: category,
            belt: ["White", "Blue", "Purple", "Brown", "Black"][Math.floor(Math.random() * 5)],
            phone: `+212 6${Math.floor(Math.random() * 90000000) + 10000000}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(' ', '')}@email.com`,
            clubId: club.id,
          },
        });
        
        athletes.push(athlete);
        
        if (isMale) maleIndex++;
        else femaleIndex++;
      }
    }

    console.log(`✅ Created ${athletes.length} athletes across all clubs`);

    // 6. Create Insurance Records (for each athlete)
    console.log("\n🛡️ Creating Insurance Records...");
    let paidInsuranceCount = 0;
    
    for (const athlete of athletes) {
      const isPaid = Math.random() > 0.20; // 80% payment rate
      if (isPaid) paidInsuranceCount++;
      
      await prisma.insurance.create({
        data: {
          athleteId: athlete.id,
          seasonId: currentSeason.id,
          amount: 150.0,
          isPaid: isPaid,
          paidAt: isPaid ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) : null,
        },
      });
    }

    console.log(`✅ Created ${athletes.length} insurance records (${paidInsuranceCount} paid, ${Math.round(paidInsuranceCount/athletes.length*100)}% rate)`);

    // 7. Create Championships (6 championships)
    console.log("\n🏆 Creating Championships...");
    const championshipsData = [
      {
        name: "Championnat Régional Casablanca-Settat 2024",
        description: "Championnat régional officiel de Ju-Jitsu pour la région Casablanca-Settat",
        location: "Complexe Sportif Mohammed V, Casablanca",
        startDate: new Date("2024-11-15"),
        endDate: new Date("2024-11-17"),
        entryFee: 100.0,
      },
      {
        name: "Coupe du Maroc Ju-Jitsu 2025",
        description: "Coupe nationale de Ju-Jitsu - édition 2025",
        location: "Palais des Sports, Rabat",
        startDate: new Date("2025-03-20"),
        endDate: new Date("2025-03-23"),
        entryFee: 200.0,
      },
      {
        name: "Tournoi International Casablanca Open 2025",
        description: "Tournoi international de Ju-Jitsu - Casablanca Open",
        location: "Complexe Sportif Moulay Abdellah, Casablanca",
        startDate: new Date("2025-05-10"),
        endDate: new Date("2025-05-12"),
        entryFee: 300.0,
      },
      {
        name: "Championnat Jeunes Casablanca-Settat 2025",
        description: "Championnat régional pour les catégories jeunes",
        location: "Gymnase Municipal, Settat",
        startDate: new Date("2025-02-15"),
        endDate: new Date("2025-02-16"),
        entryFee: 80.0,
      },
      {
        name: "Grand Prix LRCSJJ 2025",
        description: "Grand Prix de la Ligue Régionale Casablanca-Settat",
        location: "Centre Sportif, El Jadida",
        startDate: new Date("2025-04-05"),
        endDate: new Date("2025-04-07"),
        entryFee: 150.0,
      },
      {
        name: "Tournoi de Fin de Saison 2025",
        description: "Tournoi de clôture de la saison sportive",
        location: "Complexe Sportif, Mohammedia",
        startDate: new Date("2025-06-14"),
        endDate: new Date("2025-06-15"),
        entryFee: 120.0,
      },
    ];

    const createdChampionships = [];
    for (const champData of championshipsData) {
      const championship = await prisma.championship.create({
        data: {
          ...champData,
          seasonId: currentSeason.id,
        },
      });
      createdChampionships.push(championship);
    }

    console.log(`✅ Created ${createdChampionships.length} championships`);

    // 8. Create Club Championships (registrations)
    console.log("\n📝 Creating Championship Registrations...");
    let registrationCount = 0;
    
    for (const championship of createdChampionships) {
      for (const club of clubs) {
        const shouldRegister = Math.random() > 0.25; // 75% registration rate
        
        if (shouldRegister) {
          await prisma.clubChampionship.create({
            data: {
              championshipId: championship.id,
              clubId: club.id,
              isPaid: Math.random() > 0.30, // 70% payment rate
              paidAt: Math.random() > 0.30 ? new Date() : null,
            },
          });
          registrationCount++;
        }
      }
    }

    console.log(`✅ Created ${registrationCount} championship registrations`);

    // 9. Create League Teams (4 teams)
    console.log("\n⚔️ Creating League Teams...");
    const teams = [
      {
        name: "Équipe Première Division Seniors",
        division: "First Division",
        category: "SENIOR",
        description: "Équipe senior de première division de la ligue",
      },
      {
        name: "Équipe Deuxième Division Seniors", 
        division: "Second Division",
        category: "SENIOR",
        description: "Équipe senior de deuxième division",
      },
      {
        name: "Équipe Jeunes Espoirs",
        division: "Junior Division",
        category: "JUNIOR",
        description: "Équipe jeunes de la ligue",
      },
      {
        name: "Équipe Vétérans",
        division: "Veteran Division",
        category: "VETERAN",
        description: "Équipe des vétérans expérimentés",
      },
    ];

    const createdTeams = [];
    for (const teamData of teams) {
      const team = await prisma.leagueTeam.create({
        data: teamData,
      });
      createdTeams.push(team);
    }

    // Add team members (10-15 per team)
    let totalTeamMembers = 0;
    for (const team of createdTeams) {
      const eligibleAthletes = athletes.filter(a => a.category === team.category);
      const numMembers = 10 + Math.floor(Math.random() * 6); // 10-15 members
      
      for (let i = 0; i < Math.min(numMembers, eligibleAthletes.length); i++) {
        const athlete = eligibleAthletes[i];
        
        await prisma.leagueTeamMember.create({
          data: {
            teamId: team.id,
            athleteId: athlete.id,
            clubId: athlete.clubId,
            position: i === 0 ? "CAPTAIN" : (i === 1 ? "VICE_CAPTAIN" : "MEMBER"),
          },
        });
        totalTeamMembers++;
      }
    }

    console.log(`✅ Created ${createdTeams.length} league teams with ${totalTeamMembers} total members`);

    // 10. Create Payment Requests (20 requests)
    console.log("\n💳 Creating Payment Requests...");
    const paymentRequests = [];
    
    for (let i = 0; i < 20; i++) {
      const club = clubs[Math.floor(Math.random() * clubs.length)];
      const amount = [750, 1500, 2250, 3000][Math.floor(Math.random() * 4)]; // Different amounts
      
      const paymentRequest = await prisma.paymentRequest.create({
        data: {
          clubId: club.id,
          amount: amount,
          currency: "MAD",
          status: ["PENDING", "PAID", "FAILED", "EXPIRED"][Math.floor(Math.random() * 4)],
          paymentMethod: Math.random() > 0.5 ? "STRIPE" : "BANK_TRANSFER",
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
          paidAt: Math.random() > 0.4 ? new Date() : null,
        },
      });
      paymentRequests.push(paymentRequest);
    }

    console.log(`✅ Created ${paymentRequests.length} payment requests`);

    // 11. Create Posts (15 posts)
    console.log("\n📰 Creating Posts...");
    const postsData = [
      // Achievement Posts (8 posts)
      {
        title: "Médaille d'Or au Championnat National pour Ahmed Benali",
        content: "Félicitations à Ahmed Benali du Club Olympic Casablanca qui a remporté la médaille d'or en catégorie senior -73kg au Championnat National de Ju-Jitsu. Une performance exceptionnelle qui honore notre région et démontre le niveau élevé de nos athlètes.",
        type: "ACHIEVEMENT",
        medalType: "GOLD",
        competitionLevel: "NATIONAL",
        athleteName: "Ahmed Benali",
        clubName: "Club Olympic Casablanca Ju-Jitsu",
        featured: true,
      },
      {
        title: "Médaille d'Argent pour Fatima Zahra Alami",
        content: "Bravo à Fatima Zahra Alami de l'Association Sportive Settat qui décroche la médaille d'argent en catégorie junior -57kg. Un talent prometteur qui continue de progresser et d'inspirer les jeunes athlètes de notre région.",
        type: "ACHIEVEMENT",
        medalType: "SILVER", 
        competitionLevel: "REGIONAL",
        athleteName: "Fatima Zahra Alami",
        clubName: "Association Sportive Settat Ju-Jitsu",
        featured: false,
      },
      {
        title: "Triple Médaille de Bronze pour le Club Royal Berrechid",
        content: "Le Club Royal Berrechid s'illustre avec trois médailles de bronze lors du dernier tournoi régional. Omar Benjelloun, Rachid Fassi et Mohammed Benjelloun ont tous montré un excellent niveau technique.",
        type: "ACHIEVEMENT",
        medalType: "BRONZE",
        competitionLevel: "REGIONAL", 
        athleteName: null,
        clubName: "Club Royal Berrechid Ju-Jitsu",
        featured: true,
      },
      {
        title: "Participation Remarquée au Tournoi International de Paris",
        content: "Nos athlètes ont brillamment représenté la région Casablanca-Settat lors du tournoi international de Paris. Plusieurs podiums et une belle expérience internationale pour nos champions.",
        type: "ACHIEVEMENT",
        medalType: "PARTICIPATION",
        competitionLevel: "INTERNATIONAL",
        athleteName: null,
        clubName: null,
        featured: true,
      },
      {
        title: "Youssef Alaoui Champion du Maroc Vétérans",
        content: "Youssef Alaoui de l'Académie Mohammedia remporte le titre de Champion du Maroc en catégorie vétérans. Une consécration méritée pour cet athlète expérimenté et respecté.",
        type: "ACHIEVEMENT",
        medalType: "GOLD",
        competitionLevel: "NATIONAL",
        athleteName: "Youssef Alaoui",
        clubName: "Académie Mohammedia Arts Martiaux",
        featured: false,
      },
      {
        title: "Aicha Kettani Vice-Championne Africaine",
        content: "Aicha Kettani du Club Atlas El Jadida décroche la médaille d'argent au Championnat d'Afrique. Une performance historique qui place notre région sur la carte continentale du Ju-Jitsu.",
        type: "ACHIEVEMENT",
        medalType: "SILVER",
        competitionLevel: "INTERNATIONAL",
        athleteName: "Aicha Kettani", 
        clubName: "Club Atlas El Jadida Ju-Jitsu",
        featured: true,
      },
      {
        title: "Podium Complet pour l'Équipe Jeunes LRCSJJ",
        content: "L'équipe jeunes de la LRCSJJ réalise un podium complet lors du tournoi national jeunes. Zineb Lahlou (or), Houda Benjelloun (argent) et Jamal Chraibi (bronze) confirment l'excellence de notre formation.",
        type: "ACHIEVEMENT",
        medalType: "GOLD",
        competitionLevel: "NATIONAL",
        athleteName: null,
        clubName: null,
        featured: true,
      },
      {
        title: "Driss Lamrani Médaillé aux Jeux Méditerranéens",
        content: "Driss Lamrani du Club Renaissance Bouznika remporte la médaille de bronze aux Jeux Méditerranéens. Une fierté pour notre région et une inspiration pour tous nos athlètes.",
        type: "ACHIEVEMENT",
        medalType: "BRONZE",
        competitionLevel: "INTERNATIONAL",
        athleteName: "Driss Lamrani",
        clubName: "Club Renaissance Bouznika",
        featured: false,
      },
      
      // News Posts (4 posts)
      {
        title: "Nouvelle Saison 2024-2025 : Inscriptions Ouvertes",
        content: "Les inscriptions pour la nouvelle saison de Ju-Jitsu 2024-2025 sont maintenant ouvertes dans tous les clubs de la région. Rejoignez-nous pour une année riche en compétitions, stages et apprentissage. Tarif d'assurance : 150 MAD.",
        type: "NEWS",
        medalType: null,
        competitionLevel: null,
        athleteName: null,
        clubName: null,
        featured: true,
      },
      {
        title: "Stage de Perfectionnement avec Maître Kenji Tanaka",
        content: "Un stage exceptionnel de perfectionnement sera organisé le mois prochain avec Maître Kenji Tanaka, expert international en Ju-Jitsu et ancien champion du monde. Places limitées, inscriptions ouvertes aux ceintures brunes et noires uniquement.",
        type: "NEWS",
        medalType: null,
        competitionLevel: null,
        athleteName: null,
        clubName: null,
        featured: false,
      },
      {
        title: "Nouveau Règlement Sportif 2025",
        content: "La LRCSJJ annonce l'entrée en vigueur du nouveau règlement sportif pour 2025. Principales nouveautés : nouvelles catégories de poids, règles de sécurité renforcées et système de classement modernisé.",
        type: "NEWS",
        medalType: null,
        competitionLevel: null,
        athleteName: null,
        clubName: null,
        featured: false,
      },
      {
        title: "Lancement du Programme 'Ju-Jitsu dans les Écoles'",
        content: "La LRCSJJ lance un programme innovant d'initiation au Ju-Jitsu dans les établissements scolaires. Objectif : sensibiliser 5000 élèves aux valeurs et techniques de notre discipline.",
        type: "NEWS",
        medalType: null,
        competitionLevel: null,
        athleteName: null,
        clubName: null,
        featured: true,
      },
      
      // Championship Results (3 posts)
      {
        title: "Résultats du Championnat Régional Casablanca-Settat 2024",
        content: "Le championnat régional s'est déroulé avec un succès remarquable, réunissant 220 athlètes de 12 clubs. Nos compétiteurs ont obtenu d'excellents résultats avec 18 médailles d'or, 15 d'argent et 22 de bronze.",
        type: "CHAMPIONSHIP_RESULT",
        medalType: null,
        competitionLevel: "REGIONAL",
        athleteName: null,
        clubName: null,
        featured: true,
        championshipId: createdChampionships[0].id,
      },
      {
        title: "Préparatifs Intensifs pour la Coupe du Maroc 2025",
        content: "Nos équipes se préparent intensivement pour la Coupe du Maroc qui aura lieu en mars 2025. Programme renforcé : entraînements techniques bi-quotidiens, stages de préparation mentale et suivi médical personnalisé.",
        type: "CHAMPIONSHIP_RESULT",
        medalType: null,
        competitionLevel: "NATIONAL",
        athleteName: null,
        clubName: null,
        featured: false,
        championshipId: createdChampionships[1].id,
      },
      {
        title: "Bilan Exceptionnel du Tournoi Jeunes 2024",
        content: "Le tournoi jeunes a confirmé la qualité de notre formation avec 95% de réussite aux passages de grades et 12 qualifications pour les championnats nationaux. L'avenir du Ju-Jitsu régional est assuré !",
        type: "CHAMPIONSHIP_RESULT",
        medalType: null,
        competitionLevel: "REGIONAL",
        athleteName: null,
        clubName: null,
        featured: false,
        championshipId: createdChampionships[3].id,
      },
    ];

    const createdPosts = [];
    for (const postData of postsData) {
      const post = await prismaWithModels.post.create({
        data: {
          ...postData,
          adminId: admin1.id,
          isPublished: true,
        },
      });
      createdPosts.push(post);
    }

    console.log(`✅ Created ${createdPosts.length} posts`);

    // 12. Create Notifications (15 notifications)
    console.log("\n🔔 Creating Notifications...");
    const notifications = [];
    
    const notificationTypes = [
      "ATHLETE_ADDED",
      "ATHLETE_UPDATED", 
      "ATHLETE_DELETED",
      "INSURANCE_UPDATED",
      "PAYMENT_MADE"
    ];

    for (let i = 0; i < 15; i++) {
      const club = clubs[Math.floor(Math.random() * clubs.length)];
      const clubManager = await prisma.clubManager.findFirst({
        where: { clubId: club.id },
      });
      
      if (clubManager) {
        const notificationType = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        let title, message;
        
        switch (notificationType) {
          case "ATHLETE_ADDED":
            title = "Nouvel athlète inscrit";
            message = `Un nouvel athlète a été inscrit dans votre club ${club.name}`;
            break;
          case "ATHLETE_UPDATED":
            title = "Profil athlète modifié";
            message = `Le profil d'un athlète de ${club.name} a été mis à jour`;
            break;
          case "ATHLETE_DELETED":
            title = "Athlète supprimé";
            message = `Un athlète a été retiré des listes de ${club.name}`;
            break;
          case "INSURANCE_UPDATED":
            title = "Assurance mise à jour";
            message = `Le statut d'assurance d'un athlète de ${club.name} a été modifié`;
            break;
          case "PAYMENT_MADE":
            title = "Paiement effectué";
            message = `Un paiement a été reçu pour ${club.name}`;
            break;
          default:
            title = "Notification";
            message = `Notification pour ${club.name}`;
        }
        
        const notification = await prisma.notification.create({
          data: {
            type: notificationType,
            title: title,
            message: message,
            metadata: JSON.stringify({ 
              clubId: club.id,
              timestamp: new Date().toISOString()
            }),
            clubManagerId: clubManager.id,
            clubId: club.id,
            isRead: Math.random() > 0.6, // 40% read rate
          },
        });
        notifications.push(notification);
      }
    }

    console.log(`✅ Created ${notifications.length} notifications`);

    // Final Statistics
    console.log("\n" + "=".repeat(60));
    console.log("🎉 COMPLETE DATABASE SEEDING SUCCESSFUL!");
    console.log("=".repeat(60));
    
    const stats = {
      admins: 3,
      seasons: 3,
      clubs: clubs.length,
      athletes: athletes.length,
      insuranceRecords: athletes.length,
      paidInsurance: paidInsuranceCount,
      paymentRate: Math.round((paidInsuranceCount / athletes.length) * 100),
      championships: createdChampionships.length,
      registrations: registrationCount,
      leagueTeams: createdTeams.length,
      teamMembers: totalTeamMembers,
      paymentRequests: paymentRequests.length,
      posts: createdPosts.length,
      notifications: notifications.length,
      mapConfigurations: 1,
    };

    console.log("📊 COMPREHENSIVE STATISTICS:");
    console.log(`   👑 Admins: ${stats.admins}`);
    console.log(`   📅 Seasons: ${stats.seasons}`);
    console.log(`   🏢 Clubs: ${stats.clubs}`);
    console.log(`   🥋 Athletes: ${stats.athletes}`);
    console.log(`   🛡️ Insurance Records: ${stats.insuranceRecords}`);
    console.log(`   ✅ Paid Insurance: ${stats.paidInsurance} (${stats.paymentRate}%)`);
    console.log(`   🏆 Championships: ${stats.championships}`);
    console.log(`   📝 Championship Registrations: ${stats.registrations}`);
    console.log(`   ⚔️ League Teams: ${stats.leagueTeams}`);
    console.log(`   👥 Team Members: ${stats.teamMembers}`);
    console.log(`   💳 Payment Requests: ${stats.paymentRequests}`);
    console.log(`   📰 Posts: ${stats.posts}`);
    console.log(`   🔔 Notifications: ${stats.notifications}`);
    console.log(`   🗺️ Map Configurations: ${stats.mapConfigurations}`);

    console.log("\n🔐 ADMIN CREDENTIALS:");
    console.log("   📧 admin@lrcsjj.ma");
    console.log("   📧 secretaire@lrcsjj.ma");  
    console.log("   📧 mouadom2003@gmail.com");
    console.log("   🔑 Password: AdminPass2025! (or mdol2003 for developer)");

    console.log("\n👥 CLUB MANAGER CREDENTIALS:");
    console.log("   🔑 Password for all managers: ClubManager2025!");
    
    console.log("\n🌟 SYSTEM READY FOR PRODUCTION!");
    console.log("   • 12 clubs with comprehensive data");
    console.log("   • 180+ athletes with realistic profiles");
    console.log("   • 6 championships with registrations");
    console.log("   • 4 league teams with members");
    console.log("   • 15 engaging posts (achievements, news, results)");
    console.log("   • 20 payment requests with various statuses");
    console.log("   • 15 notifications for managers");
    console.log("   • Complete insurance tracking");
    console.log("   • All relationships properly established");

  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error("💥 Seeding failed:", e);
    process.exit(1);
  });
