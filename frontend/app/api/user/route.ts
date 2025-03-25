import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers'
import axios from 'axios'

export async function GET(req:NextRequest) {
    try{
        //TODO  : need not send the toke back in a cookie
        const accessToken = req.cookies.get("arraiv_at")
        console.log("BODY : ", accessToken)
        const backendResponse = await axios.get(`${process.env.Backend}/users/user-info/`, { headers: {
            Authorization: `Bearer ${accessToken}`, // Send token in Authorization header
        }, 
        withCredentials: true})
 
        return NextResponse.json(backendResponse.data);
    }

    catch (e) {
        return NextResponse.json({ error: "Could not get data" }, { status: 500 });
    }
}