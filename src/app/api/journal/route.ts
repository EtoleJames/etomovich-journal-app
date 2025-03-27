export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/journal
 * Retrieves all journal entries that are not soft-deleted.
 * Includes nested category and tag details.
 */
export async function GET(req: Request) {
  try {
    const entries = await prisma.journalEntry.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: "desc" },
      include: {
        entryCategories: {
          include: { category: true },
        },
        entryTags: {
          include: { tag: true },
        },
      },
    });
    return NextResponse.json(entries);
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    return NextResponse.json({ error: "Error fetching entries" }, { status: 500 });
  }
}

/**
 * POST /api/journal
 * Creates a new journal entry.
 * Expects JSON: { user_id, title, content, categoryIds: string[], tagIds: string[] }
 */
export async function POST(req: Request) {
  try {
    const { user_id, title, content, categoryIds, tagIds } = await req.json();
    const newEntry = await prisma.journalEntry.create({
      data: {
        user_id,
        title,
        content,
        entryCategories: {
          create: categoryIds.map((cid: string) => ({ category_id: cid })),
        },
        entryTags: {
          create: tagIds.map((tid: string) => ({ tag_id: tid })),
        },
      },
      include: {
        entryCategories: { include: { category: true } },
        entryTags: { include: { tag: true } },
      },
    });
    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating journal entry:", error);
    return NextResponse.json({ error: "Error creating entry" }, { status: 500 });
  }
}
