import { usePortfolioStore } from "@/store/portfolioStore";
import type { CoverLetter, CoverLetterPayload, ID, Profile } from "@/types";

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
  const { companyName, position, jobDescription, language } = payload;
  const todayIndo = formatIndonesianDate();
  const dateStr =
    language === "en"
      ? new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric" }).format(
          new Date()
        )
      : todayIndo;

  const userEducation = profile.education || "S1 Teknik Informatika, STT Terpadu Nurul Fikri";
  const userLocation = profile.location || "Kabupaten Bogor, Jawa Barat";
  const userPhone = profile.phone || "0858 8284 6665";
  const userEmail = profile.email || "dits144@gmail.com";
  const userName = profile.name || "Muhammad Raditya Anwar";

  const aiParagraph = `Saya memiliki minat di bidang pengembangan web dan keamanan siber. Dalam pengembangan web, saya terbiasa menggunakan pendekatan vibe coding dengan bantuan AI untuk membangun aplikasi secara efisien sambil tetap meninjau hasilnya agar optimal. Saya siap terus belajar, bekerja dengan teliti, dan berkontribusi sesuai kebutuhan ${companyName || "perusahaan"}.`;

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
  async generateCoverLetter(payload: CoverLetterPayload): Promise<string> {
    try {
      const profile = usePortfolioStore.getState().profile || ({} as Profile);
      return buildDummyLetter(payload, profile);
    } catch (err) {
      console.error("Error in generateCoverLetter:", err);
      const company = payload.companyName || "Perusahaan";
      const pos = payload.position || "Posisi";
      const dateStr = formatIndonesianDate();
      return `Surat Lamaran Kerja\nBogor, ${dateStr}\n\nKepada Yth.\nBapak/Ibu HRD ${company}\ndi tempat\n\nPerihal: Lamaran Pekerjaan\n\nDengan hormat,\nBerdasarkan informasi lowongan pekerjaan yang saya peroleh, dengan ini saya mengajukan lamaran kerja untuk posisi ${pos} di ${company}.`;
    }
  },

  // GET /api/cover-letters
  async list(): Promise<CoverLetter[]> {
    try {
      const res = await fetch("/api/cover-letters", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          usePortfolioStore.setState({ coverLetters: data });
          return data;
        }
      }
    } catch {}

    return usePortfolioStore.getState().coverLetters;
  },

  // POST /api/cover-letters
  async save(payload: CoverLetterPayload & { content: string }): Promise<CoverLetter> {
    try {
      const res = await fetch("/api/cover-letters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json();
        usePortfolioStore.getState().addCoverLetter(created);
        return created;
      }
    } catch (err) {
      console.warn("Gagal POST /api/cover-letters:", err);
    }

    const fallback: CoverLetter = {
      ...payload,
      id: `cl-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    usePortfolioStore.getState().addCoverLetter(fallback);
    return fallback;
  },

  // DELETE /api/cover-letters/:id
  async remove(id: ID): Promise<void> {
    usePortfolioStore.getState().removeCoverLetter(id);

    try {
      await fetch(`/api/cover-letters/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn(`Gagal DELETE cover letter ${id}:`, err);
    }
  },
};
