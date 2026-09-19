import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Copy,
  Download,
  Loader2,
  Sparkles,
  Trash2,
  WandSparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Field, PageHeader, TableSkeleton } from "@/components/admin/crud";
import { useAction, useRefresh, useResource } from "@/hooks/useCrud";
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
import { coverLetterService } from "@/services/coverLetterService";
import type { CoverLetterLanguage, CoverLetterTone } from "@/types";

export const Route = createFileRoute("/admin/cover-letter")({
  component: CoverLetterPage,
});

const tones: CoverLetterTone[] = ["Formal", "Semi-formal", "Santai"];
const languages: Array<{ value: CoverLetterLanguage; label: string }> = [
  { value: "id", label: "Bahasa Indonesia" },
  { value: "en", label: "English" },
];

export default function CoverLetterPage() {
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState<CoverLetterTone>("Formal");
  const [language, setLanguage] = useState<CoverLetterLanguage>("id");
  const [result, setResult] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const refresh = useRefresh();
  const queryClient = useQueryClient();

  const letters = useResource("cover-letters", coverLetterService.list);

  const generate = useMutation({
    mutationFn: coverLetterService.generateCoverLetter,
    onSuccess: (text) => {
      setResult(text);
      toast.success("Surat lamaran selesai dibuat.");
    },
    onError: () => toast.error("Generator gagal berjalan. Coba lagi ya."),
  });

  const saveLetter = useAction(
    () => coverLetterService.save({ ...currentPayload(), content: result }),
    { success: "Surat lamaran disimpan ke riwayat." },
  );

  const removeLetter = useAction(coverLetterService.remove, {
    success: "Riwayat surat dihapus.",
  });

  function currentPayload() {
    return { companyName, position, jobDescription, tone, language };
  }

  const canGenerate = companyName.trim() && position.trim();

  const runGenerate = (event: React.FormEvent) => {
    event.preventDefault();
    if (!canGenerate) {
      toast.error("Isi nama perusahaan dan posisi yang dilamar dulu.");
      return;
    }
    generate.mutate(currentPayload());
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result);
    toast.success("Teks surat disalin ke papan klip.");
  };

  const download = () => {
    const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `surat-lamaran-${companyName.toLowerCase().replace(/\s+/g, "-") || "perusahaan"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader
        title="Generator surat lamaran"
        description="Isi lowongan, pilih gaya bahasa, lalu buat drafnya. Generator masih simulasi lokal — nanti tinggal arahkan ke endpoint AI milikmu."
      />

      <div className="grid gap-6 lg:grid-cols-[400px_minmax(0,1fr)]">
        <form
          onSubmit={runGenerate}
          className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card"
        >
          <Field label="Nama perusahaan" htmlFor="cl-company">
            <Input
              id="cl-company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="mis. Tokopedia"
            />
          </Field>

          <Field label="Posisi yang dilamar" htmlFor="cl-position">
            <Input
              id="cl-position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="mis. Senior Frontend Engineer"
            />
          </Field>

          <Field
            label="Deskripsi pekerjaan"
            htmlFor="cl-jd"
            hint="Tempel poin-poin penting dari lowongan."
          >
            <Textarea
              id="cl-jd"
              rows={6}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="React, TypeScript, design system, optimasi performa…"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Gaya bahasa">
              <Select value={tone} onValueChange={(value) => setTone(value as CoverLetterTone)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Bahasa">
              <Select
                value={language}
                onValueChange={(value) => setLanguage(value as CoverLetterLanguage)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Button type="submit" className="w-full shadow-glow" disabled={generate.isPending}>
            {generate.isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <WandSparkles className="mr-2 size-4" />
            )}
            {generate.isPending ? "Menyusun surat…" : "Buat surat lamaran"}
          </Button>
        </form>

        <div className="min-w-0 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-display text-lg font-semibold">Hasil</h3>
              {result ? (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copy}>
                    <Copy className="mr-2 size-4" /> Salin
                  </Button>
                  <Button variant="outline" size="sm" onClick={download}>
                    <Download className="mr-2 size-4" /> .txt
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => saveLetter.mutate(undefined)}
                    disabled={saveLetter.isPending}
                  >
                    {saveLetter.isPending ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 size-4" />
                    )}
                    Simpan
                  </Button>
                </div>
              ) : null}
            </div>

            {generate.isPending ? (
              <div className="space-y-2">
                <div className="h-3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-11/12 animate-pulse rounded bg-muted" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-muted" />
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                <p className="pt-3 font-mono text-xs text-muted-foreground">
                  sedang menyusun paragraf…
                </p>
              </div>
            ) : result ? (
              <Textarea
                value={result}
                onChange={(e) => setResult(e.target.value)}
                rows={20}
                className="min-h-[420px] font-mono text-sm leading-relaxed"
              />
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                Belum ada draf. Isi formulir di kiri lalu klik “Buat surat lamaran”.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="font-display text-lg font-semibold">Riwayat tersimpan</h3>
            {letters.isPending ? (
              <TableSkeleton rows={2} />
            ) : (letters.data?.length ?? 0) === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">Belum ada surat yang disimpan.</p>
            ) : (
              <ul className="mt-3 divide-y divide-border">
                {letters.data?.map((letter) => (
                  <li key={letter.id} className="py-3">
                    <button
                      type="button"
                      onClick={() => setOpenId(openId === letter.id ? null : letter.id)}
                      className="flex w-full flex-wrap items-center justify-between gap-2 text-left"
                    >
                      <span className="font-medium">
                        {letter.position} · {letter.companyName}
                      </span>
                      <span className="flex items-center gap-2">
                        <Badge variant="secondary">{letter.tone}</Badge>
                        <Badge variant="outline">{letter.language.toUpperCase()}</Badge>
                      </span>
                    </button>

                    {openId === letter.id ? (
                      <div className="mt-3 rounded-xl border border-border bg-surface p-4">
                        <pre className="max-h-64 overflow-y-auto font-mono text-xs whitespace-pre-wrap">
                          {letter.content}
                        </pre>
                        <div className="mt-3 flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={async () => {
                              await removeLetter.mutateAsync(letter.id);
                              setOpenId(null);
                              refresh();
                              queryClient.invalidateQueries({ queryKey: ["portfolio"] });
                            }}
                          >
                            <Trash2 className="mr-2 size-4" /> Hapus
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
