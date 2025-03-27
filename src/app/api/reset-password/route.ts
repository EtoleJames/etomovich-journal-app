export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, newPassword, resetToken } = await req.json();

    // Retrieve the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.resetToken !== resetToken || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      return NextResponse.json({ error: "Invalid or expired reset token." }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and clear the reset token fields
    await prisma.user.update({
      where: { email },
      data: {
        password_hash: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Reset Password error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
