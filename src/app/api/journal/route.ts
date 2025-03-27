// src/app/api/journal/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/journal
 * Retrieves all journal entries that are not soft-deleted.
 */
export async function GET(req: Request) {
  try {
    const entries = await prisma.journalEntry.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: "desc",
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
 * Expected JSON payload: { user_id, title, content }
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { user_id, title, content } = data;

    // Create a new journal entry record
    const newEntry = await prisma.journalEntry.create({
      data: {
        user_id,
        title,
        content,
      },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating journal entry:", error);
    return NextResponse.json({ error: "Error creating entry" }, { status: 500 });
  }
}
