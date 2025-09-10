import { z } from "zod";
import { router, adminProcedure, publicProcedure } from "../trpc";
import { prisma as basePrisma } from "../prisma";

// Type assertion to fix Prisma client types issue
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = basePrisma as any;

export const postsRouter = router({
  // Get all posts (public)
  getAll: publicProcedure
    .input(
      z.object({
        limit: z.number().optional().default(10),
        cursor: z.string().optional(),
        type: z.enum(["ACHIEVEMENT", "NEWS", "CHAMPIONSHIP_RESULT"]).optional(),
      })
    )
    .query(async ({ input }) => {
      const { limit, cursor, type } = input;

      const posts = await prisma.post.findMany({
        where: {
          isPublished: true,
          ...(type && { type }),
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          images: true,
          championship: {
            include: {
              season: true,
            },
          },
        },
      });

      let nextCursor: string | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem!.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),

  // Get featured achievements
  getFeatured: publicProcedure.query(async () => {
    return await prisma.post.findMany({
      where: {
        isPublished: true,
        featured: true,
        type: "ACHIEVEMENT",
      },
      take: 6,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        images: true,
        championship: {
          include: {
            season: true,
          },
        },
      },
    });
  }),

  // Get post by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await prisma.post.findUnique({
        where: { id: input.id },
        include: {
          images: true,
          championship: {
            include: {
              season: true,
            },
          },
        },
      });
    }),

  // Create new post (admin only)
  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        type: z.enum(["ACHIEVEMENT", "NEWS", "CHAMPIONSHIP_RESULT"]),
        championshipId: z.string().optional(),
        medalType: z
          .enum(["GOLD", "SILVER", "BRONZE", "PARTICIPATION"])
          .optional(),
        competitionLevel: z
          .enum(["REGIONAL", "NATIONAL", "INTERNATIONAL"])
          .optional(),
        athleteName: z.string().optional(),
        clubName: z.string().optional(),
        images: z
          .array(
            z.object({
              url: z.string().url(),
              publicId: z.string(),
              caption: z.string().optional(),
            })
          )
          .optional(),
        isPublished: z.boolean().default(true),
        featured: z.boolean().default(false),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { images, ...postData } = input;

      const post = await prisma.post.create({
        data: {
          ...postData,
          championshipId: postData.championshipId || null,
          adminId: ctx.admin.adminId, // Use authenticated admin ID
          images: images?.length
            ? {
                create: images.map((img) => ({
                  url: img.url,
                  publicId: img.publicId,
                  caption: img.caption,
                })),
              }
            : undefined,
        },
        include: {
          images: true,
          championship: {
            include: {
              season: true,
            },
          },
        },
      });

      return post;
    }),

  // Update post
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        type: z.enum(["ACHIEVEMENT", "NEWS", "CHAMPIONSHIP_RESULT"]).optional(),
        championshipId: z.string().optional(),
        medalType: z
          .enum(["GOLD", "SILVER", "BRONZE", "PARTICIPATION"])
          .optional(),
        competitionLevel: z
          .enum(["REGIONAL", "NATIONAL", "INTERNATIONAL"])
          .optional(),
        athleteName: z.string().optional(),
        clubName: z.string().optional(),
        isPublished: z.boolean().optional(),
        featured: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;

      return await prisma.post.update({
        where: { id },
        data: updateData,
        include: {
          images: true,
          championship: {
            include: {
              season: true,
            },
          },
        },
      });
    }),

  // Delete post
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      // First delete associated images from Cloudinary if needed
      const post = await prisma.post.findUnique({
        where: { id: input.id },
        include: { images: true },
      });

      if (post?.images.length) {
        // TODO: Delete images from Cloudinary using publicId
        // This would require implementing cloudinary deletion
      }

      return await prisma.post.delete({
        where: { id: input.id },
      });
    }),

  // Add image to post
  addImage: adminProcedure
    .input(
      z.object({
        postId: z.string(),
        url: z.string().url(),
        publicId: z.string(),
        caption: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.postImage.create({
        data: input,
      });
    }),

  // Remove image from post
  removeImage: adminProcedure
    .input(z.object({ imageId: z.string() }))
    .mutation(async ({ input }) => {
      const image = await prisma.postImage.findUnique({
        where: { id: input.imageId },
      });

      if (image) {
        // TODO: Delete from Cloudinary using publicId
        await prisma.postImage.delete({
          where: { id: input.imageId },
        });
      }

      return { success: true };
    }),

  // Get posts by championship
  getByChampionship: publicProcedure
    .input(z.object({ championshipId: z.string() }))
    .query(async ({ input }) => {
      return await prisma.post.findMany({
        where: {
          championshipId: input.championshipId,
          isPublished: true,
        },
        include: {
          images: true,
          championship: {
            include: {
              season: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  // Get achievement stats
  getAchievementStats: adminProcedure.query(async () => {
    const stats = await prisma.post.groupBy({
      by: ["medalType", "competitionLevel"],
      where: {
        type: "ACHIEVEMENT",
        medalType: { not: null },
        competitionLevel: { not: null },
      },
      _count: {
        id: true,
      },
    });

    return stats;
  }),
});
