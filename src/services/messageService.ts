import { initialPortfolioData } from "@/mock-data";
import { usePortfolioStore } from "@/store/portfolioStore";
import type { ID, Message } from "@/types";

export const messageService = {
  // GET /api/messages
  async list(): Promise<Message[]> {
    try {
      const res = await fetch("/api/messages", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          usePortfolioStore.setState({ messages: data });
          return data;
        }
      }
    } catch {}

    const stored = usePortfolioStore.getState().messages;
    if (stored && stored.length > 0) return stored;
    return initialPortfolioData.messages || [];
  },

  // POST /api/messages
  async send(input: { name: string; email: string; content: string }): Promise<Message> {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (res.ok) {
        const created = await res.json();
        usePortfolioStore.getState().addMessage(created);
        return created;
      }
    } catch (err) {
      console.warn("Gagal POST /api/messages:", err);
    }

    const fallback: Message = {
      ...input,
      id: `ms-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    usePortfolioStore.getState().addMessage(fallback);
    return fallback;
  },

  // PATCH / PUT /api/messages/:id
  async setRead(id: ID, read: boolean): Promise<void> {
    usePortfolioStore.getState().updateMessage(id, { read });

    try {
      await fetch(`/api/messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read }),
      });
    } catch (err) {
      console.warn(`Gagal update read status message ${id}:`, err);
    }
  },

  // DELETE /api/messages/:id
  async remove(id: ID): Promise<void> {
    usePortfolioStore.getState().removeMessage(id);

    try {
      await fetch(`/api/messages/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn(`Gagal DELETE message ${id}:`, err);
    }
  },
};
