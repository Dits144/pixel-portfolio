import { initialPortfolioData } from "@/mock-data";
import { usePortfolioStore } from "@/store/portfolioStore";
import type { ID, Testimonial } from "@/types";

export const testimonialService = {
  // GET /api/testimonials
  async list(): Promise<Testimonial[]> {
    try {
      const res = await fetch("/api/testimonials", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          usePortfolioStore.setState({ testimonials: data });
          return data;
        }
      }
    } catch {}

    const stored = usePortfolioStore.getState().testimonials;
    if (stored && stored.length > 0) return stored;
    return initialPortfolioData.testimonials || [];
  },

  // POST /api/testimonials
  async create(input: Omit<Testimonial, "id">): Promise<Testimonial> {
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (res.ok) {
        const created = await res.json();
        usePortfolioStore.getState().addTestimonial(created);
        return created;
      }
    } catch (err) {
      console.warn("Gagal POST /api/testimonials:", err);
    }

    const fallback: Testimonial = { ...input, id: `ts-${Date.now()}` };
    usePortfolioStore.getState().addTestimonial(fallback);
    return fallback;
  },

  // PUT /api/testimonials/:id
  async update(id: ID, patch: Partial<Testimonial>): Promise<void> {
    usePortfolioStore.getState().updateTestimonial(id, patch);

    try {
      await fetch(`/api/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    } catch (err) {
      console.warn(`Gagal PUT /api/testimonials/${id}:`, err);
    }
  },

  // DELETE /api/testimonials/:id
  async remove(id: ID): Promise<void> {
    usePortfolioStore.getState().removeTestimonial(id);

    try {
      await fetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn(`Gagal DELETE /api/testimonials/${id}:`, err);
    }
  },
};
