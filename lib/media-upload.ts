"use client";

/**
 * Stay under Vercel's ~4.5MB serverless request body limit (multipart adds overhead).
 */
export const MAX_VIDEO_UPLOAD_BYTES = 4_000_000;

/** iOS camera / gallery often omits MOV from video/* alone. */
export const VIDEO_UPLOAD_ACCEPT =
  "video/*,.mov,.MOV,.mp4,.MP4,.m4v,.M4V,.webm,.WEBM,video/quicktime,video/mp4,video/x-m4v";

const VIDEO_EXT = /\.(mov|mp4|m4v|webm|avi|mkv|3gp|3g2|qt)$/i;

const VIDEO_MIME_PREFIXES = ["video/", "application/mp4"];

function inferVideoMimeType(file: File): string {
  const type = file.type.toLowerCase().trim();
  if (type && type !== "application/octet-stream") {
    if (VIDEO_MIME_PREFIXES.some((p) => type.startsWith(p))) return type;
    if (type === "video/quicktime") return type;
  }

  const name = file.name.toLowerCase();
  if (name.endsWith(".mov") || name.endsWith(".qt")) return "video/quicktime";
  if (name.endsWith(".m4v")) return "video/x-m4v";
  if (name.endsWith(".webm")) return "video/webm";
  if (name.endsWith(".mp4")) return "video/mp4";
  return "video/mp4";
}

export function isVideoFile(file: File): boolean {
  const type = file.type.toLowerCase().trim();
  if (type.startsWith("video/")) return true;
  if (type === "application/mp4") return true;
  if (!type || type === "application/octet-stream") {
    return VIDEO_EXT.test(file.name);
  }
  return VIDEO_EXT.test(file.name);
}

/** Ensure backend receives a recognizable video MIME (iPhone often sends empty type). */
export function normalizeVideoFile(file: File): File {
  const mime = inferVideoMimeType(file);
  const baseName =
    file.name && VIDEO_EXT.test(file.name)
      ? file.name
      : `hunt-video-${Date.now()}.${mime.includes("quicktime") ? "mov" : "mp4"}`;

  if (file.type === mime && file.name === baseName) return file;

  return new File([file], baseName, {
    type: mime,
    lastModified: file.lastModified || Date.now(),
  });
}

export function videoTooLargeMessage(sizeBytes: number): string {
  const mb = (sizeBytes / (1024 * 1024)).toFixed(1);
  return `Video is too large (${mb} MB). Record a shorter clip (about 30 seconds) or pick a smaller file.`;
}

/**
 * Re-encode oversized videos in-browser (iPhone MOV often has empty MIME + large size).
 */
async function compressVideoForUpload(
  file: File,
  maxBytes: number,
): Promise<File> {
  if (typeof window === "undefined") {
    throw new Error("Video compression is only available in the browser");
  }

  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("webkit-playsinline", "true");

    const url = URL.createObjectURL(file);
    const cleanup = () => URL.revokeObjectURL(url);

    video.onerror = () => {
      cleanup();
      reject(new Error("Could not read this video. Try MOV or MP4 from your library."));
    };

    video.onloadedmetadata = () => {
      const duration = video.duration;
      if (!Number.isFinite(duration) || duration <= 0.1) {
        cleanup();
        reject(new Error("Video length could not be read"));
        return;
      }

      const maxEdge = 720;
      let w = video.videoWidth || 640;
      let h = video.videoHeight || 360;
      if (Math.max(w, h) > maxEdge) {
        const scale = maxEdge / Math.max(w, h);
        w = Math.max(2, Math.round(w * scale));
        h = Math.max(2, Math.round(h * scale));
      }

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        cleanup();
        reject(new Error("Could not prepare video for upload"));
        return;
      }

      const mimeType = ["video/mp4", "video/webm;codecs=vp8", "video/webm"].find(
        (m) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m),
      );

      if (!mimeType) {
        cleanup();
        reject(new Error(videoTooLargeMessage(file.size)));
        return;
      }

      const videoBitsPerSecond = Math.max(
        350_000,
        Math.floor(((maxBytes * 8) / duration) * 0.75),
      );

      const stream = canvas.captureStream(24);
      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond,
      });

      const chunks: Blob[] = [];
      let stopped = false;

      const stopAll = () => {
        if (stopped) return;
        stopped = true;
        try {
          video.pause();
        } catch {
          /* ignore */
        }
        if (recorder.state === "recording") recorder.stop();
      };

      recorder.ondataavailable = (ev) => {
        if (ev.data?.size) chunks.push(ev.data);
      };

      recorder.onstop = () => {
        cleanup();
        const blob = new Blob(chunks, { type: mimeType.split(";")[0] });
        const ext = mimeType.includes("mp4") ? "mp4" : "webm";
        const out = new File(
          [blob],
          file.name.replace(/\.[^.]+$/, "") + `-upload.${ext}`,
          { type: blob.type, lastModified: Date.now() },
        );
        if (out.size > maxBytes) {
          reject(new Error(videoTooLargeMessage(out.size)));
          return;
        }
        resolve(out);
      };

      recorder.onerror = () => {
        cleanup();
        reject(new Error("Video encoding failed. Try a shorter clip."));
      };

      recorder.start(200);

      const playPromise = video.play();
      playPromise?.catch(() => {
        cleanup();
        reject(new Error("Could not play video — try a shorter clip or different file."));
      });

      const draw = () => {
        if (stopped) return;
        if (video.ended || video.currentTime >= duration - 0.05) {
          stopAll();
          return;
        }
        try {
          ctx.drawImage(video, 0, 0, w, h);
        } catch {
          /* skip bad frame */
        }
        requestAnimationFrame(draw);
      };

      video.onplaying = () => draw();
      setTimeout(stopAll, Math.ceil(duration * 1000) + 2500);
    };

    video.src = url;
  });
}

/** Normalize MIME/name and compress if needed for serverless upload limits. */
export async function prepareVideoForUpload(file: File): Promise<File> {
  const normalized = normalizeVideoFile(file);
  if (normalized.size <= MAX_VIDEO_UPLOAD_BYTES) return normalized;

  try {
    return await compressVideoForUpload(normalized, MAX_VIDEO_UPLOAD_BYTES);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : videoTooLargeMessage(normalized.size);
    throw new Error(message);
  }
}
