import { toPng } from "html-to-image";

export interface MissionReportShareData {
  playerName: string;
  metaLine: string;
  baseScore: number;
  bonusScore: number;
  rank: number;
  timeDisplay: string;
  badges: string[];
}

export interface MissionReportShareFallback {
  imageUrl: string;
  summaryText: string;
  file: File;
  needsHttps: boolean;
}

/** Short caption baked into the share image + used for native share text. */
export function buildMissionReportShareText(data: MissionReportShareData): string {
  const badgeLine = data.badges.length
    ? data.badges.join(" · ")
    : "Bonus badges in progress";

  const gameUrl =
    typeof window !== "undefined" ? window.location.origin : "";

  const lines = [
    "🏭 NLSC 2026 · Contract Hunt mission report",
    "",
    `${data.playerName} · ${data.metaLine}`,
    `${data.baseScore} pts (+${data.bonusScore} bonus) · Rank #${data.rank} · ${data.timeDisplay}`,
    `🏆 ${badgeLine}`,
    "",
    "Redline Robotics · Planetary gearbox — delivered.",
    "Powered by Phillips Machinist.",
  ];

  if (gameUrl) lines.push("", `Play: ${gameUrl}`);

  return lines.join("\n");
}

function shareCaptionLines(data: MissionReportShareData): string[] {
  const badgeLine = data.badges.length
    ? data.badges.slice(0, 3).join(" · ")
    : "Bonus challenges in progress";

  return [
    "NLSC 2026 · Contract Hunt",
    `${data.playerName} · ${data.metaLine}`,
    `${data.baseScore} pts (+${data.bonusScore} bonus) · Rank #${data.rank} · ${data.timeDisplay}`,
    `🏆 ${badgeLine}`,
    "Powered by Phillips Machinist",
  ];
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/png";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function waitForPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

export async function captureMissionReportPng(
  element: HTMLElement
): Promise<Blob> {
  await waitForPaint();

  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: Math.min(window.devicePixelRatio || 2, 2),
    backgroundColor: "#050608",
    skipFonts: true,
    style: { margin: "0" },
  });

  return dataUrlToBlob(dataUrl);
}

/** Draw summary lines under the report card so text travels with the image. */
async function compositeCaptionOnImage(
  reportBlob: Blob,
  data: MissionReportShareData
): Promise<Blob> {
  if (typeof document === "undefined") return reportBlob;

  const bitmap = await createImageBitmap(reportBlob);
  const lines = shareCaptionLines(data);
  const padding = 14;
  const lineHeight = 17;
  const footerHeight = padding * 2 + lines.length * lineHeight + 6;

  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height + footerHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return reportBlob;
  }

  ctx.fillStyle = "#050608";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();

  ctx.fillStyle = "#050608";
  ctx.fillRect(0, canvas.height - footerHeight, canvas.width, footerHeight);
  ctx.fillStyle = "#F15C30";
  ctx.fillRect(0, canvas.height - footerHeight, canvas.width, 2);

  ctx.fillStyle = "#e8eaef";
  ctx.font = "600 12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  lines.forEach((line, i) => {
    ctx.fillText(
      line,
      padding,
      canvas.height - footerHeight + padding + 12 + i * lineHeight
    );
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("caption encode failed"))),
      "image/jpeg",
      0.92
    );
  });
}

async function blobToShareableImageFile(
  blob: Blob,
  data: MissionReportShareData
): Promise<File> {
  const withCaption = await compositeCaptionOnImage(blob, data);
  return new File([withCaption], "nlsc-mission-report.jpg", {
    type: "image/jpeg",
  });
}

export async function prepareMissionReportShareFile(
  element: HTMLElement,
  data: MissionReportShareData
): Promise<File> {
  const pngBlob = await captureMissionReportPng(element);
  return blobToShareableImageFile(pngBlob, data);
}

async function copyShareText(text: string): Promise<boolean> {
  if (!navigator.clipboard?.writeText) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function hasWebShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

async function tryNativeShare(
  file: File,
  text: string
): Promise<"shared" | "aborted" | "failed"> {
  if (!hasWebShare()) return "failed";

  const payloads: ShareData[] = [
    { files: [file], text },
    { files: [file] },
    { text },
  ];

  for (const payload of payloads) {
    if (navigator.canShare && !navigator.canShare(payload)) continue;
    try {
      await navigator.share(payload);
      return "shared";
    } catch (err) {
      if ((err as Error).name === "AbortError") return "aborted";
    }
  }

  return "failed";
}

function buildFallback(
  file: File,
  summaryText: string
): MissionReportShareFallback {
  const needsHttps =
    typeof window !== "undefined" && !window.isSecureContext;

  return {
    imageUrl: URL.createObjectURL(file),
    summaryText,
    file,
    needsHttps,
  };
}

export async function shareMissionReport(
  element: HTMLElement,
  data: MissionReportShareData,
  options?: {
    onToast?: (msg: string) => void;
    cachedFile?: File | null;
    onFallback?: (fallback: MissionReportShareFallback) => void;
  }
): Promise<void> {
  const onToast = options?.onToast;
  const summaryText = buildMissionReportShareText(data);

  let file: File | null = options?.cachedFile ?? null;

  if (!file) {
    onToast?.("📸 Preparing report…");
    try {
      file = await prepareMissionReportShareFile(element, data);
    } catch {
      onToast?.("⚠ Couldn't capture report");
      return;
    }
  }

  void copyShareText(summaryText);

  const nativeResult = await tryNativeShare(file, summaryText);

  if (nativeResult === "shared") {
    onToast?.("✓ Shared with image and summary");
    return;
  }

  if (nativeResult === "aborted") return;

  options?.onFallback?.(buildFallback(file, summaryText));

  if (!window.isSecureContext) {
    onToast?.("Press and hold the image → Share");
  } else {
    onToast?.("Use the options below to share your report");
  }
}
