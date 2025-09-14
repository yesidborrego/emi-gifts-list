import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, Session } from "@/lib/types";
import { secureStorage } from "./storage";

export interface AuthState {
  user: User | null;
  session: Session | null;
  adminName: string | null;
  isLoading: boolean;
  signIn: (user: User, session: Session) => void;
  signOut: () => void;
  setUser: (user: User | null, session: Session | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      adminName: null,
      isLoading: true,
      setUser: (user, session) =>
        set({
          user,
          session,
          adminName: user?.name || null,
        }),
      signIn: (user, session) => {
        set({
          user,
          session,
          adminName: user.name,
        });
      },
      signOut: () => {
        set({ user: null, session: null, adminName: null });
      },
    }),
    {
      name: "auth-storage",
      storage: secureStorage(),
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(
            ([key]) => !["isLoading", "actions"].includes(key)
          )
        ),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isLoading = false;
        }
      },
    }
  )
);
