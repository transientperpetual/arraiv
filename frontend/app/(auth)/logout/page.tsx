"use client"

import { useEffect, useState } from "react";

export default function LogoutPage() {

    type User = { username: string }

    const [user, setUser] = useState<User | null | Response | any>(null)

    const handleLogout = async () => {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
        });
        const data = await res.json()
        if (res.ok) {
            window.location.href = "/"; // Redirect to user journey
        } else {
            console.log("Login failed", data);
        }
    }

    useEffect(()=>{
        const getUserInfo = async () => {
            const userDetails = await fetch("/api/user-info", {
                method: "GET",
            });
            const data = await userDetails.json()
            if (userDetails.ok) {
                // window.location.href = "/"; // Redirect to user journey
                console.log("User data", data);
                setUser(userDetails)
            } else {
                console.log("Could not get user", data);
            }
        }

        getUserInfo()
    }, [])

    return (
        <>
            <div>
                { user ? <h1> Hi, {user.username}</h1> : <h1>Please Login</h1>}
                <button onClick={handleLogout} >LOGOUT</button>
            </div>
        </>
    )

};
