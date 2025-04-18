import { useUserStore } from "@/stores/userStore";

export const clearAllStores = () => {
  useUserStore.getState().clearUser();
  // useGarminStore.getState().setHeartRate(null)
};
