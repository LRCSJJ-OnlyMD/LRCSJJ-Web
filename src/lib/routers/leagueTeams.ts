import { z } from 'zod'
import { adminProcedure, router } from '../trpc'
import { prisma } from '../prisma'

export const leagueTeamsRouter = router({
  getAll: adminProcedure
    .query(async () => {
      return await prisma.leagueTeam.findMany({
        include: {
          members: {
            include: {
              athlete: {
                include: {
                  club: true,
                },
              },
              club: true,
            },
          },
          _count: {
            select: {
              members: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      })
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.leagueTeam.findUnique({
        where: { id: input.id },
        include: {
          members: {
            include: {
              athlete: {
                include: {
                  club: true,
                },
              },
              club: true,
            },
          },
        },
      })
    }),

  create: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      division: z.string(),
      category: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await prisma.leagueTeam.create({
        data: input,
      })
    }),

  update: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      division: z.string().optional(),
      category: z.string().optional(),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      return await prisma.leagueTeam.update({
        where: { id },
        data,
      })
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.leagueTeam.delete({
        where: { id: input.id },
      })
    }),

  addMember: adminProcedure
    .input(z.object({
      teamId: z.string(),
      athleteId: z.string(),
      clubId: z.string(),
      position: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return await prisma.leagueTeamMember.create({
        data: input,
        include: {
          athlete: {
            include: {
              club: true,
            },
          },
          club: true,
          team: true,
        },
      })
    }),

  removeMember: adminProcedure
    .input(z.object({
      teamId: z.string(),
      athleteId: z.string(),
    }))
    .mutation(async ({ input }) => {
      return await prisma.leagueTeamMember.deleteMany({
        where: {
          teamId: input.teamId,
          athleteId: input.athleteId,
        },
      })
    }),

  updateMember: adminProcedure
    .input(z.object({
      id: z.string(),
      position: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      return await prisma.leagueTeamMember.update({
        where: { id },
        data,
        include: {
          athlete: {
            include: {
              club: true,
            },
          },
          club: true,
          team: true,
        },
      })
    }),
})
