"use client";

import {
  convertImageToPng,
  isHeicFile,
  isHeicLikeFile,
  isImageFile,
} from "@/lib/image-to-png";
export {
  resolveMediaPreviewUrl,
  resolveVideoPreviewUrl,
  MEDIA_RESIZER_BASE,
} from "@/lib/media-url";

const BROWSER_NATIVE_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
]);

/**
 * Object URL safe for <img> preview (converts HEIC → PNG in-browser).
 */
export async function createImagePreviewUrl(file: File): Promise<string> {
  if (!isImageFile(file)) {
    return URL.createObjectURL(file);
  }

  const type = file.type.toLowerCase();
  const heicLike = await isHeicLikeFile(file);
  const needsConvert =
    heicLike ||
    isHeicFile(file) ||
    !type ||
    type === "application/octet-stream" ||
    !BROWSER_NATIVE_IMAGE_TYPES.has(type);

  if (needsConvert) {
    const png = await convertImageToPng(file);
    return URL.createObjectURL(png);
  }

  return URL.createObjectURL(file);
}

export function revokeObjectPreviewUrl(url: string | null | undefined) {
  if (url?.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}
