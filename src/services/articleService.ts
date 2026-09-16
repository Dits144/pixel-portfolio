import { usePortfolioStore } from "@/store/portfolioStore";
import type { Article } from "@/types";

import { delay } from "./storage";

export const articleService = {
  // TODO: GET /api/articles
  async list(): Promise<Article[]> {
    await delay(150);
    return usePortfolioStore.getState().articles;
  },
};
