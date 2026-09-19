import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

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
import { Slider } from "@/components/ui/slider";
import { skillService } from "@/services/skillService";
import type { Skill, SkillCategory, SkillLevel } from "@/types";

export const Route = createFileRoute("/admin/skills")({
  component: SkillsPage,
});

const categories: SkillCategory[] = ["Frontend", "Backend", "Database", "DevOps/Tools"];
const levels: SkillLevel[] = ["Beginner", "Intermediate", "Advanced", "Expert"];

type Draft = Omit<Skill, "id">;

const emptyDraft: Draft = {
  name: "",
  category: "Frontend",
  percentage: 80,
  level: "Advanced",
  icon: "⚡",
};

function SkillsPage() {
  const skillsQuery = useResource("skills", skillService.list);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [pendingDelete, setPendingDelete] = useState<Skill | null>(null);

  const createSkill = useAction(skillService.create, { success: "Skill ditambahkan." });
  const updateSkill = useAction(
    (variables: { id: string; patch: Partial<Skill> }) =>
      skillService.update(variables.id, variables.patch),
    { success: "Skill diperbarui." },
  );
  const deleteSkill = useAction(skillService.remove, { success: "Skill dihapus." });

  const startCreate = () => {
    setEditing(null);
    setDraft(emptyDraft);
    setOpen(true);
  };

  const startEdit = (skill: Skill) => {
    setEditing(skill);
    setDraft({
      name: skill.name,
      category: skill.category,
      percentage: skill.percentage,
      level: skill.level,
      icon: skill.icon,
    });
    setOpen(true);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim()) return;
    if (editing) {
      updateSkill.mutate({ id: editing.id, patch: draft });
    } else {
      createSkill.mutate(draft);
    }
    setOpen(false);
  };

  const isPending = createSkill.isPending || updateSkill.isPending;

  return (
    <div>
      <PageHeader
        title="Skill"
        description="Kategori dan persentase ini yang digambar sebagai batang kemahiran di halaman depan."
        action={
          <Button onClick={startCreate} className="shadow-glow">
            <Plus className="mr-2 size-4" /> Tambah skill
          </Button>
        }
      />

      {skillsQuery.isPending ? (
        <TableSkeleton />
      ) : (skillsQuery.data?.length ?? 0) === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Belum ada skill. Tambahkan satu ya.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs text-muted-foreground uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Skill</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Level</th>
                <th className="w-56 px-4 py-3 font-medium">Kemahiran</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {skillsQuery.data?.map((skill) => (
                <tr key={skill.id} className="hover:bg-accent/40">
                  <td className="px-4 py-3 font-medium">
                    <span className="mr-2">{skill.icon}</span>
                    {skill.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{skill.category}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{skill.level}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-brand"
                          style={{ width: `${skill.percentage}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground">
                        {skill.percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(skill)}
                        aria-label={`Ubah ${skill.name}`}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setPendingDelete(skill)}
                        aria-label={`Hapus ${skill.name}`}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Ubah skill" : "Skill baru"}
        isPending={isPending}
        onSubmit={submit}
        submitLabel={editing ? "Simpan perubahan" : "Tambah skill"}
      >
        <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
          <Field label="Nama skill" htmlFor="skill-name">
            <Input
              id="skill-name"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              placeholder="mis. GraphQL"
            />
          </Field>
          <Field label="Ikon" htmlFor="skill-icon" hint="Emoji singkat.">
            <Input
              id="skill-icon"
              value={draft.icon}
              onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Kategori">
            <Select
              value={draft.category}
              onValueChange={(value) =>
                setDraft({ ...draft, category: value as SkillCategory })
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
          <Field label="Level">
            <Select
              value={draft.level}
              onValueChange={(value) => setDraft({ ...draft, level: value as SkillLevel })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field label={`Kemahiran — ${draft.percentage}%`}>
          <Slider
            value={[draft.percentage]}
            min={0}
            max={100}
            step={1}
            onValueChange={([value]) => setDraft({ ...draft, percentage: value })}
          />
        </Field>
      </FormDialog>

      <ConfirmDelete
        open={Boolean(pendingDelete)}
        onOpenChange={(value) => !value && setPendingDelete(null)}
        itemName={pendingDelete?.name ?? ""}
        isPending={deleteSkill.isPending}
        onConfirm={() => {
          if (pendingDelete) deleteSkill.mutate(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
