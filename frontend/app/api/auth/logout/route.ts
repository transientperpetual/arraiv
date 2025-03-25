import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Send logout request to Django backend
    const res = await fetch(`${process.env.BACKEND}/users/logout/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    // Get response from Django
    const data = await res.json();
    console.log("Response for django : ", data)

    if (!res.ok) {
      return NextResponse.json({ error: data.non_field_errors || "Couldn't log out" }, { status: res.status });
    }

    // Return success response
    return NextResponse.json({ message: "Logout successful" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Could not logout" }, { status: 500 });
  }
}