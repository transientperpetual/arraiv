"use client"

import { useEffect, useState } from "react";
import axios from "axios"

export default function Home() {

  const [user, setUser] = useState(null)

  useEffect(()=>{
    const getUserInfo = async () => {
      try {
        // const response = await axios.get("/api/user")
        const response = await axios.get("/api/user", {withCredentials: true})
        console.log("RESPONSE : ", response)
        // setUser(response.data.username)
      }
      catch (e) {
        console.log("Could not get user details", e)
      }

    //   try {
    //     const response = await axios.get(`http://127.0.0.1:8000/api/users/user-info/`, {withCredentials: true})
    //     console.log("LOGGED IN USER : ", response.data)
    //     return response.data;
    //   }
    //     catch (e) {
    //     throw new Error("User details fetch failed")
    // }
      
    }

    getUserInfo()
  },[])
  return (
    <div>
      <h1>Welcome to ARRAIV </h1>
      <a className="text-cyan-400 underline" href="https://www.notion.so/jangidankit/ARRAIV-18647100b75a807db003f2c9e01d58e7">Progress</a>
    </div>
  );
}
