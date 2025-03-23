import { NextRequest, NextResponse } from 'next/server';

const DJANGO_BACKEND_URL = "http://localhost:8000/api/users/register/";

export async function POST(req: NextRequest) {
  try {
    console.log("REGISTER API CALLED")
    const body = await req.json();
    console.log("Email : ", body);
    // Forward the request to Django
    const res = await fetch(DJANGO_BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include", // Ensure Django sets HttpOnly cookie
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error || "Registration failed" }, { status: res.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
