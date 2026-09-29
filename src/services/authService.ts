import { MOCK_CREDENTIALS } from "@/mock-data";
import { useAuthStore } from "@/store/authStore";
import type { AuthUser } from "@/types";

import { delay } from "./storage";

export const authService = {
  // POST /api/auth/login
  async login(email: string, password: string): Promise<AuthUser> {
    await delay(300);
    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== "dits144@gmail.com" || password !== "Ditsanalah144") {
      throw new Error("Email atau kata sandi tidak valid.");
    }

    const user: AuthUser = {
      email: normalizedEmail,
      name: "Muhammad Raditya Anwar",
    };
    useAuthStore.getState().setUser(user);
    return user;
  },

  // POST /api/auth/logout
  async logout(): Promise<void> {
    await delay(150);
    useAuthStore.getState().setUser(null);
  },
};
