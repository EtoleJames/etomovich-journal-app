export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };