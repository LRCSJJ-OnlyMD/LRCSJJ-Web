import { z } from 'zod'
import { adminProcedure, router } from '../trpc'
import { prisma } from '../prisma'

export const insuranceRouter = router({
  getAll: adminProcedure
    .query(async () => {
      return await prisma.insurance.findMany({
        include: {
          athlete: {
            include: {
              club: true,
            },
          },
          season: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }),

  getByClubId: adminProcedure
    .input(z.object({ clubId: z.string() }))
    .query(async ({ input }) => {
      return await prisma.insurance.findMany({
        where: { 
          athlete: {
            clubId: input.clubId
          }
        },
        include: {
          athlete: {
            include: {
              club: true,
            },
          },
          season: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    }),

  getBySeasonId: adminProcedure
    .input(z.object({ seasonId: z.string() }))
    .query(async ({ input }) => {
      return await prisma.insurance.findMany({
        where: { seasonId: input.seasonId },
        include: {
          athlete: {
            include: {
              club: true,
            },
          },
          season: true,
        },
      })
    }),

  getStats: adminProcedure
    .query(async () => {
      const totalInsurances = await prisma.insurance.count()
      const paidInsurances = await prisma.insurance.count({
        where: { isPaid: true }
      })
      const unpaidInsurances = await prisma.insurance.count({
        where: { isPaid: false }
      })

      const totalAmount = await prisma.insurance.aggregate({
        where: { isPaid: true },
        _sum: { amount: true }
      })

      const pendingAmount = await prisma.insurance.aggregate({
        where: { isPaid: false },
        _sum: { amount: true }
      })

      return {
        total: totalInsurances,
        paid: paidInsurances,
        unpaid: unpaidInsurances,
        totalRevenue: totalAmount._sum.amount || 0,
        pendingRevenue: pendingAmount._sum.amount || 0
      }
    }),

  create: adminProcedure
    .input(z.object({
      athleteId: z.string(),
      seasonId: z.string(),
      amount: z.number().positive(),
      isPaid: z.boolean().default(false),
      paidAt: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await prisma.insurance.create({
        data: {
          ...input,
          paidAt: input.paidAt ? new Date(input.paidAt) : null,
        },
        include: {
          athlete: {
            include: {
              club: true,
            },
          },
          season: true,
        },
      })
    }),

  update: adminProcedure
    .input(z.object({
      id: z.string(),
      athleteId: z.string().optional(),
      seasonId: z.string().optional(),
      amount: z.number().positive().optional(),
      isPaid: z.boolean().optional(),
      paidAt: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      return await prisma.insurance.update({
        where: { id },
        data: {
          ...data,
          paidAt: data.paidAt ? new Date(data.paidAt) : undefined,
        },
        include: {
          athlete: {
            include: {
              club: true,
            },
          },
          season: true,
        },
      })
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.insurance.delete({
        where: { id: input.id },
      })
    }),

  markAsPaid: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.insurance.update({
        where: { id: input.id },
        data: {
          isPaid: true,
          paidAt: new Date(),
        },
        include: {
          athlete: {
            include: {
              club: true,
            },
          },
          season: true,
        },
      })
    }),
})
