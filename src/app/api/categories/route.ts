import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/categories?user_id=...
 * Returns all categories for the specified user.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");
    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }
    const categories = await prisma.category.findMany({
      where: { user_id },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Error fetching categories" }, { status: 500 });
  }
}

/**
 * POST /api/categories
 * Creates a new category.
 * Expects JSON: { user_id, name }
 */
export async function POST(req: Request) {
  try {
    const { user_id, name } = await req.json();
    if (!user_id || !name) {
      return NextResponse.json({ error: "Missing user_id or name" }, { status: 400 });
    }
    const newCategory = await prisma.category.create({
      data: { user_id, name },
    });
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: "Error creating category" }, { status: 500 });
  }
}
