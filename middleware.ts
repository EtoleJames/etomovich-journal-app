import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const protectedPaths = ['/dashboard', '/journal']; // protected routes
  const { pathname } = req.nextUrl;

  // Allow unprotected paths to continue.
  if (!protectedPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Retrieve token using NextAuth's JWT helper
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token) {
    // Redirect to sign-in if no token is found.
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  return NextResponse.next();
}

// Specify which paths this middleware should run on.
export const config = {
  matcher: ['/dashboard/:path*', '/journal/:path*'],
};
