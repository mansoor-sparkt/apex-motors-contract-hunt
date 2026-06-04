"use client";

import { isHeicMagicBytes, readFileHeader } from "@/lib/image-magic";

/**
 * Stay under Vercel's ~4.5MB serverless request body limit (multipart adds overhead).
 */
export const MAX_UPLOAD_BYTES = 2_500_000;

/** Longest edge after resize — camera originals are often 12MP+. */
export const MAX_UPLOAD_DIMENSION = 1280;

const MIN_UPLOAD_DIMENSION = 640;
const JPEG_QUALITY_START = 0.85;
const JPEG_QUALITY_MIN = 0.55;

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

function uploadFileName(originalName: string): string {
  const base = originalName.replace(/\.[^.]+$/, "").trim() || "upload";
  return `${base}.jpg`;
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

function heicInputBlob(file: File): Blob {
  if (file.type && file.type !== "application/octet-stream") {
    return file;
  }
  return new Blob([file], { type: "image/heic" });
}

async function loadHeic2Any() {
  if (typeof window === "undefined") {
    throw new Error("HEIC conversion requires a browser");
  }
  const mod = await import("heic2any");
  return mod.default;
}

/** Decode HEIC in-browser to a JPEG blob (full resolution — caller must resize). */
async function heicToJpegBlob(file: File): Promise<Blob> {
  const heic2any = await loadHeic2Any();
  const input = heicInputBlob(file);

  const result = await heic2any({
    blob: input,
    toType: "image/jpeg",
    quality: JPEG_QUALITY_START,
  });
  const jpegBlob = Array.isArray(result) ? result[0] : result;
  if (!(jpegBlob instanceof Blob) || jpegBlob.size === 0) {
    throw new Error("HEIC conversion failed");
  }
  return jpegBlob;
}

type ImageSource = {
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  width: number;
  height: number;
  cleanup?: () => void;
};

async function loadImageSource(file: Blob): Promise<ImageSource> {
  try {
    const bitmap = await createImageBitmap(file);
    return {
      width: bitmap.width,
      height: bitmap.height,
      draw: (ctx, w, h) => {
        ctx.drawImage(bitmap, 0, 0, w, h);
      },
      cleanup: () => bitmap.close(),
    };
  } catch {
    const url = URL.createObjectURL(file);
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Image decode failed"));
      el.src = url;
    });
    return {
      width: img.naturalWidth,
      height: img.naturalHeight,
      draw: (ctx, w, h) => {
        ctx.drawImage(img, 0, 0, w, h);
      },
      cleanup: () => URL.revokeObjectURL(url),
    };
  }
}

function canvasToJpegBlob(
  source: ImageSource,
  maxDim: number,
  quality: number,
): Promise<Blob> {
  const { width: w, height: h } = scaledDimensions(
    source.width,
    source.height,
    maxDim,
  );
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  source.draw(ctx, w, h);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result ? resolve(result) : reject(new Error("JPEG conversion failed")),
      "image/jpeg",
      quality,
    );
  });
}

async function compressImageSource(source: ImageSource): Promise<Blob> {
  let maxDim = MAX_UPLOAD_DIMENSION;
  let quality = JPEG_QUALITY_START;

  try {
    for (let attempt = 0; attempt < 12; attempt++) {
      const blob = await canvasToJpegBlob(source, maxDim, quality);
      if (blob.size <= MAX_UPLOAD_BYTES) {
        return blob;
      }

      if (quality > JPEG_QUALITY_MIN + 0.05) {
        quality = Math.max(JPEG_QUALITY_MIN, quality - 0.12);
      } else if (maxDim > MIN_UPLOAD_DIMENSION) {
        maxDim = Math.max(MIN_UPLOAD_DIMENSION, Math.round(maxDim * 0.82));
        quality = JPEG_QUALITY_START;
      } else {
        return blob;
      }
    }

    return await canvasToJpegBlob(
      source,
      MIN_UPLOAD_DIMENSION,
      JPEG_QUALITY_MIN,
    );
  } finally {
    source.cleanup?.();
  }
}

/**
 * Resizes and compresses images for upload (JPEG). Server converts to PNG for the API.
 * Non-image files (e.g. video) are returned unchanged.
 */
export async function convertImageToPng(file: File): Promise<File> {
  if (typeof window === "undefined") return file;
  if (!isImageFile(file)) return file;

  if (file.size <= MAX_UPLOAD_BYTES && file.type === "image/jpeg") {
    try {
      const header = await readFileHeader(file);
      if (!isHeicMagicBytes(header)) {
        const bitmap = await createImageBitmap(file);
        const longest = Math.max(bitmap.width, bitmap.height);
        bitmap.close();
        if (longest <= MAX_UPLOAD_DIMENSION) {
          return file;
        }
      }
    } catch {
      /* fall through to full compress */
    }
  }

  let decodeBlob: Blob = file;
  if (await isHeicLikeFile(file)) {
    decodeBlob = await heicToJpegBlob(file);
  }

  const source = await loadImageSource(decodeBlob);
  const blob = await compressImageSource(source);

  if (blob.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `Image is still too large (${Math.round(blob.size / 1024)}KB). Try Photo Library.`,
    );
  }

  return new File([blob], uploadFileName(file.name), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

/** @deprecated Alias — output is JPEG for smaller uploads; server converts to PNG. */
export const prepareImageForUpload = convertImageToPng;
