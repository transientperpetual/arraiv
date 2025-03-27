"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation';

export default function OTPVerificationPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState<string>("");
  const emailInParams = searchParams.get('email') || "";

  const handleSubmit = async () => {
    try {
      const body = {
        email: email,
        otp: otp,
      };
      const res = await axios.post("/api/auth/otp/", body);

      //redirect user to login, prefill the email (to avoid any further interactions on otp page)
      const queryParams = new URLSearchParams({ email }).toString();
			router.push(`/login?${queryParams}`);
      console.log("Response:", res.data, res.status);

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

  const handleResendOtp= async () => {
    try {
      const body = {
        email: email,
      };
      const res = await axios.post("/api/auth/resend-otp/", body);

      //redirect user to homepage (to avoid any further interactions on otp page)
      console.log("Response:", res.data, res.status);

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

  useEffect(()=>{
    emailInParams && setEmail(emailInParams)
  }, [])

  return (
    <>
    <div className="min-h-screen bg-gray-900 items-center flex flex-col justify-center">

      <h1>Please verfiy otp sent to your email</h1>
      <div className="p-8 flex flex-col rounded-sm bg-white shadow-md" >

      <label className="text-gray-600 text-sm pb-1">Email</label>
      <input
        className="bg-amber-50 text-gray-700 text-sm border-2 p-1 border-gray-400 rounded-sm"
        type="email"
        value={email}
        required
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        />
      <br/>
      <label className="text-gray-600 text-sm pb-1">OTP</label>
      <input
        className="bg-amber-50 text-gray-700 text-sm border-2 p-1 border-gray-400 rounded-sm"
        type="tel"
        value={otp}
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={6} // Restricts input to 6 digits
        required
        onChange={(e) => {
          const numericValue = e.target.value.replace(/\D/g, ""); // Remove non-numeric characters
          setOtp(numericValue);
        }}
        />
      <button
        className="border-2 text-gray-800 p-1 rounded-sm hover:bg-gray-800 hover:text-gray-100"
        type="submit"
        onClick={handleSubmit}
        >
        Submit
      </button>

      <button
        className="border-2 text-gray-800 p-1 rounded-sm hover:bg-gray-800 hover:text-gray-100"
        type="submit"
        onClick={handleResendOtp}
        >
        Resend OTP
      </button>

        </div>
        </div>
    </>
  );
}
