"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [first_name, setFirstname] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (first_name === "" || email === "" || password === "") {
      return;
    }

    try {
      const res = await axios.post("/api/auth/register/", {
        first_name,
        email,
        password,
      });

      console.log("Response : ", res.data);
      //TODO - verify otp, redirect to otp verification page.
      const queryParams = new URLSearchParams({ email }).toString();
      router.push(`/verify-otp?${queryParams}`);
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

  const handleLogin = () => {
    router.push("/login");
  };

  // redirect to google login url
  const handleGoogleAuth = () => {
    window.location.href = `http://127.0.0.1:8000/api/google/login/`;
  };

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
      // redirect
      router.push("/");
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

  return (
    <div className="min-h-screen bg-gray-900 items-center flex flex-col justify-center">
      <form
        onSubmit={handleRegister}
        className="p-8 flex flex-col rounded-sm bg-white shadow-md"
      >
        <label className="text-gray-600 text-sm pb-1">First name</label>
        <input
          className="text-gray-700 text-sm border-2 p-1 border-gray-400 rounded-sm"
          type="text"
          value={first_name}
          required
          onChange={(e) => {
            setFirstname(e.target.value);
          }}
        />
        <br />

        {/* <label className="text-gray-600 text-sm pb-1">Username</label>
				<input
					className="text-gray-700 text-sm border-2 p-1 border-gray-400 rounded-sm"
					type="text"
					value={username}
					required
					onChange={(e) => {
						setUsername(e.target.value);
					}}
				/>
				<br /> */}
        <label className="text-gray-600 text-sm pb-1">Email</label>
        <input
          className="text-gray-700 text-sm border-2 p-1 border-gray-400 rounded-sm"
          type="email"
          value={email}
          required
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <br />

        <label className="text-gray-600 text-sm pb-1">Password</label>
        <input
          className="text-gray-700 text-sm border-2 p-1 border-gray-400 rounded-sm"
          type="password"
          value={password}
          required
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <br />
        <button
          className="border-2 text-gray-800 p-1 rounded-sm hover:bg-gray-800 hover:text-gray-100"
          type="submit"
        >
          REGISTER 🥳
        </button>

        <button
          onClick={handleGoogleAuth}
          className="border-2 text-gray-800 p-1 rounded-sm hover:bg-gray-800 hover:text-gray-100"
        >
          Sign Up with Google
        </button>
        <p>Already have an account?</p>
        <button
          onClick={handleLogin}
          className="border-2 text-gray-800 p-1 rounded-sm hover:bg-gray-800 hover:text-gray-100"
        >
          LOGIN
        </button>
      </form>
    </div>
  );
}
