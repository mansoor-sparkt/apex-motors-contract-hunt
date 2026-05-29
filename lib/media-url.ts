export const MEDIA_RESIZER_BASE =
  "https://phillipsx-imageresizer.azurewebsites.net/api/DevImageResizer";

const DEFAULT_MEDIA_CDN_ORIGIN =
  "https://phillipsx-content-dev.azurewebsites.net";

/** Origin for raw hunt video paths (not the image resizer). */
export function getMediaCdnOrigin(): string {
  const fromEnv =
    typeof process !== "undefined"
      ? process.env.NEXT_PUBLIC_MEDIA_CDN_ORIGIN ??
        process.env.MEDIA_CDN_ORIGIN
      : undefined;
  if (fromEnv?.trim()) {
    return fromEnv.trim().replace(/\/$/, "");
  }
  const backend =
    typeof process !== "undefined" ? process.env.BACKEND_API_URL : undefined;
  if (backend?.trim()) {
    return backend.trim().replace(/\/api\/?$/, "");
  }
  return DEFAULT_MEDIA_CDN_ORIGIN;
}

/**
 * Turns stored hunt image paths into a browser-loadable URL.
 */
export function resolveMediaPreviewUrl(
  url: string | null | undefined,
): string | null {
  if (!url?.trim()) return null;

  const trimmed = url.trim();
  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  const path = trimmed.replace(/^\//, "");
  return `${MEDIA_RESIZER_BASE}?imagepath=${encodeURIComponent(path)}`;
}

/**
 * Hunt videos must not go through the image resizer.
 */
export function resolveVideoPreviewUrl(
  url: string | null | undefined,
): string | null {
  if (!url?.trim()) return null;

  let trimmed = url.trim();

  // Legacy: video URL incorrectly stored as image-resizer link
  if (trimmed.includes("DevImageResizer") && trimmed.includes("imagepath=")) {
    try {
      const path = new URL(trimmed).searchParams.get("imagepath");
      if (path) trimmed = decodeURIComponent(path);
    } catch {
      const match = trimmed.match(/[?&]imagepath=([^&]+)/i);
      if (match?.[1]) trimmed = decodeURIComponent(match[1]);
    }
  }

  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return trimmed;
  }
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    if (trimmed.includes("DevImageResizer")) return null;
    return trimmed;
  }

  const path = trimmed.replace(/^\//, "");
  return `${getMediaCdnOrigin()}/${path}`;
}
