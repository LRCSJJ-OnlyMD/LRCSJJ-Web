import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import jwt from "jsonwebtoken";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET!;
const ADMIN_ACCESS_CODE = process.env.ADMIN_ACCESS_CODE || "LRCSJJ2025SECURE";

// Input validation
const verifyAccessSchema = z.object({
  accessCode: z.string().min(1, "Code d'accès requis"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const result = verifyAccessSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Données invalides", details: result.error.issues },
        { status: 400 }
      );
    }

    const { accessCode } = result.data;

    // Verify access code against environment variable
    if (accessCode !== ADMIN_ACCESS_CODE) {
      // Add delay to prevent brute force attacks
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return NextResponse.json(
        { error: "Code d'accès invalide" },
        { status: 401 }
      );
    }

    // Generate secure session token with short expiration (2 hours)
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
    const token = jwt.sign(
      {
        type: "admin_access",
        timestamp: Date.now(),
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return NextResponse.json({
      success: true,
      token,
      expiresAt: expiresAt.toISOString(),
      message: "Accès administrateur autorisé",
    });
  } catch (error) {
    logger.error("Admin access verification failed", {
      feature: "admin_access",
      action: "verification_error",
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
