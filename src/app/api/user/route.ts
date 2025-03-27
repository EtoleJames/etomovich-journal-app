export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * PUT /api/user
 * Updates the user's profile.
 * Expects JSON payload: { id: string, name: string }
 */
export async function PUT(req: Request) {
  try {
    const { id, name } = await req.json();
    if (!id || !name) {
      return NextResponse.json({ error: "Missing id or name" }, { status: 400 });
    }
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Error updating profile" }, { status: 500 });
  }
}
