import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers'
import axios from 'axios'

export async function GET(req:NextRequest) {
    try{
    const cookieStore = await cookies();
        const accessToken : any = cookieStore.get("arraiv_at")
        
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND}/user`,
        {   headers: {
            Cookie: `arraiv_at=${accessToken.value}`,
          }})
 
        return NextResponse.json(res.data, { status: res.status });
    } catch (e: any) {
      if (e.response) {
        return NextResponse.json(
          { error: e.response.data },
          { status: e.response.status }
        );
      }
  
      if (e.request) {
        return NextResponse.json(
          {
            error:
              "No response from the server. Please check your API or server status.",
          },
          { status: 500 }
        );
      }
  
      // Other unexpected errors
      return NextResponse.json(
        { error: "Unexpected error occurred." },
        { status: 500 }
      );
    }
  }
  