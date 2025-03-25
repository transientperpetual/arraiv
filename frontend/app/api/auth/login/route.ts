import { NextRequest, NextResponse } from "next/server";
import axios from 'axios'
import { headers, cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    //TODO : handle this on page.tsx
    // Validate input 
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Send login request to Django backend

    const backendResponse = await axios.post(`${process.env.BACKEND}/users/login/`, {email, password})

    // Extract tokens from the response
    const { arraiv_at_src, arraiv_rt_src } = backendResponse.data;

    if (!arraiv_at_src || !arraiv_rt_src) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    
    const cookieStore = await cookies();
    cookieStore.set('arraiv_at', arraiv_at_src, {
      httpOnly: true,
      secure:true, 
      sameSite: "none", // TODO : set to strict in prod?
      path: "/",
      maxAge: 60 * 60, // Expires in one hour
    });

    cookieStore.set('arraiv_rt', arraiv_rt_src, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // TODO : set to strict in prod?
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // Expires in 30 days
    });

    // Send response to client
    return NextResponse.json(backendResponse.data.user, { status: backendResponse.status });

  } catch (error) {
    return NextResponse.json({ error: "Could not login" }, { status: 500 });
  }
}