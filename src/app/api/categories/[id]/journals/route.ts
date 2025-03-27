export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/categories/[id]/journals
 * Retrieves all journal entries associated with a given category.
 */
export async function GET(req: Request, context: any) {
  const { params } = context;
  try {
    const entries = await prisma.entryCategory.findMany({
      where: { category_id: params.id },
      include: {
        journalEntry: {
          include: {
            entryCategories: { include: { category: true } },
            entryTags: { include: { tag: true } },
          },
        },
      },
    });
    const journals = entries
      .map((entry) => entry.journalEntry)
      .filter((entry) => entry.deleted_at === null);
    return NextResponse.json(journals);
  } catch (error) {
    console.error("Error fetching journals for category:", error);
    return NextResponse.json({ error: "Error fetching journals" }, { status: 500 });
  }
}
