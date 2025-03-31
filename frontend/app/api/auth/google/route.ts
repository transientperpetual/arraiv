import axios from "axios";
import { headers, cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session_key = req.headers.get("Authorization");
  console.log("Session key ", session_key);

  const res = await axios.post(
    `${process.env.BACKEND}/exchange-token/`,
    {},
    {
      headers: {
        Authorization: `${session_key}`,
        "Content-Type": "application/json",
      },
      withCredentials: true,
    }
  );

  const tokens = res.data;

  const response = NextResponse.json(
    { message: "User login successful" },
    { status: 200 }
  );
  // // Set tokens as cookies
  response.cookies.set("arraiv_at", tokens.arraiv_at_src, {
    httpOnly: true,
    secure: true,
    sameSite: "none", // TODO : set to strict in prod?
    path: "/",
    maxAge: 900, // Expires in 15 minutes
  });

  response.cookies.set("arraiv_rt", tokens.arraiv_rt_src, {
    httpOnly: true,
    secure: true,
    sameSite: "none", // TODO : set to strict in prod?
    path: "/",
    maxAge: 604800, // Expires in 7 days
  });

  return response;
}
