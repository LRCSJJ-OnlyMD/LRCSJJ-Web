import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedMapConfigurations() {
  console.log('Seeding map configurations...')

  // Create default map configurations for major Moroccan cities
  const mapConfigs = [
    {
      latitude: 33.5731,
      longitude: -7.5898,
      locationName: 'Casablanca Headquarters',
      zoom: 12,
      address: 'Casablanca, Morocco',
      isActive: true,
    },
    {
      latitude: 34.0209,
      longitude: -6.8416,
      locationName: 'Rabat Regional Office',
      zoom: 12,
      address: 'Rabat, Morocco',
      isActive: false,
    },
    {
      latitude: 33.0013,
      longitude: -7.6217,
      locationName: 'Settat Training Center',
      zoom: 13,
      address: 'Settat, Morocco',
      isActive: false,
    },
    {
      latitude: 33.2651,
      longitude: -7.5862,
      locationName: 'Berrechid Branch',
      zoom: 14,
      address: 'Berrechid, Morocco',
      isActive: false,
    },
  ]

  for (const config of mapConfigs) {
    const existing = await prisma.mapConfiguration.findFirst({
      where: { locationName: config.locationName }
    })

    if (!existing) {
      await prisma.mapConfiguration.create({
        data: {
          ...config,
          updatedBy: 'System Seed',
        },
      })
      console.log(`✅ Created map configuration: ${config.locationName}`)
    } else {
      console.log(`⚠️  Map configuration already exists: ${config.locationName}`)
    }
  }

  console.log('Map configuration seeding completed!')
}

seedMapConfigurations()
  .catch((e) => {
    console.error('Error seeding map configurations:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
