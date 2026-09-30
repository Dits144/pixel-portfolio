import { initialPortfolioData } from "@/mock-data";
import { usePortfolioStore } from "@/store/portfolioStore";
import type { Experience, ID } from "@/types";

export const experienceService = {
  // GET /api/experiences
  async list(): Promise<Experience[]> {
    try {
      const res = await fetch("/api/experiences", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          usePortfolioStore.setState({ experiences: data });
          return data;
        }
      }
    } catch {}

    const stored = usePortfolioStore.getState().experiences;
    if (stored && stored.length > 0) return stored;
    return initialPortfolioData.experiences || [];
  },

  // POST /api/experiences
  async create(input: Omit<Experience, "id">): Promise<Experience> {
    try {
      const res = await fetch("/api/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (res.ok) {
        const created = await res.json();
        usePortfolioStore.getState().addExperience(created);
        return created;
      }
    } catch (err) {
      console.warn("Gagal POST /api/experiences:", err);
    }

    const fallback: Experience = { ...input, id: `ex-${Date.now()}` };
    usePortfolioStore.getState().addExperience(fallback);
    return fallback;
  },

  // PUT /api/experiences/:id
  async update(id: ID, patch: Partial<Experience>): Promise<void> {
    usePortfolioStore.getState().updateExperience(id, patch);

    try {
      await fetch(`/api/experiences/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    } catch (err) {
      console.warn(`Gagal PUT /api/experiences/${id}:`, err);
    }
  },

  // DELETE /api/experiences/:id
  async remove(id: ID): Promise<void> {
    usePortfolioStore.getState().removeExperience(id);

    try {
      await fetch(`/api/experiences/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn(`Gagal DELETE /api/experiences/${id}:`, err);
    }
  },
};
