"use client";

import { clearAllStores } from "@/components/ui/utils/clearAllStores";
import { useUserStore } from "@/stores/userStore";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const handleLogout = async () => {
    try {
      const res = await axios.get("/api/auth/logout", {
        withCredentials: true,
      });

      // clear user store
      clearAllStores();
      router.push("/login");
      console.log("Logout response : ", res);
    } catch (e) {
      clearAllStores();
      router.push("/login");
      console.log("Err logging out : ", e);
    }
  };

  return (
    <>
      <div>
        {user ? (
          <h1 className="text-amber-50"> Hi, {user?.first_name}</h1>
        ) : (
          <h1>Please Login</h1>
        )}
        <button
          className="py-2 px-6 bg-amber-600 rounded-md "
          onClick={handleLogout}
        >
          LOGOUT
        </button>
      </div>
    </>
  );
}
