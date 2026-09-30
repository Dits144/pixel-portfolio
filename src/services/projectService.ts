import { initialPortfolioData } from "@/mock-data";
import { usePortfolioStore } from "@/store/portfolioStore";
import type { ID, Project } from "@/types";

export const projectService = {
  // GET /api/projects
  async list(): Promise<Project[]> {
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          usePortfolioStore.setState({ projects: data });
          return data;
        }
      }
    } catch {}

    const stored = usePortfolioStore.getState().projects;
    if (stored && stored.length > 0) return stored;
    return initialPortfolioData.projects || [];
  },

  // POST /api/projects
  async create(input: Omit<Project, "id" | "createdAt">): Promise<Project> {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, createdAt: new Date().toISOString().slice(0, 10) }),
      });
      if (res.ok) {
        const created = await res.json();
        usePortfolioStore.getState().addProject(created);
        return created;
      }
    } catch (err) {
      console.warn("Gagal POST /api/projects:", err);
    }

    const fallback: Project = {
      ...input,
      id: `pr-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    usePortfolioStore.getState().addProject(fallback);
    return fallback;
  },

  // PUT /api/projects/:id
  async update(id: ID, patch: Partial<Project>): Promise<void> {
    usePortfolioStore.getState().updateProject(id, patch);

    try {
      await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    } catch (err) {
      console.warn(`Gagal PUT /api/projects/${id}:`, err);
    }
  },

  // DELETE /api/projects/:id
  async remove(id: ID): Promise<void> {
    usePortfolioStore.getState().removeProject(id);

    try {
      await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn(`Gagal DELETE /api/projects/${id}:`, err);
    }
  },
};
