import { createFileRoute } from "@tanstack/react-router";
import { GripVertical, ImageOff, Loader2, Pencil, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useRef, useState } from "react";

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
import { Switch } from "@/components/ui/switch";
import { brandService } from "@/services/brandService";
import type { BrandItem } from "@/types/brand";

export const Route = createFileRoute("/admin/brands")({
  component: BrandsPage,
});

type Draft = Omit<BrandItem, "id">;

const emptyDraft: Draft = {
  name: "",
  category: "",
  logoUrl: "",
  active: true,
  sortOrder: 99,
};

/** Grayscale CSS filter to simulate greyed-out logos like in the reference design */
const GRAYSCALE_FILTER = "grayscale(100%) brightness(0.6) contrast(1.1)";

function BrandsPage() {
  const brandsQuery = useResource("brands", brandService.list);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BrandItem | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [pendingDelete, setPendingDelete] = useState<BrandItem | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createBrand = useAction(brandService.create, { success: "Brand ditambahkan." });
  const updateBrand = useAction(
    (v: { id: string; patch: Partial<BrandItem> }) => brandService.update(v.id, v.patch),
    { success: "Brand diperbarui." },
  );
  const deleteBrand = useAction(brandService.remove, { success: "Brand dihapus." });
  const toggleBrand = useAction(
    (v: { id: string; active: boolean }) => brandService.update(v.id, { active: v.active }),
    { success: "Visibility diubah." },
  );

  const startCreate = () => {
    setEditing(null);
    setDraft(emptyDraft);
    setLogoPreview("");
    setOpen(true);
  };

  const startEdit = (item: BrandItem) => {
    setEditing(item);
    setDraft({
      name: item.name,
      category: item.category,
      logoUrl: item.logoUrl,
      active: item.active,
      sortOrder: item.sortOrder,
    });
    setLogoPreview(item.logoUrl || "");
    setOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setDraft((d) => ({ ...d, logoUrl: result }));
      setLogoPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim()) return;
    if (editing) {
      updateBrand.mutate({ id: editing.id, patch: draft });
    } else {
      createBrand.mutate(draft);
    }
    setOpen(false);
  };

  const isPending = createBrand.isPending || updateBrand.isPending;
  const brands = brandsQuery.data ?? [];
  const sorted = [...brands].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div>
      <PageHeader
        title="Brand & Mitra Marquee"
        description="Logo institusi, tools, dan framework yang bergulir di marquee halaman depan. Logo otomatis diubah jadi abu-abu di tampilan publik."
        action={
          <Button onClick={startCreate} className="shadow-glow">
            <Plus className="mr-2 size-4" /> Tambah brand
          </Button>
        }
      />

      {/* Logo Preview Strip */}
      <div className="mb-6 overflow-hidden rounded-xl border border-border bg-card/60 px-6 py-4">
        <p className="mb-3 text-xs font-mono text-muted-foreground uppercase tracking-wider">Preview marquee (tampil abu-abu di publik)</p>
        <div className="flex items-center gap-6 overflow-x-auto pb-2">
          {sorted
            .filter((b) => b.active)
            .map((brand) => (
              <div key={brand.id} className="flex shrink-0 flex-col items-center gap-1.5">
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="h-8 max-w-[80px] object-contain"
                    style={{ filter: GRAYSCALE_FILTER }}
                  />
                ) : (
                  <div
                    className="flex h-8 w-20 items-center justify-center rounded bg-muted/60 text-[10px] font-mono text-muted-foreground"
                    style={{ filter: GRAYSCALE_FILTER }}
                  >
                    {brand.name.slice(0, 6)}
                  </div>
                )}
              </div>
            ))}
          {sorted.filter((b) => b.active).length === 0 && (
            <p className="text-xs text-muted-foreground">Belum ada brand aktif.</p>
          )}
        </div>
      </div>

      {/* Table */}
      {brandsQuery.isLoading ? (
        <TableSkeleton rows={6} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface/60">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-10">#</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Logo</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Nama</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kategori</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tampil</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((brand, idx) => (
                <tr key={brand.id} className="border-b border-border/50 last:border-0 hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted/40 overflow-hidden p-1">
                      {brand.logoUrl ? (
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          className="max-h-full max-w-full object-contain"
                          style={{ filter: GRAYSCALE_FILTER }}
                        />
                      ) : (
                        <ImageOff className="size-4 text-muted-foreground/40" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{brand.name}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="text-xs">{brand.category}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleBrand.mutate({ id: brand.id, active: !brand.active })}
                      className="transition-opacity hover:opacity-80"
                      aria-label={brand.active ? "Sembunyikan" : "Tampilkan"}
                    >
                      {brand.active ? (
                        <ToggleRight className="size-5 text-primary" />
                      ) : (
                        <ToggleLeft className="size-5 text-muted-foreground" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button size="icon" variant="ghost" className="size-8" onClick={() => startEdit(brand)}>
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-destructive hover:text-destructive"
                        onClick={() => setPendingDelete(brand)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-muted-foreground text-sm">
                    Belum ada brand. Tambah brand pertama!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Dialog */}
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Edit Brand" : "Tambah Brand"}
        description="Isi nama, kategori, dan upload logo. Logo akan otomatis diubah warna menjadi abu-abu di tampilan publik."
        onSubmit={submit}
        submitLabel={editing ? "Simpan Perubahan" : "Tambah Brand"}
        isPending={isPending}
      >
        <Field label="Nama Brand *">
          <Input
            value={draft.name}
            onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
            placeholder="cth: Cisco Systems"
            required
          />
        </Field>
        <Field label="Kategori">
          <Input
            value={draft.category}
            onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
            placeholder="cth: Routing & Switching"
          />
        </Field>
        <Field label="Logo">
          <div className="space-y-3">
            {/* URL input */}
            <Input
              value={draft.logoUrl.startsWith("data:") ? "" : draft.logoUrl}
              onChange={(e) => {
                setDraft((d) => ({ ...d, logoUrl: e.target.value }));
                setLogoPreview(e.target.value);
              }}
              placeholder="https://upload.wikimedia.org/.../logo.svg"
            />
            {/* OR upload file */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">atau</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload file logo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            {/* Preview */}
            {logoPreview && (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
                <p className="text-xs text-muted-foreground">Preview abu-abu:</p>
                <img
                  src={logoPreview}
                  alt="preview"
                  className="h-8 max-w-[100px] object-contain"
                  style={{ filter: GRAYSCALE_FILTER }}
                />
                <p className="text-xs text-muted-foreground">Preview asli:</p>
                <img
                  src={logoPreview}
                  alt="preview color"
                  className="h-8 max-w-[100px] object-contain"
                />
              </div>
            )}
          </div>
        </Field>
        <Field label="Urutan tampil">
          <Input
            type="number"
            value={draft.sortOrder}
            onChange={(e) => setDraft((d) => ({ ...d, sortOrder: Number(e.target.value) }))}
            min={1}
            max={999}
          />
        </Field>
        <Field label="Aktif (tampil di publik)">
          <Switch
            checked={draft.active}
            onCheckedChange={(v) => setDraft((d) => ({ ...d, active: v }))}
          />
        </Field>
      </FormDialog>

      {/* Confirm Delete */}
      <ConfirmDelete
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
        itemName={pendingDelete?.name ?? ""}
        onConfirm={() => {
          if (pendingDelete) deleteBrand.mutate(pendingDelete.id);
          setPendingDelete(null);
        }}
        isPending={deleteBrand.isPending}
      />
    </div>
  );
}
