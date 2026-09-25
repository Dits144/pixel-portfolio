import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Loader2,
  PenTool,
  Printer,
  Sparkles,
  Trash2,
  UserCheck,
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
import { coverLetterService, formatIndonesianDate } from "@/services/coverLetterService";
import { profileService } from "@/services/profileService";
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
  const [activeTab, setActiveTab] = useState<"document" | "edit">("document");
  const refresh = useRefresh();
  const queryClient = useQueryClient();

  const profileQuery = useResource("profile", profileService.get);
  const profile = profileQuery.data;

  const letters = useResource("cover-letters", coverLetterService.list);

  const generate = useMutation({
    mutationFn: coverLetterService.generateCoverLetter,
    onSuccess: (text) => {
      setResult(text);
      setActiveTab("document");
      toast.success("Surat lamaran berhasil digenerate oleh AI.");
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
      toast.error("Isi nama perusahaan dan posisi yang dilamar terlebih dahulu.");
      return;
    }
    generate.mutate(currentPayload());
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result);
    toast.success("Teks surat disalin ke clipboard.");
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

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    // Pisahkan teks surat sebelum nama pengirim untuk menyisipkan tanda tangan (TTD)
    const userName = profile?.name || "Muhammad Raditya Anwar";
    const sigImg = profile?.signature?.startsWith("data:")
      ? `<div style="margin: 8px 0;"><img src="${profile.signature}" alt="Tanda Tangan" style="max-height: 70px; object-fit: contain;" /></div>`
      : `<div style="height: 50px;"></div>`;

    // Tangkap baris "Bogor, ..." untuk posisi rata kanan (right-aligned)
    let bodyText = result.trim();
    let dateStr = "";
    const dateMatch = bodyText.match(/^Bogor,[^\n\r]+/m);
    if (dateMatch) {
      dateStr = dateMatch[0].trim();
      bodyText = bodyText.replace(dateMatch[0], "").trim();
    }

    // Buat judul Surat Lamaran Kerja jika ada
    if (bodyText.startsWith("Surat Lamaran Kerja")) {
      bodyText = bodyText.replace(/^Surat Lamaran Kerja\s*/, "").trim();
    }

    // Pisahkan sebelum & sesudah "Hormat saya,"
    let beforeHormat = bodyText;
    let afterHormat = "";
    if (bodyText.includes("Hormat saya,")) {
      const parts = bodyText.split("Hormat saya,");
      beforeHormat = (parts[0] ?? "").trim();
      afterHormat = (parts[1] || "").replace(new RegExp(`\\s*${userName}\\s*$`, "i"), "").trim();
    }

    // Format tab dan indentasi data diri agar menjorok rapi dengan titik dua lurus sejajar
    beforeHormat = beforeHormat
      .replace(/^[ \t]*Nama\s*[\t ]*:/gm, "    Nama        :")
      .replace(/^[ \t]*Pendidikan\s*[\t ]*:/gm, "    Pendidikan  :")
      .replace(/^[ \t]*Domisili\s*[\t ]*:/gm, "    Domisili    :")
      .replace(/^[ \t]*No\.\s*telepon\s*[\t ]*:/gm, "    No. telepon :")
      .replace(/^[ \t]*Email\s*[\t ]*:/gm, "    Email       :");

    const htmlContent = `
      <div class="letter-container">
        <div class="doc-title">Surat Lamaran Kerja</div>
        ${dateStr ? `<div class="date-right">${dateStr}</div>` : ""}
        <pre class="content">${beforeHormat}\n\nHormat saya,</pre>
        ${afterHormat ? `<pre class="content">${afterHormat}</pre>` : ""}
        <div class="sign-block">
          ${sigImg}
          <div class="sender-name">${userName}</div>
        </div>
      </div>
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title></title>
          <style>
            @page {
              size: A4 portrait;
              margin: 20mm 25mm 20mm 25mm;
            }
            @media print {
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: #fff;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              header, footer {
                display: none !important;
                visibility: hidden !important;
              }
            }
            * {
              box-sizing: border-box;
            }
            body {
              font-family: 'Times New Roman', Times, serif;
              line-height: 1.5;
              color: #000;
              font-size: 12pt;
              margin: 0;
              padding: 0;
            }
            .letter-container {
              max-width: 100%;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .doc-title {
              font-family: 'Times New Roman', Times, serif;
              font-size: 14pt;
              font-weight: bold;
              text-align: center;
              margin-bottom: 24px;
              letter-spacing: 0.5px;
            }
            .date-right {
              font-family: 'Times New Roman', Times, serif;
              font-size: 12pt;
              text-align: right;
              margin-bottom: 20px;
            }
            pre.content {
              font-family: 'Times New Roman', Times, serif;
              white-space: pre-wrap;
              word-wrap: break-word;
              line-height: 1.5;
              font-size: 12pt;
              margin: 0;
              color: #000;
            }
            .sign-block {
              margin-top: 4px;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .sender-name {
              font-weight: bold;
              font-size: 12pt;
              margin-top: 4px;
              color: #000;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const todayStr = `Bogor, ${formatIndonesianDate()}`;

  return (
    <div>
      <PageHeader
        title="Generator Surat Lamaran AI"
        description="Generator surat lamaran kerja resmi berstandar HRD. Tanggal otomatis, data diri tersinkronisasi dari profil, dan isi draf disusun cerdas oleh AI."
      />

      <div className="grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
        {/* Form Input */}
        <div className="space-y-4">
          <form
            onSubmit={runGenerate}
            className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            {/* Automatic Date Indicator */}
            <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-primary font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" /> Tanggal Surat (Otomatis)
              </span>
              <span className="font-semibold">{todayStr}</span>
            </div>

            <Field label="Nama Perusahaan (Manual)" htmlFor="cl-company">
              <Input
                id="cl-company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="mis. PT Cyber Solusi Nusantara"
                required
              />
            </Field>

            <Field label="Posisi yang Dilamar (Manual)" htmlFor="cl-position">
              <Input
                id="cl-position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="mis. Junior Security Analyst / Network Engineer"
                required
              />
            </Field>

            <Field
              label="Kualifikasi / Deskripsi Pekerjaan (Opsional)"
              htmlFor="cl-jd"
              hint="Tempel poin penting lowongan agar AI menyesuaikan keahlian Anda."
            >
              <Textarea
                id="cl-jd"
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="mis. Network monitoring, Linux hardening, Wireshark, packet analysis, BNSP..."
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Gaya Bahasa">
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
              {generate.isPending ? "Sedang Menyusun Surat AI…" : "Generate Surat Lamaran"}
            </Button>
          </form>

          {/* Profil Sinkronisasi Preview Card */}
          <div className="rounded-2xl border border-border bg-card/60 p-4 shadow-sm text-xs space-y-2">
            <div className="flex items-center justify-between font-semibold text-foreground">
              <span className="flex items-center gap-1.5">
                <UserCheck className="size-4 text-primary" /> Data Profil Terhubung
              </span>
              <Button asChild variant="link" size="sm" className="h-auto p-0 text-xs">
                <Link to="/admin/profile">Ubah di Profil</Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-muted-foreground pt-1">
              <div>
                <span className="block text-[10px] uppercase font-mono text-muted-foreground/80">Nama:</span>
                <span className="font-medium text-foreground">{profile?.name || "Muhammad Raditya Anwar"}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-mono text-muted-foreground/80">Pendidikan:</span>
                <span className="font-medium text-foreground">{profile?.education || "S1 Teknik Informatika"}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-mono text-muted-foreground/80">Domisili:</span>
                <span className="font-medium text-foreground">{profile?.location || "Kabupaten Bogor"}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-mono text-muted-foreground/80">No. Telepon:</span>
                <span className="font-medium text-foreground">{profile?.phone || "0858 8284 6665"}</span>
              </div>
            </div>
            <div className="border-t border-border pt-2 flex items-center justify-between">
              <span className="flex items-center gap-1 text-muted-foreground">
                <PenTool className="size-3 text-primary" /> Tanda Tangan:
              </span>
              <span className="font-medium text-foreground">
                {profile?.signature?.startsWith("data:") ? "Gambar TTD terpasang ✓" : profile?.signature || profile?.name}
              </span>
            </div>
          </div>
        </div>

        {/* Preview & Hasil */}
        <div className="min-w-0 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-lg font-semibold">Hasil Surat Lamaran</h3>
                {result ? (
                  <div className="flex rounded-lg border border-border p-0.5 text-xs bg-muted/40">
                    <button
                      type="button"
                      onClick={() => setActiveTab("document")}
                      className={`px-2.5 py-1 rounded-md transition-colors ${activeTab === "document" ? "bg-card shadow-sm font-medium text-foreground" : "text-muted-foreground"}`}
                    >
                      Tampilan Dokumen
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("edit")}
                      className={`px-2.5 py-1 rounded-md transition-colors ${activeTab === "edit" ? "bg-card shadow-sm font-medium text-foreground" : "text-muted-foreground"}`}
                    >
                      Edit Teks
                    </button>
                  </div>
                ) : null}
              </div>

              {result ? (
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrint} title="Cetak Surat (Pas 1 Halaman A4)">
                    <Printer className="mr-1.5 size-4" /> Cetak (1 Hlm)
                  </Button>
                  <Button variant="outline" size="sm" onClick={copy} title="Salin ke papan klip">
                    <Copy className="mr-1.5 size-4" /> Salin
                  </Button>
                  <Button variant="outline" size="sm" onClick={download} title="Unduh file .txt">
                    <Download className="mr-1.5 size-4" /> .txt
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => saveLetter.mutate(undefined)}
                    disabled={saveLetter.isPending}
                    className="shadow-glow"
                  >
                    {saveLetter.isPending ? (
                      <Loader2 className="mr-1.5 size-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-1.5 size-4" />
                    )}
                    Simpan Riwayat
                  </Button>
                </div>
              ) : null}
            </div>

            {result ? (
              <div className="mb-4 flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-primary">
                <span>
                  💡 <strong>Tips Cetak 1 Halaman Rapi:</strong> Di kotak dialog cetak browser (Chrome/Edge), buka <em>More settings / Opsi lainnya</em> &rarr; <strong>Hapus centang (uncheck) "Headers and footers / Header dan footer"</strong> agar teks <code>about:blank</code>, tanggal, dan <code>1/2</code> hilang total.
                </span>
              </div>
            ) : null}

            {generate.isPending ? (
              <div className="space-y-3 py-8">
                <div className="h-4 animate-pulse rounded bg-muted w-1/3" />
                <div className="h-4 animate-pulse rounded bg-muted w-1/4" />
                <div className="h-4 animate-pulse rounded bg-muted w-2/5" />
                <div className="h-16 animate-pulse rounded bg-muted w-full" />
                <div className="h-20 animate-pulse rounded bg-muted w-full" />
                <div className="h-8 animate-pulse rounded bg-muted w-1/2" />
                <p className="pt-3 font-mono text-xs text-primary flex items-center gap-2">
                  <Loader2 className="size-3.5 animate-spin" />
                  Gen AI sedang memformulasi surat lamaran resmi...
                </p>
              </div>
            ) : result ? (
              activeTab === "document" ? (
                <div className="rounded-xl border border-border/80 bg-surface/30 p-6 sm:p-8 font-sans text-base leading-relaxed shadow-inner">
                  {(() => {
                    const userName = profile?.name || "Muhammad Raditya Anwar";
                    const hasDataSig = profile?.signature?.startsWith("data:");
                    const sigText = profile?.signature && !hasDataSig ? profile.signature : null;

                    let previewText = result;
                    let hasTitle = false;
                    if (previewText.startsWith("Surat Lamaran Kerja")) {
                      previewText = previewText.replace(/^Surat Lamaran Kerja\s*/, "");
                      hasTitle = true;
                    }

                    // Format tab dan indentasi data diri agar menjorok rapi dengan titik dua lurus sejajar
                    previewText = previewText
                      .replace(/^[ \t]*Nama\s*[\t ]*:/gm, "    Nama        :")
                      .replace(/^[ \t]*Pendidikan\s*[\t ]*:/gm, "    Pendidikan  :")
                      .replace(/^[ \t]*Domisili\s*[\t ]*:/gm, "    Domisili    :")
                      .replace(/^[ \t]*No\.\s*telepon\s*[\t ]*:/gm, "    No. telepon :")
                      .replace(/^[ \t]*Email\s*[\t ]*:/gm, "    Email       :");

                    // Ambil baris tanggal untuk ditampilkan di kanan
                    let dateStr = "";
                    const dateMatch = previewText.match(/^Bogor,[^\n\r]+/m);
                    if (dateMatch) {
                      dateStr = dateMatch[0].trim();
                      previewText = previewText.replace(dateMatch[0], "").trim();
                    }

                    if (previewText.includes("Hormat saya,")) {
                      const parts = previewText.split("Hormat saya,");
                      const beforeHormat = (parts[0] ?? "").trim();
                      const afterHormat = (parts[1] || "").replace(new RegExp(`\\s*${userName}\\s*$`, "i"), "").trim();

                      return (
                        <div>
                          {hasTitle ? (
                            <div className="text-center font-bold text-lg mb-6 text-foreground">
                              Surat Lamaran Kerja
                            </div>
                          ) : null}
                          {dateStr ? (
                            <div className="text-right text-foreground font-medium mb-4">
                              {dateStr}
                            </div>
                          ) : null}
                          <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed selection:bg-primary/20">
                            {beforeHormat.trimStart()}Hormat saya,
                          </pre>
                          {afterHormat ? (
                            <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed mt-2">
                              {afterHormat}
                            </pre>
                          ) : null}
                          
                          {/* Area TTD persis di atas nama */}
                          <div className="mt-3 mb-1">
                            {hasDataSig ? (
                              <img
                                src={profile!.signature}
                                alt="Tanda Tangan"
                                className="max-h-20 object-contain drop-shadow-sm"
                              />
                            ) : sigText ? (
                              <div className="italic text-base font-serif text-foreground py-2">
                                {sigText}
                              </div>
                            ) : (
                              <div className="h-14" />
                            )}
                          </div>
                          <div className="font-semibold text-foreground">{userName}</div>
                        </div>
                      );
                    }

                    return (
                      <div>
                        <pre className="whitespace-pre-wrap font-sans text-foreground leading-relaxed selection:bg-primary/20">
                          {result}
                        </pre>
                        {hasDataSig ? (
                          <div className="mt-3 mb-1">
                            <img
                              src={profile!.signature}
                              alt="Tanda Tangan"
                              className="max-h-20 object-contain drop-shadow-sm"
                            />
                          </div>
                        ) : null}
                        <div className="font-semibold text-foreground mt-2">{userName}</div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <Textarea
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  rows={20}
                  className="min-h-[460px] font-mono text-sm leading-relaxed"
                />
              )
            ) : (
              <div className="py-16 text-center space-y-3">
                <div className="mx-auto grid size-12 place-items-center rounded-2xl border border-dashed border-border bg-surface text-muted-foreground">
                  <FileText className="size-6" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Belum ada draf surat dibuat.
                </p>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Masukkan nama perusahaan dan posisi yang dilamar di formulir kiri, lalu klik tombol "Generate Surat Lamaran".
                </p>
              </div>
            )}
          </div>

          {/* Riwayat Tersimpan */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h3 className="font-display text-lg font-semibold">Riwayat Surat Tersimpan</h3>
            {letters.isPending ? (
              <TableSkeleton rows={2} />
            ) : (letters.data?.length ?? 0) === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">Belum ada surat yang disimpan ke riwayat.</p>
            ) : (
              <ul className="mt-3 divide-y divide-border">
                {letters.data?.map((letter) => (
                  <li key={letter.id} className="py-3">
                    <button
                      type="button"
                      onClick={() => setOpenId(openId === letter.id ? null : letter.id)}
                      className="flex w-full flex-wrap items-center justify-between gap-2 text-left"
                    >
                      <span className="font-medium text-foreground">
                        {letter.position} · <span className="text-primary">{letter.companyName}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <Badge variant="secondary">{letter.tone}</Badge>
                        <Badge variant="outline">{letter.language.toUpperCase()}</Badge>
                      </span>
                    </button>

                    {openId === letter.id ? (
                      <div className="mt-3 rounded-xl border border-border bg-surface p-4">
                        <pre className="max-h-64 overflow-y-auto font-mono text-xs whitespace-pre-wrap text-muted-foreground">
                          {letter.content}
                        </pre>
                        <div className="mt-3 flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setResult(letter.content);
                              setCompanyName(letter.companyName);
                              setPosition(letter.position);
                              toast.success("Surat dimuat ke editor.");
                            }}
                          >
                            Muat ke Editor
                          </Button>
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
