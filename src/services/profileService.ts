import { usePortfolioStore } from "@/store/portfolioStore";
import type { Profile } from "@/types";

import { delay } from "./storage";

export const profileService = {
  // TODO: GET /api/profile
  async get(): Promise<Profile> {
    await delay(150);
    return usePortfolioStore.getState().profile;
  },

  // TODO: PUT /api/profile
  async update(profile: Profile): Promise<Profile> {
    await delay();
    usePortfolioStore.getState().setProfile(profile);
    return profile;
  },
};
