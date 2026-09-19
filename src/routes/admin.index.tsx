import { createFileRoute, Link, type LinkProps } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  FolderGit2,
  Inbox,
  Quote,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";

import { PageHeader, TableSkeleton } from "@/components/admin/crud";
import { useResource } from "@/hooks/useCrud";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { experienceService } from "@/services/experienceService";
import { messageService } from "@/services/messageService";
import { projectService } from "@/services/projectService";
import { skillService } from "@/services/skillService";
import { testimonialService } from "@/services/testimonialService";
import type { ReactNode } from "react";

export const Route = createFileRoute("/admin/")({
  component: DashboardPage,
});

function StatCard({
  icon,
  label,
  value,
  hint,
  to,
}: {
  icon: ReactNode;
  label: string;
  value: number | string;
  hint: string;
  to: NonNullable<LinkProps["to"]>;
}) {
  return (
    <Link
      to={to}
      className="glow-ring rounded-2xl border border-border bg-card p-5 shadow-card transition-transform hover:-translate-y-0.5"
    >
      <div className="flex items-center justify-between">
        <span className="grid size-10 place-items-center rounded-xl bg-gradient-brand text-primary-foreground">
          {icon}
        </span>
        <ArrowRight className="size-4 text-muted-foreground" />
      </div>
      <p className="mt-4 font-display text-3xl font-bold">{value}</p>
      <p className="text-sm font-medium">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </Link>
  );
}

function DashboardPage() {
  const projects = useResource("projects", projectService.list);
  const skills = useResource("skills", skillService.list);
  const experiences = useResource("experiences", experienceService.list);
  const testimonials = useResource("testimonials", testimonialService.list);
  const messages = useResource("messages", messageService.list);

  const unread = messages.data?.filter((message) => !message.read).length ?? 0;
  const featured = projects.data?.filter((project) => project.featured) ?? [];

  return (
    <div>
      <PageHeader
        title="Ringkasan portofolio"
        description="Semua data masih disimpan lokal di peramban. Setiap kartu di bawah menuju halaman CRUD-nya."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<FolderGit2 className="size-5" />}
          label="Proyek"
          value={projects.data?.length ?? 0}
          hint={`${featured.length} ditandai unggulan`}
          to="/admin/projects"
        />
        <StatCard
          icon={<Wrench className="size-5" />}
          label="Skill"
          value={skills.data?.length ?? 0}
          hint="dibagi per kategori"
          to="/admin/skills"
        />
        <StatCard
          icon={<Briefcase className="size-5" />}
          label="Pengalaman"
          value={experiences.data?.length ?? 0}
          hint="kerja & organisasi"
          to="/admin/experiences"
        />
        <StatCard
          icon={<Inbox className="size-5" />}
          label="Pesan masuk"
          value={messages.data?.length ?? 0}
          hint={`${unread} belum dibaca`}
          to="/admin/messages"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Pesan terbaru</h3>
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin/messages">
                Lihat semua <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>

          {messages.isPending ? (
            <TableSkeleton rows={3} />
          ) : (messages.data?.length ?? 0) === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Belum ada pesan masuk.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {messages.data?.slice(0, 4).map((message) => (
                <li key={message.id} className="flex items-start gap-3 py-3">
                  <span
                    className={`mt-2 size-2 shrink-0 rounded-full ${
                      message.read ? "bg-muted" : "bg-primary shadow-glow"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-sm font-medium">
                      {message.name}
                      <span className="text-xs font-normal text-muted-foreground">
                        {message.email}
                      </span>
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                      {message.content}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">Proyek unggulan</h3>
              <Star className="size-4 text-warning" />
            </div>
            {projects.isPending ? (
              <TableSkeleton rows={2} />
            ) : featured.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada proyek unggulan.</p>
            ) : (
              <ul className="space-y-2">
                {featured.map((project) => (
                  <li
                    key={project.id}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"
                  >
                    <img
                      src={project.thumbnail}
                      alt=""
                      className="size-10 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{project.title}</p>
                      <p className="text-xs text-muted-foreground">{project.category}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="font-display text-lg font-semibold">Testimoni</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {testimonials.data?.length ?? 0} testimoni tampil di halaman depan.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full gap-2">
              <Link to="/admin/cover-letter">
                <Sparkles className="size-4" /> Generator surat lamaran
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="mt-2 w-full">
              <Link to="/admin/testimonials">
                <Quote className="mr-2 size-4" /> Kelola testimoni
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">mock data</Badge>
        Ganti isi file di folder services dengan fetch() ke REST API milikmu — komponen UI
        tidak perlu diubah.
      </div>
    </div>
  );
}
