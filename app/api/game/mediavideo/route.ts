import { NextResponse } from "next/server";
import {
  emailsMatch,
  getSessionFromRequest,
  sessionForbidden,
  sessionUnauthorized,
} from "@/lib/game-session";
import { resolveVideoPreviewUrl } from "@/lib/media-url";

/** Large MOV uploads from phones can be slow through the proxy. */
export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const session = getSessionFromRequest(request);
    if (!session) {
      return sessionUnauthorized();
    }

    const incoming = await request.formData();
    const rawFile = incoming.get("UploadVideo");
    const emailId = incoming.get("EmailId");

    if (typeof emailId !== "string" || !emailsMatch(emailId, session.email)) {
      return sessionForbidden();
    }

    if (!(rawFile instanceof File)) {
      return NextResponse.json(
        { success: false, error: "No video file provided" },
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

    const formData = new FormData();
    formData.append("UploadVideo", rawFile);
    if (typeof emailId === "string") {
      formData.append("EmailId", emailId);
    }

    const res = await fetch(`${baseUrl}/Profile/UploadHunt_Video`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: "External API is down" },
        { status: res.status },
      );
    }

    const data = await res.json();

    if (data.statusCode === 200 && data.result) {
      const rawUrl = data.result.cdnUrl as string;
      return NextResponse.json({
        success: true,
        cdnUrl: resolveVideoPreviewUrl(rawUrl) ?? rawUrl,
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
    console.error("Video upload API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload video" },
      { status: 500 },
    );
  }
}
