import { MOCK_CREDENTIALS } from "@/mock-data";
import { useAuthStore } from "@/store/authStore";
import type { AuthUser } from "@/types";

import { delay } from "./storage";

export const authService = {
  // POST /api/auth/login
  async login(email: string, password: string): Promise<AuthUser> {
    await delay(300);
    const normalizedEmail = email.trim().toLowerCase();
    const validEmails = [
      MOCK_CREDENTIALS.email.toLowerCase(),
      "dits144@gmail.com",
      "admin@raditya.tech",
    ];

    // Mengizinkan email dits144@gmail.com atau admin@portfolio.dev, atau password demo
    if (
      !validEmails.includes(normalizedEmail) &&
      password !== MOCK_CREDENTIALS.password &&
      password !== "admin123"
    ) {
      throw new Error(
        "Email atau password belum terdaftar. Silakan gunakan dits144@gmail.com atau admin@portfolio.dev dengan password admin123"
      );
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
