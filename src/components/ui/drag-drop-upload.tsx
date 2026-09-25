import React, { useRef, useState } from "react";
import {
  FileCheck2,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DragDropUploadProps {
  value?: string;
  onChange: (value: string, fileName?: string) => void;
  accept?: string;
  type?: "image" | "file";
  label?: string;
  hint?: string;
  maxSizeMB?: number;
  className?: string;
}

export function DragDropUpload({
  value,
  onChange,
  accept = "image/*",
  type = "image",
  label,
  hint,
  maxSizeMB = 5,
  className,
}: DragDropUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const isDataUrl = value?.startsWith("data:");
  const isImage =
    type === "image" ||
    (value && (value.match(/\.(jpeg|jpg|png|gif|webp|svg)/i) || isDataUrl));

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onChange(result, file.name);
      toast.success(`Berkas "${file.name}" berhasil diunggah.`);
    };
    reader.onerror = () => {
      toast.error("Gagal membaca berkas.");
    };

    if (type === "image" || file.type.startsWith("image/")) {
      reader.readAsDataURL(file);
    } else {
      // PDF or documents
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleManualApply = () => {
    if (!manualUrl.trim()) return;
    onChange(manualUrl.trim());
    setShowUrlInput(false);
    setManualUrl("");
    toast.success("URL berhasil diterapkan.");
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">{label}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="h-6 px-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <LinkIcon className="mr-1 size-3" />
            {showUrlInput ? "Tutup input URL" : "Pakai tautan URL"}
          </Button>
        </div>
      ) : null}

      {showUrlInput ? (
        <div className="flex gap-2">
          <Input
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://example.com/gambar.jpg"
            className="text-xs"
          />
          <Button type="button" size="sm" onClick={handleManualApply}>
            Terapkan
          </Button>
        </div>
      ) : null}

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "group relative flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 text-center transition-all",
          isDragging
            ? "border-primary bg-primary/10 shadow-glow"
            : "border-border hover:border-primary/60 hover:bg-accent/40 bg-card/50",
          value ? "border-solid border-border/80" : ""
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />

        {value ? (
          <div className="flex w-full flex-col items-center gap-3">
            {isImage ? (
              <div className="relative overflow-hidden rounded-lg border border-border shadow-sm">
                <img
                  src={value}
                  alt="Preview"
                  className="max-h-40 w-auto max-w-full object-contain rounded-md"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3">
                <FileCheck2 className="size-6 text-primary" />
                <div className="text-left">
                  <p className="text-xs font-semibold text-foreground">Berkas Terlampir</p>
                  <p className="max-w-[240px] truncate text-[11px] text-muted-foreground">
                    {value.slice(0, 48)}...
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground group-hover:text-foreground">
                Tarik berkas baru atau klik untuk mengganti
              </span>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="size-7"
                onClick={handleRemove}
                title="Hapus berkas"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              {type === "image" ? (
                <ImageIcon className="size-5" />
              ) : (
                <UploadCloud className="size-5" />
              )}
            </div>
            <p className="text-sm font-medium text-foreground">
              Seret & lepas berkas ke sini, atau <span className="text-primary underline">pilih file</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {hint || (type === "image" ? "Mendukung semua format gambar (tanpa batas ukuran)" : "Mendukung PDF, DOC, Gambar (tanpa batas ukuran)")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
