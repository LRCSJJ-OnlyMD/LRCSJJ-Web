import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure, adminProcedure } from "../trpc";
import { verifyPassword, generateToken, hashPassword } from "../auth";
import { emailVerificationService } from "../email-verification";
import { sendClubManagerWelcomeEmail } from "../email";

export const clubManagerRouter = router({
  // Admin creates club manager
  create: adminProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(1),
        clubId: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if club exists
      const club = await ctx.prisma.club.findUnique({
        where: { id: input.clubId },
      });

      if (!club) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Club not found",
        });
      }

      // Check if club already has a manager
      const existingManager = await ctx.prisma.clubManager.findUnique({
        where: { clubId: input.clubId },
      });

      if (existingManager) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Club already has a manager",
        });
      }

      // Generate temporary password
      const temporaryPassword = Math.random()
        .toString(36)
        .slice(-8)
        .toUpperCase();

      // Create club manager
      const clubManager = await ctx.prisma.clubManager.create({
        data: {
          email: input.email,
          name: input.name,
          clubId: input.clubId,
          temporaryPassword,
          passwordResetAt: new Date(),
        },
        include: {
          club: true,
        },
      });

      // Send welcome email with credentials
      await sendClubManagerWelcomeEmail(
        input.email,
        input.name,
        club.name,
        temporaryPassword
      );

      return {
        id: clubManager.id,
        email: clubManager.email,
        name: clubManager.name,
        clubName: club.name,
      };
    }),

  // Club manager login
  initiateLogin: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log(`🔐 Login attempt for: ${input.email}`);
      
      const manager = await ctx.prisma.clubManager.findUnique({
        where: { email: input.email },
        include: { club: true },
      });

      if (!manager) {
        console.log(`❌ Manager not found: ${input.email}`);
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid credentials",
        });
      }

      if (!manager.isActive) {
        console.log(`❌ Manager account inactive: ${input.email}`);
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Account deactivated. Please contact administrator.",
        });
      }

      console.log(`✅ Manager found: ${manager.email}`);
      console.log(`   - Has password: ${!!manager.password}`);
      console.log(`   - Has temp password: ${!!manager.temporaryPassword}`);
      console.log(`   - Temp password: ${manager.temporaryPassword}`);
      console.log(`   - Input password: ${input.password}`);
      console.log(`   - Is Active: ${manager.isActive}`);

      // Case 1: First time login with temporary password
      if (manager.temporaryPassword && manager.temporaryPassword === input.password && !manager.password) {
        console.log(`✅ First time login with temporary password`);
        return {
          requiresPasswordReset: true,
          managerId: manager.id,
          message: "Please set your new password",
        };
      }

      // Case 2: Regular login with set password
      if (manager.password) {
        console.log(`🔍 Checking regular password`);
        const isValidPassword = await verifyPassword(
          input.password,
          manager.password
        );

        if (!isValidPassword) {
          console.log(`❌ Invalid regular password`);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid credentials",
          });
        }

        console.log(`✅ Valid regular password, sending verification email`);
        // Send email verification
        const result = await emailVerificationService.sendVerificationCode(
          manager.email,
          manager.id,
          manager.name
        );

        if (!result.success) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: result.error || "Failed to send verification email",
          });
        }

        return {
          message: "Code de vérification envoyé par email",
          codeId: result.codeId,
          maskedEmail: manager.email.replace(/(.{2})(.*)(@.*)/, "$1***$3"),
          requiresVerification: true,
        };
      }

      // Case 3: Account not properly activated (no password and no temp password match)
      console.log(`❌ Account not activated - no valid password found`);
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Account not activated. Please contact administrator.",
      });
    }),

  // Set new password for first-time login
  setPassword: publicProcedure
    .input(
      z.object({
        managerId: z.string(),
        temporaryPassword: z.string(),
        newPassword: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const manager = await ctx.prisma.clubManager.findUnique({
        where: { id: input.managerId },
      });

      if (!manager || manager.temporaryPassword !== input.temporaryPassword) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid temporary password",
        });
      }

      // Hash new password
      const hashedPassword = await hashPassword(input.newPassword);

      // Update manager with new password
      await ctx.prisma.clubManager.update({
        where: { id: input.managerId },
        data: {
          password: hashedPassword,
          temporaryPassword: null,
          passwordResetAt: null,
        },
      });

      return { success: true, message: "Password set successfully" };
    }),

  // Complete login with verification code
  completeLogin: publicProcedure
    .input(
      z.object({
        codeId: z.string(),
        verificationCode: z.string().length(6),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = emailVerificationService.verifyCode(
        input.codeId,
        input.verificationCode
      );

      if (!result.success) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: result.error || "Invalid verification code",
        });
      }

      const manager = await ctx.prisma.clubManager.findUnique({
        where: { id: result.adminId },
        include: { club: true },
      });

      if (!manager) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid session",
        });
      }

      // Update last login
      await ctx.prisma.clubManager.update({
        where: { id: manager.id },
        data: { lastLoginAt: new Date() },
      });

      const token = generateToken({
        adminId: manager.id,
        email: manager.email,
        role: "CLUB_MANAGER",
        clubId: manager.clubId,
      });

      return {
        token,
        manager: {
          id: manager.id,
          email: manager.email,
          name: manager.name,
          clubId: manager.clubId,
          clubName: manager.club.name,
          role: "CLUB_MANAGER",
        },
      };
    }),

  // Get all club managers (admin only)
  getAll: adminProcedure.query(async ({ ctx }) => {
    const managers = await ctx.prisma.clubManager.findMany({
      include: {
        club: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return managers.map((manager) => ({
      id: manager.id,
      email: manager.email,
      name: manager.name,
      clubName: manager.club.name,
      isActive: manager.isActive,
      hasPassword: !!manager.password,
      temporaryPassword: manager.temporaryPassword, // Add this for debugging
      lastLoginAt: manager.lastLoginAt,
      createdAt: manager.createdAt,
    }));
  }),

  // Activate club manager
  activate: adminProcedure
    .input(
      z.object({
        managerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.clubManager.update({
        where: { id: input.managerId },
        data: { isActive: true },
      });

      return { success: true };
    }),

  // Regenerate temporary password for club manager
  regeneratePassword: adminProcedure
    .input(
      z.object({
        managerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Generate new temporary password
      const temporaryPassword = Math.random()
        .toString(36)
        .slice(-8)
        .toUpperCase();

      const manager = await ctx.prisma.clubManager.update({
        where: { id: input.managerId },
        data: {
          temporaryPassword,
          password: null, // Reset password so they have to set it again
          passwordResetAt: new Date(),
          isActive: true, // Ensure account is active
        },
        include: {
          club: true,
        },
      });

      // Send welcome email with new credentials
      await sendClubManagerWelcomeEmail(
        manager.email,
        manager.name,
        manager.club.name,
        temporaryPassword
      );

      return {
        success: true,
        temporaryPassword,
        message: "New temporary password generated and sent via email",
      };
    }),

  // Deactivate club manager
  deactivate: adminProcedure
    .input(
      z.object({
        managerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.clubManager.update({
        where: { id: input.managerId },
        data: { isActive: false },
      });

      return { success: true };
    }),
});
