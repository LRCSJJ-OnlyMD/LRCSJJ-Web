import { z } from 'zod'
import { router, adminProcedure, publicProcedure } from '../trpc'

const clubInputSchema = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  president: z.string().optional(),
  coach: z.string().optional()
})

export const clubsRouter = router({
  // Public endpoint to get all clubs (for public display)
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.club.findMany({
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: {
              athletes: true
            }
          }
        }
      })
    }),

  // Admin endpoints
  getAllWithDetails: adminProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.club.findMany({
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: {
              athletes: true,
              teamMembers: true,
              championships: true
            }
          }
        }
      })
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.club.findUnique({
        where: { id: input.id },
        include: {
          athletes: {
            include: {
              insurances: {
                include: {
                  season: true
                }
              }
            }
          },
          _count: {
            select: {
              athletes: true,
              teamMembers: true,
              championships: true
            }
          }
        }
      })
    }),

  create: adminProcedure
    .input(clubInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.club.create({
        data: {
          name: input.name,
          address: input.address,
          phone: input.phone,
          email: input.email || null,
          president: input.president,
          coach: input.coach
        }
      })
    }),

  update: adminProcedure
    .input(clubInputSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return await ctx.prisma.club.update({
        where: { id },
        data: {
          ...data,
          email: data.email || null
        }
      })
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Check if club exists first
        const existingClub = await ctx.prisma.club.findUnique({
          where: { id: input.id },
          include: {
            _count: {
              select: {
                athletes: true,
                teamMembers: true,
                championships: true
              }
            }
          }
        })

        if (!existingClub) {
          throw new Error('Club non trouvé')
        }

        // Delete the club (cascade will handle related records)
        const deletedClub = await ctx.prisma.club.delete({
          where: { id: input.id }
        })

        return deletedClub
      } catch (error) {
        console.error('Erreur lors de la suppression du club:', error)
        throw error
      }
    })
})
