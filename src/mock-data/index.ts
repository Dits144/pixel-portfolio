import profilePhoto from "@/assets/profile.jpg";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

import type {
  Article,
  CoverLetter,
  Experience,
  Message,
  PortfolioData,
  Profile,
  Project,
  Skill,
  Testimonial,
} from "@/types";

export const mockProfile: Profile = {
  name: "Rizky Ananda",
  role: "Fullstack Web Developer",
  tagline:
    "Membangun produk web yang cepat, rapi, dan siap produksi — dari rancangan antarmuka sampai arsitektur API.",
  photo: profilePhoto,
  about:
    "Saya seorang fullstack developer dengan 5+ tahun pengalaman membangun aplikasi web untuk startup dan agensi digital. Fokus saya pada performa, kode yang mudah dirawat, dan pengalaman pengguna yang detail. Sehari-hari bekerja dengan React, TypeScript, Node.js, dan Laravel, serta terbiasa mengurus deployment dan monitoring sendiri.",
  email: "halo@rizkyananda.dev",
  location: "Jakarta, Indonesia",
  cvFileName: "CV-Rizky-Ananda-2026.pdf",
  typingWords: ["React", "TypeScript", "Node.js", "Laravel", "PostgreSQL", "Docker"],
  stats: { yearsExperience: 5, projects: 48, clients: 23 },
  socials: {
    github: "https://github.com/",
    linkedin: "https://linkedin.com/",
    instagram: "https://instagram.com/",
    whatsapp: "https://wa.me/6281234567890",
  },
};

export const mockSkills: Skill[] = [
  { id: "sk-1", name: "React", category: "Frontend", percentage: 95, level: "Expert", icon: "⚛️" },
  {
    id: "sk-2",
    name: "TypeScript",
    category: "Frontend",
    percentage: 92,
    level: "Expert",
    icon: "🟦",
  },
  {
    id: "sk-3",
    name: "Tailwind CSS",
    category: "Frontend",
    percentage: 94,
    level: "Expert",
    icon: "🌊",
  },
  {
    id: "sk-4",
    name: "Next.js",
    category: "Frontend",
    percentage: 85,
    level: "Advanced",
    icon: "▲",
  },
  {
    id: "sk-5",
    name: "Node.js",
    category: "Backend",
    percentage: 90,
    level: "Expert",
    icon: "🟩",
  },
  {
    id: "sk-6",
    name: "Laravel",
    category: "Backend",
    percentage: 82,
    level: "Advanced",
    icon: "🔺",
  },
  {
    id: "sk-7",
    name: "Express",
    category: "Backend",
    percentage: 88,
    level: "Advanced",
    icon: "🚂",
  },
  {
    id: "sk-8",
    name: "PostgreSQL",
    category: "Database",
    percentage: 86,
    level: "Advanced",
    icon: "🐘",
  },
  {
    id: "sk-9",
    name: "MongoDB",
    category: "Database",
    percentage: 78,
    level: "Intermediate",
    icon: "🍃",
  },
  { id: "sk-10", name: "Redis", category: "Database", percentage: 70, level: "Intermediate", icon: "🧱" },
  { id: "sk-11", name: "Docker", category: "DevOps/Tools", percentage: 80, level: "Advanced", icon: "🐳" },
  {
    id: "sk-12",
    name: "GitHub Actions",
    category: "DevOps/Tools",
    percentage: 76,
    level: "Intermediate",
    icon: "⚙️",
  },
  { id: "sk-13", name: "AWS", category: "DevOps/Tools", percentage: 68, level: "Intermediate", icon: "☁️" },
  { id: "sk-14", name: "Figma", category: "DevOps/Tools", percentage: 72, level: "Intermediate", icon: "🎨" },
];

export const mockProjects: Project[] = [
  {
    id: "pr-1",
    title: "Shoplytics Dashboard",
    description:
      "Dashboard analitik e-commerce realtime dengan laporan penjualan, retensi pelanggan, dan ekspor data.",
    thumbnail: project1,
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    demoUrl: "https://example.com",
    githubUrl: "https://github.com/",
    category: "Web App",
    featured: true,
    createdAt: "2026-02-11",
  },
  {
    id: "pr-2",
    title: "Dompetku Finance App",
    description:
      "Aplikasi pencatat keuangan pribadi dengan budgeting bulanan, kategorisasi otomatis, dan insight pengeluaran.",
    thumbnail: project2,
    techStack: ["React Native", "Expo", "Firebase"],
    demoUrl: "https://example.com",
    githubUrl: "https://github.com/",
    category: "Mobile",
    featured: true,
    createdAt: "2025-11-03",
  },
  {
    id: "pr-3",
    title: "Nusa Commerce API",
    description:
      "REST API microservice untuk marketplace: autentikasi, katalog produk, order, dan payment gateway.",
    thumbnail: project3,
    techStack: ["Node.js", "Express", "Docker", "Redis"],
    demoUrl: "https://example.com",
    githubUrl: "https://github.com/",
    category: "API",
    featured: true,
    createdAt: "2025-08-19",
  },
  {
    id: "pr-4",
    title: "Aureo Learning Platform",
    description:
      "Landing page dan portal kursus online dengan progress tracking, sertifikat, dan pembayaran berlangganan.",
    thumbnail: project4,
    techStack: ["Next.js", "Tailwind CSS", "Laravel"],
    demoUrl: "https://example.com",
    githubUrl: "https://github.com/",
    category: "Landing Page",
    featured: false,
    createdAt: "2025-05-27",
  },
];

export const mockExperiences: Experience[] = [
  {
    id: "ex-1",
    position: "Senior Fullstack Developer",
    company: "PT Nusantara Digital",
    period: "2024 — Sekarang",
    description:
      "Memimpin tim 4 developer membangun platform SaaS B2B. Merancang arsitektur frontend modular dan memangkas waktu muat halaman hingga 45%.",
    type: "Work",
  },
  {
    id: "ex-2",
    position: "Fullstack Developer",
    company: "Kreasi Studio",
    period: "2022 — 2024",
    description:
      "Mengerjakan 20+ proyek klien mulai dari company profile sampai sistem inventori internal dengan React dan Laravel.",
    type: "Work",
  },
  {
    id: "ex-3",
    position: "Frontend Developer",
    company: "Startup Cendana",
    period: "2021 — 2022",
    description:
      "Membangun design system internal dan migrasi aplikasi legacy jQuery ke React dengan TypeScript.",
    type: "Work",
  },
  {
    id: "ex-4",
    position: "Ketua Divisi Teknologi",
    company: "Himpunan Mahasiswa Informatika",
    period: "2019 — 2020",
    description:
      "Mengelola website organisasi dan menyelenggarakan workshop web development untuk 200+ mahasiswa.",
    type: "Organization",
  },
];

export const mockTestimonials: Testimonial[] = [
  {
    id: "ts-1",
    name: "Andini Prameswari",
    role: "Product Manager, Nusantara Digital",
    photo: "https://i.pravatar.cc/150?img=47",
    content:
      "Rizky sangat detail dan komunikatif. Estimasi waktunya realistis dan hasil akhirnya selalu rapi, bahkan di bagian yang tidak terlihat pengguna.",
    rating: 5,
  },
  {
    id: "ts-2",
    name: "Bagas Hidayat",
    role: "CTO, Kreasi Studio",
    photo: "https://i.pravatar.cc/150?img=12",
    content:
      "Salah satu developer yang paling bisa diandalkan untuk proyek berjangka pendek. Kode yang ditinggalkan mudah dilanjutkan tim lain.",
    rating: 5,
  },
  {
    id: "ts-3",
    name: "Clara Wijaya",
    role: "Founder, Dompetku",
    photo: "https://i.pravatar.cc/150?img=32",
    content:
      "Dari wireframe sampai rilis di store hanya 3 bulan. Banyak masukan produk yang membuat aplikasi kami jauh lebih baik.",
    rating: 4,
  },
  {
    id: "ts-4",
    name: "Dimas Nugroho",
    role: "Engineering Lead, Fintra",
    photo: "https://i.pravatar.cc/150?img=15",
    content:
      "Paham betul soal performa dan keamanan API. Review kodenya tajam tapi tetap membangun.",
    rating: 5,
  },
];

export const mockMessages: Message[] = [
  {
    id: "ms-1",
    name: "Sarah Lestari",
    email: "sarah@agency.co.id",
    content:
      "Halo, kami butuh developer untuk revamp website perusahaan. Apakah masih menerima proyek untuk bulan depan?",
    read: false,
    createdAt: "2026-09-12T09:24:00.000Z",
  },
  {
    id: "ms-2",
    name: "Michael Tan",
    email: "michael@startupx.com",
    content: "Interested in a long-term contract for our React dashboard. What is your rate?",
    read: false,
    createdAt: "2026-09-10T14:02:00.000Z",
  },
  {
    id: "ms-3",
    name: "Putri Ayu",
    email: "putri.ayu@gmail.com",
    content: "Terima kasih atas sesi mentoringnya kemarin, sangat membantu!",
    read: true,
    createdAt: "2026-09-05T18:40:00.000Z",
  },
];

export const mockArticles: Article[] = [
  {
    id: "ar-1",
    title: "Struktur Folder React yang Tidak Bikin Pusing di Bulan Ke-6",
    excerpt:
      "Cara saya menata folder proyek React agar tetap mudah dinavigasi meski fiturnya terus bertambah.",
    date: "2026-08-21",
    tag: "React",
    readingMinutes: 6,
  },
  {
    id: "ar-2",
    title: "Merancang REST API yang Enak Dipakai Tim Frontend",
    excerpt:
      "Konvensi penamaan, pagination, dan format error yang membuat integrasi jadi jauh lebih cepat.",
    date: "2026-07-09",
    tag: "Backend",
    readingMinutes: 8,
  },
  {
    id: "ar-3",
    title: "Deploy Aplikasi Node.js dengan Docker Tanpa Drama",
    excerpt: "Checklist praktis dari Dockerfile multi-stage sampai health check di produksi.",
    date: "2026-06-02",
    tag: "DevOps",
    readingMinutes: 7,
  },
];

export const mockCoverLetters: CoverLetter[] = [
  {
    id: "cl-1",
    companyName: "Tokopedia",
    position: "Senior Frontend Engineer",
    jobDescription: "React, TypeScript, design system, performance optimization.",
    tone: "Formal",
    language: "id",
    content:
      "Kepada Yth. Tim Rekrutmen Tokopedia,\n\nSaya menulis surat ini untuk menyatakan ketertarikan saya pada posisi Senior Frontend Engineer...",
    createdAt: "2026-09-01T08:00:00.000Z",
  },
];

export const initialPortfolioData: PortfolioData = {
  profile: mockProfile,
  skills: mockSkills,
  projects: mockProjects,
  experiences: mockExperiences,
  testimonials: mockTestimonials,
  messages: mockMessages,
  articles: mockArticles,
  coverLetters: mockCoverLetters,
};

/** Kredensial simulasi untuk mock auth. TODO: ganti dengan POST /api/auth/login */
export const MOCK_CREDENTIALS = {
  email: "admin@portfolio.dev",
  password: "admin123",
  name: "Rizky Ananda",
};
