"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useWizardTheme } from "./WizardTheme";

/**
 * Upload-or-paste image field used by every image slot in the wizard (logo,
 * product, OG, future avatars & screenshots). POSTs to
 * /api/admin/upload which writes into /public/uploads; falls back to a
 * read-only warning in production deploys.
 */
export function ImageUploadField({
  label,
  value,
  onChange,
  uploadType,
  placeholder,
  previewHeight = 80,
  showPreview = true,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  uploadType: string;
  placeholder?: string;
  previewHeight?: number;
  showPreview?: boolean;
}) {
  const theme = useWizardTheme();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", uploadType);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        onChange(data.url);
      } else if (data.readOnly) {
        setUploadError("File system is read-only. Paste an external URL instead.");
      } else {
        setUploadError(data.error ?? "Upload failed");
      }
    } catch {
      setUploadError("Network error during upload");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "https://… or /uploads/logo.png"}
          className="h-10 rounded-xl font-mono text-xs flex-1"
          style={theme.inputStyle}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Clear image"
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors hover:bg-red-500/10"
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.cardBorder}`,
              color: theme.muted,
            }}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="w-full min-h-11 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80 disabled:opacity-50"
        style={{
          background: theme.cardBg,
          border: `1px dashed ${theme.cardBorder}`,
          color: theme.muted,
        }}
      >
        {uploading ? (
          <>
            <div
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "var(--brand-primary)" }}
            />
            Uploading…
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Upload {label}
          </>
        )}
      </button>

      {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}

      {showPreview && value && (
        <div
          className="rounded-xl overflow-hidden flex items-center justify-center p-3"
          style={{
            background: theme.cardBg,
            border: `1px solid ${theme.cardBorder}`,
            minHeight: previewHeight,
          }}
        >
          <Image
            src={value}
            alt={`${label} preview`}
            width={400}
            height={previewHeight}
            className="max-h-40 w-auto object-contain"
            unoptimized={value.endsWith(".svg")}
          />
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
