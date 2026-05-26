export const MEDIA_RESIZER_BASE =
  "https://phillipsx-imageresizer.azurewebsites.net/api/DevImageResizer";

/**
 * Turns stored hunt media paths into a browser-loadable URL.
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
