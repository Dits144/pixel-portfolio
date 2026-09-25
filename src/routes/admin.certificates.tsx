import { createFileRoute } from "@tanstack/react-router";
import {
  Award,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Eye,
  Grid,
  List,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Tag,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

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
import { DragDropUpload } from "@/components/ui/drag-drop-upload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { certificateService } from "@/services/certificateService";
import type { Certificate, CertificateCategory } from "@/types";

export const Route = createFileRoute("/admin/certificates")({
  component: CertificatesPage,
});

const categories: CertificateCategory[] = [
  "Cyber Security",
  "Fullstack",
  "Networking",
  "Cloud",
  "Other",
];

type Draft = Omit<Certificate, "id">;

const emptyDraft: Draft = {
  title: "",
  issuer: "",
  category: "Cyber Security",
  issueDate: "2024",
  expiryDate: "Tanpa Kadaluarsa",
  credentialId: "",
  credentialUrl: "",
  image: "",
  description: "",
  skills: [],
};

export default function CertificatesPage() {
  const certificatesQuery = useResource("certificates", certificateService.list);
  const [open, setOpen] = useState(false);
  const [previewCert, setPreviewCert] = useState<Certificate | null>(null);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [skillsInput, setSkillsInput] = useState("");
  const [pendingDelete, setPendingDelete] = useState<Certificate | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const createCert = useAction(certificateService.create, {
    success: "Sertifikat baru berhasil ditambahkan.",
  });
  const updateCert = useAction(
    (variables: { id: string; patch: Partial<Certificate> }) =>
      certificateService.update(variables.id, variables.patch),
    { success: "Sertifikat berhasil diperbarui." },
  );
  const deleteCert = useAction(certificateService.remove, {
    success: "Sertifikat berhasil dihapus.",
  });

  const startCreate = () => {
    setEditing(null);
    setDraft(emptyDraft);
    setSkillsInput("");
    setOpen(true);
  };

  const startEdit = (cert: Certificate) => {
    setEditing(cert);
    setDraft({
      title: cert.title,
      issuer: cert.issuer,
      category: cert.category,
      issueDate: cert.issueDate,
      expiryDate: cert.expiryDate || "Tanpa Kadaluarsa",
      credentialId: cert.credentialId || "",
      credentialUrl: cert.credentialUrl || "",
      image: cert.image,
      description: cert.description || "",
      skills: cert.skills || [],
    });
    setSkillsInput(cert.skills?.join(", ") || "");
    setOpen(true);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.title.trim() || !draft.issuer.trim()) return;

    const parsedSkills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Draft = {
      ...draft,
      skills: parsedSkills,
    };

    if (editing) {
      updateCert.mutate({ id: editing.id, patch: payload });
    } else {
      createCert.mutate(payload);
    }
    setOpen(false);
  };

  const isPending = createCert.isPending || updateCert.isPending;

  const filteredCerts = useMemo(() => {
    const list = certificatesQuery.data || [];
    return list.filter((cert) => {
      const matchCategory =
        selectedCategory === "Semua" || cert.category === selectedCategory;
      const matchSearch =
        search.trim() === "" ||
        cert.title.toLowerCase().includes(search.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(search.toLowerCase()) ||
        (cert.credentialId && cert.credentialId.toLowerCase().includes(search.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [certificatesQuery.data, selectedCategory, search]);

  const stats = useMemo(() => {
    const all = certificatesQuery.data || [];
    const cyber = all.filter((c) => c.category === "Cyber Security").length;
    const networking = all.filter((c) => c.category === "Networking").length;
    const fullstack = all.filter((c) => c.category === "Fullstack").length;
    return { total: all.length, cyber, networking, fullstack };
  }, [certificatesQuery.data]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Kelola Sertifikat & Lisensi"
        description="Kelola sertifikasi kredensial profesional, nomor registrasi BNSP/lembaga, dan berkas verifikasi pendukung."
        action={
          <Button onClick={startCreate} className="shadow-glow">
            <Plus className="mr-2 size-4" /> Tambah Sertifikat
          </Button>
        }
      />

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Sertifikat</span>
            <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <Award className="size-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold">{stats.total}</p>
          <p className="mt-1 text-xs text-muted-foreground">Tersimpan di portofolio</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cyber Security</span>
            <span className="grid size-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="size-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold">{stats.cyber}</p>
          <p className="mt-1 text-xs text-muted-foreground">Sertifikasi keamanan siber</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Networking</span>
            <span className="grid size-8 place-items-center rounded-lg bg-blue-500/10 text-blue-500">
              <CheckCircle2 className="size-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold">{stats.networking}</p>
          <p className="mt-1 text-xs text-muted-foreground">Termasuk BNSP Junior NetAdmin</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Fullstack & Lainnya</span>
            <span className="grid size-8 place-items-center rounded-lg bg-purple-500/10 text-purple-500">
              <Tag className="size-4" />
            </span>
          </div>
          <p className="mt-2 font-display text-2xl font-bold">{stats.fullstack}</p>
          <p className="mt-1 text-xs text-muted-foreground">Web & software development</p>
        </div>
      </div>

      {/* Filter and View Mode Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul, instansi, atau no. ID..."
              className="pl-9 text-xs"
            />
          </div>

          <div className="hidden flex-wrap items-center gap-1.5 md:flex">
            {["Semua", ...categories].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Category Select */}
          <div className="md:hidden">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Semua", ...categories].map((c) => (
                  <SelectItem key={c} value={c} className="text-xs">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View mode toggle */}
          <div className="flex rounded-lg border border-border bg-card p-0.5">
            <Button
              type="button"
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="size-7"
              onClick={() => setViewMode("grid")}
              title="Tampilan Grid Kartu"
            >
              <Grid className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant={viewMode === "table" ? "secondary" : "ghost"}
              size="icon"
              className="size-7"
              onClick={() => setViewMode("table")}
              title="Tampilan Tabel"
            >
              <List className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {certificatesQuery.isPending ? (
        <TableSkeleton rows={4} />
      ) : filteredCerts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Award className="mx-auto size-10 text-muted-foreground/60" />
          <h4 className="mt-3 font-display font-semibold text-foreground">Tidak Ada Sertifikat</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            {search ? "Tidak ada sertifikat yang cocok dengan pencarian." : "Belum ada sertifikat ditambahkan."}
          </p>
          <Button onClick={startCreate} variant="outline" size="sm" className="mt-4">
            <Plus className="mr-1.5 size-4" /> Tambah Baru
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCerts.map((cert) => (
            <div
              key={cert.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow"
            >
              <div>
                {/* Certificate Image Banner */}
                <div className="relative h-44 w-full overflow-hidden bg-surface">
                  {cert.image ? (
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-surface font-mono text-xs text-muted-foreground">
                      <Award className="size-8 opacity-40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute left-3 top-3 flex gap-1.5">
                    <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                      {cert.category}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-[11px] font-medium opacity-80">{cert.issuer}</p>
                    <h3 className="line-clamp-1 font-display font-semibold text-white">
                      {cert.title}
                    </h3>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="size-3 text-primary" /> {cert.issueDate}
                    </span>
                    {cert.credentialId ? (
                      <span className="max-w-[130px] truncate font-mono text-[10px] bg-muted/60 px-1.5 py-0.5 rounded">
                        ID: {cert.credentialId}
                      </span>
                    ) : null}
                  </div>

                  {cert.description ? (
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {cert.description}
                    </p>
                  ) : null}

                  {cert.skills && cert.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {cert.skills.slice(0, 3).map((s) => (
                        <span
                          key={s}
                          className="rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] text-muted-foreground"
                        >
                          {s}
                        </span>
                      ))}
                      {cert.skills.length > 3 ? (
                        <span className="rounded-md border border-border bg-surface px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          +{cert.skills.length - 3}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between border-t border-border bg-surface/40 px-4 py-2.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewCert(cert)}
                  className="h-7 text-xs text-primary hover:text-primary"
                >
                  <Eye className="mr-1 size-3.5" /> Lihat Detail
                </Button>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => startEdit(cert)}
                    title="Ubah Sertifikat"
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-destructive hover:text-destructive"
                    onClick={() => setPendingDelete(cert)}
                    title="Hapus Sertifikat"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Sertifikat</th>
                <th className="px-4 py-3 font-medium">Instansi Penerbit</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">No. Kredensial</th>
                <th className="px-4 py-3 font-medium">Tahun</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCerts.map((cert) => (
                <tr key={cert.id} className="hover:bg-accent/40">
                  <td className="px-4 py-3 font-medium flex items-center gap-3">
                    {cert.image ? (
                      <img
                        src={cert.image}
                        alt=""
                        className="size-9 rounded-lg object-cover border border-border shrink-0"
                      />
                    ) : (
                      <div className="size-9 rounded-lg bg-surface grid place-items-center border border-border shrink-0 text-muted-foreground">
                        <Award className="size-4" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-foreground">{cert.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{cert.description}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{cert.issuer}</td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{cert.category}</Badge>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {cert.credentialId || "-"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{cert.issueDate}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => setPreviewCert(cert)}
                        title="Lihat Detail"
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => startEdit(cert)}
                        title="Ubah"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        onClick={() => setPendingDelete(cert)}
                        title="Hapus"
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

      {/* Create / Edit Form Dialog */}
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Ubah Sertifikat" : "Tambah Sertifikat Baru"}
        isPending={isPending}
        onSubmit={submit}
        submitLabel={editing ? "Simpan Perubahan" : "Tambahkan Sertifikat"}
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <Field label="Judul Sertifikat" htmlFor="cert-title">
            <Input
              id="cert-title"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="mis. Junior Network Administrator"
              required
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Instansi Penerbit" htmlFor="cert-issuer">
              <Input
                id="cert-issuer"
                value={draft.issuer}
                onChange={(e) => setDraft({ ...draft, issuer: e.target.value })}
                placeholder="mis. BNSP / Cisco / Dicoding"
                required
              />
            </Field>

            <Field label="Kategori">
              <Select
                value={draft.category}
                onValueChange={(val) =>
                  setDraft({ ...draft, category: val as CertificateCategory })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tahun / Tanggal Terbit" htmlFor="cert-date">
              <Input
                id="cert-date"
                value={draft.issueDate}
                onChange={(e) => setDraft({ ...draft, issueDate: e.target.value })}
                placeholder="mis. 2024 atau Mei 2024"
              />
            </Field>

            <Field label="Masa Berlaku" htmlFor="cert-expiry">
              <Input
                id="cert-expiry"
                value={draft.expiryDate || ""}
                onChange={(e) => setDraft({ ...draft, expiryDate: e.target.value })}
                placeholder="mis. 2027 atau Tanpa Kadaluarsa"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nomor Kredensial / Lisensi" htmlFor="cert-cred-id">
              <Input
                id="cert-cred-id"
                value={draft.credentialId || ""}
                onChange={(e) => setDraft({ ...draft, credentialId: e.target.value })}
                placeholder="mis. BNSP-JNA-5421-2024"
              />
            </Field>

            <Field label="Tautan Verifikasi URL" htmlFor="cert-url">
              <Input
                id="cert-url"
                value={draft.credentialUrl || ""}
                onChange={(e) => setDraft({ ...draft, credentialUrl: e.target.value })}
                placeholder="https://bnsp.go.id atau link verifikasi"
              />
            </Field>
          </div>

          {/* Drag and Drop Image Upload */}
          <DragDropUpload
            label="Foto / Scan Sertifikat (Drag & Drop)"
            value={draft.image}
            onChange={(val) => setDraft({ ...draft, image: val })}
            hint="Tarik gambar sertifikat (JPG, PNG, WEBP) atau masukkan URL"
          />

          <Field label="Deskripsi / Kompetensi yang Divalidasi" htmlFor="cert-desc">
            <Textarea
              id="cert-desc"
              rows={3}
              value={draft.description || ""}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              placeholder="Jelaskan kompetensi, materi ujian, atau keahlian yang terakreditasi..."
            />
          </Field>

          <Field
            label="Keahlian Terkait (Skills)"
            htmlFor="cert-skills"
            hint="Pisahkan dengan tanda koma."
          >
            <Input
              id="cert-skills"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="mis. LAN/WAN, Routing, IP Subnetting, Network Security"
            />
          </Field>
        </div>
      </FormDialog>

      {/* Modal Preview Detail Sertifikat */}
      <Dialog open={Boolean(previewCert)} onOpenChange={(v) => !v && setPreviewCert(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {previewCert ? (
            <div className="space-y-5">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-primary">{previewCert.category}</Badge>
                  <span className="text-xs text-muted-foreground">{previewCert.issuer}</span>
                </div>
                <DialogTitle className="text-xl font-display font-bold">
                  {previewCert.title}
                </DialogTitle>
                <DialogDescription>
                  Diterbitkan: {previewCert.issueDate} · Masa Berlaku: {previewCert.expiryDate || "Tanpa Kadaluarsa"}
                </DialogDescription>
              </DialogHeader>

              {previewCert.image ? (
                <div className="overflow-hidden rounded-xl border border-border bg-surface">
                  <img
                    src={previewCert.image}
                    alt={previewCert.title}
                    className="max-h-[350px] w-full object-contain bg-black/40"
                  />
                </div>
              ) : null}

              {previewCert.credentialId ? (
                <div className="rounded-xl border border-border/80 bg-surface/50 p-3.5 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="block text-[10px] uppercase font-mono text-muted-foreground">ID Kredensial</span>
                    <span className="font-mono text-sm font-semibold text-foreground">{previewCert.credentialId}</span>
                  </div>
                  {previewCert.credentialUrl ? (
                    <Button asChild size="sm" variant="outline" className="text-xs">
                      <a href={previewCert.credentialUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="mr-1.5 size-3.5" /> Verifikasi Resmi
                      </a>
                    </Button>
                  ) : null}
                </div>
              ) : null}

              {previewCert.description ? (
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Tentang Sertifikasi</h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">{previewCert.description}</p>
                </div>
              ) : null}

              {previewCert.skills && previewCert.skills.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Keahlian Tervalidasi</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {previewCert.skills.map((s) => (
                      <Badge key={s} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <ConfirmDelete
        open={Boolean(pendingDelete)}
        onOpenChange={(v) => !v && setPendingDelete(null)}
        itemName={pendingDelete?.title ?? ""}
        isPending={deleteCert.isPending}
        onConfirm={() => {
          if (pendingDelete) deleteCert.mutate(pendingDelete.id);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
