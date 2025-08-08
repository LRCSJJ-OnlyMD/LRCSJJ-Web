import { z } from 'zod'
import { adminProcedure, clubManagerProcedure, router } from '../trpc'
import { prisma } from '../prisma'

export const seasonsRouter = router({
  // Admin procedures - full access
  getAll: adminProcedure
    .query(async () => {
      return await prisma.season.findMany({
        include: {
          _count: {
            select: {
              insurances: true,
              championships: true,
            },
          },
        },
        orderBy: {
          startDate: 'desc',
        },
      })
    }),

  // Club manager procedures - read-only access to seasons
  getAllForClubManager: clubManagerProcedure
    .query(async () => {
      return await prisma.season.findMany({
        orderBy: {
          startDate: 'desc',
        },
      })
    }),

  getCurrent: adminProcedure
    .query(async () => {
      const currentDate = new Date()
      return await prisma.season.findFirst({
        where: {
          startDate: { lte: currentDate },
          endDate: { gte: currentDate },
        },
        include: {
          _count: {
            select: {
              insurances: true,
              championships: true,
            },
          },
        },
      })
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.season.findUnique({
        where: { id: input.id },
        include: {
          _count: {
            select: {
              insurances: true,
              championships: true,
            },
          },
        },
      })
    }),

  create: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      startDate: z.string(),
      endDate: z.string(),
      isActive: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      return await prisma.season.create({
        data: {
          ...input,
          startDate: new Date(input.startDate),
          endDate: new Date(input.endDate),
        },
      })
    }),

  update: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      return await prisma.season.update({
        where: { id },
        data: {
          ...data,
          startDate: data.startDate ? new Date(data.startDate) : undefined,
          endDate: data.endDate ? new Date(data.endDate) : undefined,
        },
      })
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.season.delete({
        where: { id: input.id },
      })
    }),

  setActive: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // First, set all seasons to inactive
      await prisma.season.updateMany({
        data: { isActive: false },
      })

      // Then, set the specified season to active
      return await prisma.season.update({
        where: { id: input.id },
        data: { isActive: true },
      })
    }),
})
