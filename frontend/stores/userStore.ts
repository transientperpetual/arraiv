import { create } from "zustand";
import { persist } from "zustand/middleware";

type ArraivUser = {
  id: string;
  email: string;
  first_name: string;
  health_device_status: string;
  date_joined: string;
};

type UserState = {
  user: ArraivUser | null;
  setUser: (user: ArraivUser) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "arraiv-user-store",
    }
  )
);
