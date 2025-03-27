import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * PUT /api/categories/[id]
 * Updates a category's name.
 * Expects JSON: { name: string }
 */
export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = await Promise.resolve(context.params);
  try {
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name },
    });
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json({ error: "Error updating category" }, { status: 500 });
  }
}

/**
 * DELETE /api/categories/[id]
 * Deletes a category.
 */
export async function DELETE(req: Request, context: { params: { id: string } }) {
  const { id } = await Promise.resolve(context.params);
  try {
    const deletedCategory = await prisma.category.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Category deleted", category: deletedCategory });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ error: "Error deleting category" }, { status: 500 });
  }
}
