export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/journal/[id]
 * Retrieves a single journal entry by its ID (if not soft-deleted).
 * Includes nested category and tag details.
 */
export async function GET(req: Request, context: any) {
  const { params } = context;
  try {
    const entry = await prisma.journalEntry.findUnique({
      where: { id: params.id },
      include: {
        entryCategories: { include: { category: true } },
        entryTags: { include: { tag: true } },
      },
    });
    if (!entry || entry.deleted_at !== null) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }
    return NextResponse.json(entry);
  } catch (error) {
    console.error("Error fetching journal entry:", error);
    return NextResponse.json({ error: "Error fetching journal entry" }, { status: 500 });
  }
}

/**
 * PUT /api/journal/[id]
 * Updates a journal entry and its associated categories and tags.
 * Expects JSON: { title, content, categoryIds: string[], tagIds: string[] }
 */
export async function PUT(req: Request, context: any) {
  const { id } = await Promise.resolve(context.params);
  try {
    const { title, content, categoryIds, tagIds } = await req.json();
    const updatedEntry = await prisma.journalEntry.update({
      where: { id },
      data: {
        title,
        content,
        entryCategories: {
          deleteMany: {},
          create: categoryIds.map((cid: string) => ({ category_id: cid })),
        },
        entryTags: {
          deleteMany: {},
          create: tagIds.map((tid: string) => ({ tag_id: tid })),
        },
      },
      include: {
        entryCategories: { include: { category: true } },
        entryTags: { include: { tag: true } },
      },
    });
    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error("Error updating journal entry:", error);
    return NextResponse.json({ error: "Error updating entry" }, { status: 500 });
  }
}

/**
 * DELETE /api/journal/[id]
 * Soft-deletes a journal entry by setting its deleted_at field.
 */
export async function DELETE(req: Request, context: any) {
  const { id } = await Promise.resolve(context.params);
  try {
    const deletedEntry = await prisma.journalEntry.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return NextResponse.json({ message: "Entry deleted", entry: deletedEntry });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    return NextResponse.json({ error: "Error deleting entry" }, { status: 500 });
  }
}
