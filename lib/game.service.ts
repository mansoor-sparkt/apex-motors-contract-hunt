import type {
  PlayeRegisterProfile,
  PlayerProfile,
  StopCompletion,
} from "@/lib/game-types";
import { convertImageToPng, MAX_UPLOAD_BYTES } from "@/lib/image-to-png";
import { isVideoFile, prepareVideoForUpload } from "@/lib/media-upload";
import {
  postFormDataWithProgress,
  type UploadProgressHandler,
} from "@/lib/upload-with-progress";
import { apiFetch } from "@/lib/api-client";
import { encryptProgressPayload } from "@/lib/progress-payload-crypto";
import { resolveVideoPreviewUrl } from "./media-url";

export const GameService = {
  /**
   * Login with email (no OTP) — sets session cookie via /api/auth/login.
   */
  async loginWithEmail(email: string) {
    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: "Network connection failed" };
    }
  },

  /**
   * 2. Save a new user's profile and avatar
   */
  async registerUser(profile: PlayeRegisterProfile) {
    try {
      const response = await apiFetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      return response.json();
    } catch (error) {
      return { success: false, error: "Network connection failed" };
    }
  },

  /**
   * 3. Submit a completed stop to calculate score
   */
  async submitStop(stopIndex: number, data: StopCompletion) {
    const response = await apiFetch("/api/submit-stop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stopIndex, data }),
    });
    return response.json();
  },

  /**
   * 4. Upload an image or video and return the CDN URL
   */
  async uploadMedia(
    file: File,
    emailId: string,
    onProgress?: UploadProgressHandler,
  ) {
    const isVideo = isVideoFile(file);

    const reportProgress = (pct: number) =>
      onProgress?.(Math.min(100, Math.max(0, pct)));

    try {
      reportProgress(0);

      const formData = new FormData();
      formData.append("EmailId", emailId);

      if (isVideo) {
        reportProgress(2);
        let uploadFile: File;
        try {
          uploadFile = await prepareVideoForUpload(file);
        } catch (error) {
          return {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : "Could not prepare video for upload.",
          };
        }
        reportProgress(8);
        formData.append("UploadVideo", uploadFile);

        // ── 1. BYPASS VERCEL: Point directly to Azure ──
        const azureVideoUrl = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/Profile/UploadHunt_Video`;

        const response: any = await postFormDataWithProgress(
          azureVideoUrl,
          // "/api/game/mediavideo",
          formData,
          (uploadPct) => {
            reportProgress(8 + Math.round(uploadPct * 0.92));
          },
        );

        // const data = await response.json();

        if (response?.statusCode === 200 && response?.result) {
          const rawCdnUrl = response.result.cdnUrl as string;
          return {
            success: true,
            cdnUrl: resolveVideoPreviewUrl(rawCdnUrl) ?? rawCdnUrl,
            message: response.message?.[0] || "Success",
          };
        }

        // If Azure rejected it (or if postFormDataWithProgress caught a network error)
        return {
          success: false,
          error:
            response?.errors?.[0] ||
            response?.error ||
            "Video upload rejected by server.",
        };
      }

      reportProgress(3);
      let uploadFile: File;
      try {
        uploadFile = await convertImageToPng(file);
      } catch (error) {
        console.warn("Client PNG conversion failed:", error);
        return {
          success: false,
          error:
            "Could not prepare this photo for upload. Try Photo Library or retake.",
        };
      }

      if (uploadFile.size > MAX_UPLOAD_BYTES) {
        return {
          success: false,
          error:
            "Photo is too large after compression. Try Photo Library or retake closer.",
        };
      }

      reportProgress(8);
      formData.append("UploadPicture", uploadFile);

      return await postFormDataWithProgress(
        "/api/game/mediaupload",
        formData,
        (uploadPct) => {
          reportProgress(8 + Math.round(uploadPct * 0.92));
        },
      );
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Media upload failed",
      };
    }
  },

  /**
   * 5. Save or Update Game Progress (Stringified)
   */
  async syncProgress(
    emailId: string,
    progressData: any,
    isUpdate: boolean = false,
    gamePoint: number,
  ) {
    try {
      const payload = {
        emailId: emailId,
        gameProgress: JSON.stringify(progressData),
        gamePoint,
      };

      let body;
      try {
        body = await encryptProgressPayload(payload);
      } catch (encryptError) {
        return {
          success: false,
          error:
            encryptError instanceof Error
              ? encryptError.message
              : "Progress encryption failed",
        };
      }

      const response = await apiFetch("/api/game/progress", {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      return await response.json();
    } catch (error) {
      return { success: false, error: "Progress sync failed" };
    }
  },

  /**
   * 6. Retrieve remote stringified progress snapshot
   */
  async fetchProgress(emailId: string) {
    try {
      const response = await apiFetch("/api/game/progress", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: "Failed to download cloud progress" };
    }
  },

  /** Check HttpOnly session (after OTP). */
  async getSession() {
    try {
      const response = await apiFetch("/api/auth/session", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      return await response.json();
    } catch {
      return { success: false, error: "Session check failed" };
    }
  },

  async logout() {
    try {
      const response = await apiFetch("/api/auth/logout", {
        method: "POST",
      });
      return await response.json();
    } catch {
      return { success: false, error: "Logout failed" };
    }
  },

  /**
   * 7. Fetch dynamic leaderboard (all players)
   */
  async fetchLeaderboard(emailId?: string) {
    try {
      const query = emailId ? `?emailId=${encodeURIComponent(emailId)}` : "";
      const response = await apiFetch(`/api/game/leaderboard${query}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      return await response.json();
    } catch (error) {
      return { success: false, error: "Failed to load leaderboard" };
    }
  },
};
