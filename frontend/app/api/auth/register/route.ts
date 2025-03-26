import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("REQ REACHED HERE: ", body)
    const backendResponse = await axios.post(`${process.env.BACKEND}test/` )

    return NextResponse.json(backendResponse.data, {status: backendResponse.status})

  } catch (e) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
