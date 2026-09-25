import { useQuery } from "@tanstack/react-query";

import { initialPortfolioData } from "@/mock-data";
import { articleService } from "@/services/articleService";
import { certificateService } from "@/services/certificateService";
import { experienceService } from "@/services/experienceService";
import { profileService } from "@/services/profileService";
import { projectService } from "@/services/projectService";
import { skillService } from "@/services/skillService";
import { testimonialService } from "@/services/testimonialService";
import type {
  Article,
  Certificate,
  Experience,
  Profile,
  Project,
  Skill,
  Testimonial,
} from "@/types";

export interface LandingContent {
  profile: Profile;
  skills: Skill[];
  certificates: Certificate[];
  projects: Project[];
  experiences: Experience[];
  testimonials: Testimonial[];
  articles: Article[];
}

/**
 * Satu query untuk seluruh isi halaman depan.
 * placeholderData membuat server & render pertama client menampilkan data yang sama,
 * lalu hasil service (localStorage / nanti REST API) menggantikan saat sudah selesai dimuat.
 */
const placeholder: LandingContent = {
  profile: initialPortfolioData.profile,
  skills: initialPortfolioData.skills,
  certificates: initialPortfolioData.certificates,
  projects: initialPortfolioData.projects,
  experiences: initialPortfolioData.experiences,
  testimonials: initialPortfolioData.testimonials,
  articles: initialPortfolioData.articles,
};

export function usePortfolioContent() {
  return useQuery({
    queryKey: ["portfolio", "content"],
    queryFn: async (): Promise<LandingContent> => {
      const [profile, skills, certificates, projects, experiences, testimonials, articles] =
        await Promise.all([
          profileService.get(),
          skillService.list(),
          certificateService.list(),
          projectService.list(),
          experienceService.list(),
          testimonialService.list(),
          articleService.list(),
        ]);
      return { profile, skills, certificates, projects, experiences, testimonials, articles };
    },
    placeholderData: placeholder,
    staleTime: 30_000,
  });
}
