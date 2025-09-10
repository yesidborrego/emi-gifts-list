import { create } from 'zustand';

interface GuestState {
  guestName: string | null;
  setGuestName: (name: string) => void;
  clearGuestName: () => void;
}

export const useGuestStore = create<GuestState>((set) => ({
  guestName: null,
  setGuestName: (name) => set({ guestName: name }),
  clearGuestName: () => set({ guestName: null }),
}));
