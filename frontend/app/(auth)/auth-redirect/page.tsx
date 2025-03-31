"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"

export default function AuthRedirect() {

  const router = useRouter()
  // exchange session_key for auth cookies
  const handleGoogleToken = async (session_key: string) => {
    try {
      const res = await axios.post(
        "/api/auth/google/",
        {},
        {
          headers: {
            Authorization: `${session_key}`,
            // "X-CSRF-Token": csrf_token,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response : ", res.data);
      // redirect to user page

      router.replace("/")
    } catch (e: any) {
      if (e.response) {
        console.error(
          "Request error:",
          e.response.data.error,
          e.response.status
        );
      } else if (e.request) {
        console.error("No response from server. Check API or network.");
      } else {
        console.error("Unexpected error:", e.message);
      }
    }
  };

  
  // if session_key is present in the URL then fetch auth cookies from backend
  useEffect(() => {

    const urlParams = new URLSearchParams(window.location.search);
    const session_key = urlParams.get("session");
    const csrf_token = urlParams.get("csrf");

    if (session_key) {
      handleGoogleToken(session_key);
    }
  }, []);
  return null;
}
