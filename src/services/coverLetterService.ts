import { usePortfolioStore } from "@/store/portfolioStore";
import type { CoverLetter, CoverLetterPayload, ID, Profile } from "@/types";

import { createId, delay } from "./storage";

export function formatIndonesianDate(date = new Date()): string {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

const buildDummyLetter = (payload: CoverLetterPayload, profile: Profile) => {
  const { companyName, position, jobDescription, tone, language } = payload;
  const todayIndo = formatIndonesianDate();
  const dateStr = language === "en"
    ? new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric" }).format(new Date())
    : todayIndo;

  const userEducation = profile.education || "S1 Teknik Informatika, STT Terpadu Nurul Fikri";
  const userLocation = profile.location || "Kabupaten Bogor, Jawa Barat";
  const userPhone = profile.phone || "0858 8284 6665";
  const userEmail = profile.email || "dits144@gmail.com";
  const userName = profile.name || "Muhammad Raditya Anwar";

  // GEN AI paragraph generation logic based on prompt / position / job description
  const jdLower = (jobDescription || "").toLowerCase();
  const posLower = position.toLowerCase();

  let aiParagraph = "";

  // GEN AI paragraph logic: Sesuai teks persis yang diminta user, ringkas & tepat sasaran
  aiParagraph = `Saya memiliki minat di bidang pengembangan web dan keamanan siber. Dalam pengembangan web, saya terbiasa menggunakan pendekatan vibe coding dengan bantuan AI untuk membangun aplikasi secara efisien sambil tetap meninjau hasilnya agar optimal. Saya siap terus belajar, bekerja dengan teliti, dan berkontribusi sesuai kebutuhan ${companyName || "perusahaan"}.`;

  // Sesuai template persis yang diminta user (dengan baris Surat Lamaran Kerja dan layout rapi):
  return `Surat Lamaran Kerja
Bogor, ${dateStr}

Kepada Yth.
Bapak/Ibu HRD ${companyName || "[Nama Perusahaan]"}
di tempat

Perihal: Lamaran Pekerjaan

Dengan hormat,
Berdasarkan informasi lowongan pekerjaan yang saya peroleh, dengan ini saya mengajukan lamaran kerja untuk posisi ${position || "[nama posisi]"} di ${companyName || "[Nama Perusahaan]"}. Adapun data diri saya sebagai berikut:

    Nama        : ${userName}
    Pendidikan  : ${userEducation}
    Domisili    : ${userLocation}
    No. telepon : ${userPhone}
    Email       : ${userEmail}

${aiParagraph}

Sebagai bahan pertimbangan, bersama surat ini saya lampirkan CV dan dokumen pendukung lainnya. Besar harapan saya untuk mendapat kesempatan mengikuti tahapan seleksi dan wawancara.

Demikian surat lamaran ini saya sampaikan. Atas perhatian Bapak/Ibu, saya mengucapkan terima kasih.

Hormat saya,

${userName}`;
};

export const coverLetterService = {
  /**
   * Stub generator surat lamaran dengan Gen AI.
   * Menyesuaikan posisi, nama perusahaan, kualifikasi dari profil dan input.
   */
  async generateCoverLetter(payload: CoverLetterPayload): Promise<string> {
    await delay(600); // simulasi proses Gen AI
    try {
      const profile = usePortfolioStore.getState().profile || ({} as Profile);
      return buildDummyLetter(payload, profile);
    } catch (err) {
      console.error("Error in generateCoverLetter:", err);
      // Fallback generator jika ada field yang error
      const company = payload.companyName || "Perusahaan";
      const pos = payload.position || "Posisi";
      const dateStr = formatIndonesianDate();
      return `Surat Lamaran Kerja\nBogor, ${dateStr}\n\nKepada Yth.\nBapak/Ibu HRD ${company}\ndi tempat\n\nPerihal: Lamaran Pekerjaan\n\nDengan hormat,\nBerdasarkan informasi lowongan pekerjaan yang saya peroleh, dengan ini saya mengajukan lamaran kerja untuk posisi ${pos} di ${company}. Adapun data diri saya sebagai berikut:\n\nNama            : Muhammad Raditya Anwar\nPendidikan      : S1 Teknik Informatika, STT Terpadu Nurul Fikri\nDomisili        : Kabupaten Bogor, Jawa Barat\nNo. telepon     : 0858 8284 6665\nEmail           : dits144@gmail.com\n\nSaya memiliki minat dan kemampuan di bidang web development dengan pendekatan modern (vibecoding) serta keamanan siber. Saya juga memiliki sertifikasi BNSP Junior Network Administrator serta pengalaman magang di bidang Pengolahan Data dan Informasi pada Direktorat Jenderal Pajak. Saya siap belajar, bekerja dengan teliti, dan berkontribusi sesuai kebutuhan ${company}.\n\nSebagai bahan pertimbangan, bersama surat ini saya lampirkan CV dan dokumen pendukung lainnya. Besar harapan saya untuk mendapat kesempatan mengikuti tahapan seleksi dan wawancara.\n\nDemikian surat lamaran ini saya sampaikan. Atas perhatian Bapak/Ibu, saya mengucapkan terima kasih.\n\nHormat saya,\n\nMuhammad Raditya Anwar`;
    }
  },

  // GET /api/cover-letters
  async list(): Promise<CoverLetter[]> {
    await delay(150);
    return usePortfolioStore.getState().coverLetters;
  },

  // POST /api/cover-letters
  async save(payload: CoverLetterPayload & { content: string }): Promise<CoverLetter> {
    await delay(300);
    const letter: CoverLetter = {
      ...payload,
      id: createId("cl"),
      createdAt: new Date().toISOString(),
    };
    usePortfolioStore.getState().addCoverLetter(letter);
    return letter;
  },

  // DELETE /api/cover-letters/:id
  async remove(id: ID): Promise<void> {
    await delay(200);
    usePortfolioStore.getState().removeCoverLetter(id);
  },
};
