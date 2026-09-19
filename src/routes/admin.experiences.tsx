import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  ConfirmDelete,
  Field,
  FormDialog,
  PageHeader,
  TableSkeleton,
} from "@/components/admin/crud";
import { useAction, useResource } from "@/hooks/useCrud";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { experienceService } from "@/services/experienceService";
import type { Experience } from "@/types";

export const Route = createFileRoute("/admin/experiences")({
  component: ExperiencesPage,
});

const types: Experience["type"][] = ["Work", "Organization", "Education"];

type Draft = Omit<Experience, "id">;

const emptyDraft: Draft = {
  position: "",
  company: "",
  period: "",
  description: "",
  type: "Work",
};

function ExperiencesPage() {
  const experiencesQuery = useResource("experiences", experienceService.list);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [pendingDelete, setPendingDelete] = useState<Experience | null>(null);

  const createExperience = useAction(experienceService.create, {
    success: "Pengalaman ditambahkan.",
  });
  const updateExperience = useAction(
    (variables: { id: string; patch: Partial<Experience> }) =>
      experienceService.update(variables.id, variables.patch),
    { success: "Pengalaman diperbarui." },
  );
  const removeExperience = useAction(experienceService.remove, {
    success: "Pengalaman dihapus.",
  });

  const startCreate = () => {
    setEditing(null);
    setDraft(emptyDraft);
    setOpen(true);
  };

  const startEdit = (experience: Experience) => {
    setEditing(experience);
    setDraft({
      position: experience.position,
      company: experience.company,
      period: experience.period,
      description: experience.description,
      type: experience.type,
    });
    setOpen(true);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.position.trim() || !draft.company.trim()) {
      toast.error("Posisi dan perusahaan wajib diisi.");
      return;
    }
    if (editing) {
      updateExperience.mutate({ id: editing.id, patch: draft });
    } else {
      createExperience.mutate(draft);
    }
    setOpen(false);
  };

  const isPending = createExperience.isPending || updateExperience.isPending;

  return (
    <div>
      <PageHeader
        title="Pengalaman"
        description="Urutan di daftar ini sama dengan urutan timeline di halaman depan."
        action={
          <Button onClick={startCreate} className="shadow-glow">
            <Plus className="mr-2 size-4" /> Tambah pengalaman
          </Button>
        }
      />

      {experiencesQuery.isPending ? (
        <TableSkeleton />
      ) : (experiencesQuery.data?.length ?? 0) === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Belum ada pengalaman kerja.
        </p>
      ) : (
        <ol className="space-y-3">
          {experiencesQuery.data?.map((experience, index) => (
            <li
              key={experience.id}
              className="flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-card"
            >
              <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-lg bg-surface font-mono text-xs text-muted-foreground">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display font-semibold">{experience.position}</h3>
                  <Badge variant="secondary">{experience.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {experience.company} · <span className="font-mono">{experience.period}</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{experience.description}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => startEdit(experience)}
                  aria-label={`Ubah ${experience.position}`}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPendingDelete(experience)}
                  aria-label={`Hapus ${experience.position}`}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </li>
          ))}
        </ol>
      )}

      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Ubah pengalaman" : "Pengalaman baru"}
        isPending={isPending}
        onSubmit={submit}
        submitLabel={editing ? "Simpan perubahan" : "Tambah pengalaman"}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Posisi" htmlFor="exp-position">
            <Input
              id="exp-position"
              value={draft.position}
              onChange={(e) => setDraft({ ...draft, position: e.target.value })}
              placeholder="mis. Frontend Developer"
            />
          </Field>
          <Field label="Perusahaan / organisasi" htmlFor="exp-company">
            <Input
              id="exp-company"
              value={draft.company}
              onChange={(e) => setDraft({ ...draft, company: e.target.value })}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Periode" htmlFor="exp-period">
            <Input
              id="exp-period"
              value={draft.period}
              onChange={(e) => setDraft({ ...draft, period: e.target.value })}
              placeholder="2024 — Sekarang"
            />
          </Field>
          <Field label="Tipe">
            <Select
              value={draft.type}
              onValueChange={(value) => setDraft({ ...draft, type: value as Experience["type"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label="Deskripsi" htmlFor="exp-description">
          <Textarea
            id="exp-description"
            rows={4}
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
        </Field>
      </FormDialog>

      <ConfirmDelete
        open={Boolean(pendingDelete)}
        onOpenChange={(value) => !value && setPendingDelete(null)}
        itemName={pendingDelete?.position ?? ""}
        isPending={removeExperience.isPending}
        onConfirm={() => {
          if (pendingDelete) removeExperience.mutate(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
