import logoImg from "@/assets/logo.jpg";
import profilePhoto from "@/assets/profile.jpg";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

import type {
  Article,
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

export const mockProfile: Profile = {
  name: "Muhammad Raditya Anwar",
  role: "Cyber Security & Fullstack Developer",
  tagline:
    "Spesialis Teknologi Informasi & Keamanan Siber — berfokus pada pertahanan sistem, arsitektur jaringan aman, dan web engineering modern.",
  photo: logoImg,
  about:
    "Saya memiliki minat dan kemampuan di bidang teknologi informasi dan keamanan siber. Lulusan S1 Teknik Informatika STT Terpadu Nurul Fikri dengan sertifikasi BNSP Junior Network Administrator serta pengalaman magang di bidang Pengolahan Data dan Informasi pada Direktorat Jenderal Pajak. Berpengalaman dalam network administration, vulnerability assessment, dan pengembangan aplikasi web yang aman dan scalable.",
  email: "dits144@gmail.com",
  phone: "0858 8284 6665",
  education: "S1 Teknik Informatika, STT Terpadu Nurul Fikri",
  location: "Kabupaten Bogor, Jawa Barat",
  cvFileName: "CV-Muhammad-Raditya-Anwar.pdf",
  cvFileUrl: "",
  signature: "Muhammad Raditya Anwar",
  typingWords: [
    "Cyber Security",
    "Network Admin",
    "Ethical Hacking",
    "React & TypeScript",
    "Linux Hardening",
    "Fullstack Web",
  ],
  stats: { yearsExperience: 3, projects: 28, clients: 15 },
  socials: {
    github: "https://github.com/dits144",
    linkedin: "https://linkedin.com/in/mradityaanwar",
    instagram: "https://www.instagram.com/raa__dits/",
    whatsapp: "https://wa.me/6285882846665",
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
  {
    id: "sk-15",
    name: "Network Security & Hardening",
    category: "Cyber Security",
    percentage: 90,
    level: "Expert",
    icon: "🛡️",
  },
  {
    id: "sk-16",
    name: "Wireshark Packet Analysis",
    category: "Cyber Security",
    percentage: 88,
    level: "Advanced",
    icon: "🦈",
  },
  {
    id: "sk-17",
    name: "Nmap & Network Scanning",
    category: "Cyber Security",
    percentage: 86,
    level: "Advanced",
    icon: "📡",
  },
  {
    id: "sk-18",
    name: "Burp Suite & Web Penetration",
    category: "Cyber Security",
    percentage: 82,
    level: "Advanced",
    icon: "🎯",
  },
  {
    id: "sk-19",
    name: "Linux Hardening & Firewall",
    category: "Cyber Security",
    percentage: 85,
    level: "Advanced",
    icon: "🔒",
  },
  {
    id: "sk-20",
    name: "Cryptography & SIEM",
    category: "Cyber Security",
    percentage: 78,
    level: "Intermediate",
    icon: "🔐",
  },
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

export const mockCertificates: Certificate[] = [
  {
    id: "cert-1",
    title: "Junior Network Administrator",
    issuer: "Badan Nasional Sertifikasi Profesi (BNSP)",
    category: "Networking",
    issueDate: "2024",
    expiryDate: "2027",
    credentialId: "BNSP-JNA-5421-2024",
    credentialUrl: "https://bnsp.go.id",
    image:
      "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=1000&q=80",
    description:
      "Sertifikasi kompetensi nasional standar BNSP untuk pengelolaan arsitektur jaringan lokal (LAN), routing, IP subnetting, switching, serta basic network security.",
    skills: ["LAN/WAN Configuration", "IP Subnetting", "Routing & Switching", "Network Security Basics"],
  },
  {
    id: "cert-2",
    title: "Cybersecurity Essentials & Network Defense",
    issuer: "Cisco Networking Academy",
    category: "Cyber Security",
    issueDate: "2024",
    expiryDate: "Tanpa Kadaluarsa",
    credentialId: "CISCO-SEC-992144",
    credentialUrl: "https://www.credly.com",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80",
    description:
      "Validasi pemahaman mendalam tentang prinsip confidentiality, integrity, availability (CIA triad), pencegahan cyber attacks, dan konfigurasi firewall.",
    skills: ["Vulnerability Assessment", "Firewall Configuration", "Threat Mitigation", "Packet Sniffing"],
  },
  {
    id: "cert-3",
    title: "Menjadi Front-End Web Developer Expert",
    issuer: "Dicoding Academy Indonesia",
    category: "Fullstack",
    issueDate: "2023",
    expiryDate: "2026",
    credentialId: "DICODING-FE-88120",
    credentialUrl: "https://www.dicoding.com/certificates/DICODING-FE-88120",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80",
    description:
      "Kurikulum industri kurasi Google Developers yang mencakup Progressive Web Apps (PWA), Web Performance, Clean Architecture, dan Test Driven Development (TDD).",
    skills: ["React", "TypeScript", "PWA & Service Worker", "Automation Testing", "Web Performance"],
  },
  {
    id: "cert-4",
    title: "Linux System Security & Hardening",
    issuer: "Open Source Academy",
    category: "Cyber Security",
    issueDate: "2023",
    expiryDate: "Tanpa Kadaluarsa",
    credentialId: "LNX-SEC-2023-771",
    credentialUrl: "https://example.com/verify",
    image:
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1000&q=80",
    description:
      "Konfigurasi kernel hardening, iptables/ufw, SELinux, auditd logging, secure SSH tunneling, serta manajemen hak akses berkas di lingkungan server produksi.",
    skills: ["Linux Server", "iptables/ufw", "SSH Hardening", "Audit & Log Inspection"],
  },
];

export const mockCoverLetters: CoverLetter[] = [
  {
    id: "cl-1",
    companyName: "PT Cyber Solusi Nusantara",
    position: "Junior Security Analyst / Network Engineer",
    jobDescription:
      "Network monitoring, packet analysis, vulnerability scanning, Linux system administration, and basic security response.",
    tone: "Formal",
    language: "id",
    content: `Surat Lamaran Kerja\nBogor, 24 September 2026\nKepada Yth.\nBapak/Ibu HRD PT Cyber Solusi Nusantara\ndi tempat\n\nPerihal: Lamaran Pekerjaan\n\nDengan hormat,\nBerdasarkan informasi lowongan pekerjaan yang saya peroleh, dengan ini saya mengajukan lamaran kerja untuk posisi Junior Security Analyst / Network Engineer di PT Cyber Solusi Nusantara. Adapun data diri saya sebagai berikut:\n\nNama            : Muhammad Raditya Anwar\nPendidikan      : S1 Teknik Informatika, STT Terpadu Nurul Fikri\nDomisili        : Kabupaten Bogor, Jawa Barat\nNo. telepon     : 0858 8284 6665\nEmail           : dits144@gmail.com\n\nSaya memiliki minat dan kemampuan yang kuat di bidang teknologi informasi dan keamanan siber. Saya memegang sertifikasi BNSP Junior Network Administrator serta memiliki pengalaman magang di bidang Pengolahan Data dan Informasi pada Direktorat Jenderal Pajak. Berbekal pemahaman network administration, vulnerability assessment, dan konfigurasi server Linux, saya siap belajar cepat, bekerja dengan teliti, dan memberikan kontribusi nyata sesuai kebutuhan tim PT Cyber Solusi Nusantara.\n\nSebagai bahan pertimbangan, bersama surat ini saya lampirkan CV dan dokumen pendukung lainnya. Besar harapan saya untuk mendapat kesempatan mengikuti tahapan seleksi dan wawancara.\n\nDemikian surat lamaran ini saya sampaikan. Atas perhatian Bapak/Ibu, saya mengucapkan terima kasih.\n\nHormat saya,\n\nMuhammad Raditya Anwar`,
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
  certificates: mockCertificates,
  coverLetters: mockCoverLetters,
};

/** Kredensial simulasi untuk mock auth. TODO: ganti dengan POST /api/auth/login */
export const MOCK_CREDENTIALS = {
  email: "admin@portfolio.dev",
  password: "admin123",
  name: "Muhammad Raditya Anwar",
};
