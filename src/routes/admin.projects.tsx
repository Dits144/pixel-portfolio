import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { projectService } from "@/services/projectService";
import type { Project, ProjectCategory } from "@/types";

export const Route = createFileRoute("/admin/projects")({
  component: ProjectsPage,
});

const categories: ProjectCategory[] = ["Web App", "Mobile", "API", "Landing Page"];

type Draft = Omit<Project, "id" | "createdAt">;

const emptyDraft: Draft = {
  title: "",
  description: "",
  thumbnail: "",
  techStack: [],
  demoUrl: "",
  githubUrl: "",
  category: "Web App",
  featured: false,
};

function ProjectsPage() {
  const projectsQuery = useResource("projects", projectService.list);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [techText, setTechText] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Project | null>(null);

  const createProject = useAction(projectService.create, { success: "Proyek ditambahkan." });
  const updateProject = useAction(
    (variables: { id: string; patch: Partial<Project> }) =>
      projectService.update(variables.id, variables.patch),
    { success: "Proyek diperbarui." },
  );
  const deleteProject = useAction(projectService.remove, { success: "Proyek dihapus." });

  const startCreate = () => {
    setEditing(null);
    setDraft(emptyDraft);
    setTechText("");
    setOpen(true);
  };

  const startEdit = (project: Project) => {
    setEditing(project);
    setDraft({
      title: project.title,
      description: project.description,
      thumbnail: project.thumbnail,
      techStack: project.techStack,
      demoUrl: project.demoUrl,
      githubUrl: project.githubUrl,
      category: project.category,
      featured: project.featured,
    });
    setTechText(project.techStack.join(", "));
    setOpen(true);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim()) {
      toast.error("Judul proyek wajib diisi.");
      return;
    }
    const payload = {
      ...draft,
      techStack: techText
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean),
    };
    if (editing) {
      updateProject.mutate({ id: editing.id, patch: payload });
    } else {
      createProject.mutate(payload);
    }
    setOpen(false);
  };

  const isPending = createProject.isPending || updateProject.isPending;

  return (
    <div>
      <PageHeader
        title="Proyek"
        description="Kartu proyek di halaman depan diambil dari daftar ini, diurutkan dari yang terbaru."
        action={
          <Button onClick={startCreate} className="shadow-glow">
            <Plus className="mr-2 size-4" /> Tambah proyek
          </Button>
        }
      />

      {projectsQuery.isPending ? (
        <TableSkeleton />
      ) : (projectsQuery.data?.length ?? 0) === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Belum ada proyek. Klik “Tambah proyek”.
        </p>
      ) : (
        <div className="space-y-3">
          {projectsQuery.data?.map((project) => (
            <article
              key={project.id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-card sm:flex-row sm:items-center"
            >
              {project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt=""
                  loading="lazy"
                  className="h-24 w-full shrink-0 rounded-xl object-cover sm:h-16 sm:w-28"
                />
              ) : (
                <div className="grid h-24 w-full shrink-0 place-items-center rounded-xl border border-dashed border-border bg-surface font-mono text-[10px] text-muted-foreground sm:h-16 sm:w-28">
                  tanpa gambar
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display font-semibold">{project.title}</h3>
                  {project.featured ? (
                    <Badge className="gap-1 bg-gradient-brand text-primary-foreground">
                      <Star className="size-3 fill-current" /> unggulan
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {project.description}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge variant="outline">{project.category}</Badge>
                  {project.techStack.slice(0, 4).map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {project.demoUrl ? (
                  <Button asChild variant="ghost" size="icon" aria-label="Buka demo">
                    <a href={project.demoUrl} target="_blank" rel="noreferrer">
                      <ExternalLink className="size-4" />
                    </a>
                  </Button>
                ) : null}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => startEdit(project)}
                  aria-label={`Ubah ${project.title}`}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPendingDelete(project)}
                  aria-label={`Hapus ${project.title}`}
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
        title={editing ? "Ubah proyek" : "Proyek baru"}
        isPending={isPending}
        onSubmit={submit}
        submitLabel={editing ? "Simpan perubahan" : "Tambah proyek"}
      >
        <Field label="Judul" htmlFor="project-title">
          <Input
            id="project-title"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="mis. Shoplytics Dashboard"
          />
        </Field>

        <Field label="Deskripsi" htmlFor="project-description">
          <Textarea
            id="project-description"
            rows={3}
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
        </Field>

        <Field label="Gambar (URL)" htmlFor="project-thumbnail">
          <Input
            id="project-thumbnail"
            value={draft.thumbnail}
            onChange={(e) => setDraft({ ...draft, thumbnail: e.target.value })}
            placeholder="/src/assets/project-1.jpg"
          />
        </Field>

        <Field
          label="Tech stack"
          htmlFor="project-tech"
          hint="Pisahkan dengan koma."
        >
          <Input
            id="project-tech"
            value={techText}
            onChange={(e) => setTechText(e.target.value)}
            placeholder="React, TypeScript, Node.js"
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tautan demo" htmlFor="project-demo">
            <Input
              id="project-demo"
              value={draft.demoUrl}
              onChange={(e) => setDraft({ ...draft, demoUrl: e.target.value })}
              placeholder="https://…"
            />
          </Field>
          <Field label="Tautan kode" htmlFor="project-github">
            <Input
              id="project-github"
              value={draft.githubUrl}
              onChange={(e) => setDraft({ ...draft, githubUrl: e.target.value })}
              placeholder="https://github.com/…"
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kategori">
            <Select
              value={draft.category}
              onValueChange={(value) =>
                setDraft({ ...draft, category: value as ProjectCategory })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="flex items-end gap-3 pb-1">
            <Switch
              id="project-featured"
              checked={draft.featured}
              onCheckedChange={(checked) => setDraft({ ...draft, featured: checked })}
            />
            <label htmlFor="project-featured" className="text-sm">
              Tandai unggulan
            </label>
          </div>
        </div>
      </FormDialog>

      <ConfirmDelete
        open={Boolean(pendingDelete)}
        onOpenChange={(value) => !value && setPendingDelete(null)}
        itemName={pendingDelete?.title ?? ""}
        isPending={deleteProject.isPending}
        onConfirm={() => {
          if (pendingDelete) deleteProject.mutate(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
