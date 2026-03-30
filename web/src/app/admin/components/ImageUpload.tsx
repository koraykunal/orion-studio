"use client";

import { useState, useRef } from "react";
import NextImage from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = "Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Upload failed");
        return;
      }
      const { url } = await res.json();
      onChange(url);
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label && <label className="block text-sm text-foreground-muted mb-2">{label}</label>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
      {value ? (
        <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
          <NextImage src={value} alt={label} fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 px-3 py-1 bg-background/80 backdrop-blur text-xs text-foreground rounded-md hover:bg-background"
          >
            Remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full aspect-video border-2 border-dashed border-border rounded-lg flex items-center justify-center text-sm text-foreground-muted hover:border-accent hover:text-accent transition-colors"
        >
          {uploading ? "Uploading..." : "Click to upload"}
        </button>
      )}
    </div>
  );
}
