import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/tags?user_id=...
 * Returns all tags for the specified user.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }
    const tags = await prisma.tag.findMany({
      where: { user_id },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ error: "Error fetching tags" }, { status: 500 });
  }
}

/**
 * POST /api/tags
 * Creates a new tag.
 * Expects JSON: { user_id, name }
 */
export async function POST(req: Request) {
  try {
    const { user_id, name } = await req.json();
    if (!user_id || !name) {
      return NextResponse.json({ error: "Missing user_id or name" }, { status: 400 });
    }
    const newTag = await prisma.tag.create({
      data: { user_id, name },
    });
    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json({ error: "Error creating tag" }, { status: 500 });
  }
}
