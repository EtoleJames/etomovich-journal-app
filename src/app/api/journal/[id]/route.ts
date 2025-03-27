import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * GET /api/journal/[id]
 * Retrieves a single journal entry by its ID.
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const entry = await prisma.journalEntry.findUnique({
      where: { id },
    });

    // Return 404 if entry does not exist or is soft-deleted
    if (!entry || entry.deleted_at !== null) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Error fetching journal entry:", error);
    return NextResponse.json({ error: "Error fetching entry" }, { status: 500 });
  }
}

/**
 * PUT /api/journal/[id]
 * Updates a journal entry.
 * Expected JSON payload: { title, content }
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const data = await req.json();

    const updatedEntry = await prisma.journalEntry.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
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
 * Soft deletes a journal entry by setting its deleted_at timestamp.
 */
export async function DELETE(req: Request, context: { params: { id: string } }) {
  const { id } = await Promise.resolve(context.params);
  
  try {
    const deletedEntry = await prisma.journalEntry.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });

    return NextResponse.json({ message: "Entry deleted", entry: deletedEntry });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    return NextResponse.json({ error: "Error deleting entry" }, { status: 500 });
  }
}
