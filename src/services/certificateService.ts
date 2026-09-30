import { radityaDB } from "@/lib/database";
import { initialPortfolioData } from "@/mock-data";
import { usePortfolioStore } from "@/store/portfolioStore";
import type { Certificate, ID } from "@/types";

export const certificateService = {
  // GET /api/certificates
  async list(): Promise<Certificate[]> {
    try {
      const res = await fetch("/api/certificates", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          usePortfolioStore.setState({ certificates: data });
          return data;
        }
      }
    } catch {}

    // Fallback ke IndexedDB atau Store
    try {
      const fromDB = await radityaDB.getAll<Certificate>("certificates");
      if (fromDB && fromDB.length > 0) {
        usePortfolioStore.setState({ certificates: fromDB });
        return fromDB;
      }
    } catch {}

    const stored = usePortfolioStore.getState().certificates;
    if (stored && stored.length > 0) return stored;
    return initialPortfolioData.certificates || [];
  },

  // POST /api/certificates
  async create(input: Omit<Certificate, "id">): Promise<Certificate> {
    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (res.ok) {
        const created = await res.json();
        usePortfolioStore.getState().addCertificate(created);
        radityaDB.put("certificates", created).catch(() => {});
        return created;
      }
    } catch (err) {
      console.warn("Gagal POST /api/certificates:", err);
    }

    const fallbackId = `cert-${Date.now()}`;
    const fallback: Certificate = { ...input, id: fallbackId };
    usePortfolioStore.getState().addCertificate(fallback);
    radityaDB.put("certificates", fallback).catch(() => {});
    return fallback;
  },

  // PUT /api/certificates/:id
  async update(id: ID, patch: Partial<Certificate>): Promise<void> {
    usePortfolioStore.getState().updateCertificate(id, patch);
    const current = usePortfolioStore.getState().certificates.find((c) => c.id === id);
    if (current) {
      radityaDB.put("certificates", current).catch(() => {});
    }

    try {
      await fetch(`/api/certificates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    } catch (err) {
      console.warn(`Gagal PUT /api/certificates/${id}:`, err);
    }
  },

  // DELETE /api/certificates/:id
  async remove(id: ID): Promise<void> {
    usePortfolioStore.getState().removeCertificate(id);
    radityaDB.delete("certificates", id).catch(() => {});

    try {
      await fetch(`/api/certificates/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn(`Gagal DELETE /api/certificates/${id}:`, err);
    }
  },
};
