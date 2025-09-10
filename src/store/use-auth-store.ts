import { create } from "zustand";
import { User, Session } from "@/lib/types";

interface AuthState {
  user: User | null;
  session: Session | null;
  adminName: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  setUser: (user: User | null, session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  adminName: null,
  isLoading: false,
  setUser: (user, session) =>
    set({
      user,
      session,
      adminName: user?.nombre || null,
      isLoading: false,
    }),
  signIn: (email, password) => {
    set({ isLoading: true });
    const adminName = "Geo";
    set({
      user: { id: "admin-id", email: email },
      session: {
        access_token: "mock-token",
        user: { id: "admin-id", email: email },
      },
      adminName,
      isLoading: false,
    });
  },
  signOut: () => {
    set({ user: null, session: null, adminName: null, isLoading: false });
  },
}));
