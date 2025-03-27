import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { sendResetPasswordEmail } from '@/lib/mailer';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Look for the user in the database.
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // For security, always return a success message.
      return NextResponse.json({ message: "If an account with that email exists, a reset link has been sent." });
    }

    // Generate a secure reset token and expiry (1 hour from now)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

    // Update user with the reset token and expiry
    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Construct reset link using NEXTAUTH_URL from environment variables.
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetLink = `${baseUrl}/reset-password?email=${encodeURIComponent(email)}&token=${resetToken}`;

    // Send the reset link via email.
    await sendResetPasswordEmail(email, resetLink);

    return NextResponse.json({ message: "If an account with that email exists, a reset link has been sent." });
  } catch (error) {
    console.error("Forgot Password error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
