const HEIC_BRANDS = ["heic", "heix", "hevc", "heim", "heis", "mif1"];

function readAscii(bytes: ArrayLike<number>, start: number, len: number): string {
  let s = "";
  for (let i = 0; i < len; i++) {
    s += String.fromCharCode(bytes[start + i]!);
  }
  return s;
}

/** Detect HEIC/HEIF from file header (iOS camera often mislabels MIME as image/jpeg). */
export function isHeicMagicBytes(bytes: ArrayLike<number>): boolean {
  if (bytes.length < 12) return false;
  if (readAscii(bytes, 4, 4) !== "ftyp") return false;
  const brand = readAscii(bytes, 8, 4).toLowerCase();
  return HEIC_BRANDS.some((b) => brand.startsWith(b));
}

export function isPngMagicBytes(bytes: ArrayLike<number>): boolean {
  return (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  );
}

export async function readFileHeader(
  file: Blob,
  length = 12,
): Promise<Uint8Array> {
  return new Uint8Array(await file.slice(0, length).arrayBuffer());
}
