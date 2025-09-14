import { create } from "zustand";
import { persist } from "zustand/middleware";
import { secureStorage } from "./storage";

interface GuestState {
  guestName: string | null;
  visitorId: number | null;
  isLoading: boolean;
  setGuestName: (name: string) => void;
  setVisitorId: (id: number) => void;
  clearGuestName: () => void;
  setIsLoading: (loading: boolean) => void;
}

export const useGuestStore = create(
  persist<GuestState>(
    (set) => ({
      guestName: null,
      visitorId: null,
      isLoading: true,
      setGuestName: (name) => set({ guestName: name, isLoading: false }),
      setVisitorId: (id) => set({ visitorId: id }),
      clearGuestName: () =>
        set({ guestName: null, visitorId: null, isLoading: false }),
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "guest-storage",
      storage: secureStorage(),
      onRehydrateStorage: () => () => {
        useGuestStore.setState({ isLoading: false });
      },
    }
  )
);
