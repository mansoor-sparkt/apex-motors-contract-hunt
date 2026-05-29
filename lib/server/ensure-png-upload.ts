import {
  isHeicMagicBytes,
  isPngMagicBytes,
} from "@/lib/image-magic";

const HEIC_EXT = /\.hei[cf]$/i;

/** Stay under Vercel's ~4.5MB request body limit (multipart overhead included). */
const MAX_UPLOAD_BYTES = 3_400_000;

const MAX_EDGE = 1280;

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

async function resizeToPngBuffer(input: Buffer): Promise<Buffer> {
  const sharp = (await import("sharp")).default;
  return sharp(input, { failOn: "none" })
    .rotate()
    .resize(MAX_EDGE, MAX_EDGE, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .png({ compressionLevel: 8 })
    .toBuffer();
}

export type PreparedPngUpload = {
  buffer: Buffer;
  filename: string;
  mimeType: "image/png";
};

/**
 * Ensures hunt image uploads are PNG before forwarding to the Phillips API.
 * Fast-paths client-prepared PNGs to avoid slow HEIC work on serverless.
 */
export async function ensurePngForUpload(file: File): Promise<PreparedPngUpload> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = pngFileName(file.name);

  const pngReady = isPngMagic(buffer) && !isHeicMagic(buffer);

  if (pngReady && buffer.length <= MAX_UPLOAD_BYTES) {
    try {
      const sharp = (await import("sharp")).default;
      const meta = await sharp(buffer).metadata();
      const longest = Math.max(meta.width ?? 0, meta.height ?? 0);
      if (longest <= MAX_EDGE) {
        return { buffer, filename, mimeType: "image/png" };
      }
    } catch {
      /* fall through to resize */
    }
    const resized = await resizeToPngBuffer(buffer);
    return { buffer: resized, filename, mimeType: "image/png" };
  }

  if (isHeicUpload(file, buffer)) {
    const convert = (await import("heic-convert")).default;
    const jpegBuffer = Buffer.from(
      await convert({
        buffer,
        format: "JPEG",
        quality: 0.85,
      }),
    );
    const pngBuffer = await resizeToPngBuffer(jpegBuffer);
    return { buffer: pngBuffer, filename, mimeType: "image/png" };
  }

  const pngBuffer = await resizeToPngBuffer(buffer);
  return { buffer: pngBuffer, filename, mimeType: "image/png" };
}
