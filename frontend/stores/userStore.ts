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
  setUser: (user: Partial<ArraivUser>) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (userPartial) =>
        set({
          user: {
            ...get().user,   // keep existing values
            ...userPartial, // override only what's passed
          } as ArraivUser,
        }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "arraiv-user-store",
    }
  )
);
