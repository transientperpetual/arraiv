"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function FetchTokenPairPage() {
  const router = useRouter();

  useEffect(() => {
    const fetchTokenPair = async () => {
      try {
        // Exchange refresh token for new access token
        const res = await axios.get("/api/auth/refresh");
       
        router.replace("/");
      } catch (error) {
        console.error("Could not refresh user session", error);
        // Redirect to login if refresh fails
        router.replace("/login");
      }
    };

    fetchTokenPair();
  }, [router]); // ✅ Add `router` as a dependency to avoid potential issues

  return null;
}
