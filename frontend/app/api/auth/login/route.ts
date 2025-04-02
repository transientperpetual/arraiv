import { NextRequest, NextResponse } from "next/server";
import axios from 'axios'

export async function POST(req: NextRequest) {
  try {
    const { email, password} = await req.json();
     
      // Validate input 
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
      }
      
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/token/`, {email, password}, {withCredentials:true})
      // Extract tokens from the response
      const { arraiv_at_src, arraiv_rt_src } = res.data;

      if (!arraiv_at_src || !arraiv_rt_src) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }
      const tokens = res.data
      
    
    
    // Set httpOnly cookies in client
    const response = NextResponse.json(
      { message: "User login successful" },
      { status: 200 }
    );

    // Set tokens as cookies
    response.cookies.set("arraiv_at", arraiv_at_src, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // TODO : set to strict in prod?
      path: "/",
      maxAge: 900, // Expires in 15 minutes
    });
  
    response.cookies.set("arraiv_rt", arraiv_rt_src, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // TODO : set to strict in prod?
      path: "/",
      maxAge: 604800, // Expires in 7 days
    });
  
    return response;


  } catch (error) {
    return NextResponse.json({ error: "Could not login" }, { status: 500 });
  }
}