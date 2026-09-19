import { createFileRoute } from "@tanstack/react-router";
import { CheckCheck, MailOpen, MailX, Trash2 } from "lucide-react";
import { useState } from "react";

import { ConfirmDelete, PageHeader, TableSkeleton } from "@/components/admin/crud";
import { useAction, useRefresh, useResource } from "@/hooks/useCrud";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { messageService } from "@/services/messageService";
import type { Message } from "@/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/messages")({
  component: MessagesPage,
});

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));

function MessagesPage() {
  const messagesQuery = useResource("messages", messageService.list);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Message | null>(null);
  const refresh = useRefresh();

  const setRead = useAction(
    (variables: { id: string; read: boolean }) => messageService.setRead(variables.id, variables.read),
    { success: "Status pesan diperbarui." },
  );
  const removeMessage = useAction(messageService.remove, { success: "Pesan dihapus." });

  const messages = messagesQuery.data ?? [];
  const selected = messages.find((message) => message.id === selectedId) ?? messages[0];

  const openMessage = (message: Message) => {
    setSelectedId(message.id);
    if (!message.read) setRead.mutate({ id: message.id, read: true });
  };

  const markAllRead = async () => {
    const unread = messages.filter((message) => !message.read);
    await Promise.all(unread.map((message) => messageService.setRead(message.id, true)));
    refresh();
  };

  return (
    <div>
      <PageHeader
        title="Pesan masuk"
        description="Isi kotak masuk ini berasal dari formulir kontak di halaman depan."
        action={
          <Button variant="outline" onClick={markAllRead} disabled={setRead.isPending}>
            <CheckCheck className="mr-2 size-4" /> Tandai semua dibaca
          </Button>
        }
      />

      {messagesQuery.isPending ? (
        <TableSkeleton />
      ) : messages.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Kotak masuk kosong.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
          <ul className="space-y-2">
            {messages.map((message) => (
              <li key={message.id}>
                <button
                  type="button"
                  onClick={() => openMessage(message)}
                  className={cn(
                    "w-full rounded-2xl border p-4 text-left transition-colors",
                    selected?.id === message.id
                      ? "border-primary/60 bg-accent/40"
                      : "border-border bg-card hover:bg-accent/30",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-2">
                      {!message.read ? (
                        <span className="size-2 shrink-0 rounded-full bg-primary shadow-glow" />
                      ) : null}
                      <span
                        className={cn(
                          "truncate",
                          message.read ? "font-normal" : "font-semibold",
                        )}
                      >
                        {message.name}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {message.content}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-card lg:sticky lg:top-4">
            {selected ? (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-lg font-semibold">
                      {selected.name}
                    </h3>
                    <a
                      href={`mailto:${selected.email}`}
                      className="truncate text-sm text-primary underline-offset-4 hover:underline"
                    >
                      {selected.email}
                    </a>
                  </div>
                  <Badge variant={selected.read ? "secondary" : "default"}>
                    {selected.read ? "dibaca" : "baru"}
                  </Badge>
                </div>

                <p className="mt-4 font-mono text-xs text-muted-foreground">
                  {formatDate(selected.createdAt)}
                </p>

                <p className="mt-4 text-sm leading-relaxed whitespace-pre-wrap">
                  {selected.content}
                </p>

                <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRead.mutate({ id: selected.id, read: !selected.read })}
                  >
                    {selected.read ? (
                      <>
                        <MailX className="mr-2 size-4" /> Tandai belum dibaca
                      </>
                    ) : (
                      <>
                        <MailOpen className="mr-2 size-4" /> Tandai dibaca
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setPendingDelete(selected)}
                  >
                    <Trash2 className="mr-2 size-4" /> Hapus
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Pilih pesan untuk membacanya.</p>
            )}
          </aside>
        </div>
      )}

      <ConfirmDelete
        open={Boolean(pendingDelete)}
        onOpenChange={(value) => !value && setPendingDelete(null)}
        itemName={pendingDelete?.name ?? ""}
        isPending={removeMessage.isPending}
        onConfirm={() => {
          if (pendingDelete) {
            removeMessage.mutate(pendingDelete.id);
            setSelectedId(null);
          }
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
