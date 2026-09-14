import { usePortfolioStore } from "@/store/portfolioStore";
import type { ID, Project } from "@/types";

import { createId, delay } from "./storage";

export const projectService = {
  // TODO: GET /api/projects
  async list(): Promise<Project[]> {
    await delay(150);
    return usePortfolioStore.getState().projects;
  },

  // TODO: POST /api/projects
  async create(input: Omit<Project, "id" | "createdAt">): Promise<Project> {
    await delay();
    const project: Project = {
      ...input,
      id: createId("pr"),
      createdAt: new Date().toISOString().slice(0, 10),
    };
    usePortfolioStore.getState().addProject(project);
    return project;
  },

  // TODO: PUT /api/projects/:id
  async update(id: ID, patch: Partial<Project>): Promise<void> {
    await delay();
    usePortfolioStore.getState().updateProject(id, patch);
  },

  // TODO: DELETE /api/projects/:id
  async remove(id: ID): Promise<void> {
    await delay(200);
    usePortfolioStore.getState().removeProject(id);
  },
};
