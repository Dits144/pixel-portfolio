import { usePortfolioStore } from "@/store/portfolioStore";
import type { ID, Message } from "@/types";

import { createId, delay } from "./storage";

export const messageService = {
  // TODO: GET /api/messages
  async list(): Promise<Message[]> {
    await delay(150);
    return usePortfolioStore.getState().messages;
  },

  // TODO: POST /api/messages (dipakai contact form publik)
  async send(input: { name: string; email: string; content: string }): Promise<Message> {
    await delay(800);
    const message: Message = {
      ...input,
      id: createId("ms"),
      read: false,
      createdAt: new Date().toISOString(),
    };
    usePortfolioStore.getState().addMessage(message);
    return message;
  },

  // TODO: PATCH /api/messages/:id
  async setRead(id: ID, read: boolean): Promise<void> {
    await delay(150);
    usePortfolioStore.getState().updateMessage(id, { read });
  },

  // TODO: DELETE /api/messages/:id
  async remove(id: ID): Promise<void> {
    await delay(200);
    usePortfolioStore.getState().removeMessage(id);
  },
};
