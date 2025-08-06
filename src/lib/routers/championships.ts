import { z } from 'zod'
import { adminProcedure, router } from '../trpc'
import { prisma } from '../prisma'

export const championshipsRouter = router({
  getAll: adminProcedure
    .query(async () => {
      return await prisma.championship.findMany({
        include: {
          season: true,
          _count: {
            select: {
              clubs: true,
            },
          },
        },
        orderBy: {
          startDate: 'desc',
        },
      })
    }),

  getUpcoming: adminProcedure
    .query(async () => {
      const currentDate = new Date()
      return await prisma.championship.findMany({
        where: {
          startDate: { gte: currentDate },
        },
        include: {
          season: true,
          _count: {
            select: {
              clubs: true,
            },
          },
        },
        orderBy: {
          startDate: 'asc',
        },
      })
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.championship.findUnique({
        where: { id: input.id },
        include: {
          season: true,
          clubs: {
            include: {
              club: true,
            },
          },
        },
      })
    }),

  create: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      seasonId: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      entryFee: z.number().min(0),
      location: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await prisma.championship.create({
        data: {
          ...input,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
        },
        include: {
          season: true,
        },
      })
    }),

  update: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      seasonId: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      entryFee: z.number().min(0).optional(),
      location: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      return await prisma.championship.update({
        where: { id },
        data: {
          ...data,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          endDate: data.endDate ? new Date(data.endDate) : undefined,
        },
        include: {
          season: true,
        },
      })
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.championship.delete({
        where: { id: input.id },
      })
    }),

  addClub: adminProcedure
    .input(z.object({
      championshipId: z.string(),
      clubId: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await prisma.clubChampionship.create({
        data: input,
        include: {
          club: true,
          championship: true,
        },
      })
    }),

  removeClub: adminProcedure
    .input(z.object({
      championshipId: z.string(),
      clubId: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await prisma.clubChampionship.deleteMany({
        where: {
          championshipId: input.championshipId,
          clubId: input.clubId,
        },
      })
    }),

  markClubAsPaid: adminProcedure
    .input(z.object({
      championshipId: z.string(),
      clubId: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await prisma.clubChampionship.updateMany({
        where: {
          championshipId: input.championshipId,
          clubId: input.clubId,
        },
        data: {
          isPaid: true,
          paidAt: new Date(),
        },
      })
    }),
})
