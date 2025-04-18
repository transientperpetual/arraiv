"use client";
import { useUserStore } from "@/stores/userStore";

export default function Dashboard() {
  const user = useUserStore((state) => state.user);

  // check if user's health device status

  return (
    <div>
      <h1 className="text-amber-50">
        Welcome to ARRAIV Dashboard {user?.first_name}
      </h1>
    </div>
  );
}
