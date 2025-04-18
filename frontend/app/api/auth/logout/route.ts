import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function GET() {
  try {
    // Send logout request to Django backend
    console.log("Logging out from Django backend");
    const cookieStore = await cookies();
    const refreshToken: any = cookieStore.get("arraiv_rt");

    // Blacklist the refresh token
    const res: any = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND}/logout`,
      {
        headers: {
          Cookie: `arraiv_rt=${refreshToken.value}`,
        },
        withCredentials: true,
      }
    );

    console.log("Logout response from backend:", res.data);

    // Clear the cookies
    const response = NextResponse.json(
      { message: "User logged out" },
      { status: 200 }
    );

    response.cookies.set("arraiv_at", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 0, // Expire immediately
    });

    response.cookies.set("arraiv_rt", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 0, // Expire immediately
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Could not logout" }, { status: 500 });
  }
}
