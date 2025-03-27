import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await axios.post(`${process.env.BACKEND}resend-otp/`, body);
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
