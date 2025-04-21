import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken: any = cookieStore.get("arraiv_at");
    if (!accessToken) {
      console.log("No access token found");
      //   redirect to refresh with url in params
    }
    const { email, password } = await req.json();
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND}/device/register/garmin/`,
      { email, password },
      {
        headers: {
          Cookie: `arraiv_at=${accessToken.value}`,
        },
      }
    );

    // set health_device_status to added

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
