import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
    try {

    const cookieStore = await cookies();
    const refreshToken: any = cookieStore.get("arraiv_rt");

    
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND}/token/refresh/`,
      { "refresh": refreshToken.value },
      { withCredentials: true } 
    );

    const { access, refresh } = res.data;

    if (!access || !refresh) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Set httpOnly cookies in client
    cookieStore.set("arraiv_at", access, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // TODO : set to strict in prod?
      path: "/",
      maxAge: 900, // Expires in 15 minutes
    });

    cookieStore.set("arraiv_rt", refresh, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // TODO : set to strict in prod?
      path: "/",
      maxAge: 604800, // Expires in 7 days
    });

    // Send response to client
    return NextResponse.json(
      { message: "Auth refreshed for user" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Could not refresh auth" }, { status: 500 });
  }
}
