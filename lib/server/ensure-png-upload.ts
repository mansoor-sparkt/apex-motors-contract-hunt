import {
  isHeicMagicBytes,
  isPngMagicBytes,
} from "@/lib/image-magic";

const HEIC_EXT = /\.hei[cf]$/i;

function isHeicMagic(buffer: Buffer): boolean {
  return isHeicMagicBytes(buffer);
}

function isPngMagic(buffer: Buffer): boolean {
  return isPngMagicBytes(buffer);
}

export function isHeicUpload(file: File, buffer: Buffer): boolean {
  const type = (file.type || "").toLowerCase();
  if (type.includes("heic") || type.includes("heif")) return true;
  if (HEIC_EXT.test(file.name)) return true;
  return isHeicMagic(buffer);
}

function pngFileName(originalName: string): string {
  const base = originalName.replace(/\.[^.]+$/, "").trim() || "upload";
  return `${base}.png`;
}

/** Match client cap; server only sees uploads that fit Vercel's ~4.5MB body limit. */
const MAX_EDGE = 1280;

async function resizeToPngBuffer(input: Buffer): Promise<Buffer> {
  const sharp = (await import("sharp")).default;
  return sharp(input, { failOn: "none" })
    .rotate()
    .resize(MAX_EDGE, MAX_EDGE, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .png({ compressionLevel: 9, effort: 7 })
    .toBuffer();
}

function toUploadFile(buffer: Buffer, originalName: string): File {
  const bytes = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  return new File([bytes], pngFileName(originalName), { type: "image/png" });
}

/**
 * Ensures hunt image uploads are PNG before forwarding to the Phillips API.
 * Converts HEIC/HEIF server-side when the client could not (or sent raw HEIC).
 */
export async function ensurePngForUpload(file: File): Promise<File> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isPngMagic(buffer) && !isHeicMagic(buffer)) {
    const meta = await import("sharp").then((m) =>
      m.default(buffer).metadata(),
    );
    const longest = Math.max(meta.width ?? 0, meta.height ?? 0);
    if (longest <= MAX_EDGE) {
      if (
        file.type === "image/png" &&
        file.name.toLowerCase().endsWith(".png")
      ) {
        return file;
      }
      return toUploadFile(buffer, file.name);
    }
    return toUploadFile(await resizeToPngBuffer(buffer), file.name);
  }

  if (isHeicUpload(file, buffer)) {
    const convert = (await import("heic-convert")).default;
    const pngBuffer = Buffer.from(
      await convert({
        buffer,
        format: "PNG",
      }),
    );
    return toUploadFile(await resizeToPngBuffer(pngBuffer), file.name);
  }

  return toUploadFile(await resizeToPngBuffer(buffer), file.name);
}
