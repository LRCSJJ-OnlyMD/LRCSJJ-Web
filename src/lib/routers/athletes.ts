import { z } from "zod";
import { Prisma } from "@prisma/client";
import { router, adminProcedure, clubManagerProcedure } from "../trpc";

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

  // Club Manager endpoints
  getByClub: clubManagerProcedure.query(async ({ ctx }) => {
    // Get the club manager's club ID from the token
    const clubId = ctx.admin.clubId;

    return await ctx.prisma.athlete.findMany({
      where: { clubId },
      include: {
        club: true,
        insurances: {
          include: {
            season: true,
          },
        },
      },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    });
  }),

  createByClubManager: clubManagerProcedure
    .input(athleteInputSchema.omit({ clubId: true }))
    .mutation(async ({ ctx, input }) => {
      // Use the club manager's club ID
      const clubId = ctx.admin.clubId;

      if (!clubId) {
        throw new Error("Club ID not found in token");
      }

      const athlete = await ctx.prisma.athlete.create({
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
          clubId,
        },
        include: {
          club: true,
        },
      });

      // Send notification to admin
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/trpc/notifications.create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              json: {
                type: "ATHLETE_ADDED",
                title: "Nouvel athlète ajouté",
                message: `L'athlète ${athlete.firstName} ${athlete.lastName} a été ajouté au club ${athlete.club.name}.`,
                metadata: {
                  athleteId: athlete.id,
                  athleteName: `${athlete.firstName} ${athlete.lastName}`,
                  belt: athlete.belt || "Non définie",
                  weight: athlete.weight || "Non défini",
                },
                clubManagerId: ctx.admin.adminId,
                clubId: clubId,
              },
            }),
          }
        );
      } catch (error) {
        console.error("Failed to send notification:", error);
      }

      return athlete;
    }),

  updateByClubManager: clubManagerProcedure
    .input(athleteInputSchema.extend({ id: z.string() }).omit({ clubId: true }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const clubId = ctx.admin.clubId;

      // Verify athlete belongs to club manager's club
      const existingAthlete = await ctx.prisma.athlete.findFirst({
        where: { id, clubId },
      });

      if (!existingAthlete) {
        throw new Error("Athlete not found or not authorized");
      }

      const athlete = await ctx.prisma.athlete.update({
        where: { id },
        data: {
          ...data,
          email: data.email || null,
        },
        include: {
          club: true,
        },
      });

      // Send notification to admin
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/trpc/notifications.create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              json: {
                type: "ATHLETE_UPDATED",
                title: "Athlète modifié",
                message: `Les informations de l'athlète ${athlete.firstName} ${athlete.lastName} ont été mises à jour.`,
                metadata: {
                  athleteId: athlete.id,
                  athleteName: `${athlete.firstName} ${athlete.lastName}`,
                  changes: "Informations mises à jour",
                },
                clubManagerId: ctx.admin.adminId,
                clubId: clubId,
              },
            }),
          }
        );
      } catch (error) {
        console.error("Failed to send notification:", error);
      }

      return athlete;
    }),

  deleteByClubManager: clubManagerProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const clubId = ctx.admin.clubId;

      // Verify athlete belongs to club manager's club
      const existingAthlete = await ctx.prisma.athlete.findFirst({
        where: { id: input.id, clubId },
        include: { club: true },
      });

      if (!existingAthlete) {
        throw new Error("Athlete not found or not authorized");
      }

      await ctx.prisma.athlete.delete({
        where: { id: input.id },
      });

      // Send notification to admin
      try {
        await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/trpc/notifications.create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              json: {
                type: "ATHLETE_DELETED",
                title: "Athlète supprimé",
                message: `L'athlète ${existingAthlete.firstName} ${existingAthlete.lastName} a été supprimé du club ${existingAthlete.club.name}.`,
                metadata: {
                  athleteName: `${existingAthlete.firstName} ${existingAthlete.lastName}`,
                  clubName: existingAthlete.club.name,
                },
                clubManagerId: ctx.admin.adminId,
                clubId: clubId,
              },
            }),
          }
        );
      } catch (error) {
        console.error("Failed to send notification:", error);
      }

      return { success: true };
    }),
});
