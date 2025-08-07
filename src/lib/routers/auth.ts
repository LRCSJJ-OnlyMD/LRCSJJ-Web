import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { router, publicProcedure } from '../trpc'
import { verifyPassword, generateToken } from '../auth'
import { emailVerificationService } from '../email-verification'

export const authRouter = router({
  // Step 1: Verify credentials and send email verification
  initiateLogin: publicProcedure
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

      // Send email verification
      const result = await emailVerificationService.sendVerificationCode(
        admin.email,
        admin.id,
        admin.name
      )

      if (!result.success) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: result.error || 'Failed to send verification email'
        })
      }

      return {
        message: 'Code de vérification envoyé par email',
        codeId: result.codeId,
        maskedEmail: admin.email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
        requiresVerification: true
      }
    }),

  // Step 2: Verify email code and complete login
  completeLogin: publicProcedure
    .input(z.object({
      codeId: z.string(),
      verificationCode: z.string().length(6)
    }))
    .mutation(async ({ ctx, input }) => {
      const result = emailVerificationService.verifyCode(input.codeId, input.verificationCode)
      
      if (!result.success) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: result.error || 'Invalid verification code'
        })
      }

      const admin = await ctx.prisma.admin.findUnique({
        where: { id: result.adminId }
      })

      if (!admin) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid session'
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

  // Get current admin info
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
