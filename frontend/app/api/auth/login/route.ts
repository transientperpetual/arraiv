import { NextRequest, NextResponse } from "next/server";
import axios from 'axios'
import { headers, cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password, arraiv_at_src, arraiv_rt_src} = await req.json();
    console.log("TOKEN GOOGLE : ", arraiv_at_src)

    if (arraiv_at_src) {
      console.log("TOKEN GOOGLE : ", arraiv_at_src)
    }
      
     else {

      //TODO : handle this on page.tsx
      // Validate input 
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
      }
      
      const res = await axios.post(`${process.env.BACKEND}/token/`, {email, password})
      // Extract tokens from the response
      const { arraiv_at_src, arraiv_rt_src } = res.data;
      
      if (!arraiv_at_src || !arraiv_rt_src) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
    }
      
    // console.log("res: ", res)
    
    // Set httpOnly cookies in client
    const cookieStore = await cookies();
    cookieStore.set('arraiv_at', arraiv_at_src, {
      httpOnly: true,
      secure:true, 
      sameSite: "none", // TODO : set to strict in prod?
      path: "/",
      maxAge: 900, // Expires in 15 minutes
    });

    cookieStore.set('arraiv_rt', arraiv_rt_src, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // TODO : set to strict in prod?
      path: "/",
      maxAge: 604800, // Expires in 7 days
    });

    // Send response to client
    return NextResponse.json({message: "User logged in successfully"}, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: "Could not login" }, { status: 500 });
  }
}