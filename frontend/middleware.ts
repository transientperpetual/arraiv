import { NextResponse, NextRequest } from "next/server";

const publicRoutes = [
  "/login",
  "/register",
  "/verify-otp",
  "/logout",
  "/auth-redirect",
  "/refresh",
  "/assistant",
];

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const accessToken = request.cookies.get("arraiv_at")?.value;

    if (!isPublicRoute && !accessToken) {
      const refreshToken = request.cookies.get("arraiv_rt")?.value;
      if (refreshToken && pathname !== "/refresh") {
        // Simple nonce generator (Edge-compatible)
        function generateNonce() {
          const timestamp = Date.now().toString(36); // Base-36 timestamp
          const random = Math.random().toString(36).substring(2, 8); // Random string
          console.log("NONCE : ", `${timestamp}-${random}`);
          return `${timestamp}-${random}`; // e.g., "1j4k5l-abc123"
        }

        const nonce = generateNonce();

        // Create a response object to set the nonce cookie
        const response = NextResponse.redirect(
          new URL("/refresh", request.url)
        );

        // Set nonce in a signed cookie (short-lived, 60 seconds)
        response.cookies.set("refresh_nonce", nonce, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          path: "/",
          maxAge: 60, // Expires in 60 seconds
        });

        // Optionally pass refreshToken or nonce in URL (less secure, but simpler)
        // response.nextUrl.searchParams.set('nonce', nonce);

        return response;
      }

      const loginUrl = new URL("/login", request.url);
      if (pathname !== "/") {
        loginUrl.searchParams.set("redirect", pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    if (accessToken && pathname === "/login") {
      // TODO: redirect to user dashboard
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // TODO: create a error page
    return NextResponse.redirect(new URL("/error", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
