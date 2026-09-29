import { radityaDB } from "@/lib/database";
import { initialPortfolioData } from "@/mock-data";
import { usePortfolioStore } from "@/store/portfolioStore";
import type { ID, Skill } from "@/types";

import { createId, delay } from "./storage";

export const skillService = {
  // GET /api/skills
  async list(): Promise<Skill[]> {
    await delay(80);
    // Prioritaskan dari Database IndexedDB
    try {
      const fromDB = await radityaDB.getAll<Skill>("skills");
      if (fromDB && fromDB.length > 0) {
        usePortfolioStore.setState({ skills: fromDB });
        return fromDB;
      }
    } catch (e) {
      console.warn("DB read error for skills:", e);
    }

    const stored = usePortfolioStore.getState().skills;
    if (stored && stored.length > 0) return stored;
    return initialPortfolioData.skills || [];
  },

  // POST /api/skills
  async create(input: Omit<Skill, "id">): Promise<Skill> {
    await delay(120);
    const skill: Skill = { ...input, id: createId("sk") };
    usePortfolioStore.getState().addSkill(skill);
    await radityaDB.put("skills", skill);
    return skill;
  },

  // PUT /api/skills/:id
  async update(id: ID, patch: Partial<Skill>): Promise<void> {
    await delay(120);
    usePortfolioStore.getState().updateSkill(id, patch);
    const current = usePortfolioStore.getState().skills.find((s) => s.id === id);
    if (current) {
      await radityaDB.put("skills", current);
    }
  },

  // DELETE /api/skills/:id
  async remove(id: ID): Promise<void> {
    await delay(120);
    usePortfolioStore.getState().removeSkill(id);
    await radityaDB.delete("skills", id);
  },
};
