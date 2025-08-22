import { z } from "zod";
import { router, adminProcedure, publicProcedure } from "../trpc";
import { sendAdminNotificationEmail } from "../email";

export const notificationsRouter = router({
  // Get all notifications for admin
  getAll: adminProcedure.query(async ({ ctx }) => {
    const notifications = await ctx.prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 50, // Limit to last 50 notifications
    });

    return notifications;
  }),

  // Mark notification as read
  markAsRead: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.notification.update({
        where: { id: input.id },
        data: { isRead: true },
      });

      return { success: true };
    }),

  // Mark all notifications as read
  markAllAsRead: adminProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });

    return { success: true };
  }),

  // Create notification (used internally by club manager actions)
  create: publicProcedure
    .input(
      z.object({
        type: z.enum([
          "ATHLETE_ADDED",
          "ATHLETE_UPDATED",
          "ATHLETE_DELETED",
          "INSURANCE_UPDATED",
          "PAYMENT_MADE",
        ]),
        title: z.string(),
        message: z.string(),
        metadata: z.any().optional(),
        clubManagerId: z.string(),
        clubId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get club manager and club info
      const clubManager = await ctx.prisma.clubManager.findUnique({
        where: { id: input.clubManagerId },
        include: { club: true },
      });

      if (!clubManager) {
        return { success: false, error: "Club manager not found" };
      }

      // Create notification in database
      const notification = await ctx.prisma.notification.create({
        data: {
          type: input.type,
          title: input.title,
          message: input.message,
          metadata: input.metadata || null,
          clubManagerId: input.clubManagerId,
          clubId: input.clubId,
          isRead: false,
        },
      });

      // Send email notification to admin
      try {
        await sendAdminNotificationEmail({
          type: input.type,
          title: input.title,
          message: input.message,
          clubName: clubManager.club.name,
          clubManagerName: clubManager.name,
          metadata: input.metadata,
        });
      } catch (error) {
        console.error("Failed to send admin notification email:", error);
      }

      return { success: true, notification };
    }),

  // Get unread count
  getUnreadCount: adminProcedure.query(async ({ ctx }) => {
    const count = await ctx.prisma.notification.count({
      where: { isRead: false },
    });

    return count;
  }),
});
