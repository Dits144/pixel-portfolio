import { usePortfolioStore } from "@/store/portfolioStore";
import type { Experience, ID } from "@/types";

import { createId, delay } from "./storage";

export const experienceService = {
  // TODO: GET /api/experiences
  async list(): Promise<Experience[]> {
    await delay(150);
    return usePortfolioStore.getState().experiences;
  },

  // TODO: POST /api/experiences
  async create(input: Omit<Experience, "id">): Promise<Experience> {
    await delay();
    const experience: Experience = { ...input, id: createId("ex") };
    usePortfolioStore.getState().addExperience(experience);
    return experience;
  },

  // TODO: PUT /api/experiences/:id
  async update(id: ID, patch: Partial<Experience>): Promise<void> {
    await delay();
    usePortfolioStore.getState().updateExperience(id, patch);
  },

  // TODO: DELETE /api/experiences/:id
  async remove(id: ID): Promise<void> {
    await delay(200);
    usePortfolioStore.getState().removeExperience(id);
  },
};
