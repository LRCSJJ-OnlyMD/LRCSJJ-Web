import { initTRPC, TRPCError } from "@trpc/server";
import { NextRequest } from "next/server";
import superjson from "superjson";
import { authenticateRequest, JWTPayload } from "./auth";
import { prisma } from "./prisma";

interface CreateContextOptions {
  req?: NextRequest;
}

export async function createContext(opts: CreateContextOptions) {
  let admin: JWTPayload | null = null;

  if (opts.req) {
    try {
      admin = await authenticateRequest(opts.req);
    } catch {
      // Not authenticated, admin remains null
    }
  }

  return {
    prisma,
    admin,
    req: opts.req,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Admin-only procedure
export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.admin || ctx.admin.role !== "ADMIN") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Admin authentication required",
    });
  }
  return next({
    ctx: {
      ...ctx,
      admin: ctx.admin,
    },
  });
});

// Club manager procedure
export const clubManagerProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.admin || ctx.admin.role !== "CLUB_MANAGER") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Club manager authentication required",
    });
  }
  return next({
    ctx: {
      ...ctx,
      admin: ctx.admin,
    },
  });
});

// Combined procedure for both admin and club manager
export const authenticatedProcedure = t.procedure.use(({ ctx, next }) => {
  if (
    !ctx.admin ||
    !ctx.admin.role ||
    !["ADMIN", "CLUB_MANAGER"].includes(ctx.admin.role)
  ) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }
  return next({
    ctx: {
      ...ctx,
      admin: ctx.admin,
    },
  });
});
