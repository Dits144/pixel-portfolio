import { usePortfolioStore } from "@/store/portfolioStore";
import type { ID, Testimonial } from "@/types";

import { createId, delay } from "./storage";

export const testimonialService = {
  // TODO: GET /api/testimonials
  async list(): Promise<Testimonial[]> {
    await delay(150);
    return usePortfolioStore.getState().testimonials;
  },

  // TODO: POST /api/testimonials
  async create(input: Omit<Testimonial, "id">): Promise<Testimonial> {
    await delay();
    const testimonial: Testimonial = { ...input, id: createId("ts") };
    usePortfolioStore.getState().addTestimonial(testimonial);
    return testimonial;
  },

  // TODO: PUT /api/testimonials/:id
  async update(id: ID, patch: Partial<Testimonial>): Promise<void> {
    await delay();
    usePortfolioStore.getState().updateTestimonial(id, patch);
  },

  // TODO: DELETE /api/testimonials/:id
  async remove(id: ID): Promise<void> {
    await delay(200);
    usePortfolioStore.getState().removeTestimonial(id);
  },
};
