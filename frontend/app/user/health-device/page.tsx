"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Image from "next/image";
import garmin from "@/public//logo/garmin.png";
import { useUserStore } from "@/stores/userStore";

export default function HealthDevice() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "/api/auth/garmin",
        { email, password },
        { withCredentials: true }
      );
      // mark user's health device status in local store
      setUser({ health_device_status: "linked" });
      router.push("/user/dashboard");
    } catch (e: any) {
      console.log("Err syncing garmin : ", e.response.data.error.detail);
      if (
        e.response.data.error.detail ==
        "User already has a Garmin device linked."
      ) {
        router.replace("/user/dashboard");
      }
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-3 bg-background h-[640px] w-[378px] rounded-sm items-center">
      <div className="pt-29 pb-19">
        <Image src={garmin} width={180} alt="arraiv logo" />
        <div className="text-xs text-end text-black-secondary font-light">
          More integrations coming soon..
        </div>
      </div>

      <div className="px-12 w-full">
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="px-12 w-full">
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="text-xs text-end text-black-secondary font-light hover:font-medium cursor-pointer">
        Read terms & conditions
      </div>

      <div className="mt-4 px-12 w-full">
        <Button variant="primary" onClick={handleSubmit}>
          Sync Garmin
        </Button>
      </div>
      {loading && (
        <div className="text-xs text-end text-black-secondary font-light">
          Getting your garmin details..
        </div>
      )}
    </div>
  );
}
