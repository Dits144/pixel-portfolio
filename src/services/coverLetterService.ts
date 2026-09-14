import { usePortfolioStore } from "@/store/portfolioStore";
import type { CoverLetter, CoverLetterPayload, ID } from "@/types";

import { createId, delay } from "./storage";

const buildDummyLetter = (payload: CoverLetterPayload, name: string, role: string) => {
  const { companyName, position, jobDescription, tone, language } = payload;
  const focus =
    jobDescription.trim().slice(0, 160) || "pengembangan aplikasi web modern end-to-end";

  if (language === "en") {
    const opening =
      tone === "Santai"
        ? `Hi ${companyName} team,`
        : tone === "Semi-formal"
          ? `Dear ${companyName} Hiring Team,`
          : `Dear Hiring Manager at ${companyName},`;
    return `${opening}

I am writing to apply for the ${position} role. As a ${role} with hands-on experience shipping production web applications, I was drawn to this opening because it centers on ${focus}.

In my recent work I have owned features end-to-end: designing component architecture on the frontend, building typed REST APIs on the backend, and taking responsibility for deployment and monitoring. I care a lot about maintainable code, measurable performance, and clear communication with product and design.

A few things I would bring to ${companyName}:
- Strong React and TypeScript fundamentals, including design systems and accessibility.
- Backend experience with Node.js and relational databases, with an eye on query performance.
- A habit of documenting decisions so the next engineer can move fast.

I would love to talk about how I can help your team. Thank you for your time and consideration.

Best regards,
${name}`;
  }

  const opening =
    tone === "Santai"
      ? `Halo tim ${companyName},`
      : tone === "Semi-formal"
        ? `Kepada Tim Rekrutmen ${companyName},`
        : `Kepada Yth. Bapak/Ibu HRD ${companyName},`;

  return `${opening}

Melalui surat ini saya bermaksud melamar posisi ${position}. Sebagai ${role}, saya tertarik karena kebutuhan tim berfokus pada ${focus}.

Selama beberapa tahun terakhir saya terbiasa menangani fitur dari hulu ke hilir: merancang struktur komponen di sisi frontend, membangun REST API yang rapi di sisi backend, hingga mengurus proses deployment. Saya terbiasa bekerja dengan React, TypeScript, Node.js, dan basis data relasional, serta menjaga agar kode tetap mudah dirawat oleh anggota tim lain.

Beberapa hal yang bisa saya bawa untuk ${companyName}:
- Pengalaman membangun antarmuka yang cepat, responsif, dan konsisten.
- Kemampuan merancang API dan struktur data yang jelas kontraknya.
- Kebiasaan mendokumentasikan keputusan teknis agar mudah dilanjutkan.

Saya sangat terbuka untuk berdiskusi lebih lanjut mengenai kebutuhan tim. Terima kasih atas waktu dan perhatiannya.

Hormat saya,
${name}`;
};

export const coverLetterService = {
  /**
   * Stub generator surat lamaran.
   * TODO: connect to backend AI endpoint
   * contoh: await fetch(`${API_BASE}/ai/cover-letter`, { method: "POST", body: JSON.stringify(payload) })
   */
  async generateCoverLetter(payload: CoverLetterPayload): Promise<string> {
    await delay(2000); // simulasi proses AI
    const { name, role } = usePortfolioStore.getState().profile;
    return buildDummyLetter(payload, name, role);
  },

  // TODO: GET /api/cover-letters
  async list(): Promise<CoverLetter[]> {
    await delay(150);
    return usePortfolioStore.getState().coverLetters;
  },

  // TODO: POST /api/cover-letters
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

  // TODO: DELETE /api/cover-letters/:id
  async remove(id: ID): Promise<void> {
    await delay(200);
    usePortfolioStore.getState().removeCoverLetter(id);
  },
};
