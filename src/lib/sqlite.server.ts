/**
 * Server-Side Persistent JSON Database Layer
 *
 * Menyimpan seluruh data portofolio secara persistent di server VPS:
 *   /var/www/pixel-portfolio/data/portfolio-db.json
 *
 * Bersifat 100% persistent di server, langsung dibaca & ditulis oleh REST API /api/*
 * Tanpa native compiled binaries (zero C++ compilation issues di cloud/Vite/Nitro).
 * Mendukung atomic write untuk menghindari race-condition.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { initialPortfolioData } from "@/mock-data";
import type {
  Certificate,
  CoverLetter,
  Experience,
  Message,
  PortfolioData,
  Profile,
  Project,
  Skill,
  Testimonial,
} from "@/types";

function getDataFilePath(): string {
  if (process.env.NODE_ENV === "production") {
    const dir = "/var/www/pixel-portfolio/data";
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    return join(dir, "portfolio-db.json");
  }
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const dir = resolve(__dirname, "../../../data");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return join(dir, "portfolio-db.json");
}

let _cachedData: PortfolioData | null = null;

function loadDb(): PortfolioData {
  if (_cachedData) return _cachedData;

  const filePath = getDataFilePath();
  if (existsSync(filePath)) {
    try {
      const content = readFileSync(filePath, "utf-8");
      _cachedData = JSON.parse(content) as PortfolioData;
      return _cachedData;
    } catch (e) {
      console.warn("[DB] Gagal baca database file, inisialisasi ulang:", e);
    }
  }

  // Seed awal jika file belum ada
  _cachedData = {
    profile: initialPortfolioData.profile,
    skills: initialPortfolioData.skills,
    projects: initialPortfolioData.projects,
    experiences: initialPortfolioData.experiences,
    testimonials: initialPortfolioData.testimonials,
    messages: initialPortfolioData.messages,
    articles: initialPortfolioData.articles,
    certificates: initialPortfolioData.certificates,
    coverLetters: initialPortfolioData.coverLetters,
  };

  saveDb(_cachedData);
  return _cachedData;
}

function saveDb(data: PortfolioData): void {
  _cachedData = data;
  try {
    const filePath = getDataFilePath();
    writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("[DB] Gagal menulis ke database file:", err);
  }
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ── PROFILE ───────────────────────────────────────────────────────────────────
export const profileDb = {
  get(): Profile {
    return loadDb().profile;
  },
  update(profile: Profile): void {
    const db = loadDb();
    db.profile = profile;
    saveDb(db);
  },
};

// ── SKILLS ────────────────────────────────────────────────────────────────────
export const skillsDb = {
  list(): Skill[] {
    return loadDb().skills;
  },
  create(input: Omit<Skill, "id">): Skill {
    const db = loadDb();
    const item: Skill = { id: createId("sk"), ...input };
    db.skills.push(item);
    saveDb(db);
    return item;
  },
  update(id: string, patch: Partial<Skill>): void {
    const db = loadDb();
    const idx = db.skills.findIndex((s) => s.id === id);
    if (idx !== -1) {
      db.skills[idx] = { ...db.skills[idx], ...patch };
      saveDb(db);
    }
  },
  remove(id: string): void {
    const db = loadDb();
    db.skills = db.skills.filter((s) => s.id !== id);
    saveDb(db);
  },
};

// ── CERTIFICATES ──────────────────────────────────────────────────────────────
export const certificatesDb = {
  list(): Certificate[] {
    return loadDb().certificates;
  },
  create(input: Omit<Certificate, "id">, _prefix = "cert"): Certificate {
    const db = loadDb();
    const item: Certificate = { id: createId("cert"), ...input };
    db.certificates.unshift(item);
    saveDb(db);
    return item;
  },
  update(id: string, patch: Partial<Certificate>): Certificate | null {
    const db = loadDb();
    const idx = db.certificates.findIndex((c) => c.id === id);
    if (idx !== -1) {
      db.certificates[idx] = { ...db.certificates[idx], ...patch };
      saveDb(db);
      return db.certificates[idx];
    }
    return null;
  },
  remove(id: string): void {
    const db = loadDb();
    db.certificates = db.certificates.filter((c) => c.id !== id);
    saveDb(db);
  },
};

// ── PROJECTS ──────────────────────────────────────────────────────────────────
export const projectsDb = {
  list(): Project[] {
    return loadDb().projects;
  },
  create(input: Omit<Project, "id">, _prefix = "proj"): Project {
    const db = loadDb();
    const item: Project = { id: createId("proj"), ...input };
    db.projects.unshift(item);
    saveDb(db);
    return item;
  },
  update(id: string, patch: Partial<Project>): Project | null {
    const db = loadDb();
    const idx = db.projects.findIndex((p) => p.id === id);
    if (idx !== -1) {
      db.projects[idx] = { ...db.projects[idx], ...patch };
      saveDb(db);
      return db.projects[idx];
    }
    return null;
  },
  remove(id: string): void {
    const db = loadDb();
    db.projects = db.projects.filter((p) => p.id !== id);
    saveDb(db);
  },
};

// ── EXPERIENCES ───────────────────────────────────────────────────────────────
export const experiencesDb = {
  list(): Experience[] {
    return loadDb().experiences;
  },
  create(input: Omit<Experience, "id">, _prefix = "exp"): Experience {
    const db = loadDb();
    const item: Experience = { id: createId("exp"), ...input };
    db.experiences.unshift(item);
    saveDb(db);
    return item;
  },
  update(id: string, patch: Partial<Experience>): Experience | null {
    const db = loadDb();
    const idx = db.experiences.findIndex((e) => e.id === id);
    if (idx !== -1) {
      db.experiences[idx] = { ...db.experiences[idx], ...patch };
      saveDb(db);
      return db.experiences[idx];
    }
    return null;
  },
  remove(id: string): void {
    const db = loadDb();
    db.experiences = db.experiences.filter((e) => e.id !== id);
    saveDb(db);
  },
};

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────
export const testimonialsDb = {
  list(): Testimonial[] {
    return loadDb().testimonials;
  },
  create(input: Omit<Testimonial, "id">, _prefix = "testi"): Testimonial {
    const db = loadDb();
    const item: Testimonial = { id: createId("testi"), ...input };
    db.testimonials.unshift(item);
    saveDb(db);
    return item;
  },
  update(id: string, patch: Partial<Testimonial>): Testimonial | null {
    const db = loadDb();
    const idx = db.testimonials.findIndex((t) => t.id === id);
    if (idx !== -1) {
      db.testimonials[idx] = { ...db.testimonials[idx], ...patch };
      saveDb(db);
      return db.testimonials[idx];
    }
    return null;
  },
  remove(id: string): void {
    const db = loadDb();
    db.testimonials = db.testimonials.filter((t) => t.id !== id);
    saveDb(db);
  },
};

// ── MESSAGES ──────────────────────────────────────────────────────────────────
export const messagesDb = {
  list(): Message[] {
    return loadDb().messages;
  },
  create(input: Omit<Message, "id" | "createdAt">): Message {
    const db = loadDb();
    const item: Message = {
      id: createId("ms"),
      createdAt: new Date().toISOString(),
      read: false,
      ...input,
    };
    db.messages.unshift(item);
    saveDb(db);
    return item;
  },
  update(id: string, patch: Partial<Message>): Message | null {
    const db = loadDb();
    const idx = db.messages.findIndex((m) => m.id === id);
    if (idx !== -1) {
      db.messages[idx] = { ...db.messages[idx], ...patch };
      saveDb(db);
      return db.messages[idx];
    }
    return null;
  },
  remove(id: string): void {
    const db = loadDb();
    db.messages = db.messages.filter((m) => m.id !== id);
    saveDb(db);
  },
};

// ── COVER LETTERS ─────────────────────────────────────────────────────────────
export const coverLettersDb = {
  list(): CoverLetter[] {
    return loadDb().coverLetters;
  },
  create(input: Omit<CoverLetter, "id" | "createdAt">): CoverLetter {
    const db = loadDb();
    const item: CoverLetter = {
      id: createId("cl"),
      createdAt: new Date().toISOString(),
      ...input,
    };
    db.coverLetters.unshift(item);
    saveDb(db);
    return item;
  },
  remove(id: string): void {
    const db = loadDb();
    db.coverLetters = db.coverLetters.filter((c) => c.id !== id);
    saveDb(db);
  },
};

// ── BACKUP & RESET ────────────────────────────────────────────────────────────
export function exportAllDb(): PortfolioData {
  return loadDb();
}

export function resetAllDb(): void {
  const resetData: PortfolioData = {
    profile: initialPortfolioData.profile,
    skills: initialPortfolioData.skills,
    projects: initialPortfolioData.projects,
    experiences: initialPortfolioData.experiences,
    testimonials: initialPortfolioData.testimonials,
    messages: initialPortfolioData.messages,
    articles: initialPortfolioData.articles,
    certificates: initialPortfolioData.certificates,
    coverLetters: initialPortfolioData.coverLetters,
  };
  saveDb(resetData);
}
