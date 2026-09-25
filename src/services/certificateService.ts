import { radityaDB } from "@/lib/database";
import { initialPortfolioData } from "@/mock-data";
import { usePortfolioStore } from "@/store/portfolioStore";
import type { Certificate, ID } from "@/types";

import { createId, delay } from "./storage";

export const certificateService = {
  // GET /api/certificates
  async list(): Promise<Certificate[]> {
    await delay(80);
    // Prioritaskan dari Database IndexedDB
    try {
      const fromDB = await radityaDB.getAll<Certificate>("certificates");
      if (fromDB && fromDB.length > 0) {
        usePortfolioStore.setState({ certificates: fromDB });
        return fromDB;
      }
    } catch (e) {
      console.warn("DB read error:", e);
    }

    const stored = usePortfolioStore.getState().certificates;
    if (stored && stored.length > 0) return stored;
    return initialPortfolioData.certificates || [];
  },

  // POST /api/certificates
  async create(input: Omit<Certificate, "id">): Promise<Certificate> {
    await delay(120);
    const certificate: Certificate = {
      ...input,
      id: createId("cert"),
    };
    usePortfolioStore.getState().addCertificate(certificate);
    await radityaDB.put("certificates", certificate);
    return certificate;
  },

  // PUT /api/certificates/:id
  async update(id: ID, patch: Partial<Certificate>): Promise<void> {
    await delay(120);
    usePortfolioStore.getState().updateCertificate(id, patch);
    const current = usePortfolioStore.getState().certificates.find((c) => c.id === id);
    if (current) {
      await radityaDB.put("certificates", current);
    }
  },

  // DELETE /api/certificates/:id
  async remove(id: ID): Promise<void> {
    await delay(120);
    usePortfolioStore.getState().removeCertificate(id);
    await radityaDB.delete("certificates", id);
  },
};
