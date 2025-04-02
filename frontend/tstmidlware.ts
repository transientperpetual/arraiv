// middleware.ts
import { NextResponse, NextRequest, NextFetchEvent } from 'next/server';
import { verify } from 'jsonwebtoken';

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/verify-otp', '/logout', '/auth-redirect'];

// Allowed origins for CORS
const allowedOrigins = ['https://your-app.com', 'https://another-domain.com'];

// Basic in-memory lock to prevent multiple simultaneous token refresh calls
let isRefreshing = false;

// Middleware function
export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  // Log middleware invocation for debugging
  console.log(`[${new Date().toISOString()}] Middleware invoked for path: ${pathname}`);

  // Check if the current route is a public route
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isApiRoute = pathname.startsWith('/api');

  // Get the access and refresh tokens from cookies
  const cookieStore = request.cookies;
  const accessToken = cookieStore.get('arraiv_at')?.value;
  const refreshToken = cookieStore.get('arraiv_rt')?.value;

  // Helper function to redirect to login
  const redirectToLogin = () => {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  };

  // Helper function to add security headers to the response
  const addSecurityHeaders = (response: NextResponse) => {
    // Check header size to avoid 431 errors
    const headersSize = JSON.stringify(Object.fromEntries(response.headers)).length;
    if (headersSize > 8000) {
      console.warn('Headers size exceeds safe limit, skipping some headers');
      return response;
    }
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    return response;
  };

  // Helper function to handle CORS
  const handleCors = (response: NextResponse) => {
    const origin = request.headers.get('origin') ?? '';
    const isAllowedOrigin = allowedOrigins.includes(origin);
    const isPreflight = request.method === 'OPTIONS';

    if (isPreflight) {
      const preflightHeaders = {
        ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      };
      return NextResponse.json({}, { headers: preflightHeaders });
    }

    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  };

  // Helper function to refresh tokens
  const refreshTokens = async (refreshToken: string) => {
    if (isRefreshing) {
      // Wait for the ongoing refresh to complete (simplified)
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    isRefreshing = true;
    try {
      verify(refreshToken, process.env.JWT_REFRESH_SECRET!, {
        algorithms: ['HS256'],
      });

      console.log(`[${new Date().toISOString()}] Refreshing tokens for path: ${pathname}`);

      const refreshResponse = await fetch(`${request.nextUrl.origin}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          Cookie: `arraiv_rt=${refreshToken}`,
        },
      });

      if (!refreshResponse.ok) {
        throw new Error('Failed to refresh tokens');
      }

      const setCookieHeader = refreshResponse.headers.get('set-cookie');
      if (!setCookieHeader) {
        throw new Error('No cookies returned from refresh endpoint');
      }

      const response = NextResponse.next();
      response.headers.set('Set-Cookie', setCookieHeader);

      // Log token refresh in the background
      event.waitUntil(
        (async () => {
          console.log(`[${new Date().toISOString()}] Background task: Token refresh completed for path: ${pathname}`);
        })()
      );

      return handleCors(addSecurityHeaders(response));
    } catch (error:any) {
      console.error(`[${new Date().toISOString()}] Token refresh failed: ${error.message}`);
      const response = isApiRoute
        ? NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })
        : redirectToLogin();
      response.cookies.delete('arraiv_at');
      response.cookies.delete('arraiv_rt');
      return handleCors(addSecurityHeaders(response));
    } finally {
      isRefreshing = false;
    }
  };

  // If the route is public, allow access (but redirect authenticated users away from /login)
  if (isPublicRoute) {
    if (accessToken) {
      try {
        verify(accessToken, process.env.JWT_SECRET!, {
          algorithms: ['HS256'],
        });
        if (pathname === '/login' || pathname === '/auth-redirect') {
          const response = NextResponse.redirect(new URL('/', request.url));
          return handleCors(addSecurityHeaders(response));
        }
      } catch (error) {
        // Access token is invalid, but we’ll check the refresh token below
      }
    }
    const response = NextResponse.next();
    return handleCors(addSecurityHeaders(response));
  }

  // If the route is protected, check tokens
  if (!accessToken) {
    if (!refreshToken) {
      const response = isApiRoute
        ? NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })
        : redirectToLogin();
      return handleCors(addSecurityHeaders(response));
    }
    return await refreshTokens(refreshToken);
  }

  // Access token exists, verify it
  try {
    verify(accessToken, process.env.JWT_SECRET!, {
      algorithms: ['HS256'],
    });
    const response = NextResponse.next();
    return handleCors(addSecurityHeaders(response));
  } catch (error) {
    if (!refreshToken) {
      const response = isApiRoute
        ? NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })
        : redirectToLogin();
      return handleCors(addSecurityHeaders(response));
    }
    return await refreshTokens(refreshToken);
  }
}

// Define which paths the middleware should apply to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Public routes (login, register, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|login|register|verify-otp|logout|auth-redirect).*)',
  ],
};