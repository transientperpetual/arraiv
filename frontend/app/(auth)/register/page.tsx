"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Image from "next/image";
import logo_slogan from "@/public/logo_slogan.png";

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
    window.location.href = `${process.env.NEXT_PUBLIC_BACKEND}/google/login/`;
  };

  return (
    <div className="flex flex-col gap-3 bg-background h-[640px] w-[378px] rounded-sm items-center">
      <div className="pt-12 pb-8">
        <Image src={logo_slogan} width={180} alt="arraiv logo" />
      </div>

      <div className="px-12 w-full">
        <Input
          placeholder="First name"
          type="name"
          value={first_name}
          onChange={(e) => setFirstname(e.target.value)}
        />
      </div>

      <div className="px-12 w-full">
        <Input
          placeholder="Username"
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="px-12 w-full">
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="px-12 w-full mb-6">
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="px-12 w-full">
        <Button variant="primary" onClick={handleRegister}>
          Register
        </Button>
      </div>

      <div className="text-sm font-light text-black-secondary">or</div>

      <div className="px-12 w-full">
        <Button variant="primary" onClick={handleGoogleAuth}>
          <div className="flex flex-row  items-center justify-evenly">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 256 265"
              >
                <path
                  fill="#4285F4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                />
                <path
                  fill="#34A853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                />
                <path
                  fill="#FBBC05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                />
                <path
                  fill="#EB4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                />
              </svg>
            </div>
            <div className="text-sm text-white-primary">
              Sign in with Google
            </div>
          </div>
        </Button>
      </div>

      <div className="mt-4">
        <div className="text-xs mb-1 font-light text-black-secondary">
          Already have an account?
        </div>

        <div className="">
          <Button onClick={handleLogin} variant="tertiary">
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
