import { useBrandStore } from "@/store/brandStore";
import type { BrandItem } from "@/types/brand";
import { createId, delay } from "./storage";

export const brandService = {
  async list(): Promise<BrandItem[]> {
    await delay(120);
    return useBrandStore
      .getState()
      .brands.sort((a, b) => a.sortOrder - b.sortOrder);
  },

  async create(input: Omit<BrandItem, "id">): Promise<BrandItem> {
    await delay();
    const item: BrandItem = { ...input, id: createId("br") };
    useBrandStore.getState().addBrand(item);
    return item;
  },

  async update(id: string, patch: Partial<BrandItem>): Promise<void> {
    await delay();
    useBrandStore.getState().updateBrand(id, patch);
  },

  async remove(id: string): Promise<void> {
    await delay(200);
    useBrandStore.getState().removeBrand(id);
  },
};
