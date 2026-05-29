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
  onProgress?: UploadProgressHandler
): Promise<MediaUploadResponse> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.withCredentials = true;

    xhr.upload.addEventListener("progress", (event) => {
      if (!onProgress) return;
      if (event.lengthComputable && event.total > 0) {
        onProgress(Math.min(100, Math.round((event.loaded / event.total) * 100)));
      }
    });

    xhr.addEventListener("load", () => {
      const status = xhr.status;
      let data: MediaUploadResponse;
      try {
        data = JSON.parse(xhr.responseText) as MediaUploadResponse & {
          detail?: string;
        };
      } catch {
        resolve({
          success: false,
          error:
            status === 413
              ? "Photo is too large — try Photo Library"
              : status >= 500
                ? "Server error during upload"
                : `Upload failed (${status})`,
        });
        return;
      }

      if (status >= 400) {
        resolve({
          success: false,
          error:
            data.error ||
            (status === 413
              ? "Photo is too large — try Photo Library"
              : status >= 500
                ? "Server error during upload"
                : `Upload failed (${status})`),
        });
        return;
      }

      onProgress?.(100);
      resolve(data);
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
