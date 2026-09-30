import { radityaDB } from "@/lib/database";
import { initialPortfolioData } from "@/mock-data";
import { usePortfolioStore } from "@/store/portfolioStore";
import type { ID, Skill } from "@/types";

export const skillService = {
  // GET /api/skills
  async list(): Promise<Skill[]> {
    try {
      const res = await fetch("/api/skills", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          usePortfolioStore.setState({ skills: data });
          return data;
        }
      }
    } catch {
      // Fallback jika offline/gagal
    }

    // Fallback ke IndexedDB atau Store
    try {
      const fromDB = await radityaDB.getAll<Skill>("skills");
      if (fromDB && fromDB.length > 0) {
        usePortfolioStore.setState({ skills: fromDB });
        return fromDB;
      }
    } catch {}

    const stored = usePortfolioStore.getState().skills;
    if (stored && stored.length > 0) return stored;
    return initialPortfolioData.skills || [];
  },

  // POST /api/skills
  async create(input: Omit<Skill, "id">): Promise<Skill> {
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (res.ok) {
        const created = await res.json();
        usePortfolioStore.getState().addSkill(created);
        radityaDB.put("skills", created).catch(() => {});
        return created;
      }
    } catch (err) {
      console.warn("Gagal POST /api/skills:", err);
    }

    // Client-side fallback
    const fallbackId = `sk-${Date.now()}`;
    const fallbackSkill: Skill = { ...input, id: fallbackId };
    usePortfolioStore.getState().addSkill(fallbackSkill);
    radityaDB.put("skills", fallbackSkill).catch(() => {});
    return fallbackSkill;
  },

  // PUT /api/skills/:id
  async update(id: ID, patch: Partial<Skill>): Promise<void> {
    usePortfolioStore.getState().updateSkill(id, patch);
    const current = usePortfolioStore.getState().skills.find((s) => s.id === id);
    if (current) {
      radityaDB.put("skills", current).catch(() => {});
    }

    try {
      await fetch(`/api/skills/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    } catch (err) {
      console.warn(`Gagal PUT /api/skills/${id}:`, err);
    }
  },

  // DELETE /api/skills/:id
  async remove(id: ID): Promise<void> {
    usePortfolioStore.getState().removeSkill(id);
    radityaDB.delete("skills", id).catch(() => {});

    try {
      await fetch(`/api/skills/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn(`Gagal DELETE /api/skills/${id}:`, err);
    }
  },
};
