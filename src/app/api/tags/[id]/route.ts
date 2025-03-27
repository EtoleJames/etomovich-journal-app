import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * PUT /api/tags/[id]
 * Updates a tag's name.
 * Expects JSON: { name: string }
 */
export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = await Promise.resolve(context.params);
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const updatedTag = await prisma.tag.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json({ error: "Error updating tag" }, { status: 500 });
  }
}

/**
 * DELETE /api/tags/[id]
 * Deletes a tag.
 */
export async function DELETE(req: Request, context: { params: { id: string } }) {
  const { id } = await Promise.resolve(context.params);
  try {
    const deletedTag = await prisma.tag.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Tag deleted", tag: deletedTag });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json({ error: "Error deleting tag" }, { status: 500 });
  }
}
