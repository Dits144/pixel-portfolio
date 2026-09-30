import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Award,
  CheckCircle2,
  Database,
  Download,
  FolderGit2,
  HardDrive,
  Inbox,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Upload,
  User,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/admin/crud";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRefresh } from "@/hooks/useCrud";
import { radityaDB } from "@/lib/database";

export const Route = createFileRoute("/admin/database")({
  component: DatabaseManagerPage,
});

export default function DatabaseManagerPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const refresh = useRefresh();

  const loadStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (res.ok) {
        const s = await res.json();
        setStatus(s);
      } else {
        const s = await radityaDB.getStatus();
        setStatus(s);
      }
    } catch {
      const s = await radityaDB.getStatus();
      setStatus(s);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const handleExport = async () => {
    try {
      toast.loading("Mengekspor seluruh database server...");
      const res = await fetch("/api/database/export");
      const data = res.ok ? await res.json() : await radityaDB.exportAll();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const dateStr = new Date().toISOString().slice(0, 10);
      link.href = url;
      link.download = `raditya-tech-database-backup-${dateStr}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success("Database berhasil diekspor ke file JSON!");
    } catch (err) {
      toast.dismiss();
      toast.error("Gagal mengekspor database.");
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        toast.loading("Memulihkan database dari file backup...");
        const json = JSON.parse(event.target?.result as string);
        await radityaDB.importAll(json);
        await loadStatus();
        refresh();
        toast.dismiss();
        toast.success("Database berhasil dipulihkan dari backup!");
      } catch (err) {
        toast.dismiss();
        toast.error("File backup tidak valid atau format salah.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleReset = async () => {
    setResetting(true);
    try {
      await fetch("/api/database/reset", { method: "POST" });
      await radityaDB.reset();
      await loadStatus();
      refresh();
      setResetDialogOpen(false);
      toast.success("Database di VPS & lokal berhasil direset ke awal.");
    } catch (err) {
      toast.error("Gagal mereset database.");
    } finally {
      setResetting(false);
    }
  };

  const collections = [
    { name: "certificates", label: "Sertifikat & Lisensi", icon: Award, desc: "Kredensial BNSP, Cisco, dsb." },
    { name: "skills", label: "Keahlian & Tech Stack", icon: Wrench, desc: "Cyber Security, Frontend, dsb." },
    { name: "projects", label: "Proyek Unggulan", icon: FolderGit2, desc: "Portofolio aplikasi & repositori" },
    { name: "coverLetters", label: "Surat Lamaran AI", icon: Sparkles, desc: "Draf surat lamaran resmi tersimpan" },
    { name: "profile", label: "Data Profil Pribadi", icon: User, desc: "Identitas, kontak, pendidikan, TTD" },
    { name: "messages", label: "Pesan Kontak Masuk", icon: Inbox, desc: "Formulir kontak publik" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pusat Database & Penyimpanan"
        description="Kelola penyimpanan data lokal berkinerja tinggi (IndexedDB). Data tersimpan aman di peramban tanpa batas kuota, dengan fitur pencadangan (backup) dan pemulihan (restore)."
      />

      {/* Database Health Card */}
      <div className="rounded-2xl border border-primary/30 bg-card p-6 shadow-glow">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Database className="size-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-bold text-foreground">
                  RadityaDB Enterprise Storage
                </h3>
                <Badge className="bg-emerald-500/90 text-white gap-1 text-[11px]">
                  <CheckCircle2 className="size-3" /> Online & Terhubung
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Engine: <span className="font-mono text-foreground font-semibold">{status?.engine || "IndexedDB"}</span> · 
                Database: <span className="font-mono text-foreground font-semibold">{status?.databaseName || "RadityaPortfolioDB"}</span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
                <HardDrive className="size-3.5 text-primary" />
                <span>Kapasitas penyimpanan besar (~50MB - 1GB+) untuk menyimpan berkas sertifikat & CV.</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={loadStatus} disabled={loading} className="text-xs">
              <RefreshCw className={`mr-1.5 size-3.5 ${loading ? "animate-spin" : ""}`} /> Segarkan
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} className="text-xs shadow-sm">
              <Download className="mr-1.5 size-3.5" /> Ekspor Backup (JSON)
            </Button>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent hover:text-accent-foreground shadow-sm">
              <Upload className="mr-1.5 size-3.5" /> Impor Backup
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setResetDialogOpen(true)}
              className="text-xs"
            >
              <RotateCcw className="mr-1.5 size-3.5" /> Reset Database
            </Button>
          </div>
        </div>
      </div>

      {/* Collections Overview Grid */}
      <div>
        <h3 className="mb-3 font-display text-base font-semibold text-foreground">
          Koleksi Tabel Database
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => {
            const count = status?.collectionsCount?.[col.name] ?? "-";
            const Icon = col.icon;
            return (
              <div
                key={col.name}
                className="flex items-start justify-between rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:border-primary/40"
              >
                <div className="flex items-start gap-3">
                  <span className="grid size-9 place-items-center rounded-lg bg-surface text-primary border border-border shrink-0">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{col.label}</h4>
                    <p className="text-xs text-muted-foreground">{col.desc}</p>
                    <span className="mt-2 inline-block font-mono text-[10px] text-muted-foreground bg-surface px-1.5 py-0.5 rounded">
                      table: {col.name}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-display text-xl font-bold text-foreground">
                    {count}
                  </span>
                  <span className="block text-[10px] uppercase text-muted-foreground">records</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Information Alert */}
      <div className="rounded-xl border border-border/70 bg-surface/50 p-4 text-xs text-muted-foreground space-y-2">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Activity className="size-4 text-primary" /> Keamanan & Keandalan Data
        </div>
        <p>
          Data aplikasi disimpan secara permanen di database lokal IndexedDB peramban Anda dan secara otomatis disinkronkan ke memori antarmuka. Anda dapat sewaktu-waktu mengekspor seluruh data menjadi berkas cadangan JSON dan memulihkannya di perangkat manapun dengan fitur <strong>Ekspor / Impor Backup</strong>.
        </p>
      </div>

      {/* Reset Confirmation Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-destructive mb-1">
              <AlertTriangle className="size-5" />
              <DialogTitle>Reset Seluruh Database?</DialogTitle>
            </div>
            <DialogDescription>
              Tindakan ini akan mengosongkan seluruh perubahan dan mengembalikan database ke konfigurasi data awal (profil Muhammad Raditya Anwar, sertifikat BNSP & Cisco, skill Cyber Security).
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setResetDialogOpen(false)} disabled={resetting}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleReset} disabled={resetting}>
              {resetting ? "Mereset..." : "Ya, Reset Database"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
