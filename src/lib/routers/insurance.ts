import { z } from "zod";
import { adminProcedure, clubManagerProcedure, router } from "../trpc";
import { prisma } from "../prisma";

export const insuranceRouter = router({
  // Admin procedures - can access all insurances
  getAll: adminProcedure.query(async () => {
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
        createdAt: "desc",
      },
    });
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
      });
    }),

  getStats: adminProcedure.query(async () => {
    const totalInsurances = await prisma.insurance.count();
    const paidInsurances = await prisma.insurance.count({
      where: { isPaid: true },
    });
    const unpaidInsurances = await prisma.insurance.count({
      where: { isPaid: false },
    });

    const totalAmount = await prisma.insurance.aggregate({
      where: { isPaid: true },
      _sum: { amount: true },
    });

    const pendingAmount = await prisma.insurance.aggregate({
      where: { isPaid: false },
      _sum: { amount: true },
    });

    return {
      total: totalInsurances,
      paid: paidInsurances,
      unpaid: unpaidInsurances,
      totalRevenue: totalAmount._sum.amount || 0,
      pendingRevenue: pendingAmount._sum.amount || 0,
    };
  }),

  create: adminProcedure
    .input(
      z.object({
        athleteId: z.string(),
        seasonId: z.string(),
        amount: z.number().positive(),
        isPaid: z.boolean().default(false),
        paidAt: z.string().optional(),
      })
    )
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
      });
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        athleteId: z.string().optional(),
        seasonId: z.string().optional(),
        amount: z.number().positive().optional(),
        isPaid: z.boolean().optional(),
        paidAt: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
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
      });
    }),

  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.insurance.delete({
        where: { id: input.id },
      });
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
      });
    }),

  // Club Manager procedures - scoped to their club only
  getMyClubInsurances: clubManagerProcedure
    .input(z.object({ seasonId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      const clubId = ctx.admin.clubId!;

      return await prisma.insurance.findMany({
        where: {
          athlete: { clubId },
          ...(input.seasonId && { seasonId: input.seasonId }),
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
          createdAt: "desc",
        },
      });
    }),

  getMyClubStats: clubManagerProcedure.query(async ({ ctx }) => {
    const clubId = ctx.admin.clubId!;

    const totalInsurances = await prisma.insurance.count({
      where: { athlete: { clubId } },
    });
    const paidInsurances = await prisma.insurance.count({
      where: { isPaid: true, athlete: { clubId } },
    });
    const unpaidInsurances = await prisma.insurance.count({
      where: { isPaid: false, athlete: { clubId } },
    });

    const totalAmount = await prisma.insurance.aggregate({
      where: { isPaid: true, athlete: { clubId } },
      _sum: { amount: true },
    });

    const pendingAmount = await prisma.insurance.aggregate({
      where: { isPaid: false, athlete: { clubId } },
      _sum: { amount: true },
    });

    return {
      total: totalInsurances,
      paid: paidInsurances,
      unpaid: unpaidInsurances,
      totalRevenue: totalAmount._sum.amount || 0,
      pendingRevenue: pendingAmount._sum.amount || 0,
    };
  }),

  createForMyClub: clubManagerProcedure
    .input(
      z.object({
        athleteId: z.string(),
        seasonId: z.string(),
        amount: z.number().positive(),
        isPaid: z.boolean().default(false),
        paidAt: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const clubId = ctx.admin.clubId!;

      // Verify athlete belongs to manager's club
      const athlete = await prisma.athlete.findUnique({
        where: { id: input.athleteId, clubId },
      });

      if (!athlete) {
        throw new Error("Athlete not found or access denied");
      }

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
      });
    }),

  updateMyClubInsurance: clubManagerProcedure
    .input(
      z.object({
        id: z.string(),
        athleteId: z.string().optional(),
        seasonId: z.string().optional(),
        amount: z.number().positive().optional(),
        isPaid: z.boolean().optional(),
        paidAt: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const clubId = ctx.admin.clubId!;
      const { id, ...data } = input;

      // Verify insurance belongs to manager's club
      const insurance = await prisma.insurance.findUnique({
        where: { id },
        include: { athlete: true },
      });

      if (!insurance || insurance.athlete.clubId !== clubId) {
        throw new Error("Insurance not found or access denied");
      }

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
      });
    }),

  markMyClubInsuranceAsPaid: clubManagerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const clubId = ctx.admin.clubId!;

      // Verify insurance belongs to manager's club
      const insurance = await prisma.insurance.findUnique({
        where: { id: input.id },
        include: { athlete: true },
      });

      if (!insurance || insurance.athlete.clubId !== clubId) {
        throw new Error("Insurance not found or access denied");
      }

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
      });
    }),
});
