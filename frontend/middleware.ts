import { NextResponse, NextRequest } from 'next/server';

const publicRoutes = ['/login', '/register', '/verify-otp', '/logout', '/auth-redirect', '/refresh'];

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
    const accessToken = request.cookies.get('arraiv_at')?.value;

    if (!isPublicRoute && !accessToken) {
      const refreshToken = request.cookies.get('arraiv_rt')?.value;
      if (refreshToken && pathname !== '/refresh') {
        return NextResponse.redirect(new URL('/refresh', request.url));
      }

      const loginUrl = new URL('/login', request.url);
      if (pathname !== '/') {
        loginUrl.searchParams.set('redirect', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    if (accessToken && pathname === '/login') {
      // TODO: redirect to user dashboard
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // TODO: create a error page
    return NextResponse.redirect(new URL('/error', request.url));
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};