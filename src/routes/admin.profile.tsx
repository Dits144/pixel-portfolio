import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Field, PageHeader, TableSkeleton } from "@/components/admin/crud";
import { useAction, useResource } from "@/hooks/useCrud";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { profileService } from "@/services/profileService";
import type { Profile } from "@/types";

export const Route = createFileRoute("/admin/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const profileQuery = useResource("profile", profileService.get);
  const [draft, setDraft] = useState<Profile | null>(null);

  useEffect(() => {
    if (profileQuery.data && !draft) setDraft(profileQuery.data);
  }, [draft, profileQuery.data]);

  const save = useAction(profileService.update, {
    success: "Profil disimpan.",
    error: "Profil gagal disimpan.",
  });

  if (!draft) {
    return (
      <div>
        <PageHeader title="Profil" />
        <TableSkeleton rows={6} />
      </div>
    );
  }

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setDraft((current) => (current ? { ...current, [key]: value } : current));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim() || !draft.email.trim()) {
      toast.error("Nama dan email wajib diisi.");
      return;
    }
    save.mutate(draft);
  };

  return (
    <form onSubmit={submit}>
      <PageHeader
        title="Profil"
        description="Data ini dipakai di bagian hero, tentang, kontak, dan footer."
        action={
          <Button type="submit" className="shadow-glow" disabled={save.isPending}>
            {save.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Save className="mr-2 size-4" />
            )}
            Simpan
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="font-display text-lg font-semibold">Identitas</h3>
          <Field label="Nama lengkap" htmlFor="name">
            <Input id="name" value={draft.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <Field label="Jabatan" htmlFor="role">
            <Input id="role" value={draft.role} onChange={(e) => set("role", e.target.value)} />
          </Field>
          <Field label="Tagline" htmlFor="tagline" hint="Kalimat singkat di bawah nama.">
            <Textarea
              id="tagline"
              rows={2}
              value={draft.tagline}
              onChange={(e) => set("tagline", e.target.value)}
            />
          </Field>
          <Field label="Cerita lengkap" htmlFor="about">
            <Textarea
              id="about"
              rows={6}
              value={draft.about}
              onChange={(e) => set("about", e.target.value)}
            />
          </Field>
          <Field label="Foto (URL)" htmlFor="photo">
            <Input id="photo" value={draft.photo} onChange={(e) => set("photo", e.target.value)} />
          </Field>
        </section>

        <section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card">
          <h3 className="font-display text-lg font-semibold">Kontak</h3>
          <Field label="Email" htmlFor="email">
            <Input id="email" value={draft.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Lokasi" htmlFor="location">
            <Input
              id="location"
              value={draft.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </Field>
          <Field label="Nama file CV" htmlFor="cvFileName">
            <Input
              id="cvFileName"
              value={draft.cvFileName}
              onChange={(e) => set("cvFileName", e.target.value)}
            />
          </Field>
          <Field
            label="Kata yang diketik di hero"
            htmlFor="typing"
            hint="Pisahkan dengan koma."
          >
            <Input
              id="typing"
              value={draft.typingWords.join(", ")}
              onChange={(e) =>
                set(
                  "typingWords",
                  e.target.value
                    .split(",")
                    .map((word) => word.trim())
                    .filter(Boolean),
                )
              }
            />
          </Field>

          <h3 className="pt-2 font-display text-lg font-semibold">Angka statistik</h3>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Tahun" htmlFor="years">
              <Input
                id="years"
                type="number"
                min={0}
                value={draft.stats.yearsExperience}
                onChange={(e) =>
                  set("stats", {
                    ...draft.stats,
                    yearsExperience: Number(e.target.value),
                  })
                }
              />
            </Field>
            <Field label="Proyek" htmlFor="projects">
              <Input
                id="projects"
                type="number"
                min={0}
                value={draft.stats.projects}
                onChange={(e) =>
                  set("stats", { ...draft.stats, projects: Number(e.target.value) })
                }
              />
            </Field>
            <Field label="Klien" htmlFor="clients">
              <Input
                id="clients"
                type="number"
                min={0}
                value={draft.stats.clients}
                onChange={(e) =>
                  set("stats", { ...draft.stats, clients: Number(e.target.value) })
                }
              />
            </Field>
          </div>

          <h3 className="pt-2 font-display text-lg font-semibold">Jaringan sosial</h3>
          {(["github", "linkedin", "instagram", "whatsapp"] as const).map((key) => (
            <Field key={key} label={key} htmlFor={`social-${key}`}>
              <Input
                id={`social-${key}`}
                value={draft.socials[key]}
                onChange={(e) => set("socials", { ...draft.socials, [key]: e.target.value })}
              />
            </Field>
          ))}
        </section>
      </div>
    </form>
  );
}
