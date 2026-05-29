"use client";

import {
  isHeicMagicBytes,
  isPngMagicBytes,
  readFileHeader,
} from "@/lib/image-magic";

/** Longest edge — keeps PNG under Vercel's ~4.5MB body limit. */
export const MAX_UPLOAD_DIMENSION = 1280;

/** Target max bytes before upload (multipart overhead included). */
export const MAX_UPLOAD_BYTES = 3_400_000;

/** File-picker accept string — includes HEIC/HEIF (often missing from image/* alone). */
export const IMAGE_UPLOAD_ACCEPT =
  "image/*,.heic,.heif,.HEIC,.HEIF,image/heic,image/heif";

const IMAGE_EXT =
  /\.(jpe?g|png|gif|webp|bmp|heic|heif|avif|tiff?|jfif|svg|ico)$/i;

const HEIC_EXT = /\.hei[cf]$/i;

export function isHeicFile(file: File): boolean {
  const type = file.type.toLowerCase();
  if (
    type === "image/heic" ||
    type === "image/heif" ||
    type.includes("heic") ||
    type.includes("heif")
  ) {
    return true;
  }
  return HEIC_EXT.test(file.name);
}

/** HEIC from iPhone camera is often labeled image/jpeg with a .jpg name. */
export async function isHeicLikeFile(file: File): Promise<boolean> {
  if (isHeicFile(file)) return true;
  try {
    const header = await readFileHeader(file);
    return isHeicMagicBytes(header);
  } catch {
    return false;
  }
}

export function isImageFile(file: File): boolean {
  const type = file.type.toLowerCase();
  if (type.startsWith("image/")) return true;
  if (!type || type === "application/octet-stream") {
    return IMAGE_EXT.test(file.name);
  }
  return IMAGE_EXT.test(file.name);
}

function pngFileName(originalName: string): string {
  const base = originalName.replace(/\.[^.]+$/, "").trim() || "upload";
  return `${base}.png`;
}

function scaledDimensions(
  width: number,
  height: number,
  maxDim: number,
): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (longest <= maxDim) return { width, height };
  const scale = maxDim / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

async function loadHeic2Any() {
  if (typeof window === "undefined") {
    throw new Error("HEIC conversion requires a browser");
  }
  const mod = await import("heic2any");
  return mod.default;
}

/**
 * iOS Safari decodes HEIC in <img> / canvas without heic2any (more reliable than
 * heic2any on production builds). Fall back to heic2any on other browsers.
 */
async function heicToPngBlob(file: File): Promise<Blob> {
  try {
    return await rasterizeToPngBlob(file, MAX_UPLOAD_DIMENSION);
  } catch (safariErr) {
    console.warn("Safari HEIC rasterize failed, trying heic2any:", safariErr);
  }

  const heic2any = await loadHeic2Any();
  const input =
    file.type && file.type !== "application/octet-stream"
      ? file
      : new Blob([file], { type: "image/heic" });

  let jpegBlob: Blob;
  try {
    const result = await heic2any({
      blob: input,
      toType: "image/jpeg",
      quality: 0.85,
    });
    jpegBlob = Array.isArray(result) ? result[0] : result;
  } catch {
    const result = await heic2any({
      blob: input,
      toType: "image/png",
    });
    const png = Array.isArray(result) ? result[0] : result;
    if (png instanceof Blob && png.size > 0) {
      return rasterizeToPngBlob(png, MAX_UPLOAD_DIMENSION);
    }
    throw new Error("HEIC conversion failed");
  }

  if (!(jpegBlob instanceof Blob) || jpegBlob.size === 0) {
    throw new Error("HEIC conversion failed");
  }

  return rasterizeToPngBlob(jpegBlob, MAX_UPLOAD_DIMENSION);
}

async function drawToPngBlob(
  source: CanvasImageSource,
  width: number,
  height: number,
  maxDim: number,
): Promise<Blob> {
  const { width: w, height: h } = scaledDimensions(width, height, maxDim);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(source, 0, 0, w, h);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result ? resolve(result) : reject(new Error("PNG conversion failed")),
      "image/png",
    );
  });
}

async function rasterizeToPngBlob(
  file: Blob,
  maxDim: number = MAX_UPLOAD_DIMENSION,
): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    try {
      return await drawToPngBlob(bitmap, bitmap.width, bitmap.height, maxDim);
    } finally {
      bitmap.close();
    }
  } catch {
    const url = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("Image decode failed"));
        el.src = url;
      });
      return await drawToPngBlob(
        img,
        img.naturalWidth,
        img.naturalHeight,
        maxDim,
      );
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

/** Re-compress with a smaller max edge if the PNG is still too large for Vercel. */
async function fitUnderUploadLimit(source: File, blob: Blob): Promise<Blob> {
  if (blob.size <= MAX_UPLOAD_BYTES) return blob;

  const steps = [1024, 800, 640];
  let last = blob;
  for (const maxDim of steps) {
    last = await rasterizeToPngBlob(source, maxDim);
    if (last.size <= MAX_UPLOAD_BYTES) return last;
  }
  return last;
}

/**
 * Converts any supported image (JPEG, WebP, HEIC, etc.) to PNG for backend upload.
 * Non-image files (e.g. video) are returned unchanged.
 */
export async function convertImageToPng(file: File): Promise<File> {
  if (typeof window === "undefined") return file;
  if (!isImageFile(file)) return file;

  const header = await readFileHeader(file);
  const heicLike = isHeicFile(file) || isHeicMagicBytes(header);

  const alreadyPng =
    isPngMagicBytes(header) &&
    file.type === "image/png" &&
    file.name.toLowerCase().endsWith(".png");

  let blob: Blob;

  if (alreadyPng) {
    const bitmap = await createImageBitmap(file);
    try {
      const needsResize =
        Math.max(bitmap.width, bitmap.height) > MAX_UPLOAD_DIMENSION;
      blob = needsResize
        ? await drawToPngBlob(
            bitmap,
            bitmap.width,
            bitmap.height,
            MAX_UPLOAD_DIMENSION,
          )
        : file;
    } finally {
      bitmap.close();
    }
  } else {
    blob = heicLike
      ? await heicToPngBlob(file)
      : await rasterizeToPngBlob(file, MAX_UPLOAD_DIMENSION);
  }

  if (blob instanceof File && blob === file) {
    if (blob.size <= MAX_UPLOAD_BYTES) return blob;
    blob = await rasterizeToPngBlob(file, 1024);
  } else {
    blob = await fitUnderUploadLimit(file, blob);
  }

  if (blob.size > MAX_UPLOAD_BYTES) {
    throw new Error("Image is too large after compression");
  }

  return new File([blob], pngFileName(file.name), {
    type: "image/png",
    lastModified: Date.now(),
  });
}
