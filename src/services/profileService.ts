import { radityaDB } from "@/lib/database";
import { usePortfolioStore } from "@/store/portfolioStore";
import type { Profile } from "@/types";

import { delay } from "./storage";

export const profileService = {
  // TODO: GET /api/profile
  async get(): Promise<Profile> {
    await delay(150);
    // Prioritaskan dari radityaDB jika ada
    try {
      const stored = await radityaDB.getAll<{ id: string } & Profile>("profile");
      const first = stored[0];
      if (first) {
        const { id: _id, ...prof } = first;
        usePortfolioStore.getState().setProfile(prof as Profile);
        return prof as Profile;
      }
    } catch (e) {
      console.warn("Gagal load profile dari IndexedDB, fallback ke store:", e);
    }
    return usePortfolioStore.getState().profile;
  },

  // TODO: PUT /api/profile
  async update(profile: Profile): Promise<Profile> {
    await delay();
    // 1. Simpan ke memory store untuk UI reaktif instan
    usePortfolioStore.getState().setProfile(profile);
    
    // 2. Simpan ke IndexedDB (mendukung berkas Base64 gigantik tanpa batasan kuota localStorage)
    try {
      await radityaDB.put("profile", { id: "main", ...profile });
    } catch (e) {
      console.error("Gagal simpan profile ke IndexedDB:", e);
    }
    
    return profile;
  },
};
