import { usePortfolioStore } from "@/store/portfolioStore";
import type { ID, Skill } from "@/types";

import { createId, delay } from "./storage";

export const skillService = {
  // TODO: GET /api/skills
  async list(): Promise<Skill[]> {
    await delay(150);
    return usePortfolioStore.getState().skills;
  },

  // TODO: POST /api/skills
  async create(input: Omit<Skill, "id">): Promise<Skill> {
    await delay();
    const skill: Skill = { ...input, id: createId("sk") };
    usePortfolioStore.getState().addSkill(skill);
    return skill;
  },

  // TODO: PUT /api/skills/:id
  async update(id: ID, patch: Partial<Skill>): Promise<void> {
    await delay();
    usePortfolioStore.getState().updateSkill(id, patch);
  },

  // TODO: DELETE /api/skills/:id
  async remove(id: ID): Promise<void> {
    await delay(200);
    usePortfolioStore.getState().removeSkill(id);
  },
};
