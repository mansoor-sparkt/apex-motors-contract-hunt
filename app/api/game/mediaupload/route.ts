import { NextResponse } from "next/server";
import {
  emailsMatch,
  getSessionFromRequest,
  sessionForbidden,
  sessionUnauthorized,
} from "@/lib/game-session";
import { resolveMediaPreviewUrl } from "@/lib/media-url";
import { ensurePngForUpload } from "@/lib/server/ensure-png-upload";

export const runtime = "nodejs";
export const maxDuration = 60;

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export async function POST(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return sessionUnauthorized();
    }

    let incoming: FormData;
    try {
      incoming = await request.formData();
    } catch (parseError) {
      console.error("Upload formData parse error:", parseError);
      return NextResponse.json(
        {
          success: false,
          error:
            "Photo is too large for upload. Try Photo Library or move closer and retake.",
        },
        { status: 413 },
      );
    }

    const rawFile = incoming.get("UploadPicture");
    const emailId = incoming.get("EmailId");

    if (typeof emailId !== "string" || !emailsMatch(emailId, session.email)) {
      return sessionForbidden();
    }

    if (!(rawFile instanceof File)) {
      return NextResponse.json(
        { success: false, error: "No image file provided" },
        { status: 400 },
      );
    }

    const baseUrl = process.env.BACKEND_API_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { success: false, error: "Server config error" },
        { status: 500 },
      );
    }

    let prepared;
    try {
      prepared = await ensurePngForUpload(rawFile);
    } catch (convertError) {
      console.error("HEIC/PNG conversion error:", convertError);
      return NextResponse.json(
        {
          success: false,
          error: "Could not convert image to PNG. Try Photo Library instead.",
        },
        { status: 400 },
      );
    }

    const outbound = new FormData();
    outbound.append(
      "UploadPicture",
      new Blob([new Uint8Array(prepared.buffer)], { type: prepared.mimeType }),
      prepared.filename,
    );
    outbound.append("EmailId", emailId);

    const res = await fetch(`${baseUrl}/Profile/UploadHuntImage`, {
      method: "POST",
      body: outbound,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Backend upload failed:", res.status, detail.slice(0, 500));
      return NextResponse.json(
        { success: false, error: "External API is down" },
        { status: res.status >= 500 ? 502 : res.status },
      );
    }

    let data: {
      statusCode?: number;
      result?: { cdnUrl?: string };
      message?: string[];
      errors?: string[];
    };
    try {
      data = await res.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid response from upload service" },
        { status: 502 },
      );
    }

    if (data.statusCode === 200 && data.result) {
      const rawUrl = data.result.cdnUrl as string;
      return NextResponse.json({
        success: true,
        cdnUrl: resolveMediaPreviewUrl(rawUrl) ?? rawUrl,
        message: data.message?.[0] || "Success",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: data.errors?.[0] || "Upload validation failed",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error("Upload API Error:", errorMessage(error), error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload file",
        detail:
          process.env.NODE_ENV === "development"
            ? errorMessage(error)
            : undefined,
      },
      { status: 500 },
    );
  }
}
