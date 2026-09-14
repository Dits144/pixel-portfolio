import { create } from "zustand";
import { persist } from "zustand/middleware";

import { initialPortfolioData } from "@/mock-data";
import type {
  Article,
  CoverLetter,
  Experience,
  ID,
  Message,
  PortfolioData,
  Profile,
  Project,
  Skill,
  Testimonial,
} from "@/types";

/**
 * Global store (simulasi database) — dipersist ke localStorage.
 * Komponen UI TIDAK memanggil store ini langsung untuk mutasi;
 * gunakan layer service di src/services/* agar mudah diganti ke REST API.
 */
interface PortfolioState extends PortfolioData {
  hydrated: boolean;
  setHydrated: (v: boolean) => void;

  setProfile: (profile: Profile) => void;

  addSkill: (skill: Skill) => void;
  updateSkill: (id: ID, patch: Partial<Skill>) => void;
  removeSkill: (id: ID) => void;

  addProject: (project: Project) => void;
  updateProject: (id: ID, patch: Partial<Project>) => void;
  removeProject: (id: ID) => void;

  addExperience: (experience: Experience) => void;
  updateExperience: (id: ID, patch: Partial<Experience>) => void;
  removeExperience: (id: ID) => void;

  addTestimonial: (testimonial: Testimonial) => void;
  updateTestimonial: (id: ID, patch: Partial<Testimonial>) => void;
  removeTestimonial: (id: ID) => void;

  addMessage: (message: Message) => void;
  updateMessage: (id: ID, patch: Partial<Message>) => void;
  removeMessage: (id: ID) => void;

  addCoverLetter: (letter: CoverLetter) => void;
  removeCoverLetter: (id: ID) => void;

  setArticles: (articles: Article[]) => void;
  resetAll: () => void;
}

const patchById = <T extends { id: ID }>(list: T[], id: ID, patch: Partial<T>): T[] =>
  list.map((item) => (item.id === id ? { ...item, ...patch } : item));

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      ...initialPortfolioData,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),

      setProfile: (profile) => set({ profile }),

      addSkill: (skill) => set((s) => ({ skills: [skill, ...s.skills] })),
      updateSkill: (id, patch) => set((s) => ({ skills: patchById(s.skills, id, patch) })),
      removeSkill: (id) => set((s) => ({ skills: s.skills.filter((i) => i.id !== id) })),

      addProject: (project) => set((s) => ({ projects: [project, ...s.projects] })),
      updateProject: (id, patch) => set((s) => ({ projects: patchById(s.projects, id, patch) })),
      removeProject: (id) => set((s) => ({ projects: s.projects.filter((i) => i.id !== id) })),

      addExperience: (experience) => set((s) => ({ experiences: [experience, ...s.experiences] })),
      updateExperience: (id, patch) =>
        set((s) => ({ experiences: patchById(s.experiences, id, patch) })),
      removeExperience: (id) =>
        set((s) => ({ experiences: s.experiences.filter((i) => i.id !== id) })),

      addTestimonial: (testimonial) =>
        set((s) => ({ testimonials: [testimonial, ...s.testimonials] })),
      updateTestimonial: (id, patch) =>
        set((s) => ({ testimonials: patchById(s.testimonials, id, patch) })),
      removeTestimonial: (id) =>
        set((s) => ({ testimonials: s.testimonials.filter((i) => i.id !== id) })),

      addMessage: (message) => set((s) => ({ messages: [message, ...s.messages] })),
      updateMessage: (id, patch) => set((s) => ({ messages: patchById(s.messages, id, patch) })),
      removeMessage: (id) => set((s) => ({ messages: s.messages.filter((i) => i.id !== id) })),

      addCoverLetter: (letter) => set((s) => ({ coverLetters: [letter, ...s.coverLetters] })),
      removeCoverLetter: (id) =>
        set((s) => ({ coverLetters: s.coverLetters.filter((i) => i.id !== id) })),

      setArticles: (articles) => set({ articles }),
      resetAll: () => set({ ...initialPortfolioData }),
    }),
    {
      name: "portfolio-data-v1",
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
      partialize: ({ hydrated: _hydrated, ...rest }) => rest,
    },
  ),
);
