/**
 * Kontrak data aplikasi.
 * Semua service (src/services/*) memakai tipe ini, sehingga saat backend REST API
 * siap, cukup ganti isi service tanpa mengubah komponen UI.
 */

export type ID = string;

export type SkillCategory = "Frontend" | "Backend" | "Database" | "DevOps/Tools";
export type SkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface Skill {
  id: ID;
  name: string;
  category: SkillCategory;
  /** 0 - 100 */
  percentage: number;
  level: SkillLevel;
  /** nama ikon lucide (mis. "Code2") atau emoji */
  icon: string;
}

export type ProjectCategory = "Web App" | "Mobile" | "API" | "Landing Page";

export interface Project {
  id: ID;
  title: string;
  description: string;
  thumbnail: string;
  techStack: string[];
  demoUrl: string;
  githubUrl: string;
  category: ProjectCategory;
  featured: boolean;
  createdAt: string;
}

export interface Experience {
  id: ID;
  position: string;
  company: string;
  period: string;
  description: string;
  type: "Work" | "Organization" | "Education";
}

export interface Testimonial {
  id: ID;
  name: string;
  role: string;
  photo: string;
  content: string;
  /** 1 - 5 */
  rating: number;
}

export interface Message {
  id: ID;
  name: string;
  email: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Article {
  id: ID;
  title: string;
  excerpt: string;
  date: string;
  tag: string;
  readingMinutes: number;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  instagram: string;
  whatsapp: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  photo: string;
  about: string;
  email: string;
  location: string;
  cvFileName: string;
  typingWords: string[];
  stats: {
    yearsExperience: number;
    projects: number;
    clients: number;
  };
  socials: SocialLinks;
}

export type CoverLetterTone = "Formal" | "Semi-formal" | "Santai";
export type CoverLetterLanguage = "id" | "en";

export interface CoverLetterPayload {
  companyName: string;
  position: string;
  jobDescription: string;
  tone: CoverLetterTone;
  language: CoverLetterLanguage;
}

export interface CoverLetter extends CoverLetterPayload {
  id: ID;
  content: string;
  createdAt: string;
}

export interface AuthUser {
  email: string;
  name: string;
}

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  projects: Project[];
  experiences: Experience[];
  testimonials: Testimonial[];
  messages: Message[];
  articles: Article[];
  coverLetters: CoverLetter[];
}
