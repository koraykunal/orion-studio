import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { requireAdmin } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";
// Large multipart bodies must not be capped by the default server limit.
export const maxDuration = 60;

const MAX_SIZE = 30 * 1024 * 1024;
const MAX_IMAGE_PIXELS = 50_000_000;

type ImageFormat = "jpeg" | "png" | "webp" | "gif";
type AllowedKind = { kind: "image"; format: ImageFormat } | { kind: "video"; ext: string };

/**
 * The declared MIME type on a multipart part is attacker-controlled, so it is
 * only used to pick a candidate. The bytes themselves are then checked and,
 * for images, re-encoded.
 */
const MIME_TO_KIND: Record<string, AllowedKind> = {
    "image/jpeg": { kind: "image", format: "jpeg" },
    "image/png": { kind: "image", format: "png" },
    "image/webp": { kind: "image", format: "webp" },
    "image/gif": { kind: "image", format: "gif" },
    "video/mp4": { kind: "video", ext: ".mp4" },
    "video/webm": { kind: "video", ext: ".webm" },
    "video/quicktime": { kind: "video", ext: ".mov" },
};

/** Container signatures. Enough to reject a renamed HTML or SVG payload. */
function hasImageSignature(buffer: Buffer, format: ImageFormat): boolean {
    switch (format) {
        case "jpeg":
            return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
        case "png":
            return (
                buffer.length > 8 &&
                buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
            );
        case "webp":
            return (
                buffer.length > 12 &&
                buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
                buffer.subarray(8, 12).toString("ascii") === "WEBP"
            );
        case "gif":
            return buffer.length > 6 && ["GIF87a", "GIF89a"].includes(buffer.subarray(0, 6).toString("ascii"));
    }
}

function hasVideoSignature(buffer: Buffer, ext: string): boolean {
    if (ext === ".webm") {
        // EBML header
        return buffer.length > 4 && buffer.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]));
    }
    // ISO base media (mp4, mov): a `ftyp` box at offset 4.
    return buffer.length > 12 && buffer.subarray(4, 8).toString("ascii") === "ftyp";
}

export async function POST(request: Request) {
  const { failure } = await requireAdmin();
  if (failure) return failure;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowed = MIME_TO_KIND[file.type];
    if (!allowed) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF, MP4, WebM, MOV" },
        { status: 400 },
      );
    }

    if (file.size === 0) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 30MB" }, { status: 400 });
    }

    const input = Buffer.from(await file.arrayBuffer());

    let output: Buffer;
    let filename: string;

    if (allowed.kind === "image") {
      if (!hasImageSignature(input, allowed.format)) {
        return NextResponse.json({ error: "File content does not match its declared type" }, { status: 400 });
      }

      // Re-encoding is the real validation: whatever the upload claimed to be,
      // only a decodable raster image survives. This removes any payload
      // smuggled inside image metadata and guarantees the optimiser, which
      // cannot be trusted with attacker-controlled bytes, gets clean input.
      try {
        const pipeline = sharp(input, { limitInputPixels: MAX_IMAGE_PIXELS, animated: allowed.format === "gif" });
        output =
          allowed.format === "jpeg"
            ? await pipeline.jpeg({ quality: 90, mozjpeg: true }).toBuffer()
            : allowed.format === "png"
              ? await pipeline.png({ compressionLevel: 9 }).toBuffer()
              : allowed.format === "webp"
                ? await pipeline.webp({ quality: 90 }).toBuffer()
                : await pipeline.gif().toBuffer();
      } catch {
        return NextResponse.json({ error: "Image could not be decoded" }, { status: 400 });
      }

      filename = `${randomUUID()}.${allowed.format === "jpeg" ? "jpg" : allowed.format}`;
    } else {
      if (!hasVideoSignature(input, allowed.ext)) {
        return NextResponse.json({ error: "File content does not match its declared type" }, { status: 400 });
      }
      output = input;
      filename = `${randomUUID()}${allowed.ext}`;
    }

    // The filename is a generated UUID plus a fixed extension from the
    // allowlist, so no user-controlled string ever reaches the path.
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const target = path.join(uploadDir, filename);
    if (path.dirname(target) !== uploadDir) {
      return NextResponse.json({ error: "Invalid upload path" }, { status: 400 });
    }

    await mkdir(uploadDir, { recursive: true });
    await writeFile(target, output);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      bytes: output.byteLength,
      kind: allowed.kind,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
