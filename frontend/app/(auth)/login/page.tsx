"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const emailInParams = searchParams.get("email") || "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      //TODO: check if user is already logged in? check this by finding presence of access_token if yes then use it to login, if no find refresh
      // if found use it to get a access token if no the proceed to fetch new token pair
      //TODO add session refresh via middleware.
      const res = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      //TODO:
      //if user otp is not verified then refirect them to otp verification page with email prefilled.
      // if (true){
      // 	const queryParams = new URLSearchParams({ email }).toString();
      // 	router.push(`/verify-otp?${queryParams}`);
      // }
      console.log("Response : ", res);
      router.push("/");
    } catch (e) {
      console.log("Err logging in : ", e);
      //   router.push("/");
      // if otp is not verified then redirect to otp verify page
      // if email is not registered then redirect to register page
    }
  };

    // redirect to google login url
    const handleGoogleAuth = () => {
      window.location.href = `${process.env.NEXT_PUBLIC_BACKEND}/google/login/`;
    };

    // redirect to register page
    const handleRegister = () => {
      router.push("/register");
    };

  useEffect(() => {
    emailInParams && setEmail(emailInParams);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 items-center flex flex-col justify-center">
      <form
        onSubmit={handleSubmit}
        className="p-8 flex flex-col rounded-sm bg-white shadow-md"
      >
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
          Login
        </button>

        <button
          onClick={handleGoogleAuth}
          className="border-2 text-gray-800 p-1 rounded-sm hover:bg-gray-800 hover:text-gray-100"
        >
          Sign In with Google
        </button>
        <p>Already have an account?</p>
        <button
          onClick={handleRegister}
          className="border-2 text-gray-800 p-1 rounded-sm hover:bg-gray-800 hover:text-gray-100"
        >
          REGISTER
        </button>
      </form>
    </div>
  );
}
