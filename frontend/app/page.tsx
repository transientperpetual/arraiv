"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [user, setUser] = useState(null);

  const getUserInfo = async () => {
    try {
      // const response = await axios.get("/api/user")
      const response = await axios.get("/api/user", {
        withCredentials: true,
      });
      console.log("RESPONSE : ", response);
      // setUser(response.data.username)
    } catch (e) {
      console.log("Could not get user details", e);
    }
  };

  // if session_key is present in the URL then fetch auth cookies from backend
  useEffect(() => {

    getUserInfo();
  }, []);

  return (
    <div>
      <h1>Welcome to ARRAIV </h1>
      <a
        className="text-cyan-400 underline"
        href="https://www.notion.so/jangidankit/ARRAIV-18647100b75a807db003f2c9e01d58e7"
      >
        Progress
      </a>

      {/* <button onClick={handleLogout} >
        LOGOUT
      </button> */}
    </div>
  );
}
