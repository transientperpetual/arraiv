// middleware.ts
import { NextResponse, NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/verify-otp', '/logout', '/auth-redirect'];

// Middleware function
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current route is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Get the token (or session) from cookies or headers
  // This depends on how you're handling authentication (e.g., JWT, session)
  const token = request.cookies.get('arraiv_at')?.value;

  // If the route is not public and there's no token, redirect to login
  if (!isPublicRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname); // Optional: Pass the current path to redirect back after login
    return NextResponse.redirect(loginUrl);
  }

  // If the user is authenticated and tries to access a public route like /login, redirect to a dashboard
  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Define which paths the middleware should apply to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};