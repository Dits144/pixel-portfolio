import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthUser } from "@/types";

interface AuthState {
  user: AuthUser | null;
  hydrated: boolean;
  setUser: (user: AuthUser | null) => void;
  setHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hydrated: false,
      setUser: (user) => set({ user }),
      setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: "portfolio-auth-v1",
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
      partialize: ({ user }) => ({ user }),
    },
  ),
);
