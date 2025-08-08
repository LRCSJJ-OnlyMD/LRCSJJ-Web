import { z } from "zod";
import { Prisma } from "@prisma/client";
import {
  router,
  adminProcedure,
  clubManagerProcedure,
  authenticatedProcedure,
} from "../trpc";

const athleteInputSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string().pipe(z.coerce.date()),
  passportNo: z.string().optional(),
  nationalId: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  photoUrl: z.string().optional(),
  belt: z.string().optional(),
  weight: z.number().optional(),
  category: z.string().optional(),
  clubId: z.string(),
});

export const athletesRouter = router({
  // Admin can view all athletes across all clubs
  getAll: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        clubId: z.string().optional(),
        seasonId: z.string().optional(),
        insuranceStatus: z.enum(["paid", "unpaid", "all"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Prisma.AthleteWhereInput = {};

      if (input.search) {
        where.OR = [
          { firstName: { contains: input.search, mode: "insensitive" } },
          { lastName: { contains: input.search, mode: "insensitive" } },
          { passportNo: { contains: input.search, mode: "insensitive" } },
          { nationalId: { contains: input.search, mode: "insensitive" } },
        ];
      }

      if (input.clubId) {
        where.clubId = input.clubId;
      }

      return await ctx.prisma.athlete.findMany({
        where,
        include: {
          club: true,
          insurances: {
            where: input.seasonId ? { seasonId: input.seasonId } : undefined,
            include: {
              season: true,
            },
          },
          _count: {
            select: {
              insurances: true,
              teamMembers: true,
            },
          },
        },
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      });
    }),

  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.athlete.findUnique({
        where: { id: input.id },
        include: {
          club: true,
          insurances: {
            include: {
              season: true,
            },
          },
          teamMembers: {
            include: {
              team: true,
            },
          },
        },
      });
    }),

  create: adminProcedure
    .input(athleteInputSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.athlete.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          dateOfBirth: input.dateOfBirth,
          passportNo: input.passportNo,
          nationalId: input.nationalId,
          phone: input.phone,
          email: input.email || null,
          address: input.address,
          photoUrl: input.photoUrl,
          belt: input.belt,
          weight: input.weight,
          category: input.category,
          clubId: input.clubId,
        },
        include: {
          club: true,
        },
      });
    }),

  update: adminProcedure
    .input(athleteInputSchema.extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.prisma.athlete.update({
        where: { id },
        data: {
          ...data,
          email: data.email || null,
        },
        include: {
          club: true,
        },
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.athlete.delete({
        where: { id: input.id },
      });
    }),

  getStats: adminProcedure.query(async ({ ctx }) => {
    const [totalAthletes, activeSeasonInsurances, athletesWithoutInsurance] =
      await Promise.all([
        ctx.prisma.athlete.count(),
        ctx.prisma.insurance.count({
          where: {
            isPaid: true,
            season: { isActive: true },
          },
        }),
        ctx.prisma.athlete.count({
          where: {
            insurances: {
              none: {
                season: { isActive: true },
                isPaid: true,
              },
            },
          },
        }),
      ]);

    return {
      totalAthletes,
      activeSeasonInsurances,
      athletesWithoutInsurance,
    };
  }),

  // Club Manager specific procedures - scoped to their club only
  getMyClubAthletes: clubManagerProcedure
    .input(
      z.object({
        search: z.string().optional(),
        seasonId: z.string().optional(),
        insuranceStatus: z.enum(["paid", "unpaid", "all"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const clubId = ctx.admin.clubId!;

      const where: Prisma.AthleteWhereInput = {
        clubId,
      };

      if (input.search) {
        where.OR = [
          { firstName: { contains: input.search, mode: "insensitive" } },
          { lastName: { contains: input.search, mode: "insensitive" } },
          { passportNo: { contains: input.search, mode: "insensitive" } },
          { nationalId: { contains: input.search, mode: "insensitive" } },
        ];
      }

      return await ctx.prisma.athlete.findMany({
        where,
        include: {
          club: true,
          insurances: {
            where: input.seasonId ? { seasonId: input.seasonId } : undefined,
            include: {
              season: true,
            },
          },
          _count: {
            select: {
              insurances: true,
              teamMembers: true,
            },
          },
        },
        orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
      });
    }),

  getMyClubAthleteById: clubManagerProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const athlete = await ctx.prisma.athlete.findUnique({
        where: {
          id: input.id,
          clubId: ctx.admin.clubId!, // Ensure athlete belongs to manager's club
        },
        include: {
          club: true,
          insurances: {
            include: {
              season: true,
            },
          },
          teamMembers: {
            include: {
              team: true,
            },
          },
        },
      });

      if (!athlete) {
        throw new Error("Athlete not found or access denied");
      }

      return athlete;
    }),

  createForMyClub: clubManagerProcedure
    .input(athleteInputSchema.omit({ clubId: true }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.athlete.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          dateOfBirth: input.dateOfBirth,
          passportNo: input.passportNo,
          nationalId: input.nationalId,
          phone: input.phone,
          email: input.email || null,
          address: input.address,
          photoUrl: input.photoUrl,
          belt: input.belt,
          weight: input.weight,
          category: input.category,
          clubId: ctx.admin.clubId!, // Always use manager's club
        },
        include: {
          club: true,
        },
      });
    }),

  updateMyClubAthlete: clubManagerProcedure
    .input(athleteInputSchema.omit({ clubId: true }).extend({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verify athlete belongs to manager's club
      const athlete = await ctx.prisma.athlete.findUnique({
        where: { id, clubId: ctx.admin.clubId! },
      });

      if (!athlete) {
        throw new Error("Athlete not found or access denied");
      }

      return await ctx.prisma.athlete.update({
        where: { id },
        data: {
          ...data,
          email: data.email || null,
        },
        include: {
          club: true,
        },
      });
    }),

  deleteMyClubAthlete: clubManagerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify athlete belongs to manager's club
      const athlete = await ctx.prisma.athlete.findUnique({
        where: { id: input.id, clubId: ctx.admin.clubId! },
      });

      if (!athlete) {
        throw new Error("Athlete not found or access denied");
      }

      return await ctx.prisma.athlete.delete({
        where: { id: input.id },
      });
    }),

  getMyClubStats: clubManagerProcedure.query(async ({ ctx }) => {
    const clubId = ctx.admin.clubId!;

    const [totalAthletes, activeSeasonInsurances, athletesWithoutInsurance] =
      await Promise.all([
        ctx.prisma.athlete.count({
          where: { clubId },
        }),
        ctx.prisma.insurance.count({
          where: {
            isPaid: true,
            season: { isActive: true },
            athlete: { clubId },
          },
        }),
        ctx.prisma.athlete.count({
          where: {
            clubId,
            insurances: {
              none: {
                season: { isActive: true },
                isPaid: true,
              },
            },
          },
        }),
      ]);

    return {
      totalAthletes,
      activeSeasonInsurances,
      athletesWithoutInsurance,
    };
  }),
});
