import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, publicProcedure } from '../trpc'
import { verifyPassword, generateToken } from '../auth'

export const authRouter = router({
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(1)
    }))
    .mutation(async ({ ctx, input }) => {
      const admin = await ctx.prisma.admin.findUnique({
        where: { email: input.email }
      })

      if (!admin) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials'
        })
      }

      const isValidPassword = await verifyPassword(input.password, admin.password)
      
      if (!isValidPassword) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials'
        })
      }

      const token = generateToken({
        adminId: admin.id,
        email: admin.email
      })

      return {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name
        }
      }
    }),

  me: publicProcedure
    .query(async ({ ctx }) => {
      if (!ctx.admin) {
        return null
      }

      const admin = await ctx.prisma.admin.findUnique({
        where: { id: ctx.admin.adminId }
      })

      if (!admin) {
        return null
      }

      return {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    })
})
