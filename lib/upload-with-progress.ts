export type UploadProgressHandler = (percent: number) => void;

export interface MediaUploadResponse {
  success: boolean;
  cdnUrl?: string;
  message?: string;
  error?: string;
}

/** POST multipart FormData with upload progress (0–100). */
export function postFormDataWithProgress(
  url: string,
  formData: FormData,
  onProgress?: UploadProgressHandler,
): Promise<MediaUploadResponse> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    // xhr.withCredentials = true;

    xhr.withCredentials = !url.startsWith("http");

    xhr.upload.addEventListener("progress", (event) => {
      if (!onProgress) return;
      if (event.lengthComputable && event.total > 0) {
        onProgress(
          Math.min(100, Math.round((event.loaded / event.total) * 100)),
        );
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status === 413) {
        resolve({
          success: false,
          error:
            "File is too large to upload. For video, record a shorter clip (about 30 seconds). For photos, use Photo Library or retake closer.",
        });
        return;
      }

      if (xhr.status < 200 || xhr.status >= 300) {
        try {
          const data = JSON.parse(xhr.responseText) as MediaUploadResponse;
          resolve({
            success: false,
            error: data.error || `Upload failed (${xhr.status})`,
          });
        } catch {
          resolve({
            success: false,
            error: `Upload failed (${xhr.status})`,
          });
        }
        return;
      }

      try {
        const data = JSON.parse(xhr.responseText) as MediaUploadResponse;
        onProgress?.(100);
        resolve(data);
      } catch {
        resolve({ success: false, error: "Invalid server response" });
      }
    });

    xhr.addEventListener("error", () => {
      resolve({ success: false, error: "Network connection failed" });
    });

    xhr.addEventListener("abort", () => {
      resolve({ success: false, error: "Upload cancelled" });
    });

    onProgress?.(0);
    xhr.send(formData);
  });
}
