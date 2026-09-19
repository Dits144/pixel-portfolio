import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
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
import { testimonialService } from "@/services/testimonialService";
import type { Testimonial } from "@/types";

export const Route = createFileRoute("/admin/testimonials")({
  component: TestimonialsPage,
});

type Draft = Omit<Testimonial, "id">;

const emptyDraft: Draft = {
  name: "",
  role: "",
  photo: "",
  content: "",
  rating: 5,
};

function TestimonialsPage() {
  const testimonialsQuery = useResource("testimonials", testimonialService.list);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [pendingDelete, setPendingDelete] = useState<Testimonial | null>(null);

  const createTestimonial = useAction(testimonialService.create, {
    success: "Testimoni ditambahkan.",
  });
  const updateTestimonial = useAction(
    (variables: { id: string; patch: Partial<Testimonial> }) =>
      testimonialService.update(variables.id, variables.patch),
    { success: "Testimoni diperbarui." },
  );
  const removeTestimonial = useAction(testimonialService.remove, {
    success: "Testimoni dihapus.",
  });

  const startCreate = () => {
    setEditing(null);
    setDraft(emptyDraft);
    setOpen(true);
  };

  const startEdit = (testimonial: Testimonial) => {
    setEditing(testimonial);
    setDraft({
      name: testimonial.name,
      role: testimonial.role,
      photo: testimonial.photo,
      content: testimonial.content,
      rating: testimonial.rating,
    });
    setOpen(true);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim() || draft.content.trim().length < 10) {
      toast.error("Nama wajib diisi dan isi testimoni minimal 10 karakter.");
      return;
    }
    if (editing) {
      updateTestimonial.mutate({ id: editing.id, patch: draft });
    } else {
      createTestimonial.mutate(draft);
    }
    setOpen(false);
  };

  const isPending = createTestimonial.isPending || updateTestimonial.isPending;

  return (
    <div>
      <PageHeader
        title="Testimoni"
        description="Tampil sebagai slider otomatis di halaman depan. Rating 1–5."
        action={
          <Button onClick={startCreate} className="shadow-glow">
            <Plus className="mr-2 size-4" /> Tambah testimoni
          </Button>
        }
      />

      {testimonialsQuery.isPending ? (
        <TableSkeleton />
      ) : (testimonialsQuery.data?.length ?? 0) === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Belum ada testimoni.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {testimonialsQuery.data?.map((testimonial) => (
            <article
              key={testimonial.id}
              className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.photo}
                  alt=""
                  loading="lazy"
                  className="size-11 rounded-full border border-border object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{testimonial.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
                <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground">
                  <Star className="size-3.5 fill-warning text-warning" /> {testimonial.rating}
                </span>
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                “{testimonial.content}”
              </p>

              <div className="mt-4 flex justify-end gap-1 border-t border-border pt-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => startEdit(testimonial)}
                  aria-label={`Ubah testimoni ${testimonial.name}`}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPendingDelete(testimonial)}
                  aria-label={`Hapus testimoni ${testimonial.name}`}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Ubah testimoni" : "Testimoni baru"}
        isPending={isPending}
        onSubmit={submit}
        submitLabel={editing ? "Simpan perubahan" : "Tambah testimoni"}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nama" htmlFor="ts-name">
            <Input
              id="ts-name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </Field>
          <Field label="Jabatan & perusahaan" htmlFor="ts-role">
            <Input
              id="ts-role"
              value={draft.role}
              onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              placeholder="CTO, Kreasi Studio"
            />
          </Field>
        </div>

        <Field label="Foto (URL)" htmlFor="ts-photo">
          <Input
            id="ts-photo"
            value={draft.photo}
            onChange={(e) => setDraft({ ...draft, photo: e.target.value })}
          />
        </Field>

        <Field label="Isi testimoni" htmlFor="ts-content">
          <Textarea
            id="ts-content"
            rows={4}
            value={draft.content}
            onChange={(e) => setDraft({ ...draft, content: e.target.value })}
          />
        </Field>

        <Field label="Rating">
          <Select
            value={String(draft.rating)}
            onValueChange={(value) => setDraft({ ...draft, rating: Number(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 4, 3, 2, 1].map((rating) => (
                <SelectItem key={rating} value={String(rating)}>
                  {rating} bintang
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </FormDialog>

      <ConfirmDelete
        open={Boolean(pendingDelete)}
        onOpenChange={(value) => !value && setPendingDelete(null)}
        itemName={pendingDelete?.name ?? ""}
        isPending={removeTestimonial.isPending}
        onConfirm={() => {
          if (pendingDelete) removeTestimonial.mutate(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
