
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = {
            "email": "ajangid663@gmail.com",
            "otp": "635457"
        };

        const res = await axios.post(`http://127.0.0.1:8000/api/verify-otp/`, body);

        return NextResponse.json(res.data, { status: res.status });
    } catch (error: any) {
        console.error("Axios Error:", error);

        if (error.response) {
            // Axios received a response (4xx or 5xx)
            console.error("Error Response Data:", error.response.data);
            console.error("Status Code:", error.response.status);

            return NextResponse.json(
                { error: error.response.data },
                { status: error.response.status }
            );
        } else if (error.request) {
            // No response received (network error, CORS, server down)
            console.error("No Response from Server:", error.request);

            return NextResponse.json(
                { error: "No response from server. Check your API." },
                { status: 500 }
            );
        } else {
            // Other Axios errors
            console.error("Unexpected Error:", error.message);

            return NextResponse.json(
                { error: "Unexpected error occurred." },
                { status: 500 }
            );
        }
    }
}
