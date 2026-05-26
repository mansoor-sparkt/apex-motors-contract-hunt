const HEIC_EXT = /\.hei[cf]$/i;

const HEIC_BRANDS = ["heic", "heix", "hevc", "heim", "heis", "mif1"];

function isHeicMagic(buffer: Buffer): boolean {
  if (buffer.length < 12) return false;
  if (buffer.toString("ascii", 4, 8) !== "ftyp") return false;
  const brand = buffer.toString("ascii", 8, 12).toLowerCase();
  return HEIC_BRANDS.some((b) => brand.startsWith(b));
}

function isPngMagic(buffer: Buffer): boolean {
  return (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  );
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

/**
 * Ensures hunt image uploads are PNG before forwarding to the Phillips API.
 * Converts HEIC/HEIF server-side when the client could not (or sent raw HEIC).
 */
export async function ensurePngForUpload(file: File): Promise<File> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isPngMagic(buffer) && !isHeicMagic(buffer)) {
    if (file.type === "image/png" && file.name.toLowerCase().endsWith(".png")) {
      return file;
    }
    return new File([buffer], pngFileName(file.name), { type: "image/png" });
  }

  if (isHeicUpload(file, buffer)) {
    const convert = (await import("heic-convert")).default;
    const pngBuffer = await convert({
      buffer,
      format: "PNG",
    });
    return new File([Uint8Array.from(pngBuffer)], pngFileName(file.name), {
      type: "image/png",
    });
  }

  return file;
}
