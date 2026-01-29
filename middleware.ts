import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/auth/signin', '/auth/signup'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('mca_token')?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
