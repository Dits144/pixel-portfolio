import { radityaDB } from "@/lib/database";
import { usePortfolioStore } from "@/store/portfolioStore";
import type { Profile } from "@/types";

export const profileService = {
  // GET /api/profile
  async get(): Promise<Profile> {
    try {
      const res = await fetch("/api/profile", { cache: "no-store" });
      if (res.ok) {
        const prof = await res.json();
        if (prof && prof.name) {
          usePortfolioStore.getState().setProfile(prof);
          return prof;
        }
      }
    } catch {}

    // Fallback ke IndexedDB atau Store
    try {
      const stored = await radityaDB.getAll<{ id: string } & Profile>("profile");
      const first = stored[0];
      if (first) {
        const { id: _id, ...prof } = first;
        usePortfolioStore.getState().setProfile(prof as Profile);
        return prof as Profile;
      }
    } catch {}

    return usePortfolioStore.getState().profile;
  },

  // PUT /api/profile
  async update(profile: Profile): Promise<Profile> {
    usePortfolioStore.getState().setProfile(profile);
    radityaDB.put("profile", { id: "main", ...profile }).catch(() => {});

    try {
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
    } catch (e) {
      console.error("Gagal update profile ke server API:", e);
    }

    return profile;
  },
};
