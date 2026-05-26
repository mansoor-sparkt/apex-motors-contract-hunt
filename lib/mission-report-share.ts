import { toPng } from "html-to-image";
import { MACHINIST_APP_URL } from "@/constants";

export interface MissionReportShareData {
  playerName: string;
  metaLine: string;
  baseScore: number;
  bonusScore: number;
  rank: number;
  timeDisplay: string;
  badges: string[];
}

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
    "Redline Robotics planetary gearbox — delivered. Powered by Phillips Machinist.",
  ];

  if (gameUrl) lines.push(`Play: ${gameUrl}`);
  lines.push(`App: ${MACHINIST_APP_URL}`);

  return lines.join("\n");
}

export async function captureMissionReportPng(
  element: HTMLElement
): Promise<Blob> {
  const dataUrl = await toPng(element, {
    cacheBust: true,
    pixelRatio: Math.min(window.devicePixelRatio || 2, 2),
    backgroundColor: "#050608",
    style: { margin: "0" },
  });

  const response = await fetch(dataUrl);
  return response.blob();
}

/** JPEG shares more reliably on iOS than PNG via Web Share API. */
async function blobToShareableImageFile(pngBlob: Blob): Promise<File> {
  if (typeof document === "undefined") {
    return new File([pngBlob], "nlsc-mission-report.png", { type: "image/png" });
  }

  try {
    const bitmap = await createImageBitmap(pngBlob);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no canvas");

    ctx.fillStyle = "#050608";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();

    const jpegBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error("jpeg encode failed"));
        },
        "image/jpeg",
        0.92
      );
    });

    return new File([jpegBlob], "nlsc-mission-report.jpg", {
      type: "image/jpeg",
    });
  } catch {
    return new File([pngBlob], "nlsc-mission-report.png", { type: "image/png" });
  }
}

export async function prepareMissionReportShareFile(
  element: HTMLElement
): Promise<File> {
  const pngBlob = await captureMissionReportPng(element);
  return blobToShareableImageFile(pngBlob);
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

/**
 * Opens the native share sheet with the report image.
 * Summary text is copied to clipboard (iOS/Android often ignore text when sharing files).
 */
export async function shareMissionReportFile(
  file: File | null,
  data: MissionReportShareData,
  onToast?: (msg: string) => void
): Promise<void> {
  const text = buildMissionReportShareText(data);
  const copied = await copyShareText(text);

  if (!file) {
    onToast?.("⚠ Couldn't prepare report image");
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }
    onToast?.(
      copied
        ? "✓ Summary copied — paste in your post"
        : "Sharing isn't supported here"
    );
    return;
  }

  if (typeof navigator !== "undefined" && navigator.share) {
    // Files only — required for reliable image share on iOS (no text/url/title in same call)
    const filePayload: ShareData = { files: [file] };

    const canShareFiles =
      !navigator.canShare || navigator.canShare(filePayload);

    if (canShareFiles) {
      try {
        await navigator.share(filePayload);
        onToast?.(
          copied
            ? "✓ Choose an app — summary is on your clipboard to paste"
            : "✓ Choose where to share your report"
        );
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        console.warn("File share failed:", err);
      }
    }

    try {
      await navigator.share({ text });
      onToast?.("✓ Shared summary text");
      return;
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
    }
  }

  onToast?.(
    copied
      ? "✓ Summary copied — use your browser menu to share, or try on your phone"
      : "Sharing isn't supported in this browser"
  );
}

/** Capture then share (use prepare + shareMissionReportFile on click when possible). */
export async function shareMissionReport(
  element: HTMLElement,
  data: MissionReportShareData,
  onToast?: (msg: string) => void
): Promise<void> {
  onToast?.("📸 Preparing report…");
  let file: File | null = null;
  try {
    file = await prepareMissionReportShareFile(element);
  } catch {
    onToast?.("⚠ Couldn't capture report");
  }
  await shareMissionReportFile(file, data, onToast);
}
