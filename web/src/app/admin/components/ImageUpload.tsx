"use client";

import { useState, useRef } from "react";
import NextImage from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  /**
   * Preview aspect ratio. Pass a CSS aspect-ratio value (e.g. "16/9", "9/19.5"),
   * or "auto" to size the preview from the image's natural dimensions.
   * Defaults to "16/9".
   */
  aspectRatio?: string;
  /** Accept attribute for the file input. Defaults to "image/*". */
  accept?: string;
  /** Allow video files. When true, accept includes common video mimes and the API allows them. */
  allowVideo?: boolean;
}

const VIDEO_EXT_RE = /\.(mp4|webm|mov|m4v)$/i;

export default function ImageUpload({
  value,
  onChange,
  label = "Image",
  aspectRatio = "16/9",
  accept,
  allowVideo = false,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [naturalRatio, setNaturalRatio] = useState<string | null>(null);
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

  const isVideo = !!value && VIDEO_EXT_RE.test(value);
  const previewRatio =
    aspectRatio === "auto" ? (naturalRatio ?? "16/9") : aspectRatio;
  const acceptAttr =
    accept ?? (allowVideo ? "image/*,video/mp4,video/webm,video/quicktime" : "image/*");

  return (
    <div>
      {label && <label className="block text-sm text-foreground-muted mb-2">{label}</label>}
      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />
      {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
      {value ? (
        <div
          className="relative rounded-lg overflow-hidden border border-border bg-background"
          style={{ aspectRatio: previewRatio }}
        >
          {isVideo ? (
            <video
              src={value}
              className="absolute inset-0 h-full w-full object-contain"
              muted
              loop
              playsInline
              autoPlay
            />
          ) : (
            <NextImage
              src={value}
              alt={label}
              fill
              sizes="400px"
              className="object-contain"
              onLoadingComplete={(img) => {
                if (aspectRatio === "auto" && img.naturalWidth && img.naturalHeight) {
                  setNaturalRatio(`${img.naturalWidth}/${img.naturalHeight}`);
                }
              }}
            />
          )}
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
          className="w-full border-2 border-dashed border-border rounded-lg flex items-center justify-center text-sm text-foreground-muted hover:border-accent hover:text-accent transition-colors"
          style={{ aspectRatio: previewRatio === "auto" ? "16/9" : previewRatio }}
        >
          {uploading ? "Uploading..." : "Click to upload"}
        </button>
      )}
    </div>
  );
}
