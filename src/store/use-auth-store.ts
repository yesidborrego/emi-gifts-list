import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  adminName: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => void;
  signOut: () => Promise<void>;
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
      adminName: user?.user_metadata?.name || null,
      isLoading: false,
    }),
  signIn: (email, password) => {
    set({ isLoading: true });
    // TODO: Eliminar el siguiente código cuando se implemente Supabase
    // const adminName = email.split("@")[0];
    const adminName = "Geo";
    set({
      user: { id: "admin-id", email: email } as User,
      session: { access_token: "mock-token" } as Session,
      adminName,
      isLoading: false,
    });
  },
  signOut: async () => {
    set({ isLoading: true });
    await supabase.auth.signOut();
    set({ user: null, session: null, adminName: null, isLoading: false });
  },
}));

// Initialize the store with the session from Supabase
/* supabase.auth.getSession().then(({ data: { session } }) => {
  useAuthStore.getState().setUser(session?.user ?? null, session);
});

supabase.auth.onAuthStateChange((_event, session) => {
  useAuthStore.getState().setUser(session?.user ?? null, session);
}); */
