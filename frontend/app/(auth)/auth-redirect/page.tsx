"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";

export default function AuthRedirect() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
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

      // get user details
      try {
        const response = await axios.get("/api/user", {
          withCredentials: true,
        });
        console.log("RESPONSE : ", response);
        setUser({
          id: response.data.id,
          email: response.data.email,
          first_name: response.data.first_name,
          health_device_status: response.data.health_device_status,
          date_joined: response.data.date_joined,
        });
      } catch (e) {
        console.log("Could not get user details", e);
      }
      // set user store

      // redirect to user page
      router.replace("/user/dashboard");
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
    // const csrf_token = urlParams.get("csrf");

    if (session_key) {
      handleGoogleToken(session_key);
    }
  }, []);
  return null;
}
