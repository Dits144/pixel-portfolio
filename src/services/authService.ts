import { MOCK_CREDENTIALS } from "@/mock-data";
import { useAuthStore } from "@/store/authStore";
import type { AuthUser } from "@/types";

import { delay } from "./storage";

export const authService = {
  // TODO: POST /api/auth/login — ganti pengecekan hardcode di bawah dengan respons backend
  async login(email: string, password: string): Promise<AuthUser> {
    await delay(700);
    if (email.trim().toLowerCase() !== MOCK_CREDENTIALS.email || password !== MOCK_CREDENTIALS.password) {
      throw new Error("Email atau password salah.");
    }
    const user: AuthUser = { email: MOCK_CREDENTIALS.email, name: MOCK_CREDENTIALS.name };
    useAuthStore.getState().setUser(user);
    return user;
  },

  // TODO: POST /api/auth/logout
  async logout(): Promise<void> {
    await delay(150);
    useAuthStore.getState().setUser(null);
  },
};
