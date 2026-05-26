"use client";

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

/** heic2any is most reliable outputting JPEG; we then canvas → PNG. */
async function heicToPngBlob(file: File): Promise<Blob> {
  const heic2any = await loadHeic2Any();
  const input = heicInputBlob(file);

  let jpegBlob: Blob;
  try {
    const result = await heic2any({
      blob: input,
      toType: "image/jpeg",
      quality: 0.92,
    });
    jpegBlob = Array.isArray(result) ? result[0] : result;
  } catch {
    const result = await heic2any({
      blob: input,
      toType: "image/png",
    });
    const png = Array.isArray(result) ? result[0] : result;
    if (png instanceof Blob && png.size > 0) return png;
    throw new Error("HEIC conversion failed");
  }

  if (!(jpegBlob instanceof Blob) || jpegBlob.size === 0) {
    throw new Error("HEIC conversion failed");
  }

  const jpegFile = new File([jpegBlob], "converted.jpg", {
    type: "image/jpeg",
  });
  return fileToPngBlob(jpegFile);
}

async function drawToPngBlob(
  source: CanvasImageSource,
  width: number,
  height: number,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(source, 0, 0, width, height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result ? resolve(result) : reject(new Error("PNG conversion failed")),
      "image/png",
    );
  });
}

async function fileToPngBlob(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    try {
      return await drawToPngBlob(bitmap, bitmap.width, bitmap.height);
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
      return await drawToPngBlob(img, img.naturalWidth, img.naturalHeight);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

/**
 * Converts any supported image (JPEG, WebP, HEIC, etc.) to PNG for backend upload.
 * Non-image files (e.g. video) are returned unchanged.
 */
export async function convertImageToPng(file: File): Promise<File> {
  if (typeof window === "undefined") return file;
  if (!isImageFile(file)) return file;

  if (file.type === "image/png") {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "png") return file;
  }

  const blob = isHeicFile(file)
    ? await heicToPngBlob(file)
    : await fileToPngBlob(file);

  return new File([blob], pngFileName(file.name), {
    type: "image/png",
    lastModified: Date.now(),
  });
}
