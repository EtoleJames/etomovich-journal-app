import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

/**
 * NextAuth configuration with both Google and Credentials providers.
 * - GoogleProvider handles social login.
 * - CredentialsProvider handles email/password authentication.
 */
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google Provider: uses environment variables for client credentials.
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // Credentials Provider: for email and password sign-in.
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "example@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        // Find the user in the database using Prisma.
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) {
          throw new Error("No user found with this email");
        }
        // Verify the password using bcrypt.
        const isValid = await bcrypt.compare(credentials.password, user.password_hash);
        if (!isValid) {
          throw new Error("Incorrect password");
        }
        // Return a minimal user object.
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in", // Custom sign in page
  },
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }): Promise<string> {
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    state: {
      name: "next-auth.state-token",
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
